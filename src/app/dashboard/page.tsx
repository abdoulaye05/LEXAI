import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Tableau de bord — LexAI",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ?? null;
  const greeting = fullName ? fullName.split(" ")[0] : "Maître";

  // Placeholder data — will be replaced by real queries in the next iteration.
  const stats = [
    { label: "Documents ce mois", value: "0" },
    { label: "Plan actif", value: "Essai" },
    { label: "Crédits restants", value: "10" },
    { label: "Dernière génération", value: "—" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">Tableau de bord</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Bonjour, {greeting}
          <span className="text-accent">.</span>
        </h1>
      </header>

      <section className="grid grid-cols-1 hairline-b md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-10 py-10 ${
              i < stats.length - 1 ? "md:border-r md:border-ink" : ""
            }`}
          >
            <p className="label">{stat.label}</p>
            <p className="mt-4 font-serif text-5xl leading-none tracking-tightest">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="px-10 py-16">
        <p className="label">Commencer</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tightest">
          Quatre outils, un seul flux de travail.
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2">
          {[
            {
              num: "01",
              title: "Générer un contrat",
              desc: "Décrivez le contexte. Obtenez un contrat structuré en articles numérotés, référencé au Code civil.",
              href: "/dashboard/contrats",
            },
            {
              num: "02",
              title: "Analyser un document",
              desc: "Collez un contrat. LexAI identifie les clauses à risque et propose des reformulations.",
              href: "/dashboard/analyse",
            },
            {
              num: "03",
              title: "Rédiger une mise en demeure",
              desc: "Un ton ferme, un cadre légal précis, une lettre prête à envoyer en recommandé.",
              href: "/dashboard/mise-en-demeure",
            },
            {
              num: "04",
              title: "Créer une clause sur mesure",
              desc: "Confidentialité, non-concurrence, force majeure — calibrées à votre dossier.",
              href: "/dashboard/clauses",
            },
          ].map((tool, i) => (
            <Link
              key={tool.num}
              href={tool.href}
              className={`group border-t border-ink px-0 py-10 transition-colors duration-200 ease-surgical hover:bg-ink hover:text-creme md:px-10 ${
                i % 2 === 0 ? "md:border-r md:border-ink" : ""
              }`}
            >
              <p className="label group-hover:text-creme/70">{tool.num}</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tightest">
                {tool.title}
              </h3>
              <p className="mt-3 max-w-md text-muted group-hover:text-creme/70">
                {tool.desc}
              </p>
              <p className="mt-6 inline-block border-b border-current pb-1 font-sans text-xs font-bold uppercase tracking-[0.08em] transition-colors group-hover:text-accent">
                Ouvrir l'outil →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
