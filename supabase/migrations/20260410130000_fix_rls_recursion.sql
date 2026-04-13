-- ============================================================================
-- Fix : récursion infinie RLS sur les policies "owner OR is_admin"
-- ============================================================================
-- Problème : les policies originales faisaient `exists (select 1 from profiles
-- where is_admin = true)` à l'intérieur de policies sur profiles → récursion.
-- Solution : SECURITY DEFINER function qui bypass RLS pour le check admin.
-- ----------------------------------------------------------------------------

-- 1. Helper SECURITY DEFINER — bypass RLS quand on check is_admin
create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where user_id = auth.uid()),
    false
  );
$$;

-- Permission d'appel pour les rôles authentifiés et anonymes
grant execute on function public.current_user_is_admin() to authenticated, anon;

-- 2. Drop les anciennes policies récursives
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "generations_select_own_or_admin" on public.generations;
drop policy if exists "subscriptions_select_own_or_admin" on public.subscriptions;
drop policy if exists "usage_credits_select_own_or_admin" on public.usage_credits;

-- 3. Recréer les policies avec la fonction SECURITY DEFINER
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = user_id or public.current_user_is_admin());

create policy "generations_select_own_or_admin"
  on public.generations for select
  using (auth.uid() = user_id or public.current_user_is_admin());

create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.current_user_is_admin());

create policy "usage_credits_select_own_or_admin"
  on public.usage_credits for select
  using (auth.uid() = user_id or public.current_user_is_admin());
