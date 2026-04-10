"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="border border-ink px-8 py-10">
        <p className="label mb-4">Confirmation envoyée</p>
        <p className="font-serif text-3xl leading-tight">
          Consultez votre boîte de réception.
        </p>
        <p className="mt-4 text-muted">
          Un lien de confirmation a été envoyé à{" "}
          <span className="text-ink">{email}</span>. Cliquez dessus pour
          activer votre compte et accéder à LexAI.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <label htmlFor="fullName" className="label">
          Nom complet
        </label>
        <input
          id="fullName"
          type="text"
          required
          autoComplete="name"
          className="field mt-2"
          placeholder="Maître Camille Dubois"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Adresse email professionnelle
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

      <div>
        <label htmlFor="password" className="label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="field mt-2"
          placeholder="Minimum 8 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <p className="border border-accent bg-creme px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Création du compte…" : "Créer mon compte"}
      </button>

      <p className="text-xs text-muted">
        En créant un compte, vous acceptez nos conditions générales
        d’utilisation et notre politique de confidentialité.
      </p>
    </form>
  );
}
