import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tableau de bord — LexAI",
};

const PLAN_LABELS: Record<Plan, string> = {
  solo: "Solo",
  cabinet: "Cabinet",
  enterprise: "Enterprise",
};

// Heuristiques pour l'analytics personnel
const MINUTES_SAVED_PER_DOC = 40; // estimation moyenne : 40 min de rédaction économisées
const LAWYER_HOURLY_RATE = 180; // € TTC, tarif horaire médian avocat parisien

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function formatEuro(n: number, decimals = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 10) return `${hours.toFixed(1)} h`;
  return `${Math.round(hours)} h`;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ?? null;
  const greeting = fullName
    ? fullName.split(" ")[0].split("@")[0]
    : "Maître";

  // Requêtes en parallèle : générations du mois, total, abonnement, quota
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: monthCount },
    { count: totalCount },
    { data: subscription },
    { data: lastGen },
  ] = await Promise.all([
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "done")
      .gte("created_at", startOfMonth.toISOString()),
    supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "done"),
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("generations")
      .select("created_at, tool")
      .eq("user_id", user.id)
      .eq("status", "done")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const docsThisMonth = monthCount ?? 0;
  const docsTotal = totalCount ?? 0;
  const plan = subscription?.plan as Plan | null;
  const planLabel = plan ? PLAN_LABELS[plan] : "Essai gratuit";
  const isActive = subscription?.status === "active";

  // Calcul analytics
  const minutesSavedThisMonth = docsThisMonth * MINUTES_SAVED_PER_DOC;
  const minutesSavedTotal = docsTotal * MINUTES_SAVED_PER_DOC;
  const euroValueThisMonth =
    (minutesSavedThisMonth / 60) * LAWYER_HOURLY_RATE;
  const euroValueTotal = (minutesSavedTotal / 60) * LAWYER_HOURLY_RATE;

  const lastGenText = lastGen?.created_at
    ? new Date(lastGen.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  const stats = [
    {
      label: "Documents ce mois",
      value: formatNumber(docsThisMonth),
      caption: docsTotal > 0 ? `${formatNumber(docsTotal)} au total` : undefined,
    },
    {
      label: "Plan actif",
      value: planLabel,
      caption: isActive ? "Facturation mensuelle active" : "Ouvrez un plan pour continuer",
    },
    {
      label: "Temps économisé",
      value: formatHours(minutesSavedThisMonth),
      caption:
        minutesSavedTotal > minutesSavedThisMonth
          ? `${formatHours(minutesSavedTotal)} depuis l'inscription`
          : "Estimation : 40 min par document",
    },
    {
      label: "Valeur équivalente",
      value: formatEuro(euroValueThisMonth),
      caption:
        euroValueTotal > euroValueThisMonth
          ? `${formatEuro(euroValueTotal)} cumulés`
          : `Tarif médian avocat ${LAWYER_HOURLY_RATE} €/h`,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">Tableau de bord</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Bonjour, {greeting}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-muted">
          Dernière génération : <span className="text-ink">{lastGenText}</span>
        </p>
      </header>

      {/* 4 KPIs personnels */}
      <section className="grid grid-cols-1 hairline-b sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-10 py-10 ${
              i < stats.length - 1
                ? "border-b border-ink md:border-b-0 md:border-r"
                : ""
            }`}
          >
            <p className="label">{stat.label}</p>
            <p className="mt-4 font-serif text-5xl leading-none tracking-tightest">
              {stat.value}
              <span className="text-accent">.</span>
            </p>
            {stat.caption && (
              <p className="mt-3 text-xs text-muted">{stat.caption}</p>
            )}
          </div>
        ))}
      </section>

      {docsThisMonth === 0 ? (
        <section className="px-10 py-16">
          <p className="label">Premier document ?</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tightest">
            Quatre outils, un seul flux de travail.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Chaque outil est livré avec des <strong>templates pré-remplis</strong> pour
            les cas les plus courants. Cliquez sur un outil, puis sur « Templates → » pour
            pré-remplir le formulaire en un clic.
          </p>
        </section>
      ) : (
        <section className="px-10 py-16">
          <p className="label">Continuer</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tightest">
            Vous avez déjà économisé {formatHours(minutesSavedTotal)}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Soit l&apos;équivalent de <strong>{formatEuro(euroValueTotal)}</strong> de
            facturation. Continuez à déléguer vos tâches répétitives et concentrez-vous
            sur la stratégie et la plaidoirie.
          </p>
        </section>
      )}

      <section className="px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {[
            {
              num: "01",
              title: "Générer un contrat",
              desc: "Décrivez le contexte. Obtenez un contrat structuré en articles numérotés, référencé au Code civil.",
              href: "/dashboard/contrats",
              fullWidth: false,
            },
            {
              num: "02",
              title: "Analyser un document",
              desc: "Collez un contrat. LexAI identifie les clauses à risque et propose des reformulations.",
              href: "/dashboard/analyse",
              fullWidth: false,
            },
            {
              num: "03",
              title: "Rédiger une mise en demeure",
              desc: "Un ton ferme, un cadre légal précis, une lettre prête à envoyer en recommandé.",
              href: "/dashboard/mise-en-demeure",
              fullWidth: false,
            },
            {
              num: "04",
              title: "Créer une clause sur mesure",
              desc: "Confidentialité, non-concurrence, force majeure — calibrées à votre dossier.",
              href: "/dashboard/clauses",
              fullWidth: false,
            },
            {
              num: "05",
              title: "Rédiger des conclusions",
              desc: "Faits, discussion, par ces motifs — des conclusions déposables structurées pour TJ, prud'hommes, T. com. ou Cour d'appel.",
              href: "/dashboard/conclusions",
              fullWidth: true,
            },
          ].map((tool, i) => (
            <Link
              key={tool.num}
              href={tool.href}
              className={`group border-t border-ink px-0 py-10 transition-colors duration-200 ease-surgical hover:bg-ink hover:text-creme md:px-10 ${
                tool.fullWidth ? "md:col-span-2" : i % 2 === 0 ? "md:border-r md:border-ink" : ""
              }`}
            >
              <p className="label group-hover:text-creme/70">{tool.num}</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tightest">
                {tool.title}
              </h3>
              <p className="mt-3 max-w-md text-muted group-hover:text-creme/70">
                {tool.desc}
              </p>
              <p className="mt-6 inline-block border-b border-current pb-1 font-sans text-xs font-bold uppercase tracking-[0.08em] transition-colors group-hover:text-accent">
                Ouvrir l&apos;outil →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
