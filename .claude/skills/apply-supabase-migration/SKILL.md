---
name: apply-supabase-migration
description: Use this skill whenever you create a new file in `supabase/migrations/` OR when the user asks to apply / push / déployer a SQL migration. The local Supabase CLI is NOT linked to the prod project, so creating a migration file does NOT apply it. The user must manually run the SQL via Supabase Dashboard.
---

# Apply Supabase migration

## Context critique

LexAI utilise Supabase cloud (projet `egwixtovshnomvxwvmsm.supabase.co`, région eu-west-1). Le repo contient un dossier `supabase/migrations/` avec les migrations SQL versionnées, **mais il n'y a aucun lien CLI** entre ce dossier et la prod. Conséquence : créer un fichier .sql ne change RIEN sur la vraie base tant que le SQL n'est pas exécuté manuellement.

## Workflow obligatoire

Quand tu crées (ou modifies) une migration dans `supabase/migrations/` :

### 1. Nommer correctement le fichier
Format : `YYYYMMDDHHMMSS_<snake_case_name>.sql` (ex : `20260512120000_lock_is_admin_column.sql`).
Date/heure = moment de création, dans le futur si nécessaire pour préserver l'ordre.

### 2. Écrire la migration idempotente
- Toujours `create or replace function ...`
- Toujours `drop trigger if exists ... ; create trigger ...`
- Toujours `create table if not exists ...`
- Toujours `alter table ... add column if not exists ...`
- Préfixer chaque section par un commentaire `-- ============================================================================` qui explique le POURQUOI (pas le quoi).

### 3. Créer une todo dédiée
**Avant** de dire au user que c'est fait, ajouter à la TodoWrite :
- `Appliquer la migration <nom> sur Supabase prod (SQL editor)` — status `pending`

Tant que le user n'a pas confirmé l'application, cette todo reste `pending` même si le fichier local est écrit.

### 4. Donner au user les instructions exactes
Toujours fournir le bloc suivant en réponse, adapté au contexte :

```
Pour appliquer la migration sur ta prod :

1. Ouvrir https://supabase.com/dashboard/project/egwixtovshnomvxwvmsm/sql/new
2. Coller le contenu de `supabase/migrations/<nom>.sql`
3. Cliquer "Run"
4. Attendre "Success. No rows returned"
```

### 5. Si la migration est security-critical
Proposer un test rapide en console JS (DevTools) ou via curl pour confirmer que la protection est active après application. Exemple pour le verrou is_admin :

```js
await supabase.from('profiles').update({ is_admin: true }).eq('user_id', '<son-uuid>')
// Attendu : pas d'erreur côté API mais SELECT confirme is_admin toujours false
```

### 6. Une fois le user a confirmé "j'ai run"
- Marquer la todo `Appliquer la migration` comme `completed`
- NE PAS demander de relancer une vérif si la migration est triviale (juste un alter column par exemple).

## Erreurs à ne pas commettre

- ❌ Considérer le fichier local comme "déployé" dès qu'il est écrit
- ❌ Suggérer `supabase db push` (la CLI n'est pas linkée à la prod)
- ❌ Oublier le todo "Appliquer sur Supabase prod"
- ❌ Modifier rétroactivement une migration déjà appliquée (créer une nouvelle migration à la place)
