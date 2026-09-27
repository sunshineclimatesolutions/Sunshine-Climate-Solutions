# Deployment — Cloudflare Pages

Astro static site. **Build command:** `npm run build` · **Output directory:** `dist` ·
**Node version:** 20 or 22.

## 1. Connect the repository

Cloudflare dashboard → Workers & Pages → Create → Pages → *Connect to Git* → select
`sunshineclimatesolutions/Sunshine-Climate-Solutions` → set:

| Setting | Value |
| --- | --- |
| Framework preset | Astro (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repo root) |

## 2. Environment variables

Set in **Settings → Variables and deployments**:

| Variable | Production | Preview | Purpose |
| --- | --- | --- | --- |
| `NODE_VERSION` | `20` (or `22`) | same | Pin the build runtime |
| `PUBLIC_PREVIEW_MODE` | **do not set** (or `false`) | `true` | Preview builds get `noindex` meta + `robots.txt: Disallow: /`. Production MUST NOT have it. |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | *(optional)* | *(optional)* | Only needed if you rotate the Web3Forms key; a working key is committed in `src/config/business.ts` as the public-by-design client identifier. |

No secrets are required — everything here is public, client-side configuration.

## 3. pages.dev testing

The first deploy gets a `<project>.pages.dev` URL. Because preview builds carry
`PUBLIC_PREVIEW_MODE=true`, that URL is not indexed. Test there: navigation, phone/text links,
the request form (a live test submission is expected to reach owner@sunshineclimatesolutions.com),
and the sticky mobile action bar on a real phone.

## 4. Custom domain (apex + www)

Settings → Custom domains → *Set up a custom domain* → `sunshineclimatesolutions.com`; repeat
for `www.sunshineclimatesolutions.com`.

**DNS cautions — read before touching anything:**

- The zone already has Google Workspace email records (**MX and SPF/DKIM TXT**) and a separate
  `ai` subdomain tunnel. **Do not delete the zone, replace nameservers, or alter those records.**
- Cloudflare Pages needs only the site hostname records (apex `A`/`AAAA` + `www` CNAME) — the
  Pages custom-domain wizard creates them; leave every other record untouched.
- The marketing site must be served by Pages — **not** through the AI tunnel subdomain.
- If nameservers are currently external, attaching the domain in Cloudflare Pages on a
  partial (CNAME) setup still works for `www`; confirm the provider's requirements before any
  nameserver change, and only make that change if you intend to.

## 5. HTTPS + canonical redirect checks (post-deploy)

1. `https://sunshineclimatesolutions.com/` loads with a valid certificate.
2. The non-canonical host redirects to the canonical one (choose one, e.g. `www` → apex).
   If Cloudflare doesn't add it automatically: Rules → Redirect Rules →
   `www.sunshineclimatesolutions.com/*` → 301 → `https://sunshineclimatesolutions.com/$1`.
3. Internal links, canonicals, and the sitemap all use the production domain (they do by
   default — `site` is set in `astro.config.mjs`).
4. `https://sunshineclimatesolutions.com/robots.txt` shows `Allow: /` + the sitemap URL, and
   page meta robots = `index, follow` (confirms `PUBLIC_PREVIEW_MODE` is off in production).

## 6. Post-deployment checks

- Submit one live form request → confirm arrival at owner@sunshineclimatesolutions.com →
  delete the test email.
- Click Call / Text / Request actions from a phone.
- Confirm email (Google Workspace) still delivers — MX untouched.
- Re-run `scripts/smoke.mjs` with `BASE_URL=https://sunshineclimatesolutions.com` and update
  `docs/VERIFICATION.md`.

## 7. Rollback / redeploy

- **Instant rollback:** Workers & Pages → the project → **Deployments** → any previous
  deployment → *Rollback to this deployment*. (Pages keeps a history; rollback is one click.)
- **Redeploy:** Deployments → *Retry deployment* on the latest, or push any commit to the
  production branch to trigger a fresh build.
- Build failures never affect the live deployment — the previous build keeps serving.

## 8. Preview deployments

Every branch/PR gets a `<hash>.<project>.pages.dev` URL. With `PUBLIC_PREVIEW_MODE=true` on the
preview environment, all preview pages are `noindex` — safe to share. A noindex directive is
not access control: preview URLs are public to anyone who has the link (they contain no
secrets by design).
