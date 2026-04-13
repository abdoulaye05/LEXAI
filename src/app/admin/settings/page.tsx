export const metadata = {
  title: "Réglages — Admin LexAI",
};

const SECTIONS = [
  {
    num: "A",
    title: "Modèle Anthropic",
    description:
      "Choisir le modèle Claude utilisé par défaut pour les générations, et les modèles alternatifs autorisés selon les plans.",
    status: "à venir",
  },
  {
    num: "B",
    title: "Prompts juridiques",
    description:
      "Éditer les system prompts utilisés par chaque outil (contrat, analyse, mise en demeure, clause) sans toucher au code.",
    status: "à venir",
  },
  {
    num: "C",
    title: "Tarification",
    description:
      "Modifier les prix des plans Solo, Cabinet, Enterprise. Synchronisé avec les produits Stripe.",
    status: "à venir",
  },
  {
    num: "D",
    title: "Quotas",
    description:
      "Ajuster le nombre de générations incluses par mois pour chaque plan, et les seuils d'alerte coût.",
    status: "à venir",
  },
  {
    num: "E",
    title: "Conditions générales",
    description:
      "Mettre à jour les CGU, la politique de confidentialité, et le DPA fourni aux cabinets.",
    status: "à venir",
  },
  {
    num: "F",
    title: "Marque blanche",
    description:
      "Permettre aux cabinets Enterprise d'utiliser leur propre logo et leur palette dans les exports PDF.",
    status: "à venir",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">05 — Configuration de la plateforme</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Réglages
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Paramètres globaux qui influencent le comportement de LexAI pour
          tous les avocats. À utiliser avec discernement — chaque modification
          impacte tous les utilisateurs.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2">
        {SECTIONS.map((sec, i) => (
          <article
            key={sec.num}
            className={`border-b border-ink px-12 py-12 ${
              i % 2 === 0 ? "lg:border-r" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <p className="label">Section {sec.num}</p>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                ◆ {sec.status}
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tightest">
              {sec.title}
            </h2>
            <p className="mt-4 max-w-md text-muted">{sec.description}</p>
          </article>
        ))}
      </section>

      <section className="px-12 py-12">
        <div className="max-w-2xl border-l-2 border-accent pl-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            Note d&apos;implémentation
          </p>
          <p className="mt-3 font-serif text-xl leading-tight">
            Toutes ces sections seront branchées progressivement, après que les
            fondations Stripe et le tracking de coût soient solides. Pour
            l&apos;instant, ces réglages s&apos;éditent directement dans le code
            ou dans Supabase.
          </p>
        </div>
      </section>
    </div>
  );
}
