import { NextResponse, type NextRequest } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import {
  SYSTEM_PROMPTS,
  buildUserMessage,
  type ToolId,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_TEMPLATES, estimateTokens } from "@/lib/mock-templates";
import { computeCostEur } from "@/lib/cost";
import { buildCountryContext } from "@/lib/countries";

// Préfixe utilisé par le composant DocumentInput côté client pour signaler
// qu'un champ contient un PDF uploadé sur Supabase Storage (bucket
// 'analyse-documents') et non du texte brut. Le path qui suit est de la
// forme {user_id}/{timestamp}-{rand}-{filename}.pdf.
const STORAGE_PREFIX = "STORAGE_PATH::";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TOOLS: ToolId[] = [
  "contrat",
  "analyse",
  "mise-en-demeure",
  "clause",
  "conclusions",
];

// Active le mock tant qu'on n'a pas une vraie clé Anthropic dans .env.local
function isMockMode(): boolean {
  const key = process.env.ANTHROPIC_API_KEY ?? "";
  return key === "" || key.includes("placeholder") || !key.startsWith("sk-ant-");
}

export async function POST(request: NextRequest) {
  // 1. Auth guard
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 1bis. Rate-limit anti-abus — 5 générations max par minute glissante.
  // Sans ça, un compte compromis sur le plan cabinet (99999 docs/mois) peut
  // brûler tout le budget Anthropic en quelques minutes.
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count: recentCount, error: rateError } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneMinuteAgo);

  if (rateError) {
    return NextResponse.json(
      { error: "rate_check_failed", detail: rateError.message },
      { status: 500 }
    );
  }
  if ((recentCount ?? 0) >= 5) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message:
          "Vous avez lancé trop de générations en peu de temps. Patientez une minute avant de relancer.",
      },
      { status: 429 }
    );
  }

  // 2. Body validation
  let body: { tool?: string; fields?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { tool, fields } = body;
  if (!tool || !VALID_TOOLS.includes(tool as ToolId)) {
    return NextResponse.json({ error: "invalid_tool" }, { status: 400 });
  }
  if (!fields || typeof fields !== "object") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const toolId = tool as ToolId;

  // Lit le pays OHADA d'exercice du cabinet pour adapter le system prompt.
  // Si le profil n'a pas encore été créé (rare), fallback Guinée par défaut.
  const { data: profileForCountry } = await supabase
    .from("profiles")
    .select("country")
    .eq("user_id", user.id)
    .maybeSingle();

  const userCountry = profileForCountry?.country ?? "GN";
  const countryContext = buildCountryContext(userCountry);

  // Préfixe le system prompt avec le contexte cabinet (pays, monnaie,
  // juridiction par défaut). Le BASE_IDENTITY OHADA traite ensuite la suite.
  const system = `${countryContext}\n\n${SYSTEM_PROMPTS[toolId]}`;

  // 2bis. Détection PDF — si un champ contient le préfixe STORAGE_PATH::,
  // on récupère le PDF depuis Supabase Storage pour l'envoyer en multimodal
  // à Claude. Vérification stricte de l'ownership du path (sécurité).
  let pdfBase64: string | null = null;
  let pdfFileName: string | null = null;

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || !value.startsWith(STORAGE_PREFIX)) continue;

    const pdfPath = value.slice(STORAGE_PREFIX.length);

    // Garde-fou : le path DOIT commencer par {user.id}/ (RLS-equivalent applicatif)
    if (!pdfPath.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        { error: "forbidden_path", detail: "PDF path does not match user" },
        { status: 403 }
      );
    }

    const admin = createAdminClient();
    const { data: pdfBlob, error: pdfError } = await admin.storage
      .from("analyse-documents")
      .download(pdfPath);

    if (pdfError || !pdfBlob) {
      return NextResponse.json(
        { error: "pdf_fetch_failed", detail: pdfError?.message },
        { status: 500 }
      );
    }

    const arrayBuffer = await pdfBlob.arrayBuffer();
    pdfBase64 = Buffer.from(arrayBuffer).toString("base64");
    pdfFileName = pdfPath.split("/").pop() ?? "document.pdf";

    // Remplace la valeur du champ par une mention lisible — Claude verra le PDF
    // en plus de ce texte dans son content.
    fields[key] = `[Document PDF téléversé : ${pdfFileName} — analyse multimodale via Claude]`;
    break; // un seul PDF par génération
  }

  const userMessage = buildUserMessage(toolId, fields);

  // 3. Quota mensuel — appelle la fonction SQL atomique
  const { data: allowed, error: quotaError } = await supabase.rpc(
    "consume_credit",
    { p_user_id: user.id }
  );

  if (quotaError) {
    return NextResponse.json(
      { error: "quota_check_failed", detail: quotaError.message },
      { status: 500 }
    );
  }
  if (allowed === false) {
    return NextResponse.json(
      {
        error: "quota_exceeded",
        message:
          "Vous avez atteint votre quota mensuel de générations. Passez au plan supérieur pour continuer.",
      },
      { status: 429 }
    );
  }

  // 4. Crée la ligne generations en statut "streaming"
  const { data: genRow, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      tool: toolId,
      input_fields: fields,
      status: "streaming",
    })
    .select("id")
    .single();

  if (insertError || !genRow) {
    return NextResponse.json(
      { error: "log_failed", detail: insertError?.message },
      { status: 500 }
    );
  }

  const generationId = genRow.id;
  const useMock = isMockMode();

  // 5. Stream les chunks vers le client + update la row à la fin
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let collected = "";
      let tokensIn = 0;
      let tokensOut = 0;
      let errored = false;
      let errorMessage: string | null = null;

      try {
        if (useMock) {
          // ───── MODE MOCK ─────
          const template = MOCK_TEMPLATES[toolId];
          tokensIn = estimateTokens(system + userMessage);

          const chunkSize = 10;
          for (let i = 0; i < template.length; i += chunkSize) {
            const chunk = template.slice(i, i + chunkSize);
            controller.enqueue(encoder.encode(chunk));
            collected += chunk;
            // Pause artificielle pour ressembler à un vrai streaming
            await new Promise((r) => setTimeout(r, 14));
          }
          tokensOut = estimateTokens(template);
        } else {
          // ───── MODE ANTHROPIC RÉEL ─────
          // Si un PDF a été téléversé, on l'envoie en mode multimodal :
          // content = [PDF (base64), texte (instructions)]. Sinon, simple texte.
          const userContent = pdfBase64
            ? ([
                {
                  type: "document" as const,
                  source: {
                    type: "base64" as const,
                    media_type: "application/pdf" as const,
                    data: pdfBase64,
                  },
                },
                { type: "text" as const, text: userMessage },
              ])
            : userMessage;

          const anthropicStream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 4096,
            system,
            messages: [{ role: "user", content: userContent }],
          });

          for await (const event of anthropicStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              controller.enqueue(encoder.encode(text));
              collected += text;
            }
            if (event.type === "message_delta" && event.usage) {
              tokensOut = event.usage.output_tokens ?? tokensOut;
            }
            if (event.type === "message_start" && event.message?.usage) {
              tokensIn = event.message.usage.input_tokens ?? tokensIn;
            }
          }
        }
      } catch (err) {
        errored = true;
        errorMessage = err instanceof Error ? err.message : "stream_error";
        try {
          controller.enqueue(
            encoder.encode(`\n\n[Erreur génération : ${errorMessage}]`)
          );
        } catch {
          // Connexion déjà fermée, on ignore
        }
      } finally {
        try {
          controller.close();
        } catch {
          // Déjà close, on ignore
        }

        // 6. Mise à jour finale de la row avec output, tokens, coût, statut
        const costEur = computeCostEur(tokensIn, tokensOut);
        await supabase
          .from("generations")
          .update({
            output_md: collected || null,
            tokens_in: tokensIn,
            tokens_out: tokensOut,
            cost_eur: costEur,
            status: errored ? "error" : "done",
            error_message: errorMessage,
            completed_at: new Date().toISOString(),
          })
          .eq("id", generationId);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
      "X-LexAI-Mode": useMock ? "mock" : "anthropic",
      "X-LexAI-Input-Type": pdfBase64 ? "pdf" : "text",
      "X-LexAI-Generation-Id": generationId,
    },
  });
}
