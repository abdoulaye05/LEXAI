import Link from "next/link";
import Marquee from "@/components/marquee";
import SiteFooter from "@/components/site-footer";

const STATS = [
  { value: "4", label: "Outils intégrés" },
  { value: "30s", label: "Temps moyen de génération" },
  { value: "Sonnet 4.5", label: "Modèle Claude" },
  { value: "100%", label: "Droit français" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-creme text-ink">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <span className="font-serif text-2xl tracking-tightest">LexAI</span>
          <nav className="flex items-center gap-8">
            <Link href="/login" className="label hover:text-accent">
              Connexion
            </Link>
            <Link href="/signup" className="btn-primary">
              Ouvrir un compte
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-32">
        <p className="label mb-8">01 — Intelligence juridique instantanée</p>
        <h1 className="font-serif text-[clamp(56px,9vw,148px)] leading-[0.9] tracking-tightest">
          Le droit,
          <br />
          <span className="italic text-accent">à la vitesse</span>
          <br />
          de votre pensée.
        </h1>
        <div className="mt-16 grid grid-cols-1 gap-12 hairline-t pt-12 md:grid-cols-3">
          <div>
            <p className="label mb-2">Pour qui</p>
            <p className="font-serif text-2xl leading-tight">
              Avocats indépendants et cabinets français exigeants.
            </p>
          </div>
          <div>
            <p className="label mb-2">Ce que nous faisons</p>
            <p className="font-serif text-2xl leading-tight">
              Contrats, mises en demeure, clauses et analyses de risque —
              générés en quelques secondes.
            </p>
          </div>
          <div>
            <p className="label mb-2">Comment</p>
            <p className="font-serif text-2xl leading-tight">
              Par une IA de pointe, encadrée par le Code civil français.
            </p>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto max-w-7xl px-8 py-24">
        <p className="label mb-12">02 — Le produit en chiffres</p>
        <div className="grid grid-cols-1 hairline-t md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-0 py-10 md:px-8 ${
                i < STATS.length - 1 ? "md:border-r md:border-ink" : ""
              }`}
            >
              <p className="font-serif text-6xl leading-none tracking-tightest">
                {stat.value}
                <span className="text-accent">.</span>
              </p>
              <p className="mt-4 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-creme">
        <div className="mx-auto max-w-7xl px-8 py-32 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-creme/50">
            03 — Commencer maintenant
          </p>
          <h2 className="mt-6 font-serif text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-tightest">
            Dix documents offerts.
            <br />
            <span className="italic text-creme/60">Sans carte bancaire.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-creme/70">
            Ouvrez un compte, générez vos dix premiers documents, jugez sur
            pièce. Vous payez seulement si la valeur est évidente.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-accent px-10 py-5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-creme transition-colors hover:bg-creme hover:text-ink"
            >
              Essayer LexAI →
            </Link>
            <Link
              href="/login"
              className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-creme/70 underline-offset-4 hover:text-creme hover:underline"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
