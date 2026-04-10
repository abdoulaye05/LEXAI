import ResetPasswordForm from "./reset-password-form";

export const metadata = {
  title: "Nouveau mot de passe — LexAI",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-creme text-ink">
      <div className="mx-auto max-w-xl px-8 py-24">
        <p className="label mb-6">05 — Nouveau mot de passe</p>
        <h1 className="font-serif text-6xl leading-[0.95] tracking-tightest">
          Définissez<br />
          un <span className="italic text-accent">nouveau</span> mot de passe.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Choisissez un mot de passe d’au moins 8 caractères pour sécuriser
          votre espace LexAI.
        </p>

        <div className="mt-14">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
