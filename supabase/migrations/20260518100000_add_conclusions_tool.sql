-- ============================================================================
-- Ajout de l'outil "conclusions" au CHECK constraint de public.generations
-- ============================================================================
-- La table generations a un CHECK constraint qui limite la colonne `tool` aux
-- 4 valeurs initiales (contrat, analyse, mise-en-demeure, clause). On ajoute
-- "conclusions" pour permettre la génération de conclusions d'avocat (5ème
-- outil livré dans le dashboard).
--
-- Idempotent : on drop puis recrée la contrainte.
-- ----------------------------------------------------------------------------

alter table public.generations
  drop constraint if exists generations_tool_check;

alter table public.generations
  add constraint generations_tool_check
  check (tool in ('contrat', 'analyse', 'mise-en-demeure', 'clause', 'conclusions'));
