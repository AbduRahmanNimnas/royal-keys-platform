# Secret Management Policy

This repository is public. Treat every committed file, every Git commit, every pull request, every CI log and every browser bundle as publicly readable.

## Non-negotiable rule

**Real credentials are never committed to Git.** Not temporarily, not in a private-looking branch, and not with the intention of deleting them later. If a real credential is committed even once, consider it exposed and rotate it.

## Where secrets belong

- **GitHub Actions:** repository/environment Secrets and Variables for CI/CD.
- **Lovable runtime/deployment:** project environment/secret settings, never source files or chat-generated frontend code.
- **Supabase:** the publishable/anon key may be used by the browser, but the `service_role` key is server-only and must never be exposed to client code.
- **Other providers (Meta, WhatsApp, PayHere, email, AI APIs):** provider tokens/secret keys must be stored in server-side runtime secrets.

## Vite rule

Anything whose environment-variable name begins with `VITE_` is bundled into browser JavaScript. Therefore **a VITE_* value must be considered public**.

Acceptable examples:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` / publishable browser key

Never use names such as:

- `VITE_SUPABASE_SERVICE_ROLE_KEY`
- `VITE_META_ACCESS_TOKEN`
- `VITE_PAYHERE_SECRET`
- `VITE_DATABASE_PASSWORD`

## Local development

Copy `.env.example` to `.env.local`. The repository ignores real `.env*` files while explicitly allowing only `.env.example`.

Do not send real secrets in screenshots, issue descriptions, pull requests, application logs or test fixtures.

## Automated protection

`npm run security:secrets` scans tracked text files for common private keys, token formats, committed values assigned to high-risk secret names, and secret-like variables incorrectly prefixed with `VITE_`.

GitHub CI runs this check on every push and pull request.

This check is a guardrail, not a substitute for correct secret storage.

## If a secret is exposed

1. Revoke/rotate the credential immediately at the provider.
2. Replace it in the proper runtime/GitHub secret store.
3. Remove it from the repository and, where appropriate, rewrite Git history.
4. Review logs and provider activity for misuse.
