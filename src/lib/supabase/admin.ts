import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec le rôle SERVICE_ROLE — bypass complet de RLS.
 *
 * À UTILISER UNIQUEMENT côté serveur (route handlers, server actions),
 * et UNIQUEMENT pour les opérations qui ne peuvent pas passer par le user JWT,
 * comme :
 *   - le webhook Stripe (le payload vient de Stripe, pas d'un user authentifié)
 *   - les jobs cron / scheduled functions
 *
 * NE JAMAIS exposer cette clé côté client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client unavailable: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
