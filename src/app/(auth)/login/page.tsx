import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./login-form";

export const metadata = {
  title: "Connexion — LexAI",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="label mb-6">02 — Connexion</p>
      <h1 className="font-serif text-6xl leading-[0.95] tracking-tightest">
        Bon retour<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        Accédez à votre espace de travail pour générer vos documents
        juridiques.
      </p>

      <div className="mt-14">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Link href="/forgot-password" className="btn-ghost">
          Mot de passe oublié
        </Link>
        <Link href="/signup" className="btn-ghost">
          Ouvrir un compte →
        </Link>
      </div>
    </div>
  );
}
