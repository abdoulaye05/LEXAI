import { createClient } from "@/lib/supabase/server";
import type { Plan, SubscriptionStatus } from "@/types/database";
import { CheckoutButton, PortalButton } from "./abonnement-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Abonnement — LexAI",
};

type PlanCard = {
  num: string;
  id: Plan;
  name: string;
  price: string;
  cadence: string;
  audience: string;
  features: string[];
  featured?: boolean;
};

const PLANS: PlanCard[] = [
  {
    num: "01",
    id: "solo",
    name: "Solo",
    price: "199 €",
    cadence: "/ mois",
    audience: "Avocat indépendant",
    features: [
      "50 documents générés par mois",
      "Accès aux 4 outils juridiques",
      "PDF avec votre logo et identité cabinet",
      "Bibliothèque personnelle de clauses",
      "Templates pré-remplis (NDA, CDI, MED…)",
      "Historique illimité et recherche",
      "Assistant IA intégré (questions 24/7)",
    ],
  },
  {
    num: "02",
    id: "cabinet",
    name: "Cabinet",
    price: "599 €",
    cadence: "/ mois",
    audience: "Cabinet de taille moyenne",
    features: [
      "Documents illimités (fair-use)",
      "Tout du plan Solo",
      "PDF white-label (LexAI seulement en pied de page)",
      "Analyse en lot (10 documents d'un coup)",
      "Comparaison intelligente de versions",
      "Synthèse automatique de documents longs",
      "Traduction juridique FR ↔ EN",
    ],
    featured: true,
  },
  {
    num: "03",
    id: "enterprise",
    name: "Enterprise",
    price: "1 500 €",
    cadence: "/ mois",
    audience: "Grand cabinet et direction juridique",
    features: [
      "Tout du plan Cabinet",
      "PDF 100 % white-label (aucune mention LexAI)",
      "Prompts personnalisables en libre-service",
      "Intégration Google Drive / Dropbox",
      "Signature électronique intégrée",
      "Rappels automatiques de suivi",
      "Accès API (1 000 appels / mois)",
    ],
  },
];

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sub } = user
    ? await supabase
        .from("subscriptions")
        .select("plan, status, current_period_end, cancel_at_period_end")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const currentPlan = (sub?.plan ?? null) as Plan | null;
  const status = (sub?.status ?? null) as SubscriptionStatus | null;
  const hasActiveSub =
    status === "active" || status === "trialing" || status === "past_due";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">06 — Abonnement</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tightest">
          Choisissez votre formule
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Passez à la facturation automatique. Annulation possible à tout
          moment, sans engagement.
        </p>
      </header>

      {/* Bandeau de statut courant */}
      {searchParams?.status === "success" && (
        <div className="border-b border-ink bg-ink px-10 py-6 text-creme">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            ◆ Souscription confirmée
          </p>
          <p className="mt-2 font-serif text-2xl">
            Bienvenue sur votre nouveau plan. Votre quota a été mis à jour.
          </p>
        </div>
      )}
      {searchParams?.status === "canceled" && (
        <div className="border-b border-ink bg-creme px-10 py-6">
          <p className="label">Souscription annulée</p>
          <p className="mt-2 font-serif text-xl">
            Aucun débit n&apos;a été effectué. Vous pouvez reprendre quand vous
            êtes prêt.
          </p>
        </div>
      )}

      {hasActiveSub && (
        <div className="hairline-b px-10 py-8">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <div>
              <p className="label">Votre plan en cours</p>
              <p className="mt-2 font-serif text-3xl tracking-tightest">
                {currentPlan
                  ? PLANS.find((p) => p.id === currentPlan)?.name
                  : "—"}
                <span className="text-accent">.</span>
              </p>
              {sub?.current_period_end && (
                <p className="mt-2 text-xs text-muted">
                  {sub.cancel_at_period_end
                    ? `Résilié — actif jusqu'au ${new Date(sub.current_period_end).toLocaleDateString("fr-FR")}`
                    : `Renouvellement le ${new Date(sub.current_period_end).toLocaleDateString("fr-FR")}`}
                </p>
              )}
            </div>
            <PortalButton />
          </div>
        </div>
      )}

      <section className="grid flex-1 grid-cols-1 lg:grid-cols-3">
        {PLANS.map((plan, i) => (
          <article
            key={plan.num}
            className={`px-10 py-12 ${
              i < PLANS.length - 1 ? "lg:border-r lg:border-ink" : ""
            } ${plan.featured ? "bg-ink text-creme" : ""}`}
          >
            <p
              className={`font-sans text-xs font-bold tracking-[0.14em] ${
                plan.featured ? "text-creme/70" : "text-muted"
              }`}
            >
              {plan.num} — {plan.audience.toUpperCase()}
            </p>
            <h2 className="mt-4 font-serif text-5xl tracking-tightest">
              {plan.name}
            </h2>
            <p className="mt-6 font-serif text-4xl tracking-tightest">
              {plan.price}
              <span
                className={`ml-1 font-sans text-sm ${
                  plan.featured ? "text-creme/70" : "text-muted"
                }`}
              >
                {plan.cadence}
              </span>
            </p>

            <ul
              className={`mt-10 space-y-3 border-t pt-6 ${
                plan.featured ? "border-creme/30" : "border-ink"
              }`}
            >
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="font-serif text-lg leading-snug"
                >
                  — {f}
                </li>
              ))}
            </ul>

            <CheckoutButton
              plan={plan.id}
              featured={plan.featured ?? false}
              hasActiveSub={hasActiveSub}
              currentPlan={currentPlan}
            />
          </article>
        ))}
      </section>

      <footer className="hairline-t px-10 py-8">
        <p className="label">
          Paiement sécurisé via Stripe. Toutes les cartes acceptées. Mode
          test actif tant que la mention « TEST » apparaît dans Stripe Checkout.
        </p>
      </footer>
    </div>
  );
}
