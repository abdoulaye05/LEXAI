import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: usage }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("user_id", user.id)
      .maybeSingle(),
    (() => {
      const today = new Date();
      const periodStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
        .toISOString()
        .slice(0, 10);
      return supabase
        .from("usage_credits")
        .select("count_used, count_limit")
        .eq("user_id", user.id)
        .eq("period_start", periodStart)
        .maybeSingle();
    })(),
  ]);

  return (
    <DashboardShell
      email={user.email ?? ""}
      fullName={
        profile?.full_name ??
        ((user.user_metadata?.full_name as string) ?? null)
      }
      isAdmin={profile?.is_admin ?? false}
      countUsed={usage?.count_used ?? 0}
      countLimit={usage?.count_limit ?? 10}
    >
      {children}
    </DashboardShell>
  );
}
