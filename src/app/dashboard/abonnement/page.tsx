export const metadata = {
  title: "Abonnement — LexAI",
};

const PLANS = [
  {
    num: "01",
    name: "Solo",
    price: "199 €",
    cadence: "/ mois",
    audience: "Avocat indépendant",
    features: [
      "50 documents générés par mois",
      "Accès aux 4 outils LexAI",
      "Historique et export Markdown",
      "Support email sous 48 h",
    ],
  },
  {
    num: "02",
    name: "Cabinet",
    price: "599 €",
    cadence: "/ mois",
    audience: "Cabinet de 5 à 10 avocats",
    features: [
      "Documents illimités",
      "Jusqu'à 10 comptes collaborateurs",
      "Facturation centralisée",
      "Support prioritaire sous 24 h",
    ],
    featured: true,
  },
  {
    num: "03",
    name: "Enterprise",
    price: "1 500 €",
    cadence: "/ mois",
    audience: "Grand cabinet et direction juridique",
    features: [
      "Comptes et volumétrie illimités",
      "Prompts personnalisés sur mesure",
      "Engagement de confidentialité renforcé",
      "Interlocuteur dédié",
    ],
  },
];

export default function AbonnementPage() {
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

            <button
              disabled
              className={`mt-12 w-full cursor-not-allowed border px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.08em] ${
                plan.featured
                  ? "border-creme text-creme opacity-60"
                  : "border-ink text-ink opacity-60"
              }`}
            >
              Bientôt disponible
            </button>
          </article>
        ))}
      </section>

      <footer className="hairline-t px-10 py-8">
        <p className="label">
          L'intégration Stripe arrive à l'étape suivante. Vous recevrez un
          email lorsque la facturation sera active.
        </p>
      </footer>
    </div>
  );
}
