# CLAUDE.md — LexAI

Fichier auto-chargé par Claude Code au début de chaque session. Contient le contexte permanent du projet.
**Garder court** (< 200 lignes) pour ne pas dominer le contexte.

---

## Projet en une phrase

**LexAI** = SaaS legal IA pour avocats français. 4 outils (analyse contrat, rédaction contrat, mise en demeure, clauses). Founder solo étudiant. **Objectif business : 15-20 k€ MRR minimum**.

- **Site live** : https://lexai-dun.vercel.app
- **Repo branch principale** : `claude/supabase-auth-setup-I21O8`
- **Le nom "LexAI" sera renommé** (collision marque) — voir mémoire `project_rename_pending.md`

---

## Stack & contraintes architecturales

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 14.2.35 App Router + TS strict | App Router obligatoire (server components, streaming) |
| DB / Auth / Storage | Supabase (Postgres + Auth + Storage) | RLS native, projet eu-west-1 |
| Client Supabase | `@supabase/supabase-js` + `@supabase/ssr` | **PAS Prisma** (Prisma contourne RLS — sécurité affaiblie) |
| Paiement | Stripe (mode **TEST** actuellement) | Pas de SIRET → mode live impossible pour l'instant |
| IA | Anthropic Claude Sonnet 4.5 streaming | **Actuellement mocké** via `src/lib/mock-templates.ts` tant que `ANTHROPIC_API_KEY` contient "placeholder" |
| PDF | `@react-pdf/renderer` | White-label par plan (Solo header+footer / Cabinet footer only / Enterprise invisible) |
| Package manager | **pnpm** | Plus rapide, lockfile stable |
| Styling | Tailwind CSS + utilities custom dans `src/app/globals.css` | Aucun composant lib (pas shadcn) |
| Hosting | Vercel région fra1 (Frankfurt) | Données EU |

---

## ⚠️ Direction visuelle — CRITIQUE

**JAMAIS de look "AI générique"** (mémoire `feedback_visual_direction.md`).

- ❌ Interdit : shadcn, cards génériques, gradients, dark mode, glassmorphism, emojis dans l'UI, icônes Lucide partout
- ✅ Obligatoire : direction **éditoriale luxe**
  - Couleurs : crème `#F5F2ED`, ink `#0D0D0D`, accent rouge `#C1392B`
  - Fonts : **DM Serif Display** (serif, titres) + **Syne** (sans, uppercase pour labels `tracking-[0.14em]`)
  - Hairline borders (`hairline-b`, `hairline-r` — utilities custom)
  - Espace généreux, tracking serré, `tracking-tightest` sur les gros titres
  - Numérotation des sections (`01 —`, `02 —`)
  - Point rouge final sur les titres (`<span className="text-accent">.</span>`)

Si on hésite, regarder `src/app/page.tsx` (landing) ou `src/app/dashboard/page.tsx` comme références.

---

## Structure du repo

```
src/
├─ app/
│  ├─ (auth)/             ← login, signup, forgot-password (route group, layout dédié)
│  ├─ (legal)/            ← mentions, CGU, confidentialité (route group)
│  ├─ admin/              ← console admin (page, users, generations, subscriptions, costs, settings)
│  ├─ api/
│  │  ├─ generate/        ← POST streaming Anthropic OU mock (rate-limit 5/min)
│  │  ├─ stripe/          ← checkout, webhook, portal
│  │  └─ export/pdf/      ← PDF white-label
│  ├─ auth/callback/      ← Supabase OAuth callback (route admin vs user)
│  ├─ dashboard/          ← espace user (4 outils + historique + abonnement + réglages)
│  ├─ reset-password/
│  ├─ layout.tsx          ← root layout (fonts, viewport, cookie banner)
│  ├─ page.tsx            ← landing publique
│  ├─ not-found.tsx       ← 404 éditoriale
│  └─ error.tsx           ← 500 éditoriale
├─ components/
│  ├─ tool-workspace.tsx  ← UI partagée des 4 outils IA (formulaire + streaming output)
│  ├─ site-footer.tsx
│  ├─ marquee.tsx
│  └─ cookie-banner.tsx
├─ lib/
│  ├─ anthropic.ts        ← client + MODEL
│  ├─ budget.ts           ← getBudgetLevel (ok/warning/critical/exceeded)
│  ├─ cost.ts             ← computeCostEur (Sonnet 4.5 $3 in / $15 out, USD_TO_EUR=0.92)
│  ├─ form-templates.ts   ← 14 templates pré-remplis
│  ├─ mock-templates.ts   ← 4 templates statiques fallback
│  ├─ pdf.tsx             ← PDF generator white-label
│  ├─ prompts.ts          ← SYSTEM_PROMPTS + buildUserMessage par tool
│  ├─ stripe.ts           ← PLAN_PRICE_IDS, PLAN_QUOTAS, isStripeConfigured
│  └─ supabase/
│     ├─ admin.ts         ← client service_role (server-only)
│     ├─ admin-guard.ts   ← protect /admin routes via profiles.is_admin
│     ├─ client.ts        ← client browser
│     ├─ middleware.ts    ← refresh session + route protection
│     └─ server.ts        ← client server components
├─ middleware.ts          ← entry point Next.js middleware
└─ types/database.ts      ← types Postgres (Profile, Generation, Subscription, UsageCredit)

supabase/
└─ migrations/            ← migrations versionnées (NON auto-appliquées en prod)

.claude/skills/           ← skills custom pour ce projet (auto-chargées par Claude Code)
```

---

## Workflow obligatoire

### Avant tout commit/push
**TOUJOURS** tester en local d'abord (mémoire `feedback_test_local_before_deploy.md`) :
1. `pnpm dev` (port 3000)
2. Demander au user de valider la feature dans son navigateur
3. ALORS seulement commit + push
4. Vercel auto-déploie depuis `main`

### Migrations Supabase
La prod n'est **PAS** linkée au Supabase CLI local. Workflow :
1. Créer le fichier `supabase/migrations/YYYYMMDDHHMMSS_<name>.sql`
2. Demander au user de copier-coller le SQL dans **Supabase Dashboard → SQL Editor → New query → Run**
3. Confirmer l'application (rappel : créer un todo dédié tant que non confirmé)

### Skills disponibles dans ce projet
Voir `.claude/skills/` — apply-supabase-migration, deploy-vercel, audit-security, switch-anthropic-prod.

---

## Sécurité — points sensibles

- **RLS activée** sur les 4 tables (profiles, generations, subscriptions, usage_credits)
- **`profiles.is_admin`** : verrouillée par trigger (migration `20260512120000_lock_is_admin_column.sql`). **Ne JAMAIS retirer ce trigger** sans replacement équivalent.
- **`SUPABASE_SERVICE_ROLE_KEY`** : UNIQUEMENT côté serveur (`src/lib/supabase/admin.ts`). Jamais dans un component client / un import partagé.
- **Webhook Stripe** : signature vérifiée via `stripe.webhooks.constructEvent` (raw body via `request.arrayBuffer()`).
- **`/api/generate`** : auth guard + rate-limit 5/min + quota mensuel atomique via RPC `consume_credit`.

---

## Variables d'environnement (`.env.local` — JAMAIS commit, `.gitignore` OK)

Critiques :
- `ANTHROPIC_API_KEY` — actuellement `sk-ant-placeholder`. La présence de "placeholder" déclenche automatiquement le mode mock dans `src/app/api/generate/route.ts:23-26`.
- `ANTHROPIC_MONTHLY_BUDGET_USD` — cap mensuel (100$ par défaut, doit matcher le spend limit console Anthropic).
- `STRIPE_*` — mode TEST. STRIPE_WEBHOOK_SECRET fourni par `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- `STRIPE_PRICE_ID_{SOLO,CABINET,ENTERPRISE}` — IDs Stripe prod (déjà créés).
- `NEXT_PUBLIC_SITE_URL` — à mettre à jour quand domaine custom acheté.

Voir `.env.local.example` pour la liste complète.

---

## Commandes utiles

```bash
pnpm dev             # dev server port 3000
pnpm build           # build prod (ignoreBuildErrors=true actuellement, à nettoyer en P2)
pnpm lint            # ESLint (ignoreDuringBuilds=true actuellement)
```

---

## État actuel (à jour 2026-05-12)

### ✅ Implémenté
- Auth Supabase (signup + email confirm + login + reset-password)
- Dashboard avec 4 KPI + 4 outils + sidebar quotas
- 4 outils IA (analyse, contrat, mise-en-demeure, clauses) en streaming via `/api/generate`
- Historique des générations + page détail + export PDF/MD
- PDF white-label par plan (Solo/Cabinet/Enterprise)
- Réglages cabinet (identité + logo upload Storage)
- Stripe Checkout + Webhook + Customer Portal
- Console admin complète (overview, users, generations, subscriptions, costs)
- Pages légales (mentions, CGU, confidentialité)
- Cookie banner
- Migration sécurité is_admin (appliquée 2026-05-12)
- Rate-limit 5/min sur /api/generate

### ⚠️ Blockers vente (P0/P1 non réglés)
- Anthropic en mode mock (clé placeholder)
- Stripe en mode test → l'avocat verra "TEST MODE" dans Checkout
- Mentions légales contiennent `[À COMPLÉTER]` → infraction LCEN
- Domaine custom pas acheté (URL = lexai-dun.vercel.app)
- Pas de page `/pricing` publique
- Pas de bouton "Supprimer mon compte" (RGPD)
- Email contact `contact@lexai.app` bounce partout

### 📋 Roadmap
Mémoires `project_*.md` (voir `~/.claude/projects/-Users-abdoulaye-Downloads-LEXAI/memory/`).
