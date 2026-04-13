"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour pouvoir la tracer (Sentry plus tard)
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col bg-creme text-ink">
      <header className="hairline-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Link
            href="/"
            className="font-serif text-2xl tracking-tightest text-ink"
          >
            LexAI
            <span className="text-accent">.</span>
          </Link>
          <Link href="/" className="label hover:text-accent">
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center">
        <div className="mx-auto max-w-4xl px-8">
          <p className="label">Erreur serveur</p>
          <h1 className="mt-6 font-serif text-[clamp(48px,8vw,128px)] leading-[0.9] tracking-tightest">
            Une impasse
            <br />
            <span className="italic text-accent">temporaire.</span>
          </h1>
          <div className="mt-12 hairline-t pt-10">
            <p className="max-w-2xl text-muted">
              Quelque chose s&apos;est mal passé de notre côté. L&apos;incident
              a été loggué. Vous pouvez réessayer immédiatement ou revenir sur
              vos pas.
            </p>
            {error.digest && (
              <p className="mt-4 font-mono text-xs text-muted">
                Identifiant technique : {error.digest}
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={reset}
                className="btn-primary"
              >
                Réessayer
              </button>
              <Link
                href="/"
                className="label hover:text-accent"
              >
                Retour à l&apos;accueil →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="hairline-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <p className="text-xs text-muted">
            © LexAI — Intelligence juridique instantanée
          </p>
          <p className="label">Erreur serveur</p>
        </div>
      </footer>
    </main>
  );
}
