"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "lexai.cookie-consent.v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // N'affiche le bandeau que si l'utilisateur n'a jamais acquitté
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage peut être indisponible (mode privé strict) — on n'affiche pas
    }
  }, []);

  function acknowledge() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ acknowledged_at: new Date().toISOString() })
      );
    } catch {
      // Ignore — le bandeau reviendra à la prochaine visite
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Information sur les cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-ink text-creme"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
            ◆ Cookies
          </p>
          <p className="mt-2 font-serif text-lg leading-snug">
            LexAI utilise uniquement des cookies strictement nécessaires au
            fonctionnement du service (authentification, session de paiement).
            Aucun cookie publicitaire ou de mesure d&apos;audience n&apos;est
            déposé.
          </p>
          <p className="mt-2 text-sm text-creme/70">
            Pour en savoir plus, consultez notre{" "}
            <Link
              href="/confidentialite"
              className="text-creme underline underline-offset-4 hover:text-accent"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 border border-creme bg-creme px-8 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-accent hover:text-creme"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
