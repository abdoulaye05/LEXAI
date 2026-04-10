"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(mapError(signInError.message));
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
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

      <div>
        <label htmlFor="password" className="label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          className="field mt-2"
          placeholder="••••••••"
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
        {loading ? "Connexion en cours…" : "Se connecter"}
      </button>
    </form>
  );
}

function mapError(message: string): string {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Identifiants incorrects. Vérifiez votre email et mot de passe.";
  }
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Email non confirmé. Consultez votre boîte de réception.";
  }
  return message;
}
