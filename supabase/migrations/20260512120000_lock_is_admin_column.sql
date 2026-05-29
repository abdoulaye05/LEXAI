-- ============================================================================
-- P0 SÉCURITÉ — verrouille la colonne profiles.is_admin contre toute écriture
-- côté client (faille découverte lors de l'audit du 2026-05-11).
-- ============================================================================
-- La policy "profiles_update_own" (migration 20260410120000) autorise un user
-- à modifier TOUTES les colonnes de son propre profil, y compris is_admin.
-- Avec sa clé anon publique, n'importe quel user authentifié peut donc faire :
--
--   await supabase.from('profiles')
--     .update({ is_admin: true })
--     .eq('user_id', userId)
--
-- et devenir admin → accès à toutes les données de tous les utilisateurs via
-- la policy "profiles_select_own_or_admin".
--
-- Fix : un trigger BEFORE UPDATE qui, pour tout rôle "authenticated" (ce qui
-- couvre tous les appels venant d'un client supabase-js avec un JWT user),
-- force silencieusement NEW.is_admin = OLD.is_admin. Le service_role (utilisé
-- par les API routes server-side via SUPABASE_SERVICE_ROLE_KEY et par le SQL
-- editor Supabase) conserve la capacité de promouvoir un user en admin.
-- ----------------------------------------------------------------------------

create or replace function public.lock_profile_admin_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Seul service_role (ou un appel SQL direct depuis le dashboard) peut
  -- modifier is_admin. Pour tout user authentifié via supabase-js, on
  -- réécrit silencieusement la valeur à celle d'avant.
  if auth.role() = 'authenticated' then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_lock_is_admin on public.profiles;
create trigger profiles_lock_is_admin
  before update on public.profiles
  for each row execute function public.lock_profile_admin_column();
