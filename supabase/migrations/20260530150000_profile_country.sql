-- ============================================================================
-- Ajout du pays d'exercice du cabinet sur public.profiles
-- ============================================================================
-- Permet à chaque cabinet de choisir son pays principal d'exercice OHADA, et
-- d'adapter automatiquement le droit national, la monnaie et les juridictions
-- compétentes dans les documents générés.
--
-- Par défaut : 'GN' (Guinée — pays de la beta avec le père du founder).
--
-- 14 États OHADA principaux supportés à ce stade (Comores, Guinée-Bissau,
-- Guinée équatoriale ajoutables ultérieurement sans casser la contrainte
-- en l'élargissant).
-- ----------------------------------------------------------------------------

alter table public.profiles
  add column if not exists country text not null default 'GN';

-- Drop d'abord la contrainte si elle existe déjà (idempotent)
alter table public.profiles
  drop constraint if exists profiles_country_check;

alter table public.profiles
  add constraint profiles_country_check
  check (country in (
    'GN', -- Guinée
    'CI', -- Côte d'Ivoire
    'SN', -- Sénégal
    'CM', -- Cameroun
    'ML', -- Mali
    'BF', -- Burkina Faso
    'BJ', -- Bénin
    'TG', -- Togo
    'NE', -- Niger
    'CD', -- RDC
    'GA', -- Gabon
    'CG', -- Congo-Brazzaville
    'TD', -- Tchad
    'CF'  -- RCA
  ));
