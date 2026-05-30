# CLAUDE.md — LexAI

Fichier auto-chargé par Claude Code au début de chaque session. Contient le contexte permanent du projet.
**Garder court** (< 200 lignes) pour ne pas dominer le contexte.

---

## Projet en une phrase

**LexAI** = SaaS legal IA pour avocats **OHADA** (17 États d'Afrique francophone), pivot stratégique depuis le marché français le 2026-05-18. 5 outils (analyse contrat, rédaction contrat, mise en demeure, clauses, conclusions). Founder solo étudiant, père avocat à Conakry = beta-testeur jour 1. **Objectif business : 15-20 k€ MRR minimum** via 200-400 cabinets africains francophones à 30-150€/mois.

- **Site live** : https://lexai-dun.vercel.app
- **Repo branch principale** : `claude/supabase-auth-setup-I21O8`
- **Pays par défaut** : République de Guinée (beta). Marché cible long terme : Espace OHADA + Afrique francophone non-OHADA (Maroc, Tunisie, Algérie, Madagascar).
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

## ⚖️ Cadre juridique cible — OHADA (CRITIQUE)

**JAMAIS de référence au droit français** (Code civil, CPC, Légifrance, jurisprudence Chronopost / Salembier) dans les prompts, mock templates ou UI sauf renvoi exprès d'un Acte Uniforme OHADA.

**Cadre normatif à utiliser** :
- **10 Actes Uniformes OHADA** : AU DCG (Droit Commercial Général), AUSCGIE (Sociétés Commerciales et GIE), AU Sûretés, AU Recouvrement (Procédures Simplifiées de Recouvrement et Voies d'Exécution), AU PC (Procédures Collectives), AU Arbitrage + Règlement CCJA, SYSCOHADA, AU CTMR, AU Coopératives, AU Médiation.
- **CCJA** (Cour Commune de Justice et d'Arbitrage, Abidjan) = juridiction suprême OHADA.
- **Droit national** : Code de procédure civile guinéen par défaut (mais multi-pays OHADA à terme). Pays par pays pour droit du travail, droit pénal, droit foncier.
- **Monnaies** : FCFA (UEMOA/CEMAC), GNF (Guinée), CDF (RDC), EUR/USD pour international uniquement.
- **Juridictions exemples** : Tribunal de Commerce de Conakry, Tribunal de Première Instance de Conakry I, Cour d'Appel de Conakry, CCJA d'Abidjan.

**Ne JAMAIS inventer** : jurisprudence CCJA (n° d'arrêt), numéros d'articles d'AU. En cas de doute, écrire "[article à vérifier]".

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

## État actuel (à jour 2026-05-18)

### ✅ Implémenté
- Auth Supabase (signup + email confirm + login + reset-password)
- Dashboard avec 4 KPI + 5 outils + sidebar quotas
- 5 outils IA (analyse, contrat, mise-en-demeure, clauses, **conclusions**) en streaming via `/api/generate`
- Historique des générations + page détail + export PDF/MD
- PDF white-label par plan (Solo/Cabinet/Enterprise) + **choix fond crème ou blanc**
- Réglages cabinet (identité + logo upload Storage)
- Stripe Checkout + Webhook + Customer Portal
- Console admin complète (overview, users, generations, subscriptions, costs)
- Pages légales (mentions, CGU, confidentialité)
- Cookie banner
- Migration sécurité is_admin (appliquée 2026-05-12)
- Rate-limit 5/min sur /api/generate
- **Pivot OHADA** (2026-05-18) : tous les system prompts, mock templates et UI réécrits pour droit OHADA / Guinée

### ⚠️ Blockers vente (P0/P1 non réglés)
- Anthropic en mode mock (clé placeholder) — à activer pour beta père en Guinée
- Stripe en mode test → "TEST MODE" affiché dans Checkout
- Paiement Mobile Money pas intégré (Orange Money / Wave) — critique Afrique
- Mentions légales contiennent `[À COMPLÉTER]`
- Domaine custom pas acheté (URL = lexai-dun.vercel.app)
- Pas de page `/pricing` publique avec tier Africa-friendly (29-79-199 €/mois)
- Pas de bouton "Supprimer mon compte" (RGPD)
- Email contact `contact@lexai.app` bounce partout

### 📋 Roadmap OHADA
- **Phase 2** : 3 outils OHADA-natifs killer (Injonction de payer + voies d'exécution AU Recouvrement, Statuts SARL OHADA conformes AUSCGIE, Acte de sûreté AU Sûretés)
- **Phase 3** (le moat) : Base de jurisprudence CCJA (~3000 arrêts depuis 2001) avec recherche vectorielle Supabase pgvector
- **Phase 4** : Paiement Mobile Money (Wave Sénégal/CI, Orange Money Guinée/Mali/Cameroun) + landing OHADA
- **Phase 5** : Beta père + 3-5 cabinets Guinée, programme "Founding Lawyers Africa" 50% remise à vie

Mémoires `project_*.md` (voir `~/.claude/projects/-Users-abdoulaye-Downloads-LEXAI/memory/`).
