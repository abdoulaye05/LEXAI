import Link from "next/link";
import SignupForm from "./signup-form";

export const metadata = {
  title: "Ouvrir un compte — LexAI",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="label mb-6">03 — Ouvrir un compte</p>
      <h1 className="font-serif text-6xl leading-[0.95] tracking-tightest">
        Votre cabinet
        <br />
        <span className="italic text-accent">augmenté</span>.
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        Créez votre espace LexAI. Quelques secondes, une adresse email, un mot
        de passe.
      </p>

      <div className="mt-14">
        <SignupForm />
      </div>

      <div className="mt-10">
        <Link href="/login" className="btn-ghost">
          Déjà un compte ? Se connecter →
        </Link>
      </div>
    </div>
  );
}
