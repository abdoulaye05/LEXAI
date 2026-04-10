import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-creme text-ink">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link href="/" className="font-serif text-2xl tracking-tightest">
            LexAI
          </Link>
          <Link href="/" className="label hover:text-accent">
            ← Retour
          </Link>
        </div>
      </header>
      <div className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl grid-cols-1 md:grid-cols-12">
        <aside className="hidden border-r border-ink md:col-span-5 md:flex md:flex-col md:justify-between md:p-12">
          <p className="label">Accès professionnel</p>
          <div>
            <p className="label mb-4">— Clause 01</p>
            <p className="font-serif text-3xl leading-tight">
              « L’outil que j’aurais voulu avoir lors de mes dix premières
              années au barreau. »
            </p>
            <p className="label mt-6">
              Maître C. — Avocate au Barreau de Paris
            </p>
          </div>
          <p className="label">© {new Date().getFullYear()} LexAI</p>
        </aside>
        <section className="flex items-center md:col-span-7">
          <div className="w-full px-8 py-16 md:px-16">{children}</div>
        </section>
      </div>
    </main>
  );
}
