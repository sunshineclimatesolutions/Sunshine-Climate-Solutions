# IndexNow

IndexNow notifies participating search engines (Bing, Yandex, Seznam, Naver, …) about new,
updated or deleted URLs. It is an additional notification channel — **not** a replacement for
Google Search Console, the sitemap, or crawlability. Google is not an IndexNow participant.

## Key / verification (Option 1 — root key file)

- The verification file lives in `public/<key>.txt` and contains exactly the key (UTF-8).
  It is served at `https://sunshineclimatesolutions.com/<key>.txt`.
- The key is **public by design** (that is how verification works) — no secrets involved.
- The file name must equal the file content. The submission script enforces this.
- To rotate the key: generate a new key, replace the file in `public/` (delete the old one),
  and update nothing else — the script reads whichever valid key file exists.

## Manual use

```
node scripts/indexnow.mjs --range <fromSha>..<toSha>   # URLs changed in a commit range
node scripts/indexnow.mjs --urls "https://…/a/,https://…/b/"
  --base https://sunshineclimatesolutions.com          # default
  --wait        # poll until the changed URLs are live (deployment finished)
  --dry-run     # print + verify only, never submit
```

The script:
- maps changed repository files to the canonical URLs they affect;
- verifies every URL is live (HTTP 200, not `noindex`) before submitting;
- excludes preview/localhost hosts, tracking-query URLs, `/thank-you/` and `/404/`;
- submits **one batched request** to `https://api.indexnow.org/indexnow` (the shared
  endpoint distributes to all participating engines — never call engines individually);
- logs every URL and the HTTP response; retries once on 429/5xx;
- never repeats unchanged pages (submissions derive from git commit ranges).

## Automation (GitHub Actions)

`.github/workflows/indexnow.yml` runs on every push to `main` (the production branch):
it computes the pushed commit range, waits (up to 6 minutes) until the changed URLs are
actually live on the production domain, then submits them. The workflow does not build,
deploy, or modify the site; it uses no secrets (the key is public). If the repository has
Actions disabled, run the script manually after a deployment instead.

## Response codes

| Code | Meaning |
| --- | --- |
| 200 | Received. (Does not guarantee indexing.) |
| 202 | Received; key verification pending. |
| 400/403/422 | Invalid request / key not verified / URL not on host — investigate. |
| 429 | Rate limited — the script retries once after 30 s. |

## Verifying activity

Bing Webmaster Tools → your site → **IndexNow** (or URL submission reports) shows submitted
URLs and their status. IndexNow responses confirm **receipt only** — indexing is decided by
each search engine independently.
