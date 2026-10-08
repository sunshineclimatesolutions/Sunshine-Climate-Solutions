# Social profile setup guide

Everything the owner needs to fill in each new platform profile consistently,
plus the current visual asset sizes. Nothing here changes the website.

## Standard brand block (use these exact values)

| Field | Value |
| --- | --- |
| Business name | Sunshine Climate Solutions |
| Phone | (727) 661-5200 |
| Website | the platform-specific tracked URL from `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md` |
| Primary market | Spring Hill, Florida |
| Service area | Hernando, Pasco, Pinellas and Hillsborough counties / Tampa Bay |
| Hours | 7:30 AM – 7:30 PM, every day |
| Core positioning | Owner-operated · Repair-first · Measurement-driven diagnostics · Clear explanations |
| Services | AC Repair & Diagnostics · Premium AC Maintenance · Replacement & Installation · Airflow & Ductwork · Commercial Service & Maintenance · TAB & Commissioning Support |

Rules:

- **Paste the tracked URL (with `utm_*` parameters) into the platform's Website
  field** — never the plain homepage. That is how visits from each platform are
  attributed. The exact URL per platform is in the owner cheat sheet
  (`WHERE-TO-PASTE-UTM-LINKS.md`).
- The website's footer links to the clean public profile URLs; the website
  never adds UTMs to outbound social links.
- Phone format stays `(727) 661-5200`. Hours stay exactly as above.

## Recommended profile copy

### Instagram bio

```text
HVAC repair, maintenance & installation
Airflow • Ductwork • Commercial • TAB
Spring Hill & Tampa Bay
Call/Text: (727) 661-5200
```

### TikTok bio

```text
HVAC repair • installs • airflow • TAB
Spring Hill + Tampa Bay
```

### X bio

```text
Owner-operated HVAC • AC repair, maintenance, installs, airflow, commercial & TAB • Spring Hill + Tampa Bay • (727) 661-5200
```

### Gab / Parler short bio

```text
Owner-operated HVAC service. Repair, maintenance, installation, airflow/ductwork, commercial & TAB. Spring Hill + Tampa Bay.
```

### YouTube channel description

```text
Sunshine Climate Solutions provides owner-operated HVAC service throughout Spring Hill and the Tampa Bay area.

We specialize in AC repair and diagnostics, preventive maintenance, replacement and installation, airflow and ductwork troubleshooting, commercial HVAC service, and Testing, Adjusting & Balancing / commissioning support.

Our approach is repair-first and measurement-driven. We use electrical testing, refrigerant readings, static pressure, airflow measurements and other diagnostic methods to identify the actual problem before recommending work.

Serving Hernando, Pasco, Pinellas and Hillsborough counties.

Call or text: (727) 661-5200
Website: [paste the YouTube tracked URL from WHERE-TO-PASTE-UTM-LINKS.md]
```

### LinkedIn tagline (publish on the live Company Page)

```text
Measurement-driven HVAC service, airflow diagnostics, commercial support & TAB.
```

### LinkedIn overview (publish on the live Company Page)

```text
Sunshine Climate Solutions is an owner-operated HVAC company serving Spring Hill and the Tampa Bay region.

Our work includes residential and light-commercial HVAC service, diagnostics, maintenance, replacements and installations, airflow and ductwork troubleshooting, as well as Testing, Adjusting & Balancing and commissioning support.

We emphasize measurement-driven diagnostics, straightforward recommendations and a repair-first approach.

Service area includes Hernando, Pasco, Pinellas and Hillsborough counties.

Commercial contractors, property teams and project partners are welcome to contact us regarding service, subcontracted work, TAB and commissioning support.
```

## Profile pictures

Use the approved SCS avatar exports (no new logo was created; these are copies
of the approved mark):

- `public/brand/social-avatar-1024.png` — master for profile pictures.
- `public/brand/social-avatar-400.png` — for small upload fields.

Regenerate with `node scripts/generate-social-avatars.mjs`. The mark is centered
with generous margins, so circular crops never clip it.

## Recommended visual asset sizes

Sources are cited per platform; values marked "practical target" are widely
used production targets where the platform does not publish a fixed number.
Checked 2026-09-30.

| Platform | Asset | Recommendation | Source |
| --- | --- | --- | --- |
| Instagram | Profile picture | 320×320 (1:1) — practical target; Instagram publishes no fixed upload size. Displayed as a circle. | Instagram Help Center — Add a profile picture or change your current picture: `https://help.instagram.com/557544397610546` (no dimensions published); 320×320 is the standard production target |
| TikTok | Profile photo | Minimum **20×20** (official); served ~200×200 — upload a 1:1 square at **400×400 or larger** | TikTok Support — Adding a profile photo or video: `https://support.tiktok.com/en/getting-started/setting-up-your-profile/adding-a-profile-photo-or-video` (minimum 20×20); 400×400 is the practical production target |
| YouTube | Profile picture | Square image (official guidance: "best to upload a square or round image"); 800×800 is the common production size | YouTube Help — Channel banner & profile picture tips: `https://support.google.com/youtube/answer/12950272` |
| YouTube | Channel banner | Recommended **2560×1440** (min 2048×1152, 16:9; safe area for text/logos 1235×338; ≤6 MB) | YouTube Help — Manage your channel branding: `https://support.google.com/youtube/answer/10456525` |
| X | Profile photo | **400×400** (1:1), JPG/PNG, ≤2 MB | X Help Center — Customize your profile: `https://help.x.com/en/managing-your-account/how-to-customize-your-profile` |
| X | Header photo | **1500×500** (3:1), JPG/PNG, ≤5 MB | X Help Center — Customize your profile (same page) |
| LinkedIn | Company Page logo | **400×400 recommended** (min 268×268, 1:1) | LinkedIn Help — Image specifications for your LinkedIn Pages: `https://www.linkedin.com/help/linkedin/answer/a563309` |
| LinkedIn | Company Page cover | **1512×256** | LinkedIn Help — same page |
| Gab | Avatar | Square 1:1, ≤5 MB — oversized files are downscaled to **400×400** | Gab Help — Optimum video/image upload specs: `https://help.gab.com/faq/optimum-video-image-specs-social` |
| Gab | Profile header | 3:1, downscaled to 1500×500 (profile header 1330×440) | Gab Help — same page |
| Parler | Profile picture | **No official published spec located (2026-09-30).** Use a 400×400 1:1 square. | — |

Do not create a new SCS logo for any of these; use the avatar exports above or
the existing `public/brand/` assets.

## YouTube setup notes

- **Channel name:** Sunshine Climate Solutions
- **Preferred handle if available:** `@SunshineClimateSolutions`
- **Primary content categories:** AC repair · HVAC diagnostics · HVAC
  maintenance · AC replacement · airflow · static pressure · ductwork ·
  commercial HVAC · TAB · air balancing · commissioning
- Titles and descriptions must be written per video and must not be
  mechanically keyword-stuffed. Describe what the video actually shows.
- No videos are uploaded by the repository — this section is owner guidance only.

### Default video description template

```text
Sunshine Climate Solutions is an owner-operated HVAC company serving Spring Hill and the Tampa Bay area.

Service area: Hernando, Pasco, Pinellas and Hillsborough counties.
Call or text: (727) 661-5200
Website: [paste the YouTube tracked URL from WHERE-TO-PASTE-UTM-LINKS.md]
[Relevant service page link — e.g. AC repair & diagnostics, maintenance, airflow & ductwork]
```

## Platform verification status — October 1, 2026

### TikTok Business Account — OWNER-CONFIRMED

- **Business verification is fully completed as of 2026-10-01** (authenticated TikTok Business
  Suite screenshots: "Verify your business — Good to go!"; the verified-business record shows
  Sunshine Climate Solutions with accepted business documentation).
- The configured company website is the tracked TikTok profile URL:
  `https://sunshineclimatesolutions.com/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=profile`
- This is **business verification / verified business status** — **not** a public blue-check
  verification unless separately confirmed.
- Business Suite currently exposes features including: Analytics, Creative Hub, Leads Manager,
  and message settings/labels. **Do not claim specific lead-generation or messaging features
  are enabled** unless actually confirmed in the authenticated account.

**Remaining owner actions (TikTok):**

1. Review the TikTok **Leads Manager** configuration.
2. Configure appropriate customer-message **labels / automation** where available.
3. Verify whether the business **street address** is publicly visible. SCS is a service-area
   business — do not intentionally publish a private operating address unless the owner wants
   it public.

### LinkedIn Company Page — LIVE (owner-approved 2026-10-07)

- Public Company Page: <https://www.linkedin.com/company/sunshine-climate-solutions>
  (owner-supplied URL; do not alter it in config).
- Published on the website: footer/contact social links and `HVACBusiness` `sameAs` structured
  data, sourced from `business.social.linkedin`. The icon is
  `public/images/linkedin-logo.webp` (owner-supplied mark; white margin trimmed only, to match
  the other icons' optical size).
- The tracked `linkedin_profile` campaign link is now **active** in
  `src/config/marketing-links.ts` (activated 2026-10-08). Paste it in the Company Page website
  field (see `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md`).
