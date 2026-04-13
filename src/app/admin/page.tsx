import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLAN_PRICES_EUR } from "@/types/database";
import { getMonthlyBudgetEur, getBudgetLevel } from "@/lib/budget";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vue d'ensemble — Admin LexAI",
};

type Kpi = {
  label: string;
  value: string;
  caption?: string;
};

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function AdminOverviewPage() {
  const supabase = createClient();

  // Compteur d'utilisateurs (depuis profiles puisqu'auth.users n'est pas accessible via supabase-js)
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("user_id", { count: "exact", head: true });

  // Générations du mois en cours
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthGens } = await supabase
    .from("generations")
    .select("cost_eur, tokens_in, tokens_out, status")
    .gte("created_at", startOfMonth.toISOString());

  const generationsThisMonth = monthGens?.length ?? 0;
  const costThisMonth =
    monthGens?.reduce((sum, g) => sum + Number(g.cost_eur ?? 0), 0) ?? 0;
  const errorsThisMonth =
    monthGens?.filter((g) => g.status === "error").length ?? 0;

  // Abonnements actifs et MRR
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("status", "active");

  const activeSubscriptions = activeSubs?.length ?? 0;
  const mrr =
    activeSubs?.reduce((sum, s) => {
      if (!s.plan) return sum;
      return sum + (PLAN_PRICES_EUR[s.plan as keyof typeof PLAN_PRICES_EUR] ?? 0);
    }, 0) ?? 0;

  const grossMargin = mrr - costThisMonth;
  const marginPct = mrr > 0 ? (grossMargin / mrr) * 100 : 0;

  // Budget tracking pour afficher un bandeau d'alerte si > 80%
  const budgetEur = getMonthlyBudgetEur();
  const budgetLevel = getBudgetLevel(costThisMonth, budgetEur);
  const budgetPct =
    budgetEur > 0 ? Math.round((costThisMonth / budgetEur) * 100) : 0;

  const kpis: Kpi[] = [
    {
      label: "Utilisateurs inscrits",
      value: formatNumber(totalUsers ?? 0),
    },
    {
      label: "MRR",
      value: formatEuro(mrr),
      caption: `${activeSubscriptions} abonnement${activeSubscriptions > 1 ? "s" : ""} actif${activeSubscriptions > 1 ? "s" : ""}`,
    },
    {
      label: "Générations ce mois",
      value: formatNumber(generationsThisMonth),
      caption:
        errorsThisMonth > 0
          ? `${errorsThisMonth} en erreur`
          : "aucune erreur",
    },
    {
      label: "Coût Anthropic",
      value: formatEuro(costThisMonth),
      caption: "ce mois",
    },
    {
      label: "Marge brute",
      value: formatEuro(grossMargin),
      caption: mrr > 0 ? `${marginPct.toFixed(0)} % du MRR` : "—",
    },
  ];

  // 5 dernières générations toutes confondues
  const { data: recentGens } = await supabase
    .from("generations")
    .select("id, tool, status, cost_eur, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(5);

  // 5 derniers utilisateurs inscrits
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("user_id, full_name, cabinet_name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">00 — Console d&apos;administration</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Vue d&apos;ensemble
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          État de la plateforme LexAI en temps réel — utilisateurs, revenu,
          consommation Anthropic, marge brute.
        </p>
      </header>

      {/* Bandeau d'alerte budget — apparaît uniquement si critical ou exceeded */}
      {(budgetLevel === "critical" || budgetLevel === "exceeded") && (
        <section className="border-b border-ink bg-accent px-12 py-6 text-creme">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex-1">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em]">
                ◆ Alerte budget Anthropic —{" "}
                {budgetLevel === "exceeded"
                  ? "100 % dépassé"
                  : `${budgetPct} % consommé`}
              </p>
              <p className="mt-2 font-serif text-2xl leading-snug">
                {budgetLevel === "exceeded"
                  ? "Le budget mensuel est dépassé. L'API va bloquer au spend limit."
                  : "80 % du budget mensuel consommé. Surveillez de près."}
              </p>
              <p className="mt-2 text-sm text-creme/80">
                Regardez les 10 utilisateurs les plus coûteux dans{" "}
                <Link
                  href="/admin/costs"
                  className="underline underline-offset-4"
                >
                  Coûts &amp; marge
                </Link>{" "}
                pour identifier un éventuel abus.
              </p>
            </div>
            <Link
              href="/admin/costs"
              className="border border-creme px-6 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-creme transition-colors hover:bg-creme hover:text-accent"
            >
              Voir le détail →
            </Link>
          </div>
        </section>
      )}

      {/* KPIs principaux */}
      <section className="grid grid-cols-1 hairline-b sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`px-12 py-12 ${
              i < kpis.length - 1
                ? "border-b border-ink lg:border-b-0 lg:border-r"
                : ""
            }`}
          >
            <p className="label">{kpi.label}</p>
            <p className="mt-6 font-serif text-5xl leading-none tracking-tightest">
              {kpi.value}
              <span className="text-accent">.</span>
            </p>
            {kpi.caption && (
              <p className="mt-3 text-xs text-muted">{kpi.caption}</p>
            )}
          </div>
        ))}
      </section>

      {/* Deux colonnes : générations récentes + utilisateurs récents */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-ink px-12 py-12 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline justify-between">
            <p className="label">Dernières générations</p>
            <Link
              href="/admin/generations"
              className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Tout voir →
            </Link>
          </div>

          {!recentGens || recentGens.length === 0 ? (
            <EmptyState
              title="Aucune génération encore."
              description="Dès qu'un avocat lancera son premier outil, l'activité apparaîtra ici."
            />
          ) : (
            <table className="mt-8 w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-3 pr-4 font-bold">Outil</th>
                  <th className="py-3 pr-4 font-bold">Statut</th>
                  <th className="py-3 pr-4 text-right font-bold tabular-nums">
                    Coût
                  </th>
                  <th className="py-3 text-right font-bold">Quand</th>
                </tr>
              </thead>
              <tbody>
                {recentGens.map((gen) => (
                  <tr
                    key={gen.id}
                    className="border-b border-ink/10"
                  >
                    <td className="py-4 pr-4 font-serif text-base">
                      {gen.tool}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={gen.status} />
                    </td>
                    <td className="py-4 pr-4 text-right tabular-nums">
                      {formatEuro(Number(gen.cost_eur ?? 0))}
                    </td>
                    <td className="py-4 text-right text-xs text-muted">
                      {timeAgo(gen.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-12 py-12">
          <div className="flex items-baseline justify-between">
            <p className="label">Derniers inscrits</p>
            <Link
              href="/admin/users"
              className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Tout voir →
            </Link>
          </div>

          {!recentUsers || recentUsers.length === 0 ? (
            <EmptyState
              title="Personne pour l'instant."
              description="Le premier inscrit arrivera bientôt — soyez prêt à l'accueillir."
            />
          ) : (
            <ul className="mt-8 divide-y divide-ink/10">
              {recentUsers.map((u) => (
                <li
                  key={u.user_id}
                  className="flex items-baseline justify-between py-4"
                >
                  <div>
                    <p className="font-serif text-lg leading-tight">
                      {u.full_name ?? "—"}
                    </p>
                    {u.cabinet_name && (
                      <p className="text-xs text-muted">{u.cabinet_name}</p>
                    )}
                  </div>
                  <p className="font-sans text-xs text-muted">
                    {timeAgo(u.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    done: {
      label: "Terminée",
      className: "border-ink text-ink",
    },
    streaming: {
      label: "En cours",
      className: "border-accent text-accent",
    },
    error: {
      label: "Erreur",
      className: "border-accent bg-accent text-creme",
    },
  };
  const variant = map[status] ?? {
    label: status,
    className: "border-muted text-muted",
  };
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${variant.className}`}
    >
      {variant.label}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 max-w-md border-l-2 border-ink pl-6">
      <p className="font-serif text-2xl italic leading-tight tracking-tightest">
        {title}
      </p>
      <p className="mt-3 text-sm text-muted">{description}</p>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `il y a ${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min}min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `il y a ${hr}h`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `il y a ${days}j`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
