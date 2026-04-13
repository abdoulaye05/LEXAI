import { NextResponse, type NextRequest } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import {
  SYSTEM_PROMPTS,
  buildUserMessage,
  type ToolId,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { MOCK_TEMPLATES, estimateTokens } from "@/lib/mock-templates";
import { computeCostEur } from "@/lib/cost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TOOLS: ToolId[] = [
  "contrat",
  "analyse",
  "mise-en-demeure",
  "clause",
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
  const system = SYSTEM_PROMPTS[toolId];
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
          const anthropicStream = anthropic.messages.stream({
            model: MODEL,
            max_tokens: 4096,
            system,
            messages: [{ role: "user", content: userMessage }],
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
      "X-LexAI-Generation-Id": generationId,
    },
  });
}
