-- ============================================================================
-- Fonction consume_credit() — quota mensuel atomique
-- ============================================================================
-- Appelée par /api/generate avant chaque génération.
-- Crée la ligne usage_credits du mois si absente, vérifie le quota,
-- incrémente count_used, et renvoie true si la génération est autorisée.
-- En cas de dépassement, renvoie false (l'API retourne 429).
-- ----------------------------------------------------------------------------

create or replace function public.consume_credit(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_period_start date := date_trunc('month', now())::date;
  v_period_end date := (date_trunc('month', now()) + interval '1 month - 1 day')::date;
  v_used int;
  v_limit int;
begin
  -- Upsert : crée la ligne pour le mois en cours si elle n'existe pas
  insert into public.usage_credits (user_id, period_start, period_end, count_used, count_limit)
  values (p_user_id, v_period_start, v_period_end, 0, 10)
  on conflict (user_id, period_start) do nothing;

  -- Lock la ligne pour éviter les race conditions
  select count_used, count_limit into v_used, v_limit
  from public.usage_credits
  where user_id = p_user_id and period_start = v_period_start
  for update;

  -- Refus si quota atteint
  if v_used >= v_limit then
    return false;
  end if;

  -- Sinon : incrémente et autorise
  update public.usage_credits
  set count_used = count_used + 1
  where user_id = p_user_id and period_start = v_period_start;

  return true;
end;
$$;

-- Permission d'appel pour les utilisateurs authentifiés
grant execute on function public.consume_credit(uuid) to authenticated;
