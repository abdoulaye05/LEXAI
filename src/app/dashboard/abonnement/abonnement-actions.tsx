"use client";

import { useState } from "react";
import type { Plan } from "@/types/database";

export function CheckoutButton({
  plan,
  featured,
  hasActiveSub,
  currentPlan,
}: {
  plan: Plan;
  featured: boolean;
  hasActiveSub: boolean;
  currentPlan: Plan | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCurrentPlan = currentPlan === plan;

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? data?.error ?? `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError("URL de checkout manquante");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (isCurrentPlan) {
    return (
      <div
        className={`mt-12 w-full border px-8 py-4 text-center font-sans text-xs font-bold uppercase tracking-[0.08em] ${
          featured
            ? "border-creme/40 text-creme/60"
            : "border-ink/40 text-muted"
        }`}
      >
        ◆ Plan en cours
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`w-full border px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-200 ease-surgical disabled:cursor-not-allowed disabled:opacity-50 ${
          featured
            ? "border-accent bg-accent text-creme hover:bg-creme hover:text-ink"
            : "border-ink text-ink hover:bg-ink hover:text-creme"
        }`}
      >
        {loading
          ? "Redirection vers Stripe…"
          : hasActiveSub
            ? "Changer pour ce plan →"
            : "Souscrire →"}
      </button>
      {error && (
        <p
          className={`text-xs ${
            featured ? "text-creme/80" : "text-accent"
          }`}
        >
          Erreur : {error}
        </p>
      )}
    </div>
  );
}

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? data?.error ?? `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError("URL portail manquante");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent hover:underline disabled:opacity-50"
      >
        {loading ? "Redirection…" : "Gérer mon abonnement →"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-accent">Erreur : {error}</p>
      )}
    </div>
  );
}
