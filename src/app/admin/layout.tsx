import { requireAdmin } from "@/lib/supabase/admin-guard";
import AdminShell from "./admin-shell";

export const metadata = {
  title: "Admin — LexAI",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireAdmin();

  return (
    <AdminShell
      email={user.email ?? ""}
      fullName={profile.full_name ?? null}
    >
      {children}
    </AdminShell>
  );
}
