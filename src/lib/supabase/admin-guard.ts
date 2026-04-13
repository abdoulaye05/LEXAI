import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Garde d'auth admin — à appeler en haut de chaque server component admin.
 * Renvoie le user et son profil si admin, sinon redirect.
 */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile || !profile.is_admin) {
    redirect("/dashboard?error=admin_required");
  }

  return { user, profile };
}
