# Support campaign video strategy — two separate founder speeches

**Status:** owner-directed plan (2026-10-09). No video is published yet; both
films are produced separately by Aaron and supplied when finished.

The SCS support campaign uses **two separately written and recorded founder
speeches**. They are different productions with different audiences and lengths.
Never treat one as an edit of the other.

## 1. Website introduction (SHORT)

- **Where it appears:** the `/support/` page only, in the "A Brief Message from
  the Owner" section directly beneath the hero.
- **Length:** approximately **45–75 seconds**.
- **Purpose:** a short, distinct message introducing Aaron, SCS, and the purpose
  of the campaign. It should interest the viewer in the longer founder message.
- **Configuration:** `business.fundraising.founderVideoUrl` in
  `src/config/business.ts` — this field is for the website introduction ONLY.
- **Integration:** normal YouTube watch/share link; the page derives a
  privacy-enhanced `youtube-nocookie` embed and loads it only on click
  (no third-party request before interaction). Until a URL is configured the
  page shows the neutral-gray "Coming Soon" frame with a slashed camera icon —
  no image, no play control, no fake player.

## 2. Full fundraiser presentation (LONG)

- **Where it appears:** the GoFundMe and GiveSendGo campaign pages, managed in
  the fundraising-platform workflow (not in this repository).
- **Length:** approximately **2–3 minutes**.
- **Purpose:** a complete explanation of Aaron's story, SCS, his personal
  investment, the approved $20,000 financial goal, and the future of the
  company. It must make sense to someone who has never visited the SCS website.
- **Reuse:** the same complete film may be used on both GiveSendGo and
  GoFundMe.
- **Configuration:** none in the website repository. Do not point
  `business.fundraising.founderVideoUrl` at the fundraiser film.

## Rules

- Do not automatically use one video as the source for both — they are separate
  speeches.
- Do not overwrite the website introduction with the fundraiser presentation.
- Do not invent media URLs and do not publish unfinished footage.
- The website introduction stays embeddable on `/support/` through the existing
  click-to-load video component; the fundraiser film stays entirely within the
  fundraising platforms.
