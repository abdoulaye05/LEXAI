import Link from "next/link";

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
    </main>
  );
}
