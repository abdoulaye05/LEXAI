---
name: audit-security
description: Use this skill when the user asks for a security audit of LexAI ("audit sécu", "check les RLS", "y a-t-il une faille", "scan sécu"). Performs a focused checklist of the project's known sensitive surfaces: RLS policies, service_role exposure, input validation, rate-limiting, secret management, LCEN/RGPD compliance.
---

# Audit sécurité LexAI

## Trigger phrases (français + anglais)
- "fais un audit sécu" / "audit security"
- "check les RLS" / "vérifie les policies"
- "y a-t-il une faille ?"
- "scan sécu"

## Checklist exhaustive

### 1. RLS — toutes les tables
Pour CHAQUE table sensible (`profiles`, `generations`, `subscriptions`, `usage_credits`) :
- [ ] RLS activée (`alter table X enable row level security`)
- [ ] Policy SELECT existe et respecte ownership (`auth.uid() = user_id`)
- [ ] Policy INSERT existe (ou justifiée par trigger SECURITY DEFINER)
- [ ] Policy UPDATE existe, avec `with check` qui couvre l'ownership ET les colonnes sensibles
- [ ] Policy DELETE existe (sinon vérifier que l'absence est intentionnelle, p.ex. cascade depuis `auth.users`)
- [ ] Aucune column-level GRANT manquante sur les flags privilégiés (`is_admin`, etc.)

**Cas connu LexAI** : `profiles.is_admin` doit être verrouillée par le trigger de la migration `20260512120000_lock_is_admin_column.sql`. Vérifier que ce trigger existe ET que la fonction `lock_profile_admin_column()` est `security definer`.

### 2. service_role key
- [ ] Grep `SUPABASE_SERVICE_ROLE_KEY` partout dans `src/` : ne doit apparaître QUE dans `src/lib/supabase/admin.ts`
- [ ] Vérifier que ce fichier n'est jamais importé depuis un client component (chercher `"use client"` dans tout fichier qui importe `@/lib/supabase/admin`)
- [ ] `.env.local` est bien dans `.gitignore` (`grep .env .gitignore`)

### 3. Webhook Stripe
- [ ] `src/app/api/stripe/webhook/route.ts` lit le body via `request.arrayBuffer()` (PAS `request.json()`)
- [ ] Appelle `stripe.webhooks.constructEvent(body, signature, secret)`
- [ ] Renvoie 400 si signature invalide
- [ ] Gère au moins : `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 4. Rate-limiting
- [ ] `/api/generate` cap à 5 req/min/user (check sur table `generations` `where created_at > now() - 60s`)
- [ ] Réponse 429 propre avec message FR

### 5. Validation inputs
- [ ] Body parsing dans `try/catch` (`/api/generate` ligne ~42)
- [ ] Whitelist des valeurs énumérables (`tool` doit être dans `VALID_TOOLS`)
- [ ] **Cap longueur** sur chaque champ texte (max 8000 chars par champ) — actuellement MANQUANT, à flag en finding P2

### 6. Secrets et placeholders
- [ ] `grep -r "placeholder" src/` : seules occurrences acceptables = `isMockMode()` logique
- [ ] `grep -r "sk_test" src/` : ne doit pas apparaître en dur (seulement via `process.env`)
- [ ] `.env.local.example` ne contient AUCUNE vraie clé

### 7. Compliance LCEN / RGPD
- [ ] `src/app/(legal)/mentions-legales/page.tsx` : aucun `[À COMPLÉTER]` ou `[ADRESSE COMPLÈTE]` (LCEN art. 6-III)
- [ ] `src/app/(legal)/confidentialite/page.tsx` : droit à l'effacement promis ET tenu (existe-t-il un endpoint `/api/account/delete` ?)
- [ ] Cookie banner présent (`src/components/cookie-banner.tsx`)
- [ ] Footer affiche un lien vers mentions légales

### 8. Anthropic budget
- [ ] `ANTHROPIC_MONTHLY_BUDGET_USD` défini en env (vérifier qu'il matche le spend limit console.anthropic.com)
- [ ] `src/lib/budget.ts` fonctions `getBudgetLevel()` retournent `critical` à 80 % et `exceeded` à 100 %
- [ ] Bandeau d'alerte affiché dans `/admin` quand level >= critical

## Format de sortie attendu

Markdown avec une table :

| # | Finding | File:line | Severity | Effort | Action |
|---|---|---|---|---|---|

Puis un top 5 prioritaires en clair, avec rationale.

## Erreurs à ne pas commettre

- ❌ Trust the comments in migrations (ex: `-- sauf is_admin, qui est réservé via SQL direct` peut être MENTEUR si la policy ne l'enforce pas)
- ❌ Audit sans lire les vraies migrations Supabase (commencer par lire `supabase/migrations/*.sql` dans l'ordre)
- ❌ Sous-évaluer une faille parce qu'elle "demande de l'effort à exploiter" — sur une plateforme publique avec des avocats, toute escalade de privilège = P0
