import { createClient } from "@/lib/supabase/server";
import { PLAN_PRICES_EUR } from "@/types/database";
import {
  getMonthlyBudgetEur,
  getMonthlyBudgetUsd,
  getBudgetLevel,
} from "@/lib/budget";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Coûts & marge — Admin LexAI",
};

const LEVEL_LABELS: Record<
  ReturnType<typeof getBudgetLevel>,
  { label: string; className: string; caption: string }
> = {
  ok: {
    label: "Sous contrôle",
    className: "border-ink text-ink",
    caption: "Consommation normale, pas d'action requise.",
  },
  warning: {
    label: "À surveiller",
    className: "border-ink text-ink",
    caption: "Mi-parcours atteint. Vérifiez que l'usage reste cohérent.",
  },
  critical: {
    label: "Alerte 80 %",
    className: "border-accent text-accent",
    caption:
      "80 % du budget consommé. Regardez le top consommateurs ci-dessous et agissez si nécessaire.",
  },
  exceeded: {
    label: "Budget dépassé",
    className: "border-accent bg-accent text-creme",
    caption:
      "Le budget mensuel est dépassé. L'API Anthropic va bloquer si le spend limit est atteint — rechargez ou relevez la limite.",
  },
};

function formatEuro(n: number, decimals = 2): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatPct(n: number): string {
  return `${n.toFixed(1)} %`;
}

export default async function AdminCostsPage() {
  const supabase = createClient();

  // Récupère toutes les générations des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const { data: gens } = await supabase
    .from("generations")
    .select("user_id, tool, cost_eur, tokens_in, tokens_out, created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Coût total 30j
  const totalCost30d =
    gens?.reduce((sum, g) => sum + Number(g.cost_eur ?? 0), 0) ?? 0;

  // Mois en cours seulement
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthGens = gens?.filter(
    (g) => new Date(g.created_at) >= startOfMonth
  );
  const costThisMonth =
    monthGens?.reduce((sum, g) => sum + Number(g.cost_eur ?? 0), 0) ?? 0;

  // MRR depuis subscriptions actives
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("user_id, plan")
    .eq("status", "active");

  const mrr =
    activeSubs?.reduce((sum, s) => {
      if (!s.plan) return sum;
      return sum + (PLAN_PRICES_EUR[s.plan as keyof typeof PLAN_PRICES_EUR] ?? 0);
    }, 0) ?? 0;

  const grossMargin = mrr - costThisMonth;
  const marginPct = mrr > 0 ? (grossMargin / mrr) * 100 : 0;
  const costRatio = mrr > 0 ? (costThisMonth / mrr) * 100 : 0;

  // Coût par utilisateur (top 10 plus chers)
  const costByUser = new Map<string, number>();
  monthGens?.forEach((g) => {
    costByUser.set(
      g.user_id,
      (costByUser.get(g.user_id) ?? 0) + Number(g.cost_eur ?? 0)
    );
  });
  const topUserIds = Array.from(costByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const { data: topProfiles } = topUserIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, cabinet_name")
        .in(
          "user_id",
          topUserIds.map(([id]) => id)
        )
    : { data: [] };
  const profileByUser = new Map(
    (topProfiles ?? []).map((p) => [p.user_id, p] as const)
  );

  // Coût par outil
  const costByTool: Record<string, number> = {};
  const countByTool: Record<string, number> = {};
  monthGens?.forEach((g) => {
    costByTool[g.tool] =
      (costByTool[g.tool] ?? 0) + Number(g.cost_eur ?? 0);
    countByTool[g.tool] = (countByTool[g.tool] ?? 0) + 1;
  });
  const toolBreakdown = Object.entries(costByTool)
    .map(([tool, cost]) => ({
      tool,
      cost,
      count: countByTool[tool] ?? 0,
      avg: countByTool[tool] ? cost / countByTool[tool] : 0,
    }))
    .sort((a, b) => b.cost - a.cost);

  // Budget tracking (USD chez Anthropic, on convertit en EUR pour l'affichage)
  const budgetUsd = getMonthlyBudgetUsd();
  const budgetEur = getMonthlyBudgetEur();
  const budgetPct = budgetEur > 0 ? (costThisMonth / budgetEur) * 100 : 0;
  const budgetLevel = getBudgetLevel(costThisMonth, budgetEur);
  const budgetVariant = LEVEL_LABELS[budgetLevel];
  const budgetBarPct = Math.min(100, budgetPct);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">04 — Économie de la plateforme</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Coûts &amp; marge
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Combien Anthropic vous coûte chaque mois, ce que vous facturez en
          face, et la marge brute qui reste. Surveillez les utilisateurs les
          plus gourmands.
        </p>
      </header>

      {/* Budget Anthropic — widget d'alerte au-dessus des KPIs */}
      <section className="hairline-b px-12 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <div>
            <p className="label">Budget Anthropic ce mois</p>
            <p className="mt-3 font-serif text-5xl leading-none tracking-tightest">
              {formatEuro(costThisMonth, 2)}
              <span className="text-2xl text-muted"> / {formatEuro(budgetEur, 0)}</span>
              <span className="text-accent">.</span>
            </p>
            <p className="mt-3 text-xs text-muted">
              Budget fixé à {budgetUsd} USD ({formatEuro(budgetEur, 0)}) dans{" "}
              <code className="font-mono text-[11px]">
                ANTHROPIC_MONTHLY_BUDGET_USD
              </code>
              . À synchroniser avec le Spend Limit Anthropic.
            </p>
          </div>
          <span
            className={`inline-flex items-center border px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${budgetVariant.className}`}
          >
            ◆ {budgetVariant.label} · {budgetPct.toFixed(0)} %
          </span>
        </div>

        {/* Barre de progression avec seuils visuels */}
        <div className="mt-6 h-[3px] w-full bg-ink/15" aria-hidden="true">
          <div
            className={`h-full transition-all duration-500 ease-surgical ${
              budgetLevel === "exceeded" || budgetLevel === "critical"
                ? "bg-accent"
                : "bg-ink"
            }`}
            style={{ width: `${budgetBarPct}%` }}
          />
        </div>
        {/* Marqueurs 50% et 80% */}
        <div className="relative mt-2 h-4 text-[10px] text-muted">
          <span className="absolute left-[50%] -translate-x-1/2">50 %</span>
          <span className="absolute left-[80%] -translate-x-1/2 text-accent">
            ◆ 80 %
          </span>
        </div>

        {budgetLevel !== "ok" && (
          <p
            className={`mt-6 border-l-2 pl-6 text-sm ${
              budgetLevel === "critical" || budgetLevel === "exceeded"
                ? "border-accent text-accent"
                : "border-ink text-ink"
            }`}
          >
            {budgetVariant.caption}
          </p>
        )}
      </section>

      {/* Bande économique */}
      <section className="grid grid-cols-1 hairline-b lg:grid-cols-4">
        <div className="border-b border-ink px-12 py-12 lg:border-b-0 lg:border-r">
          <p className="label">MRR du mois</p>
          <p className="mt-6 font-serif text-5xl leading-none tracking-tightest">
            {formatEuro(mrr, 0)}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-xs text-muted">
            Revenu récurrent des abonnements actifs
          </p>
        </div>

        <div className="border-b border-ink px-12 py-12 lg:border-b-0 lg:border-r">
          <p className="label">Coût Anthropic</p>
          <p className="mt-6 font-serif text-5xl leading-none tracking-tightest">
            {formatEuro(costThisMonth, 0)}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-xs text-muted">
            {formatPct(costRatio)} du MRR
          </p>
        </div>

        <div className="border-b border-ink px-12 py-12 lg:border-b-0 lg:border-r">
          <p className="label">Marge brute</p>
          <p
            className={`mt-6 font-serif text-5xl leading-none tracking-tightest ${
              grossMargin < 0 ? "text-accent" : ""
            }`}
          >
            {formatEuro(grossMargin, 0)}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-xs text-muted">
            {mrr > 0 ? `${formatPct(marginPct)} de marge` : "—"}
          </p>
        </div>

        <div className="px-12 py-12">
          <p className="label">Coût 30 jours</p>
          <p className="mt-6 font-serif text-5xl leading-none tracking-tightest">
            {formatEuro(totalCost30d, 0)}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-xs text-muted">
            Hors limites du mois calendaire
          </p>
        </div>
      </section>

      {/* Deux colonnes : par outil + top users */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        {/* Coût par outil */}
        <div className="border-b border-ink px-12 py-12 lg:border-b-0 lg:border-r">
          <p className="label mb-8">Répartition par outil ce mois</p>
          {toolBreakdown.length === 0 ? (
            <div className="max-w-md border-l-2 border-ink pl-6">
              <p className="font-serif text-2xl italic leading-tight">
                Aucune donnée encore.
              </p>
              <p className="mt-3 text-sm text-muted">
                Lancez quelques générations pour peupler cette répartition.
              </p>
            </div>
          ) : (
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-4 font-bold">Outil</th>
                  <th className="py-4 pr-4 text-right font-bold tabular-nums">
                    Volume
                  </th>
                  <th className="py-4 pr-4 text-right font-bold tabular-nums">
                    Coût total
                  </th>
                  <th className="py-4 text-right font-bold tabular-nums">
                    Coût moyen
                  </th>
                </tr>
              </thead>
              <tbody>
                {toolBreakdown.map((row) => (
                  <tr key={row.tool} className="border-b border-ink/10">
                    <td className="py-4 pr-4 font-serif text-base">
                      {row.tool}
                    </td>
                    <td className="py-4 pr-4 text-right tabular-nums">
                      {row.count}
                    </td>
                    <td className="py-4 pr-4 text-right tabular-nums">
                      {formatEuro(row.cost, 4)}
                    </td>
                    <td className="py-4 text-right tabular-nums text-muted">
                      {formatEuro(row.avg, 4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top utilisateurs gourmands */}
        <div className="px-12 py-12">
          <p className="label mb-8">10 utilisateurs les plus coûteux ce mois</p>
          {topUserIds.length === 0 ? (
            <div className="max-w-md border-l-2 border-ink pl-6">
              <p className="font-serif text-2xl italic leading-tight">
                Pas encore de gourmands.
              </p>
              <p className="mt-3 text-sm text-muted">
                Quand vos clients commenceront à générer, vous saurez
                immédiatement qui consomme le plus — et qui menace votre marge.
              </p>
            </div>
          ) : (
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-4 font-bold">Avocat</th>
                  <th className="py-4 text-right font-bold tabular-nums">
                    Coût ce mois
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUserIds.map(([userId, cost]) => {
                  const profile = profileByUser.get(userId);
                  return (
                    <tr key={userId} className="border-b border-ink/10">
                      <td className="py-4 pr-4">
                        <p className="font-serif text-base">
                          {profile?.full_name ?? "—"}
                        </p>
                        {profile?.cabinet_name && (
                          <p className="text-xs text-muted">
                            {profile.cabinet_name}
                          </p>
                        )}
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {formatEuro(cost, 4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
