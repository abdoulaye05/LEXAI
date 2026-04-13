import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ToolId } from "@/lib/prompts";
import HistoriqueDetailActions from "./actions";

export const dynamic = "force-dynamic";

const TOOL_LABELS: Record<ToolId, string> = {
  contrat: "Contrat",
  analyse: "Analyse juridique",
  "mise-en-demeure": "Mise en demeure",
  clause: "Clause contractuelle",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  return {
    title: `Document ${params.id.slice(0, 8)} — LexAI`,
  };
}

export default async function HistoriqueDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: generation } = await supabase
    .from("generations")
    .select(
      "id, tool, output_md, status, created_at, completed_at, tokens_in, tokens_out, error_message"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!generation) {
    notFound();
  }

  const toolLabel =
    TOOL_LABELS[generation.tool as ToolId] ?? generation.tool;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <Link
          href="/dashboard/historique"
          className="label mb-4 inline-flex items-baseline gap-2 hover:text-accent"
        >
          ← Retour à l&apos;historique
        </Link>
        <p className="label">07 — Document archivé</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tightest">
          {toolLabel}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-muted">
          Émis le {formatDateTime(generation.created_at)}
          {generation.tokens_out
            ? ` · ${generation.tokens_out} tokens générés`
            : ""}
        </p>
      </header>

      <section className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_320px]">
        <article className="order-2 px-10 py-10 lg:order-1">
          {generation.status === "error" ? (
            <div className="max-w-2xl border-l-2 border-accent pl-6">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                Erreur de génération
              </p>
              <p className="mt-3 font-serif text-2xl leading-tight">
                Cette génération n&apos;a pas abouti.
              </p>
              {generation.error_message && (
                <p className="mt-4 text-sm text-muted">
                  Détail : {generation.error_message}
                </p>
              )}
            </div>
          ) : generation.output_md ? (
            <article className="max-w-3xl whitespace-pre-wrap font-serif text-[17px] leading-[1.75] text-ink">
              {generation.output_md}
            </article>
          ) : (
            <p className="text-muted">Document vide.</p>
          )}
        </article>

        <aside className="order-1 border-b border-ink px-10 py-10 lg:order-2 lg:border-b-0 lg:border-l">
          <HistoriqueDetailActions
            generationId={generation.id}
            outputMd={generation.output_md}
            status={generation.status}
          />
        </aside>
      </section>
    </div>
  );
}
