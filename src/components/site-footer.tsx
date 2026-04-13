import Link from "next/link";

const LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Contact", href: "mailto:contact@lexai.app" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t bg-creme">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl tracking-tightest">
            LexAI<span className="text-accent">.</span>
          </p>
          <p className="label mt-2">Intelligence juridique instantanée</p>
        </div>

        <p className="text-xs text-muted">
          © {year} LexAI — Conçu pour les avocats au Barreau de Paris.
        </p>

        <nav className="flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="label hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
