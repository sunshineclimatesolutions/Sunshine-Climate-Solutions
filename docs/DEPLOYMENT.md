# Deployment — GitHub-connected Cloudflare project

Astro static site. **Build command:** `npm run build` · **Output directory:** `dist` ·
**Node version:** 20 or 22.

> History: this site was originally set up and documented for Cloudflare Pages. The production
> deployment is now the owner's **GitHub-connected Cloudflare project** (the owner identifies
> it as Cloudflare Workers). The deployment is configured entirely in the **Cloudflare
> dashboard** — this repository intentionally contains no wrangler file or Cloudflare
> deployment configuration. The only repository workflow is `.github/workflows/indexnow.yml`
> (search-engine notifications after a push; it does not build or deploy).
> **Agents must never change deployment settings, DNS, or the GitHub connection.**

## How deployment works

1. The GitHub repository `sunshineclimatesolutions/Sunshine-Climate-Solutions` is connected to
   the Cloudflare project.
2. **Pushing to `main` triggers a production build** (never push without explicit owner
   approval). Build: `npm run build`, output `dist/`, Node 20+.
3. Build failures never affect the live deployment — the previous build keeps serving.

## Environment variables (Cloudflare dashboard)

| Variable | Production | Preview | Purpose |
| --- | --- | --- | --- |
| `NODE_VERSION` | `20` (or `22`) | same | Pin the build runtime |
| `PUBLIC_PREVIEW_MODE` | **do not set** (or `false`) | `true` | Preview builds get `noindex` meta + `robots.txt: Disallow: /`. Production MUST NOT have it. |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | *(optional)* | *(optional)* | Only needed if the Web3Forms key is rotated; a working key is committed in `src/config/business.ts` as the public-by-design client identifier. |

No secrets are required — everything here is public, client-side configuration.

## Custom domain and DNS cautions — read before touching anything

The zone already has Google Workspace email records (**MX and SPF/DKIM TXT**) and a separate
`ai` subdomain tunnel. **Do not delete the zone, replace nameservers, or alter those records.**

- The site needs only the site hostname records (apex `A`/`AAAA` + `www` CNAME) — leave every
  other record untouched.
- The marketing site must be served by the main site hostname — **not** through the AI tunnel
  subdomain.
- If nameservers are currently external, confirm the provider's requirements before any
  nameserver change, and only make that change with explicit owner authorization.

## HTTPS + canonical redirect checks (post-deploy)

1. `https://sunshineclimatesolutions.com/` loads with a valid certificate.
2. The non-canonical host redirects to the canonical one (e.g. `www` → apex). If Cloudflare
   doesn't add it automatically: Rules → Redirect Rules →
   `www.sunshineclimatesolutions.com/*` → 301 → `https://sunshineclimatesolutions.com/$1`.
3. Internal links, canonicals, and the sitemap all use the production domain (they do by
   default — `site` is set in `astro.config.mjs`).
4. `https://sunshineclimatesolutions.com/robots.txt` shows `Allow: /` + the sitemap URL, and
   page meta robots = `index, follow` (confirms `PUBLIC_PREVIEW_MODE` is off in production).

## Post-deployment checks

- Submit one live form request → confirm arrival at owner@sunshineclimatesolutions.com →
  delete the test email.
- Click Call / Text / Request actions from a phone.
- Confirm email (Google Workspace) still delivers — MX untouched.
- Re-run `scripts/smoke.mjs` with `BASE_URL=https://sunshineclimatesolutions.com` and update
  `docs/VERIFICATION.md`.

## Rollback / redeploy

- **Instant rollback:** Cloudflare dashboard → the project → **Deployments** → any previous
  deployment → *Rollback to this deployment*. (Deployment history and one-click rollback are
  provided by the Cloudflare dashboard.)
- **Redeploy:** Deployments → *Retry* on the latest build, or push any commit to `main` to
  trigger a fresh build.

## Preview deployments

Any branch/PR deployment should carry `PUBLIC_PREVIEW_MODE=true` so all preview pages are
`noindex` — safe to share. A noindex directive is not access control: preview URLs are public
to anyone who has the link (they contain no secrets by design).

### Confirmed preview build failure (October 1, 2026)

Cloudflare Workers Builds runs **two separate steps** for a pull request:

1. **Build step** — `npm run build` (Astro static build). **This succeeds** (18 pages built;
   Cloudflare reports the build command completed successfully).
2. **Preview deploy step** — Cloudflare then runs `npx wrangler preview`, which **fails** with:

   > Your Wrangler configuration is missing a `previews` block to run this command.

**Root cause:** this repository intentionally contains **no Wrangler configuration**
(deployment settings live in the Cloudflare dashboard), so the preview-deploy command has no
`previews` block to use. The failure is in the preview **deployment** step, not the Astro
build and not the repository content (the same commit builds cleanly locally in both
production and preview modes).

**Impact:** only the PR **preview URL** is affected. The production site, the production build,
and the merged content are unaffected — pushes to `main` continue to build and deploy normally.

**Remediation options (owner / Cloudflare-side; this repository makes no change):**

1. **Temporarily disable Cloudflare Preview Builds** for documentation-only PRs
   (Cloudflare → Workers project → Settings → Builds & deployments). The PR can be reviewed and
   merged without a preview URL; production deploys are unaffected.
2. **For future branch previews, configure Worker Previews:** add a Wrangler configuration that
   **matches the existing production Worker** and includes the required `previews` block so
   `npx wrangler preview` can create preview versions. This is a deliberate
   deployment-configuration change requiring owner approval — **do not add a `wrangler`
   configuration to this repository without it.**
