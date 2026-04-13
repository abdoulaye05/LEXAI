import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitNext = searchParams.get("next");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Si la redirection a été demandée explicitement, on la respecte.
      // Sinon, on route admin vs avocat selon profiles.is_admin.
      let target = explicitNext;
      if (!target) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("user_id", user.id)
            .maybeSingle();
          target = profile?.is_admin ? "/admin" : "/dashboard";
        } else {
          target = "/dashboard";
        }
      }
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
