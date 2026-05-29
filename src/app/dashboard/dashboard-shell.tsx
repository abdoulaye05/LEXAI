"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { num: "01", label: "Vue d’ensemble", href: "/dashboard" },
  { num: "02", label: "Contrats", href: "/dashboard/contrats" },
  { num: "03", label: "Analyse de risques", href: "/dashboard/analyse" },
  { num: "04", label: "Mise en demeure", href: "/dashboard/mise-en-demeure" },
  { num: "05", label: "Clauses sur mesure", href: "/dashboard/clauses" },
  { num: "06", label: "Conclusions", href: "/dashboard/conclusions" },
  { num: "07", label: "Abonnement", href: "/dashboard/abonnement" },
  { num: "08", label: "Historique", href: "/dashboard/historique" },
  { num: "09", label: "Réglages", href: "/dashboard/reglages" },
];

export default function DashboardShell({
  children,
  email,
  fullName,
  isAdmin,
  countUsed,
  countLimit,
}: {
  children: React.ReactNode;
  email: string;
  fullName: string | null;
  isAdmin: boolean;
  countUsed: number;
  countLimit: number;
}) {
  const pathname = usePathname();
  const unlimited = countLimit >= 1000;
  const quotaPct = unlimited
    ? 0
    : Math.min(100, Math.round((countUsed / countLimit) * 100));
  const quotaReached = !unlimited && countUsed >= countLimit;

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-sidebar-collapsed");
    if (stored === "1") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-creme text-ink">
      <div
        className={`mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 ${
          collapsed
            ? "md:grid-cols-[88px_1fr]"
            : "md:grid-cols-[280px_1fr]"
        }`}
      >
        <aside className="relative border-b border-ink md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Déplier la navigation" : "Replier la navigation"}
            className="absolute right-0 top-6 hidden h-8 w-6 translate-x-1/2 items-center justify-center border border-ink bg-creme text-ink transition-colors hover:bg-ink hover:text-creme md:flex"
          >
            <span className="font-sans text-[11px] font-bold leading-none">
              {collapsed ? "›" : "‹"}
            </span>
          </button>

          <div
            className={`flex h-full flex-col justify-between overflow-y-auto ${
              collapsed ? "px-4 py-10" : "p-10"
            }`}
          >
            <div>
              <Link
                href="/dashboard"
                className={`block font-serif tracking-tightest ${
                  collapsed ? "text-center text-xl" : "text-2xl"
                }`}
              >
                {collapsed ? "L." : "LexAI"}
              </Link>
              {!collapsed && (
                <p className="label mt-2">Espace professionnel</p>
              )}

              <nav className={`mt-16 ${collapsed ? "space-y-7" : "space-y-6"}`}>
                {NAV.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-baseline transition-colors duration-200 ease-surgical ${
                        collapsed ? "justify-center" : "gap-4"
                      } ${
                        active
                          ? "text-accent"
                          : "text-ink hover:text-accent"
                      }`}
                    >
                      <span
                        className={`font-sans font-bold ${
                          collapsed ? "text-sm" : "text-xs"
                        }`}
                      >
                        {item.num}
                      </span>
                      {!collapsed && (
                        <span className="font-serif text-xl leading-tight">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div
              className={`border-t border-ink pt-6 ${
                collapsed ? "mt-10 text-center" : "mt-10"
              }`}
            >
              {!collapsed && <p className="label">Documents ce mois</p>}
              {unlimited ? (
                <>
                  <p
                    className={`font-serif leading-none tracking-tightest ${
                      collapsed ? "text-2xl" : "mt-3 text-4xl"
                    }`}
                  >
                    {countUsed}
                    <span className={collapsed ? "text-base italic text-muted" : "text-2xl italic text-muted"}>
                      {" "}/ ∞
                    </span>
                    <span className="text-accent">.</span>
                  </p>
                  {!collapsed && (
                    <p className="mt-3 text-xs text-muted">
                      Générations illimitées
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p
                    className={`font-serif leading-none tracking-tightest ${
                      collapsed ? "text-2xl" : "mt-3 text-4xl"
                    }`}
                  >
                    {countUsed}
                    <span className={collapsed ? "text-base text-muted" : "text-2xl text-muted"}>
                      {" "}/ {countLimit}
                    </span>
                    <span className="text-accent">.</span>
                  </p>
                  {!collapsed && (
                    <>
                      <div
                        className="mt-4 h-[2px] w-full bg-ink/15"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full transition-all duration-500 ease-surgical ${
                            quotaReached ? "bg-accent" : "bg-ink"
                          }`}
                          style={{ width: `${quotaPct}%` }}
                        />
                      </div>
                      {quotaReached ? (
                        <p className="mt-3 text-xs text-accent">
                          Quota atteint. Passez au plan supérieur pour continuer.
                        </p>
                      ) : (
                        <p className="mt-3 text-xs text-muted">
                          {countLimit - countUsed} restant
                          {countLimit - countUsed > 1 ? "s" : ""} sur l&apos;essai
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <div
              className={`border-t border-ink pt-6 ${
                collapsed ? "mt-8 text-center" : "mt-8"
              }`}
            >
              {isAdmin && (
                <Link
                  href="/admin"
                  title={collapsed ? "Console admin" : undefined}
                  className={`mb-6 flex items-baseline font-sans font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-ink ${
                    collapsed
                      ? "justify-center text-base"
                      : "gap-3 text-[11px]"
                  }`}
                >
                  <span>◆</span>
                  {!collapsed && <span>Console admin →</span>}
                </Link>
              )}
              {!collapsed && (
                <>
                  <p className="label">Connecté</p>
                  {fullName && fullName !== email ? (
                    <>
                      <p className="mt-2 break-words font-serif text-lg leading-tight">
                        {fullName}
                      </p>
                      <p className="break-all text-xs text-muted">{email}</p>
                    </>
                  ) : (
                    <p className="mt-2 break-all font-serif text-lg leading-tight">
                      {email}
                    </p>
                  )}
                </>
              )}
              <form action="/auth/signout" method="post" className={collapsed ? "mt-2" : "mt-4"}>
                <button
                  type="submit"
                  title={collapsed ? "Se déconnecter" : undefined}
                  className={collapsed ? "font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-muted hover:text-accent" : "btn-ghost"}
                >
                  {collapsed ? "↩" : "Se déconnecter"}
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
