"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { num: "01", label: "Vue d’ensemble", href: "/dashboard" },
  { num: "02", label: "Contrats", href: "/dashboard/contrats" },
  { num: "03", label: "Analyse de risques", href: "/dashboard/analyse" },
  { num: "04", label: "Mise en demeure", href: "/dashboard/mise-en-demeure" },
  { num: "05", label: "Clauses sur mesure", href: "/dashboard/clauses" },
  { num: "06", label: "Abonnement", href: "/dashboard/abonnement" },
];

export default function DashboardShell({
  children,
  email,
  fullName,
}: {
  children: React.ReactNode;
  email: string;
  fullName: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-creme text-ink">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="border-b border-ink md:border-b-0 md:border-r">
          <div className="flex h-full flex-col justify-between p-10">
            <div>
              <Link
                href="/dashboard"
                className="font-serif text-2xl tracking-tightest"
              >
                LexAI
              </Link>
              <p className="label mt-2">Espace professionnel</p>

              <nav className="mt-16 space-y-6">
                {NAV.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-baseline gap-4 transition-colors duration-200 ease-surgical ${
                        active
                          ? "text-accent"
                          : "text-ink hover:text-accent"
                      }`}
                    >
                      <span className="font-sans text-xs font-bold">
                        {item.num}
                      </span>
                      <span className="font-serif text-xl leading-tight">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-ink pt-6">
              <p className="label">Connecté</p>
              <p className="mt-2 font-serif text-lg leading-tight">
                {fullName ?? email}
              </p>
              {fullName && (
                <p className="text-xs text-muted">{email}</p>
              )}
              <form action="/auth/signout" method="post" className="mt-4">
                <button type="submit" className="btn-ghost">
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="bg-creme">{children}</main>
      </div>
    </div>
  );
}
