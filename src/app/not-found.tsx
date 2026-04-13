import Link from "next/link";

export const metadata = {
  title: "Page introuvable — LexAI",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-creme text-ink">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link
            href="/"
            className="font-serif text-2xl tracking-tightest text-ink"
          >
            LexAI
            <span className="text-accent">.</span>
          </Link>
          <Link href="/" className="label hover:text-accent">
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center">
        <div className="mx-auto max-w-4xl px-8">
          <p className="label">Erreur 404</p>
          <h1 className="mt-6 font-serif text-[clamp(56px,9vw,148px)] leading-[0.9] tracking-tightest">
            Cette page
            <br />
            <span className="italic text-accent">n&apos;existe pas</span>
            <br />
            — encore.
          </h1>
          <div className="mt-12 hairline-t pt-10">
            <p className="max-w-2xl text-muted">
              L&apos;adresse que vous cherchez ne correspond à aucun document
              de LexAI. C&apos;est peut-être un lien obsolète, ou une faute de
              frappe. Revenez à l&apos;accueil, ou allez directement à votre
              espace de travail si vous êtes avocat.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/" className="btn-primary">
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/dashboard"
                className="label hover:text-accent"
              >
                Mon espace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="hairline-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <p className="text-xs text-muted">
            © LexAI — Intelligence juridique instantanée
          </p>
          <p className="label">404 — introuvable</p>
        </div>
      </footer>
    </main>
  );
}
