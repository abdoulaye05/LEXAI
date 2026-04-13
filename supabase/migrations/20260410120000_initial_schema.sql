-- ============================================================================
-- LexAI — schema initial
-- ============================================================================
-- Tables : profiles, generations, subscriptions, usage_credits
-- Sécurité : RLS activée partout. Policies "owner OR is_admin".
-- Triggers : profile auto-créé à la signup, usage_credits init 1er du mois.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- 1. PROFILES — extension de auth.users
-- ============================================================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  full_name text,
  cabinet_name text,
  bar_id text, -- numéro de Barreau, optionnel
  role text not null default 'solo' check (role in ('solo', 'cabinet_admin', 'cabinet_member')),
  is_admin boolean not null default false, -- admin plateforme LexAI
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Tout user voit son propre profil. Les admins voient tous les profils.
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- Tout user peut updater son propre profil (sauf is_admin, qui est réservé via SQL direct).
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger : créer un profile automatiquement à chaque nouvelle inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2. GENERATIONS — historique de toutes les générations IA
-- ============================================================================
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tool text not null check (tool in ('contrat', 'analyse', 'mise-en-demeure', 'clause')),
  input_fields jsonb not null default '{}'::jsonb,
  output_md text,
  tokens_in integer not null default 0,
  tokens_out integer not null default 0,
  cost_eur numeric(10, 4) not null default 0,
  status text not null default 'streaming' check (status in ('streaming', 'done', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists generations_user_id_idx on public.generations (user_id, created_at desc);
create index if not exists generations_tool_idx on public.generations (tool);
create index if not exists generations_created_at_idx on public.generations (created_at desc);

alter table public.generations enable row level security;

create policy "generations_select_own_or_admin"
  on public.generations for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

create policy "generations_insert_own"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "generations_update_own"
  on public.generations for update
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. SUBSCRIPTIONS — sync depuis Stripe via webhook
-- ============================================================================
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text check (plan in ('solo', 'cabinet', 'enterprise')),
  status text check (status in ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_status_idx on public.subscriptions (status);
create index if not exists subscriptions_plan_idx on public.subscriptions (plan);

alter table public.subscriptions enable row level security;

-- Lecture : owner ou admin
create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );
-- Write : seul le service_role (webhook Stripe) peut écrire. Aucune policy = aucune écriture côté client.

-- ============================================================================
-- 4. USAGE_CREDITS — quotas mensuels appliqués
-- ============================================================================
create table if not exists public.usage_credits (
  user_id uuid not null references auth.users on delete cascade,
  period_start date not null,
  period_end date not null,
  count_used integer not null default 0,
  count_limit integer not null default 10, -- 10 docs/mois en essai gratuit
  primary key (user_id, period_start)
);

alter table public.usage_credits enable row level security;

create policy "usage_credits_select_own_or_admin"
  on public.usage_credits for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.is_admin = true)
  );

-- ============================================================================
-- 5. UPDATED_AT TRIGGER — auto-update sur les tables avec updated_at
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();
