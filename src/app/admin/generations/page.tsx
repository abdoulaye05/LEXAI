import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Générations — Admin LexAI",
};

const TOOL_LABELS: Record<string, string> = {
  contrat: "Contrat",
  analyse: "Analyse",
  "mise-en-demeure": "Mise en demeure",
  clause: "Clause",
};

function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(n);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminGenerationsPage() {
  const supabase = createClient();

  const { data: gens } = await supabase
    .from("generations")
    .select(
      "id, tool, status, tokens_in, tokens_out, cost_eur, created_at, completed_at, user_id"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Map user_id → full_name pour affichage
  const userIds = Array.from(new Set((gens ?? []).map((g) => g.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds)
    : { data: [] };
  const nameByUser = new Map(
    (profiles ?? []).map((p) => [p.user_id, p.full_name] as const)
  );

  // KPIs en haut
  const totalGens = gens?.length ?? 0;
  const totalCost =
    gens?.reduce((sum, g) => sum + Number(g.cost_eur ?? 0), 0) ?? 0;
  const totalTokens =
    gens?.reduce(
      (sum, g) => sum + (g.tokens_in ?? 0) + (g.tokens_out ?? 0),
      0
    ) ?? 0;

  const byTool: Record<string, number> = {};
  gens?.forEach((g) => {
    byTool[g.tool] = (byTool[g.tool] ?? 0) + 1;
  });
  const topTool =
    Object.entries(byTool).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">02 — Activité IA</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Générations
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Les 100 dernières générations toutes confondues. Surveillez les
          erreurs, les abus, et l&apos;outil le plus utilisé.
        </p>
      </header>

      {/* Mini KPIs */}
      <section className="grid grid-cols-2 hairline-b lg:grid-cols-4">
        {[
          { label: "Affichées", value: formatNumber(totalGens) },
          {
            label: "Coût cumulé",
            value: new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 2,
            }).format(totalCost),
          },
          { label: "Tokens", value: formatNumber(totalTokens) },
          {
            label: "Outil dominant",
            value: TOOL_LABELS[topTool] ?? topTool,
          },
        ].map((k, i) => (
          <div
            key={k.label}
            className={`px-12 py-10 ${
              i < 3 ? "border-b border-ink lg:border-b-0 lg:border-r" : ""
            }`}
          >
            <p className="label">{k.label}</p>
            <p className="mt-4 font-serif text-4xl leading-none tracking-tightest">
              {k.value}
              <span className="text-accent">.</span>
            </p>
          </div>
        ))}
      </section>

      <section className="px-12 py-12">
        {!gens || gens.length === 0 ? (
          <div className="max-w-md border-l-2 border-ink pl-6">
            <p className="font-serif text-3xl italic leading-tight tracking-tightest">
              Aucune génération encore.
            </p>
            <p className="mt-4 text-muted">
              Dès que vous ou un avocat lancerez un outil depuis le dashboard,
              chaque appel sera tracé ici avec ses tokens et son coût.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-6 font-bold">Outil</th>
                  <th className="py-4 pr-6 font-bold">Avocat</th>
                  <th className="py-4 pr-6 font-bold">Statut</th>
                  <th className="py-4 pr-6 text-right font-bold tabular-nums">
                    Tokens in
                  </th>
                  <th className="py-4 pr-6 text-right font-bold tabular-nums">
                    Tokens out
                  </th>
                  <th className="py-4 pr-6 text-right font-bold tabular-nums">
                    Coût
                  </th>
                  <th className="py-4 font-bold">Lancée</th>
                </tr>
              </thead>
              <tbody>
                {gens.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-ink/10 transition-colors hover:bg-ink/5"
                  >
                    <td className="py-4 pr-6 font-serif text-base">
                      {TOOL_LABELS[g.tool] ?? g.tool}
                    </td>
                    <td className="py-4 pr-6 text-muted">
                      {nameByUser.get(g.user_id) ?? "—"}
                    </td>
                    <td className="py-4 pr-6">
                      <GenStatusBadge status={g.status} />
                    </td>
                    <td className="py-4 pr-6 text-right tabular-nums">
                      {formatNumber(g.tokens_in ?? 0)}
                    </td>
                    <td className="py-4 pr-6 text-right tabular-nums">
                      {formatNumber(g.tokens_out ?? 0)}
                    </td>
                    <td className="py-4 pr-6 text-right tabular-nums">
                      {formatEuro(Number(g.cost_eur ?? 0))}
                    </td>
                    <td className="py-4 text-xs text-muted">
                      {formatDateTime(g.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalGens === 100 && (
              <p className="mt-8 text-center font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
                100 dernières — pagination à venir
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function GenStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    done: { label: "Terminée", className: "border-ink text-ink" },
    streaming: {
      label: "En cours",
      className: "border-accent text-accent",
    },
    error: {
      label: "Erreur",
      className: "border-accent bg-accent text-creme",
    },
  };
  const v = map[status] ?? { label: status, className: "border-muted text-muted" };
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${v.className}`}
    >
      {v.label}
    </span>
  );
}
