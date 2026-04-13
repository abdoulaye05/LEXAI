import { createClient } from "@/lib/supabase/server";
import { PLAN_PRICES_EUR } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Abonnements — Admin LexAI",
};

const PLAN_LABELS: Record<string, string> = {
  solo: "Solo",
  cabinet: "Cabinet",
  enterprise: "Enterprise",
};

function formatEuro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminSubscriptionsPage() {
  const supabase = createClient();

  const { data: subs } = await supabase
    .from("subscriptions")
    .select(
      "user_id, plan, status, current_period_end, cancel_at_period_end, stripe_customer_id, created_at"
    )
    .order("created_at", { ascending: false });

  // Profiles pour afficher le nom
  const userIds = Array.from(new Set((subs ?? []).map((s) => s.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, cabinet_name")
        .in("user_id", userIds)
    : { data: [] };
  const profileByUser = new Map(
    (profiles ?? []).map((p) => [p.user_id, p] as const)
  );

  // KPIs : MRR par plan + total
  const planCounts: Record<string, number> = {
    solo: 0,
    cabinet: 0,
    enterprise: 0,
  };
  let mrr = 0;
  let activeCount = 0;
  let pastDueCount = 0;
  let trialingCount = 0;

  subs?.forEach((s) => {
    if (s.status === "active" && s.plan) {
      planCounts[s.plan] = (planCounts[s.plan] ?? 0) + 1;
      mrr += PLAN_PRICES_EUR[s.plan as keyof typeof PLAN_PRICES_EUR] ?? 0;
      activeCount++;
    }
    if (s.status === "past_due") pastDueCount++;
    if (s.status === "trialing") trialingCount++;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">03 — Revenu récurrent</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Abonnements
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Vue consolidée des abonnements actifs, leurs plans et le MRR cumulé.
          Synchronisé en temps réel depuis Stripe via webhook (à venir).
        </p>
      </header>

      <section className="grid grid-cols-2 hairline-b lg:grid-cols-4">
        {[
          { label: "MRR cumulé", value: formatEuro(mrr) },
          { label: "Solo actifs", value: String(planCounts.solo) },
          { label: "Cabinet actifs", value: String(planCounts.cabinet) },
          {
            label: "Enterprise actifs",
            value: String(planCounts.enterprise),
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

      <section className="hairline-b px-12 py-8">
        <div className="flex flex-wrap items-baseline gap-12">
          <div>
            <p className="label">Actifs</p>
            <p className="mt-1 font-serif text-2xl">{activeCount}</p>
          </div>
          <div>
            <p className="label">En essai</p>
            <p className="mt-1 font-serif text-2xl">{trialingCount}</p>
          </div>
          <div>
            <p className="label">Impayés</p>
            <p
              className={`mt-1 font-serif text-2xl ${
                pastDueCount > 0 ? "text-accent" : ""
              }`}
            >
              {pastDueCount}
            </p>
          </div>
        </div>
      </section>

      <section className="px-12 py-12">
        {!subs || subs.length === 0 ? (
          <div className="max-w-md border-l-2 border-ink pl-6">
            <p className="font-serif text-3xl italic leading-tight tracking-tightest">
              Pas encore d&apos;abonnements.
            </p>
            <p className="mt-4 text-muted">
              Stripe sera branché à la prochaine étape. Dès que le premier
              avocat passera à la caisse, son abonnement apparaîtra ici
              automatiquement via le webhook.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-6 font-bold">Avocat</th>
                  <th className="py-4 pr-6 font-bold">Plan</th>
                  <th className="py-4 pr-6 font-bold">Statut</th>
                  <th className="py-4 pr-6 font-bold">Fin de période</th>
                  <th className="py-4 pr-6 font-bold">Stripe ID</th>
                  <th className="py-4 font-bold">Annulation</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => {
                  const profile = profileByUser.get(s.user_id);
                  return (
                    <tr
                      key={s.user_id}
                      className="border-b border-ink/10 transition-colors hover:bg-ink/5"
                    >
                      <td className="py-5 pr-6">
                        <p className="font-serif text-base">
                          {profile?.full_name ?? "—"}
                        </p>
                        {profile?.cabinet_name && (
                          <p className="text-xs text-muted">
                            {profile.cabinet_name}
                          </p>
                        )}
                      </td>
                      <td className="py-5 pr-6 font-serif text-base">
                        {s.plan ? PLAN_LABELS[s.plan] : "—"}
                      </td>
                      <td className="py-5 pr-6">
                        <SubStatusBadge status={s.status} />
                      </td>
                      <td className="py-5 pr-6 text-xs text-muted">
                        {formatDate(s.current_period_end)}
                      </td>
                      <td className="py-5 pr-6 font-mono text-[10px] text-muted">
                        {s.stripe_customer_id?.slice(0, 14) ?? "—"}…
                      </td>
                      <td className="py-5">
                        {s.cancel_at_period_end ? (
                          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                            ◆ Programmée
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SubStatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center border border-muted px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        —
      </span>
    );
  }
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "Actif", className: "border-ink text-ink" },
    trialing: { label: "Essai", className: "border-muted text-muted" },
    past_due: { label: "Impayé", className: "border-accent text-accent" },
    canceled: { label: "Résilié", className: "border-muted text-muted" },
    incomplete: { label: "En attente", className: "border-muted text-muted" },
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
