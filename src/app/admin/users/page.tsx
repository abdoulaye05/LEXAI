import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Utilisateurs — Admin LexAI",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const supabase = createClient();

  // Récupère tous les profiles + leur compteur de générations + leur abonnement
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, cabinet_name, role, is_admin, created_at")
    .order("created_at", { ascending: false });

  // Récupère les abos + le nombre de générations en parallèle pour chaque user
  // Pour rester simple à ce stade, on fait une seule requête par user.
  // Quand le volume montera, on remplacera par une vue PostgreSQL.
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("user_id, plan, status");

  const { data: gens } = await supabase
    .from("generations")
    .select("user_id");

  const subByUser = new Map(
    (subs ?? []).map((s) => [s.user_id, s] as const)
  );
  const genCountByUser = new Map<string, number>();
  (gens ?? []).forEach((g) => {
    genCountByUser.set(g.user_id, (genCountByUser.get(g.user_id) ?? 0) + 1);
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-12 py-12">
        <p className="label">01 — Comptes utilisateurs</p>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95] tracking-tightest">
          Utilisateurs
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Tous les comptes inscrits sur LexAI, leur cabinet, leur plan, et leur
          consommation totale.
        </p>
      </header>

      <section className="px-12 py-12">
        {!profiles || profiles.length === 0 ? (
          <div className="max-w-md border-l-2 border-ink pl-6">
            <p className="font-serif text-3xl italic leading-tight tracking-tightest">
              Aucun compte pour l&apos;instant.
            </p>
            <p className="mt-4 text-muted">
              Les avocats apparaîtront ici dès leur première inscription via la
              page{" "}
              <Link
                href="/signup"
                className="text-ink underline underline-offset-4 hover:text-accent"
              >
                /signup
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-4 pr-6 font-bold">Nom</th>
                  <th className="py-4 pr-6 font-bold">Cabinet</th>
                  <th className="py-4 pr-6 font-bold">Plan</th>
                  <th className="py-4 pr-6 font-bold">Statut</th>
                  <th className="py-4 pr-6 text-right font-bold tabular-nums">
                    Générations
                  </th>
                  <th className="py-4 pr-6 font-bold">Inscrit le</th>
                  <th className="py-4 font-bold">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const sub = subByUser.get(p.user_id);
                  const genCount = genCountByUser.get(p.user_id) ?? 0;
                  return (
                    <tr
                      key={p.user_id}
                      className="border-b border-ink/10 transition-colors hover:bg-ink/5"
                    >
                      <td className="py-5 pr-6 font-serif text-lg">
                        {p.full_name ?? "—"}
                      </td>
                      <td className="py-5 pr-6 text-muted">
                        {p.cabinet_name ?? "—"}
                      </td>
                      <td className="py-5 pr-6 font-serif text-base">
                        {sub?.plan ?? "essai"}
                      </td>
                      <td className="py-5 pr-6">
                        <SubStatusBadge status={sub?.status ?? null} />
                      </td>
                      <td className="py-5 pr-6 text-right tabular-nums">
                        {genCount}
                      </td>
                      <td className="py-5 pr-6 text-xs text-muted">
                        {formatDate(p.created_at)}
                      </td>
                      <td className="py-5">
                        {p.is_admin ? (
                          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                            ◆ Admin
                          </span>
                        ) : (
                          <span className="text-xs text-muted">{p.role}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SubStatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center border border-muted px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        Essai
      </span>
    );
  }
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "Actif", className: "border-ink text-ink" },
    trialing: { label: "Essai", className: "border-muted text-muted" },
    past_due: {
      label: "Impayé",
      className: "border-accent text-accent",
    },
    canceled: { label: "Résilié", className: "border-muted text-muted" },
  };
  const variant = map[status] ?? {
    label: status,
    className: "border-muted text-muted",
  };
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${variant.className}`}
    >
      {variant.label}
    </span>
  );
}
