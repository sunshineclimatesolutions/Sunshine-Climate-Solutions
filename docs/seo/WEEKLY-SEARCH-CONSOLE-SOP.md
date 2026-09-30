# Weekly Search Console SOP — September 2026

A 20–30 minute weekly process. Emphasize **clicks, impressions, and trends** over any single
position; GSC average position is an average, not a universal rank.

## Weekly routine

1. **Performance → Queries (last 7 / 28 days).** Record: clicks, impressions, CTR, position.
   Note new queries and any query with impressions ≥ ~50 and CTR below ~1%.
2. **Performance → Pages.** Which landing pages earn impressions/clicks? Map each new query to
   an existing page before considering new content (cannibalization check).
3. **Indexing → Pages.** Confirm 15 URLs indexed (14 + hub). Investigate any "Discovered –
   not indexed" or "Crawled – not indexed" for real pages (not thank-you/404).
4. **Sitemaps.** Confirm the sitemap is read and no errors.
5. **Experience / Core Web Vitals.** Watch field data once traffic exists; the site's lab CLS
   work is documented in `docs/VERIFICATION.md`.
6. **Log the week** in a simple sheet (date, query, impressions, clicks, CTR, position, action).

## Opportunity rules (what to do with what you see)

| Signal | Interpretation | Action |
| --- | --- | --- |
| High impressions + position 4–10 | Page is close; snippet may be limiting clicks | Improve title/meta usefulness (variants in `ON-PAGE-AUDIT.md`), add depth |
| High impressions + position 11–20 | Ranking but too far down | Strengthen the owning page (content, internal links), not a new page |
| High impressions + low CTR | Intent/snippet mismatch | Re-read the query intent; adjust snippet, not clickbait |
| Rising impressions | Google is testing the page | Watch; do not panic-edit |
| New query | New demand signal | Map to an existing page first; only then consider content |
| Query cannibalization (two pages, same query) | Unclear ownership | Decide the primary page (see `KEYWORD-TO-PAGE-MAP.md`), de-optimize the other |
| Brand queries rising | Entity strengthening | Keep NAP/GBP consistent |

## Monthly additions

- GBP performance export: compare **website organic search** vs **Maps/Business Profile**
  visibility; note which queries surface the profile.
- Review count/rating trend (GBP).
- Check the citation audit items that were actioned.

## Data hygiene

- Filter out internal traffic once identifiable (owner/tech devices).
- Do not apply destructive filters without review; keep raw exports before filtering.
- Keep date ranges consistent week over week.
