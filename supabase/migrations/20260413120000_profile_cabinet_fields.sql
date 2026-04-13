-- ============================================================================
-- Personnalisation cabinet — champs identité + bucket logo
-- ============================================================================
-- Ajoute les champs nécessaires à la personnalisation des documents PDF
-- générés (nom complet du cabinet, adresse, SIRET, téléphone, email, logo),
-- crée le bucket Supabase Storage pour les logos, et pose les RLS policies
-- qui autorisent chaque utilisateur à gérer SES propres fichiers.
-- ----------------------------------------------------------------------------

-- 1. Nouvelles colonnes sur public.profiles
alter table public.profiles
  add column if not exists cabinet_address text,
  add column if not exists cabinet_phone text,
  add column if not exists cabinet_email text,
  add column if not exists cabinet_siret text,
  add column if not exists cabinet_website text,
  add column if not exists cabinet_logo_url text;

-- 2. Bucket Supabase Storage pour les logos (lecture publique, indispensable
--    pour que @react-pdf/renderer puisse fetch l'image côté serveur lors
--    de la génération PDF sans avoir à gérer une signed URL).
insert into storage.buckets (id, name, public)
values ('cabinet-logos', 'cabinet-logos', true)
on conflict (id) do nothing;

-- 3. RLS policies sur storage.objects pour le bucket 'cabinet-logos'
-- Chaque user écrit/update/delete uniquement dans SON propre dossier (path = {user_id}/...).

drop policy if exists "cabinet_logos_insert_own" on storage.objects;
create policy "cabinet_logos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'cabinet-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "cabinet_logos_update_own" on storage.objects;
create policy "cabinet_logos_update_own"
  on storage.objects for update
  using (
    bucket_id = 'cabinet-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "cabinet_logos_delete_own" on storage.objects;
create policy "cabinet_logos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'cabinet-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "cabinet_logos_select_public" on storage.objects;
create policy "cabinet_logos_select_public"
  on storage.objects for select
  using (bucket_id = 'cabinet-logos');
