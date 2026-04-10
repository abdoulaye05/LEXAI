import Link from "next/link";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata = {
  title: "Mot de passe oublié — LexAI",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="label mb-6">04 — Réinitialisation</p>
      <h1 className="font-serif text-6xl leading-[0.95] tracking-tightest">
        Un instant
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        Indiquez votre adresse email. Vous recevrez un lien sécurisé pour
        définir un nouveau mot de passe.
      </p>

      <div className="mt-14">
        <ForgotPasswordForm />
      </div>

      <div className="mt-10">
        <Link href="/login" className="btn-ghost">
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
