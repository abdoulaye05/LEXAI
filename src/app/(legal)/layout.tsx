import Link from "next/link";
import SiteFooter from "@/components/site-footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-creme text-ink">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link
            href="/"
            className="font-serif text-2xl tracking-tightest text-ink"
          >
            LexAI
            <span className="text-accent">.</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/mentions-legales" className="label hover:text-accent">
              Mentions
            </Link>
            <Link href="/cgu" className="label hover:text-accent">
              CGU
            </Link>
            <Link
              href="/confidentialite"
              className="label hover:text-accent"
            >
              Confidentialité
            </Link>
            <Link href="/login" className="btn-primary">
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-20 md:py-28">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
