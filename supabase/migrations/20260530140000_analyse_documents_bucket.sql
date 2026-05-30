-- ============================================================================
-- Bucket Supabase Storage pour les PDFs uploadés à des fins d'analyse juridique
-- ============================================================================
-- Permet aux avocats de téléverser un PDF (contrat, statuts, jugement) dans
-- l'outil /dashboard/analyse, qui sera envoyé directement à Claude Sonnet 4.5
-- en mode multimodal (OCR natif, lecture tableaux et scans).
--
-- Sécurité : bucket privé. Chaque user lit/écrit/supprime uniquement SES
-- propres fichiers, isolés par dossier {user_id}/...
-- Le service_role (côté API) peut lire tous les fichiers pour les transmettre
-- à Anthropic.
--
-- Note : pas de purge automatique pour la beta. Les fichiers s'accumulent
-- dans le bucket. À mettre en place via Edge Function planifiée quand le
-- volume dépassera 1 Go.
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('analyse-documents', 'analyse-documents', false)
on conflict (id) do nothing;

drop policy if exists "analyse_documents_insert_own" on storage.objects;
create policy "analyse_documents_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'analyse-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "analyse_documents_select_own" on storage.objects;
create policy "analyse_documents_select_own"
  on storage.objects for select
  using (
    bucket_id = 'analyse-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "analyse_documents_delete_own" on storage.objects;
create policy "analyse_documents_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'analyse-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
