# Citation / NAP audit — September 2026

Read-only public research; nothing was submitted or edited on any platform. "Not observed"
means no public evidence was found — it does not prove no unclaimed record exists. Full rows:
`CITATION-AUDIT.csv`.

## Current status update — October 1, 2026 (owner-confirmed)

The findings below remain the **September 2026 audit record**. Since then, owner-confirmed
changes:

- **Bing Places: published** and synchronized with Google Business Profile (the September
  "not observed" condition is resolved). Bing Webmaster Tools is also active (Site Scan found
  three over-long service titles — corrected and deployed).
- **Google Business Profile: active**, with the **GA4 link created** through Google's
  interface.
- **Facebook page URL:** the page URL recorded in the CSV has since changed; the current URL is
  configured in `src/config/business.ts` (post-audit note added to the CSV row).
- **Still open (verify before acting):** the authenticated GBP service-area/location
  verification, Yelp locality, Facebook field completeness, Apple Business Connect status, and
  the stale LinkedIn "Aaron's A/C Solutions" reference.
- Current platform register: `docs/operations/PLATFORM-STATUS.md`.

## Most important findings

1. **Locality/geographic inconsistency in public data — verify against the authenticated GBP.**
   Public local-business data (a place reference resolving near Tampa/Carrollwood) and the Yelp
   city field ("brooksville") disagree about locality. **The actual GBP map pin has not been
   independently verified by this audit.** Open the authenticated Google Business Profile and
   verify the service-area/location settings; do not move or change the pin based solely on
   third-party/local-search data.
2. **Yelp says "brooksville"** in the URL slug while every other citation says Spring Hill.
   Verify in the authenticated listing and correct if wrong (never solicit Yelp reviews).
3. **Bing Places and Apple Business Connect are absent** — a local-distribution **opportunity**,
   not a technical defect. Missing presence does not prevent Google organic ranking, but
   establishing the profiles expands search/map visibility and strengthens entity consistency.
   Both offer free claiming.
4. **No street address is public anywhere** (consistent service-area operation; the state
   registry address is not on the site). Keep this consistent across platforms; do not publish
   an address unless the owner decides to.
5. **Facebook details (phone/website/hours) are not visible** in the public snippet — owner
   should verify and fill them.
6. **The LLC is new** (filed May 20, 2026) — the thin footprint is expected; the priority is
   the core profiles (Google, Facebook) plus Nextdoor/Yelp consistency, then Bing/Apple as
   opportunities.

## Consistency target (use these exact values)

| Field | Canonical value |
| --- | --- |
| Name | Sunshine Climate Solutions |
| Phone | (727) 661-5200 |
| Website (profile links) | the exact UTM links in `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md` |
| Hours | 7:30 AM – 7:30 PM, every day |
| Service area | Hernando, Pasco, Pinellas, Hillsborough counties; Spring Hill home market |
| Category | HVAC contractor / air conditioning repair (closest match) |

## Owner verification actions (in priority order)

1. **Google (verify, do not move blindly):** open the authenticated profile; verify the
   service-area/location settings, categories, hours (7:30 AM – 7:30 PM daily), phone, and
   website (UTM link). Change the pin only if the authenticated profile itself shows a problem.
2. **Yelp (verify):** confirm the locality; correct only if actually wrong; complete
   phone/website/hours.
3. **Facebook (verify):** confirm phone/website/hours/service area; use the canonical page URL.
4. **Nextdoor:** verify current fields (already consistent in public view).
5. **Bing Places (opportunity):** create/claim (Google import is supported).
6. **Apple Business Connect (opportunity):** create the location.
7. Decide on BBB / Angi / Thumbtack intentionally.
8. Reconcile the public LinkedIn "Aaron's A/C Solutions" reference if it is stale branding.

No third-party edits were made from this repository, and none should be made without owner
authorization. Do not claim any external inconsistency is fixed until the owner has actually
changed it.
