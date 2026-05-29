import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLexAIPdf, type PdfBackground } from "@/lib/pdf";
import type { ToolId } from "@/lib/prompts";
import type { Plan } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const generationId = searchParams.get("id");
  const rawBg = searchParams.get("background");
  const background: PdfBackground = rawBg === "white" ? "white" : "creme";

  if (!generationId) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Récupère la génération (RLS : owner ou admin)
  const { data: generation, error } = await supabase
    .from("generations")
    .select("id, tool, output_md, status, created_at, user_id")
    .eq("id", generationId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "query_failed", detail: error.message },
      { status: 500 }
    );
  }
  if (!generation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!generation.output_md) {
    return NextResponse.json(
      { error: "empty_generation" },
      { status: 400 }
    );
  }

  // Récupère en parallèle le profil (identité cabinet) et l'abonnement (plan)
  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, cabinet_name, cabinet_address, cabinet_phone, cabinet_email, cabinet_siret, cabinet_website, cabinet_logo_url, bar_id"
      )
      .eq("user_id", generation.user_id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", generation.user_id)
      .maybeSingle(),
  ]);

  // N'applique le white-label supérieur que si l'abo est actif ou en essai
  const activeStatuses = new Set(["active", "trialing"]);
  const plan: Plan | null =
    subscription?.plan &&
    subscription?.status &&
    activeStatuses.has(subscription.status)
      ? (subscription.plan as Plan)
      : null;

  const buffer = await generateLexAIPdf({
    generation: {
      tool: generation.tool as ToolId,
      output_md: generation.output_md,
      created_at: generation.created_at,
    },
    branding: {
      full_name: profile?.full_name ?? null,
      cabinet_name: profile?.cabinet_name ?? null,
      cabinet_address: profile?.cabinet_address ?? null,
      cabinet_phone: profile?.cabinet_phone ?? null,
      cabinet_email: profile?.cabinet_email ?? null,
      cabinet_siret: profile?.cabinet_siret ?? null,
      cabinet_website: profile?.cabinet_website ?? null,
      cabinet_logo_url: profile?.cabinet_logo_url ?? null,
      bar_id: profile?.bar_id ?? null,
    },
    plan,
    background,
  });

  const safeFilenameBase =
    (profile?.cabinet_name ?? profile?.full_name ?? "lexai")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "lexai";

  const filename = `${safeFilenameBase}-${generation.tool}-${new Date(
    generation.created_at
  )
    .toISOString()
    .slice(0, 10)}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
