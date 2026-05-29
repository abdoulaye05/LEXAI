---
name: deploy-vercel
description: Use this skill before ANY git commit or git push that will trigger a Vercel production deploy of LexAI. Enforces the local-test-first rule. The user's strict feedback memory `feedback_test_local_before_deploy.md` requires `pnpm dev` validation before any push to main.
---

# Deploy to Vercel

## Règle d'or

**Le user a explicitement demandé : "TOUJOURS lancer `pnpm dev` et faire valider par le user AVANT tout commit/push Vercel."**

Cette règle n'a JAMAIS d'exception sauf si :
- Le user dit explicitement "skip local test" / "push direct"
- Le changement est sur un fichier qui n'affecte pas le runtime (`.gitignore`, `README.md`, `CLAUDE.md`, doc seule)

## Workflow obligatoire

### 1. Avant tout `git commit` ou `git push`

```
1. Vérifier que pnpm dev tourne (ou le lancer en background)
2. Attendre "Ready in ..." dans les logs
3. Donner au user l'URL exacte de la feature modifiée (ex: http://localhost:3000/dashboard/contrats)
4. Demander explicitement "Teste, dis-moi si ça marche"
5. Si user dit OK → commit + push
6. Si user dit "ça marche pas" → debug, ne PAS push
```

### 2. Format du commit
- 1 ligne courte (< 70 caractères) qui dit le **pourquoi**, pas le quoi
- Co-author obligatoire :
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```
- Toujours via HEREDOC pour préserver le formatage
- Ne JAMAIS utiliser `--no-verify` ni `--no-gpg-sign`
- Ne JAMAIS amender un commit déjà pushé

### 3. Push
- Branche actuelle : `claude/supabase-auth-setup-I21O8` (vérifier avec `git branch --show-current` si doute)
- `git push` (sans `--force`)
- Vercel auto-déploie sur push vers main / branche de prod

### 4. Confirmer le déploiement
- URL prod : https://lexai-dun.vercel.app
- Donner l'URL au user pour qu'il vérifie en prod
- Si nécessaire : `curl -s -o /dev/null -w "%{http_code}" https://lexai-dun.vercel.app` pour valider que ça boot

## Erreurs à ne pas commettre

- ❌ Push sans avoir lancé `pnpm dev` au préalable
- ❌ Push sans validation explicite du user
- ❌ Commit avec un message qui décrit le **quoi** au lieu du **pourquoi**
- ❌ Force push, --no-verify, --amend sur commit pushé
- ❌ Ignorer les warnings TypeScript / ESLint (même si `ignoreBuildErrors: true` est temporairement actif dans `next.config.mjs`)

## Note sur les build checks

`next.config.mjs` a actuellement `typescript.ignoreBuildErrors: true` et `eslint.ignoreDuringBuilds: true` (dette technique, P2). Le build Vercel ne casse PAS sur erreurs TS/ESLint. Conséquence : `pnpm dev` (ou `pnpm tsc --noEmit`) est encore plus important pour catch les régressions avant prod.

Quand cette dette sera réglée, retirer ces deux flags et supprimer cette note.
