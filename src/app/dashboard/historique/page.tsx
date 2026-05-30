import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ToolId } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Historique — LexAI",
};

const TOOL_LABELS: Record<ToolId, string> = {
  contrat: "Contrat",
  analyse: "Analyse",
  "mise-en-demeure": "Mise en demeure",
  clause: "Clause",
  conclusions: "Conclusions",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractTitle(outputMd: string | null): string {
  if (!outputMd) return "Sans titre";
  // Cherche la première ligne non vide
  const firstLine = outputMd
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return "Sans titre";
  // Retire le markdown heading (# ## ###)
  const cleaned = firstLine.replace(/^#+\s*/, "");
  return cleaned.length > 100 ? cleaned.slice(0, 100) + "…" : cleaned;
}

export default async function HistoriquePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: generations } = await supabase
    .from("generations")
    .select("id, tool, output_md, status, created_at, completed_at, tokens_out")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const items = generations ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">07 — Mes documents</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tightest">
          Historique
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Tous vos documents générés, consultables et réexportables à tout
          moment. Les 100 derniers sont affichés ici.
        </p>
      </header>

      <section className="flex-1 px-10 py-10">
        {items.length === 0 ? (
          <div className="max-w-md border-l-2 border-ink pl-6">
            <p className="font-serif text-3xl italic leading-tight tracking-tightest">
              Aucun document encore.
            </p>
            <p className="mt-4 text-muted">
              Dès que vous lancerez une génération depuis un outil, elle
              apparaîtra ici avec tous ses détails.
            </p>
            <Link
              href="/dashboard"
              className="btn-ghost mt-8 inline-block"
            >
              Retour au tableau de bord
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink/15">
            {items.map((gen) => {
              const title = extractTitle(gen.output_md);
              const label = TOOL_LABELS[gen.tool as ToolId] ?? gen.tool;
              return (
                <li key={gen.id}>
                  <Link
                    href={`/dashboard/historique/${gen.id}`}
                    className="group flex items-start justify-between gap-6 py-6 transition-colors hover:bg-ink/5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                        {label}
                      </p>
                      <p className="mt-2 font-serif text-2xl leading-tight tracking-tightest text-ink transition-colors group-hover:text-accent">
                        {title}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {formatDateTime(gen.created_at)}
                        {gen.tokens_out ? ` · ${gen.tokens_out} tokens` : ""}
                        {gen.status === "error" ? " · ⚠ erreur" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 self-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-transform duration-200 ease-surgical group-hover:translate-x-1 group-hover:text-accent">
                      Ouvrir →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
