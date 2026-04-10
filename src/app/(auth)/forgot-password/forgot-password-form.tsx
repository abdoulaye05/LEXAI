"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="border border-ink px-8 py-10">
        <p className="label mb-4">Email envoyé</p>
        <p className="font-serif text-3xl leading-tight">
          Vérifiez votre boîte de réception.
        </p>
        <p className="mt-4 text-muted">
          Si un compte existe pour <span className="text-ink">{email}</span>,
          vous recevrez un lien de réinitialisation dans quelques instants.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <label htmlFor="email" className="label">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="field mt-2"
          placeholder="maitre@cabinet.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && (
        <p className="border border-accent bg-creme px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Envoi en cours…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
