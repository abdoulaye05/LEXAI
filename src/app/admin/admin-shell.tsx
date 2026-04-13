"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { num: "00", label: "Vue d'ensemble", href: "/admin" },
  { num: "01", label: "Utilisateurs", href: "/admin/users" },
  { num: "02", label: "Générations", href: "/admin/generations" },
  { num: "03", label: "Abonnements", href: "/admin/subscriptions" },
  { num: "04", label: "Coûts & marge", href: "/admin/costs" },
  { num: "05", label: "Réglages", href: "/admin/settings" },
];

export default function AdminShell({
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
      <div className="mx-auto grid min-h-screen max-w-[1700px] grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Sidebar inversée — fond ink, texte crème */}
        <aside className="border-b border-ink bg-ink text-creme md:border-b-0 md:border-r">
          <div className="flex h-full flex-col justify-between p-10">
            <div>
              <Link
                href="/admin"
                className="block font-serif text-2xl tracking-tightest text-creme"
              >
                LexAI
                <span className="text-accent">.</span>
              </Link>
              <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                Console d&apos;administration
              </p>

              <nav className="mt-16 space-y-6">
                {NAV.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-baseline gap-4 transition-colors duration-200 ease-surgical ${
                        active
                          ? "text-accent"
                          : "text-creme/80 hover:text-creme"
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

            <div className="border-t border-creme/20 pt-6">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-creme/50">
                Connecté en admin
              </p>
              <p className="mt-2 font-serif text-lg leading-tight text-creme">
                {fullName ?? email}
              </p>
              {fullName && (
                <p className="text-xs text-creme/50">{email}</p>
              )}
              <div className="mt-6 flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-creme/70 underline-offset-4 hover:text-creme hover:underline"
                >
                  ← Espace pro
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-creme/70 underline-offset-4 hover:text-accent hover:underline"
                  >
                    Déconnexion
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        <main className="bg-creme">{children}</main>
      </div>
    </div>
  );
}
