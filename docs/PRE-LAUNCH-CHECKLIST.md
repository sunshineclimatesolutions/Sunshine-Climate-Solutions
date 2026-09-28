# Pre-launch checklist

Statuses: **Complete** / **Owner input required** / **Not yet verified**

## LAUNCH BLOCKERS (must be resolved before the site goes live)

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Florida contractor license number entered | **Owner input required** | Edit `licenseNumber` in `src/config/business.ts`. Renders in footer (every page) + About + Contact. Blank = no license line rendered anywhere (intentional). |
| 2 | Correct live contact details | Complete | Phone (727) 661-5200, SMS, owner@ email, hours, counties — all central in `src/config/business.ts`; verify once more before launch. |
| 3 | Web3Forms working + **verified inbox delivery** | Owner input required | Key configured; code + payload match Web3Forms' current documented API. Real delivery must be confirmed by an owner-authorized live submission to owner@sunshineclimatesolutions.com (free tier previously verified at ~250 submissions/month — recheck at web3forms.com). |
| 4 | Domain/HTTPS verification | Not yet verified | Blocked until deployment is authorized. After attaching the custom domain, confirm https://sunshineclimatesolutions.com loads with a valid certificate and www→apex (or apex→www) canonical redirect. |
| 5 | Preview indexing restrictions removed in production | Not yet verified | Production Cloudflare environment must NOT set `PUBLIC_PREVIEW_MODE`. Verify `robots.txt` shows `Allow: /` + sitemap and meta robots = `index, follow` on the live site. |
| 6 | No unapproved warranty/financing claims | Complete | Only the approved warranty sentence is published; Klarna promo flag disabled; payments FAQ is factual and qualified. |

## Content & SEO

| Item | Status |
| --- | --- |
| Unique titles/descriptions per page | Complete |
| One h1 per page | Complete |
| Canonical URLs + sitemap + robots.txt | Complete (behavior verified in build) |
| HVACBusiness structured data (known facts only) | Complete — no fake address, no rating markup |
| Favicon + apple-touch-icon + og image | Complete (provisional brand assets) |
| Accurate hours/pricing/contact everywhere | Complete |
| No TODOs/fake assets/secrets/customer data in repo | Complete (Web3Forms public key is an intentional public identifier) |

## Engineering verification

| Item | Status |
| --- | --- |
| Production build | Complete (14 pages) |
| TypeScript strict check | Complete (0 errors) |
| Mobile/desktop smoke test (real browser) | Complete — all checks pass |
| Console errors introduced by our code | Complete — none |
| Responsive visual inspection at 360/768/1440 | Screenshots captured (`docs/verification/screenshots/`) — owner human visual review recommended |
| Keyboard focus + zoom walkthrough | Not yet verified (manual owner pass recommended) |
| axe-core WCAG 2.2 AA scan | Complete — 0 violations across 22 scans (11 routes × mobile + desktop); pre-existing gold-on-light eyebrow contrast fixed (now navy on light surfaces) |
| Lighthouse performance (LCP/CLS targets) | Not yet verified (planned with post-push verification pass) |
| Form: validation/pending/success/failure states | Complete (against provider-spec mocks; live delivery still needs item 3) |
| Form: missing-key fallback | Complete (honest call/text/email state; no fake success) |

## OPTIONAL ENHANCEMENTS (not launch-blocking)

| Item | Status |
| --- | --- |
| Final logo replacing provisional SCS wordmark | Complete — approved Logo 2 implemented (transparent variants, favicon, touch icons, OG image); owner visual pass recommended via screenshots |
| Real project gallery | Owner input required (empty collection; Our Work hidden until entries exist) |
| Genuine testimonials | Owner input required (empty collection; hidden until entries exist) |
| Optional future analytics | Not started (intentionally; stable `data-cta` IDs are already in place on every CTA) |

## Final go-live sequence

1. Confirm blockers 1 and 3 above.
2. Deploy via the GitHub-connected Cloudflare project (see `docs/DEPLOYMENT.md`); leave preview
   `PUBLIC_PREVIEW_MODE` on the *preview* environment only.
3. Verify blockers 4 and 5 against the live URL.
4. Submit one live form test and confirm it arrives at owner@sunshineclimatesolutions.com, then
   delete the test email.
5. Re-run the verification scripts against the production URL and update `docs/VERIFICATION.md`.
