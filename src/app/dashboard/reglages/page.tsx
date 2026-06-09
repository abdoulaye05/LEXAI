import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";
import SettingsForm from "./settings-form";
import LogoUpload from "./logo-upload";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Réglages — LexAI",
};

const PLAN_LABELS: Record<Plan, string> = {
  solo: "Solo",
  cabinet: "Cabinet",
  enterprise: "Enterprise",
};

export default async function ReglagesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "user_id, full_name, cabinet_name, cabinet_address, cabinet_phone, cabinet_email, cabinet_siret, cabinet_website, cabinet_logo_url, bar_id, country"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .maybeSingle();

  const plan = (subscription?.plan ?? null) as Plan | null;
  const planLabel = plan ? PLAN_LABELS[plan] : "Essai";

  // Niveau de white-label autorisé par plan
  const whiteLabelLevel =
    plan === "enterprise"
      ? "Complet"
      : plan === "cabinet"
        ? "Avancé"
        : "Basique";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">08 — Personnalisation</p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tightest">
          Réglages du cabinet
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Paramétrez l&apos;identité de votre cabinet. Ces informations
          apparaissent dans l&apos;en-tête des PDF générés, à la place du nom
          LexAI, pour que vos documents portent votre marque.
        </p>
      </header>

      {/* Plan courant + niveau de personnalisation */}
      <section className="grid grid-cols-1 hairline-b md:grid-cols-3">
        <div className="border-b border-ink px-10 py-8 md:border-b-0 md:border-r">
          <p className="label">Plan en cours</p>
          <p className="mt-3 font-serif text-3xl tracking-tightest">
            {planLabel}
            <span className="text-accent">.</span>
          </p>
        </div>
        <div className="border-b border-ink px-10 py-8 md:border-b-0 md:border-r">
          <p className="label">Niveau de white-label</p>
          <p className="mt-3 font-serif text-3xl tracking-tightest">
            {whiteLabelLevel}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            {plan === "enterprise"
              ? "LexAI invisible sur vos PDF."
              : plan === "cabinet"
                ? "LexAI en bas de page uniquement."
                : "LexAI mentionné en tête et en bas."}
          </p>
        </div>
        <div className="px-10 py-8">
          <p className="label">Niveau supérieur ?</p>
          <p className="mt-3 font-serif text-xl leading-tight">
            {plan === "enterprise" ? (
              "Vous avez le niveau maximum."
            ) : (
              <>
                Passez au plan supérieur pour un branding plus discret sur vos
                documents.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Logo upload */}
      <section className="hairline-b px-10 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="label">Logo du cabinet</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tightest">
              Votre signature visuelle.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-muted">
              PNG ou JPG, 2 Mo maximum. Idéalement un logo sur fond transparent
              ou fond clair, hauteur 80-120 pixels à la sortie.
            </p>
          </div>
          <LogoUpload
            userId={user.id}
            currentLogoUrl={profile?.cabinet_logo_url ?? null}
          />
        </div>
      </section>

      {/* Email de connexion (readonly) */}
      <section className="hairline-b px-10 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="label">Email de connexion</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tightest">
              Identifiant du compte.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Cette adresse est votre identifiant. Pour la modifier, contactez
              le support.
            </p>
          </div>
          <div className="flex items-end">
            <p className="break-all font-serif text-2xl leading-tight">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Form identité cabinet */}
      <section className="px-10 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="label">Identité et coordonnées</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tightest">
              Votre cabinet en tête de document.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Tous ces champs sont optionnels. Renseignez au minimum le nom du
              cabinet pour que vos PDF affichent votre identité.
            </p>
          </div>
          <SettingsForm
            userId={user.id}
            initial={{
              country: profile?.country ?? "GN",
              full_name:
                profile?.full_name && profile.full_name !== user.email
                  ? profile.full_name
                  : "",
              cabinet_name: profile?.cabinet_name ?? "",
              cabinet_address: profile?.cabinet_address ?? "",
              cabinet_phone: profile?.cabinet_phone ?? "",
              cabinet_email: profile?.cabinet_email ?? "",
              cabinet_siret: profile?.cabinet_siret ?? "",
              cabinet_website: profile?.cabinet_website ?? "",
              bar_id: profile?.bar_id ?? "",
            }}
          />
        </div>
      </section>
    </div>
  );
}
