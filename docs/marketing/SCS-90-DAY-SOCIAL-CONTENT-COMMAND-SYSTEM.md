# SCS 90-Day Social Content Command System

**Sunshine Climate Solutions LLC — 10-week, 20-core-post multi-platform social production package.**

This is the **execution layer** for SCS social content: 20 core posts, each translated for
Facebook, Instagram, LinkedIn, TikTok, YouTube and Google Business Profile, with real media
assigned from the SCS archive, exact UTM links, landing pages, shot lists, a dated calendar,
and DaVinci Resolve 19 production notes. It is designed so the owner, an editor, or a future
marketing assistant can execute the entire campaign without guessing.

**Status legend used throughout**

| Tag | Meaning |
| --- | --- |
| **READY** | Existing in-repo media covers the post; only cropping/editing needed. |
| **READY (EDIT)** | Existing media exists; an edit/batch pass is required (carousel build, montage). |
| **NEW CAPTURE** | No suitable existing media; a shot list is provided and the capture must happen during real work. |
| **NEW SHOOT** | A deliberate filming session is required (e.g., talking head). |

---

## 0. Document map and integration (read this first)

This document **does not replace** the existing SCS marketing system. It is the social
production companion to it and must be executed within it.

| Document | Role | Relationship to this file |
| --- | --- | --- |
| `docs/seo/90-DAY-CONTENT-PLAN.md` | Authoritative 12-week anchor strategy, audience, owning pages, CTAs | **Parent strategy.** This file's 20 posts map onto its anchors (cross-references in §11 and per-post blocks). |
| `docs/marketing/CONTENT-OPERATING-SYSTEM.md` | Authoritative production workflow, funnel rules, platform roles, UTM rules, guardrails | **Operating manual.** This file assumes and follows it. |
| `docs/marketing/90-DAY-CONTENT-CALENDAR.csv` | Week-by-week execution tracker | Companion tracker. This file's calendar (§10) is the social layer; copy its CSV block into the tracker or track it separately. |
| `docs/marketing/UTM-MASTER-LINKS.md` / `WHERE-TO-PASTE-UTM-LINKS.md` | Exact prepared UTM links (generated) | **Only source of links used in this file.** Never hand-build a URL. |
| `docs/marketing/SOCIAL-PROFILE-SETUP.md` | Profile bios, visual specs, LinkedIn status | Channel setup reference. |
| `docs/marketing/REVIEW-GROWTH-SYSTEM.md` | Review request workflow | Used after jobs referenced in this campaign. |
| `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` | Weekly KPI capture | Record campaign results here. |

**Registry changes made for this campaign (2026-10-08):** the prepared `linkedin_profile`
link was **activated** (the Company Page is live), and two GBP post links were added
(`post_airflow`, `post_replacement`) because this campaign publishes GBP posts for those
topics and the registry rule is "no hand-built URLs." Registry is now **62 links, 0 pending**;
regenerate with `npm run marketing:links` after any future change.

---

## 1. Campaign at a glance

- **20 core posts** × ~6 platforms, published **2 per week** on a Tuesday/Friday rhythm.
- **10 publishing weeks:** Tue Oct 13 → Fri Dec 18, 2026, plus a year-end coda on Tue Dec 29 (Post 20). Thanksgiving week intentionally carries a single post.
- **Engines:** Posts 01–11, 13–18 are Engine A (residential). Post 12 and the commercial adaptations are Engine B (commercial/TAB). Posts 10, 19, 20 are brand/retention (both audiences).
- **Primary platforms:** Facebook, Instagram, LinkedIn, TikTok, YouTube (Shorts + anchor shelf), Google Business Profile.
- **Recommended additions per the operating system:** Nextdoor adaptations for the hyperlocal posts (P05, P06, P15, P17) using the prepared Nextdoor links; X/Gab/Parler reposts where capacity allows; email/SMS only for maintenance-season posts.
- **The strategic goal:** build a searchable, visual body of evidence that SCS actually knows HVAC — real diagnostics, real instruments, real installations, real commercial work, real explanations.

**Frequency reality check (honest):** the existing operating system sets a normal weekly
ceiling (1 anchor + 3–4 vertical clips + Field Proof + 2–3 GBP + ~3 Facebook + 1–2 LinkedIn).
Tuesdays are the "technical authority" slot; Fridays are the "customer/local/brand" slot.
Each post below therefore defines **one anchor asset + the platform derivatives**; nothing
requires more than the OS ceiling.

---

## 2. Audit and reconciliation (what was verified, and what was corrected)

**Verified business facts used throughout (sources: `src/config/business.ts`, live site):**

| Fact | Value used |
| --- | --- |
| Phone | **(727) 661-5200** — "call or text" |
| Email | `owner@sunshineclimatesolutions.com` |
| Website | `sunshineclimatesolutions.com` |
| Hours | 7:30 AM – 7:30 PM, every day |
| Service area | Spring Hill, Florida home market; **Hernando, Pasco, Pinellas and Hillsborough counties**; "Tampa Bay and surrounding counties." Central Florida projects are considered **depending on scope** |
| Pricing | $75 Premium AC Maintenance (per system, per visit); $50 service call **waived when you proceed with the repair**; free written estimates |
| Credentials | EPA Section 608 certified; "Licensed and insured" (license number intentionally unpublished) |
| Owner | **Aaron Thomas**, owner/operator (site) — the business card and this campaign use "Owner / Founder" per owner direction |
| Warranty wording | "Ask about the workmanship and manufacturer warranty coverage included with your proposal." — never altered |
| Social | Facebook, Instagram, TikTok, YouTube, X, **LinkedIn (live 2026-10-07)**, Nextdoor, Yelp, Gab, Parler |
| Equipment brands | The service-brand vocabulary on the site: Daikin, Carrier, Bryant, Trane, Ruud, Rheem, Lennox, Goodman, York (+ Mitsubishi Electric marks in the brand grid) — **serviced, never claimed as dealership** |

**Edits applied to the owner's campaign drafts (reasons):**

1. **Service-area phrasing.** "Tampa Bay & Central Florida" is not the approved wording. All
   copy now uses "Tampa Bay and surrounding counties" and, where regional reach is mentioned,
   "Central Florida projects are considered depending on scope." (GBP posts keep it short:
   "Serving Tampa Bay and surrounding counties.")
2. **Landing pages.** No campaign link points at the homepage. Every post routes to its
   owning service page or `/contact/` per the operating system's six conversion paths.
3. **UTMs.** Every link is the exact prepared registry URL (never hand-built). Instagram,
   TikTok, LinkedIn and YouTube posts use "link in bio / channel link" because those channels
   intentionally carry only profile-level tracked links today.
4. **CTA discipline.** One primary CTA per item; Facebook asks for comments; LinkedIn uses the
   professional service-provider CTA ("Commercial contractors and facility teams can contact
   SCS for field measurement, HVAC, TAB and commissioning support"); GBP CTAs use the
   registry's prepared post links.
5. **No unsupported claims.** Removed/neutralized anything resembling response-time promises
   ("fast", "emergency service"), competitor attacks, savings claims, and dealership
   implications. "Old ≠ failed" style logic is kept — it is a diagnostic position, not a
   claim about any competitor.
6. **Brand-reference safety in Post 11.** Brand names are used only as "equipment brands we
   service" context. The post's point is installation quality, never "we are the best
   Daikin/Mitsubishi dealer."
7. **Video expectations.** The three in-repo clips are **2–3 second silent field loops**
   (960×720 / 800×600), not talking-head content. Posts that need TikTok/YouTube performance
   videos are marked **NEW CAPTURE/NEW SHOOT** with shot lists — the clips are used as
   inserts, textures and loop B-roll, exactly where they are honest.
8. **Halloween/Thanksgiving/Christmas/New Year** content stays brand-consistent: no staged
   horror gore, no fear marketing, no fake urgency.

**Editorial standard for every caption below** (from the owner's campaign, kept intact):
technical authority, real field evidence, professional presentation, local relevance,
commercial credibility, persuasion through competence — never generic HVAC marketing language,
never fake urgency, never "best company" claims.

---

## 3. Pre-launch checklist (complete before Week 1)

| # | Task | Where | Status |
| --- | --- | --- | --- |
| 1 | Paste the tracked LinkedIn link in the Company Page website field | `WHERE-TO-PASTE-UTM-LINKS.md` item 13 | Owner action |
| 2 | Verify Facebook/Instagram/TikTok/YouTube/Nextdoor profile website fields still carry their prepared tracked links | `WHERE-TO-PASTE-UTM-LINKS.md` | Owner action |
| 3 | Confirm Google Business Profile is active and verified (it is owner-confirmed active) | GBP | Owner |
| 4 | Import this campaign's calendar block (§10) into the tracker or a working copy | `90-DAY-CONTENT-CALENDAR.csv` | Marketer |
| 5 | Install **Archivo** + **Public Sans** on the editing machine (SIL OFL, files in `public/fonts/`) so Resolve titles match the brand | Resolve | Editor |
| 6 | Build the three reusable vertical templates in Resolve (§15): title card, lower-third, end card | Resolve | Editor |
| 7 | Confirm capture privacy rules: no faces/addresses/paperwork/plates without permission (OS §8) | Field | Aaron |
| 8 | Decide which posts this cycle can use live job capture (§6 checklist) — mark them on the calendar | Planning | Aaron |
| 9 | Do **not** publish any post whose media is still marked NEW CAPTURE/NEW SHOOT until the asset exists | Publishing | Marketer |

---

## 4. Platform operating rules (SCS-specific, refined from the campaign + OS)

### Facebook — the local SCS community page
Context, conversation, real job photos, local references. CTA hierarchy: **comment →
share/save → website → contact**. Never make every post an ad. Posts should make neighbors
think *"I've seen this company before."* Use the prepared Facebook per-service links; the
sign-off block is the approved descriptor:
**Sunshine Climate Solutions — HVAC Service • Installation • Commercial HVAC • TAB / Commissioning — sunshineclimatesolutions.com**

### Instagram — the visual proof layer
Reels and carousels of real field photography; the photograph must stop the scroll before the
caption has to convince. Large restrained typography on images (Archivo 800, `#ffffff` or
`#f4b631` on navy `#203549` scrims); never paragraphs over photos. Caption limit for this
campaign: ≤120 words. Hashtag set per post (8–12), never a wall. Link strategy: **profile
link only** (tracked); say "link in bio" once, at most.

### LinkedIn — commercial/TAB authority
Speaks to GCs, engineers, mechanical contractors, facility/property managers, building owners,
TAB firms, commissioning professionals. No residential lead-gen tone; no "call us today."
Use first-person only where Aaron genuinely writes it (Posts 10, 19). Closing line pattern:
*"Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB
and commissioning support."* 3–5 focused hashtags. Link: tracked profile link once activated
(now live).

### TikTok — the rawest platform
Aaron actually doing HVAC. Formula: **0–2 s pattern interrupt → 2–8 s show the evidence →
8–30 s explain → 30–45 s why it matters → one takeaway.** No over-production. Vertical
9:16, natural audio, captions burned in (most viewers watch muted). Every video must be
filmable during real work; nothing staged. Link: profile link.

### YouTube — the long-term authority library
Anchors 4–8 minutes for the strongest subjects (static pressure, microns, airflow diagnosis,
commercial/TAB, replacement decisions). Shorts 20–45 s as discovery. Titles follow search
intent; descriptions carry the tracked channel link; chapters for long-form. Thumbnails:
real photo + 3–5 word text, brand navy/gold.

### Google Business Profile — local conversion, not Instagram
Concise, local, service-oriented, search-friendly, actionable. 2–3 posts/week total across
the account; use this campaign's GBP posts on their release weeks. No hashtags. Every GBP
post uses the prepared GBP link (registry). CTAs: Learn more / Call / Book.

---

## 5. Media inventory (what actually exists)

### 5.1 Repository assets (canonical, stable paths)

**Field clips (`public/videos/`, muted H.264, faststart, 4:3):**
| File | Runtime | Size | Use in this campaign |
| --- | --- | --- | --- |
| `manometer-reading-unit.mp4` | 2.0 s | 960×720 | Insert/loop for P01, P07, P16; b-roll |
| `air-handler-service.mp4` | 1.8 s | 960×720 | Insert for P13, P15; b-roll |
| `static-pressure-balancing.mp4` | 2.9 s | 800×600 | Insert for P03, P12, P16; TAB context |

**Curated stills (`src/content/site/images/`, all optimized, genuine SCS work):**
- **Diagnostics/instruments:** `field-service-manifold-gauges.jpg`, `clamp-meter-reading.jpg`, `digital-manifold-readings.jpg`, `refrigerant-gauges-diagnostic.jpg`, `static-pressure-manometer.jpg`, `static-pressure-display.jpg` (Alnor readout — orientation-corrected), `micron-gauge-reading.jpg` ("412 microns"), `evacuation-micron-gauge.jpg`, `micron-pull-evacuation.jpg`, `recovery-machine-reading.jpg`, `unit-panel-diagnostics.jpg`
- **Repair evidence:** `blower-wheel-condition.jpg`, `connector-heat-discoloration.jpg`, `failed-component-removed.jpg`, `dirty-coil-detail.jpg`, `dirty-condenser-coils.jpg`, `dirty-evaporator-coil.jpg`, `dirty-return-filter.jpg`
- **Airflow/maintenance:** `airflow-measurement-at-grille.jpg` (building exhaust at a terminal louver), `filter-return-size.jpg`, `filter-rack-maintenance.jpg`, `coil-cleaning-wash.jpg`, `metal-duct-interior.jpg`, `duct-design-cfm-layout.jpg`
- **Installation/workmanship:** `custom-ductboard-supply-plenum.jpg`, `linehide-and-disconnect.jpg`, `installing-line-hide.jpg`, `nitrogen-purge-during-brazing.jpg`, `brazed-lineset-detail.jpg`, `condenser-installation-complete.jpg`, `condenser-installed-pad.jpg`, `condenser-replacement-in-progress.jpg`, `condenser-lineset-detail.jpg`, `package-unit-install.jpg`, `side-discharge-copper-bend.jpg`, `copper-bend-air-handler.jpg`, `furnace-install.jpg`, `sheet-metal-trunk-hung.jpg`, `double-45-copper-bend.jpg`, `new-roll-copper-line-set.jpg`
- **Commercial/TAB:** `commercial-rooftop-unit.jpg`, `commercial-rooftop-walkway.jpg`, `rooftop-mechanical-equipment.jpg`, `commercial-ahu-field-work.jpg`, `building-pressure-manometer.jpg`, `pressure-reading-commercial.jpg`, `equipment-control-wiring.jpg`, `vfd-motor-readings.jpg`, `vfd-operating-screen.jpg`, `psychrometric-measurement-report.jpg`, `airside-measurement-report.jpg`
- **People/brand:** `owner-headshot.jpg`, `work-truck.jpg`, `service-truck-oaks.jpg`, `service-truck.jpg`, `bottling-factory-field-visit.jpg` (commercial site visit, hi-vis)

**Brand assets:** `public/brand/logo-light.png` / `logo-dark.png` (approved Logo 2, 331×96),
`public/images/brand-*.png|webp` (8 equipment marks), `public/brand/qr-review.*`,
`public/marketing/qr/*` (11 campaign QRs). **Print:** `docs/print/business-card/`.

**Real reviews:** `src/content/reviews/` — Michael Gallentine and Jim Acres (genuine Google
reviews; may be quoted verbatim in local posts, never edited).

### 5.2 Owner archive (NOT in the repo — import only what is used)

- `C:\Users\thoma\OneDrive\Documents\SunshineClimateSolutions\Photo Portfolio\` — approximately 80 full-resolution work photos (installation, brazing, evacuation, recovery, coils, ductwork, mobile-home jobs). Converted copies of many already live in the repo; this archive supplies higher-resolution originals for crops.
- `C:\Websites\Sunshine-Climate-Solutions\public\images\variety pics.zip` — 61 owner-selected camera-roll photos + 1 short video (dirty coils, dirty filters, coil washing, blower wheels, mini-splits, thermostats, commercial context). **Untracked by design** — import selected photos into the repo media folders when a post uses them.
- `C:\Users\thoma\OneDrive\Documents\SunshineClimateSolutions\Digital Assets\` — approved headshot, `Work_Truck.jpg`, `coverphoto.jpg`.
- Commercial project archives (verified during the site release): Crunch Fitness building-pressure photos, Gatorade VFD photos, Panasoffkee; several are already curated in-repo (`building-pressure-manometer.jpg`, `vfd-*.jpg`, `commercial-*.jpg`).

### 5.3 What does NOT exist yet (honest gaps that drive NEW CAPTURE)
- Any **talking-head/video-with-audio** content (all existing clips are silent 2–3 s loops).
- Evacuation/micron **video**; brazing/nitrogen video; static-pressure walk-and-explain video; coil-cleaning video; commercial building-pressure walk-through video.
- Any footage or photo of outdoor-air measurement at a specific project (single still exists: `airflow-measurement-at-grille.jpg`).

---

## 6. Field capture system (operating-system SOP, specialized for this campaign)

Before leaving any job, run the 60-second check. Capture **only** when it is safe and honest to
do so. Never stage, never interrupt the work for content, never capture customer PII (faces,
addresses, paperwork, plates) without permission.

| Category | Capture | Used by |
| --- | --- | --- |
| Establishing | Building exterior, equipment location, rooftop/mechanical room, work area | P06, P12, P19 |
| Technical | Gauges, instruments, screens, static-pressure setup, airflow readings, electrical measurements, micron gauge, nitrogen, controls, components | P01, P02, P03, P07, P09, P11, P16 |
| Workmanship | Installation details, brazing, line sets, drains, electrical, equipment placement, finished work | P04, P11, P19 |
| Problem evidence | Dirty coil/filter, failed components, restrictions, drain problems, anomalies | P08, P13, P15, P17, P18 |
| Verification | Final measurements, startup, completed installation, reports | P02, P04, P12 |
| Vertical video | 10–30 s walkthrough clips of the above (talk or voiceover) | All TikTok/Shorts |

**Caption formula for Field Proof posts (OS §8): Problem → Measurement → Meaning → Action →
CTA.** One measurement is never presented as a universal standard; context always travels
with the number.

---

## 7. Content multiplication system

One real job → only the derivatives that make strategic sense:

```
ONE REAL JOB (diagnose / install / service / TAB visit)
  ↓  1 YouTube anchor (if the subject is one of the 10 anchor topics)
  ↓  1 YouTube Short  ┐
  ↓  1 TikTok         ├ vertical derivations (different hooks, not the same cut)
  ↓  1 Instagram Reel ┘
  ↓  1 Instagram carousel (frames = the evidence sequence)
  ↓  1 Facebook post (job-story context)
  ↓  1 LinkedIn post (only when commercial/TAB applies)
  ↓  1 GBP post (only when a prepared GBP link exists for the topic)
  ↓  1 Field Proof still package (site / future project entries)
```

**Rules:** do not force every job into every platform; do not manufacture weak clips to hit a
number; a strong post reused across networks must be re-hooked per platform, never pasted
identically. The 60–70% / 30–40% compounding rule from the OS applies to the next cycle.

---

# THE 20 CORE POSTS

Each post: objective, audience, funnel role, landing page, exact UTM, media assignment with
real paths (Primary / Secondary / Backup), final platform copy, repurposing, and production
status. **Copy below is final-edited** — publish it as written; edit notes live in §2.

---

## POST 01 — YOUR THERMOSTAT ISN'T THE DIAGNOSIS

| | |
| --- | --- |
| **Publish** | Week 1 · Tuesday, Oct 13, 2026 |
| **Engine / funnel** | A (residential) · Authority → Consideration |
| **Audience** | No-cool homeowner (seg 1) + comfort/airflow homeowner (seg 2) |
| **Objective** | Establish the diagnostic philosophy with evidence, not slogans; separate "symptom" from "diagnosis." |
| **Landing page** | `/services/ac-repair-diagnostics/` |
| **Primary CTA** | Request diagnostics (call/text/form) |
| **Channels** | FB · IG · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` · others: tracked profile links |

**Media assignment**
- **PRIMARY** — `src/content/site/images/field-service-manifold-gauges.jpg` (4:3 landscape; owner working at a packaged unit with digital manifold gauges connected). IG feed 4:5 center crop; TikTok opening frame 9:16; YouTube thumbnail 16:9; FB/LinkedIn 4:5.
- **SECONDARY** — `src/content/site/images/clamp-meter-reading.jpg` (clamp meter on wiring).
- **BACKUP** — `src/content/site/images/refrigerant-gauges-diagnostic.jpg`.
- **VIDEO INSERT** — `public/videos/manometer-reading-unit.mp4` (2.0 s silent loop) as the evidence beat in the vertical cut.
- **VIDEO HOST** — **NEW SHOOT — see VID-01 (§9)**.
- **Status: READY (stills + insert); NEW SHOOT for the TikTok/YouTube host piece.**

**Hook:** "Your thermostat tells you what the system is doing — not why."

**Proof/evidence:** real gauges and meters on a live system; the sequence Observe → Measure → Interpret → Explain → Decide.

**Platform copy**

**Facebook** — *Your thermostat tells you what the system is doing. It doesn't necessarily tell you why.*
> A system can run constantly because of airflow restrictions, refrigerant problems, electrical issues, duct problems, controls, heat-transfer problems — or several things at once. That's why replacing a part based on a symptom can get expensive quickly.
> At Sunshine Climate Solutions we start with the system itself. We look at the equipment, take measurements, and evaluate the conditions — then explain what those findings mean before we talk about options.
> A thermostat saying "72°" doesn't tell the whole story. Neither does a system saying "I'm not cooling."
> **If your HVAC system isn't behaving normally, don't guess at the cause. Have it properly evaluated.**
> Sunshine Climate Solutions — HVAC Service • Installation • Commercial HVAC • TAB / Commissioning
> 🔗 [facebook_ac_repair_post link]
> *Comment with the HVAC symptom you've been dealing with.*

**Instagram** — caption: *Your thermostat isn't the diagnosis.*
> "Not cooling." "Running constantly." "Making noise." "Can't keep up." Those are symptoms.
> The actual problem could involve airflow, refrigeration, electrical components, controls, ductwork, heat transfer — or several together. That's why we measure before we recommend.
> **Observe → Measure → Interpret → Explain → Decide.**
> 📍 Spring Hill, FL · Serving Tampa Bay and surrounding counties
> 🌐 link in bio
> #HVAC #TampaHVAC #FloridaHVAC #HVACService #HVACTechnician #AirConditioning #HVACRepair #SunshineClimateSolutions
> **Visual text:** "Your thermostat isn't the diagnosis."

**LinkedIn** —
> A thermostat provides information. It doesn't provide a complete diagnosis.
> When an HVAC system isn't performing properly, the cause may involve airflow, static pressure, refrigeration, electrical conditions, controls, ductwork, heat transfer, or the interaction between several of those variables.
> A symptom can tell you **where to start looking**. It doesn't necessarily tell you **what to replace**.
> Our approach is built around field measurement and interpretation: **Observe → Measure → Interpret → Explain → Recommend.**
> The objective isn't simply to identify a failed component — it's to understand the system well enough to make an informed recommendation. That applies to residential service and becomes even more important with commercial equipment and building systems.
> #HVAC #HVACDiagnostics #CommercialHVAC #BuildingPerformance #TAB #Commissioning

**TikTok** — on-screen hook: **YOUR THERMOSTAT IS NOT THE DIAGNOSIS**
> Spoken: "If your HVAC isn't cooling, this thermostat isn't telling me what's wrong. It tells me the system isn't meeting the condition you're asking for. It doesn't tell me whether I've got an airflow problem, electrical problem, refrigeration problem, duct issue, control issue — or something else. That's why we measure the system before deciding what needs to happen."
> End screen: **"Don't guess. Diagnose."**
> Caption: A thermostat gives you a symptom. The system gives you the evidence. #HVAC #HVACTok #HVACTechnician #FloridaHVAC #TampaHVAC

**YouTube Short** — title: *Your Thermostat Isn't the Diagnosis* · description: A thermostat gives you a symptom. Proper HVAC diagnosis requires looking at the system and measuring what's actually happening. (Tracked channel link in description.) **Anchor recommendation:** fold into the OS Week 1 anchor "AC Running but Not Cooling — What We Actually Check."

**GBP** — *Not every HVAC problem can be diagnosed from the thermostat. Cooling problems can involve airflow, refrigeration, electrical components, controls, ductwork and other system conditions. Sunshine Climate Solutions evaluates the system with field measurements before recommending a course of action.* **Need HVAC service in Tampa Bay and surrounding counties?** Learn more → `gbp_ac_repair_post`

**Repurposing:** still + carousel of the three instruments; pull-quote graphic "A symptom tells you where to start looking"; the OS Week 1 anchor absorbs the long-form.

---

## POST 02 — WHAT DOES 412 MICRONS ACTUALLY MEAN?

| | |
| --- | --- |
| **Publish** | Week 1 · Friday, Oct 16, 2026 |
| **Engine / funnel** | A (installation quality → both engines) · Authority |
| **Audience** | Replacement shoppers + commercial/technical contacts who value verification |
| **Objective** | Demonstrate that SCS verifies work, not just performs it — "procedure ≠ verification." |
| **Landing page** | `/services/replacement-installation/` |
| **Primary CTA** | Free estimate / talk through a project |
| **Channels** | FB · IG · LinkedIn · TikTok (priority) · YouTube Short · GBP |
| **UTM** | FB `facebook_replacement_post` · GBP `gbp_replacement_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/micron-gauge-reading.jpg` (digital vacuum gauge at 412 microns on a service port; the homepage "Evacuation verified at 412 microns" photo).
- **SECONDARY** — `src/content/site/images/evacuation-micron-gauge.jpg` (412-micron gauge during evacuation).
- **BACKUP** — `src/content/site/images/digital-manifold-readings.jpg`, `src/content/site/images/recovery-machine-reading.jpg`.
- **VIDEO** — **NEW CAPTURE — see VID-02 (§9), the campaign's highest-priority video**: 30–45 s of the micron gauge during an actual evacuation (gauge falling, isolation check).
- **Status: READY (stills); NEW CAPTURE for video (VID-02).**

**Hook:** "412 microns. Here's why I care about this number."

**Proof/evidence:** the actual gauge reading + the isolation behavior after evacuation.

**Platform copy**

**Facebook** —
> This number matters: **412 microns.**
> When evacuating a refrigeration system, we're not simply watching the vacuum pump run and deciding the job must be done. We're measuring what is actually happening inside the system.
> The important part isn't chasing a number on a gauge. You have to understand how the evacuation is progressing, whether the system is reaching the intended level, whether it holds appropriately, and whether the work was actually verified.
> There's a difference between **performing a procedure** and **verifying that the procedure worked.** That's why instrumentation matters.
> **412 microns isn't decoration. It's information.**
> [facebook_replacement_post link]

**Instagram** — **412 MICRONS.**
> That's not a random number on a gauge. During evacuation we're looking at what is actually happening inside the refrigeration system.
> The important part isn't just reaching a number — it's understanding the process and verifying the result. **Procedure + measurement + verification.**
> That's what turns "we pulled a vacuum" into something you can actually evaluate.
> 📍 Spring Hill, FL · Serving Tampa Bay and surrounding counties · 🌐 link in bio
> #HVAC #Refrigeration #HVACTechnician #Microns #HVACInstallation #TampaHVAC #HVACDiagnostics
> **Visual text:** "412 MICRONS"

**LinkedIn** —
> A micron reading is a good example of why HVAC work can't always be evaluated by appearance.
> A refrigeration system can look completely finished from the outside. That doesn't tell you what happened during evacuation.
> Instrumentation gives us another layer of information: the progression of the vacuum, the conditions affecting the reading, and whether the system behaves appropriately after the intended evacuation is achieved.
> The lesson extends beyond evacuation: **Performing a procedure is not the same as verifying the result.** Measurement is what moves us from assumption to evidence.
> Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.
> #HVAC #Refrigeration #Commissioning #HVACInstallation #QualityControl

**TikTok (VID-02)** — hook (0–2 s): gauge on screen, "412 microns. Here's why I care about this number."
> (2–8 s) show gauge falling; (8–30 s) "When you evacuate a refrigeration system you're removing unwanted moisture and non-condensables. I'm not just watching the pump run — I'm watching the micron reading. Then I want to know what happens when the system is isolated. The number gives me information; the behavior of the system gives me even more."
> End: **"Measure the work. Don't just assume it worked."**
> Caption: 412 microns — procedure vs verification. #HVAC #HVACTok #Refrigeration #Microns #HVACTechnician

**YouTube** — Short title: *What 412 Microns Actually Means* · Anchor title: *What Does 412 Microns Mean in HVAC? Why Micron Measurement Matters* · description: A real-world look at micron measurement during refrigeration-system evacuation — why evacuation isn't simply about running a vacuum pump, and why measurement and verification matter. (Tracked channel link.)

**GBP** — *Proper HVAC installation involves more than connecting equipment and turning it on. Micron measurement during refrigeration-system evacuation provides valuable information about the system and the evacuation process. Sunshine Climate Solutions uses appropriate field instrumentation to verify the work performed.* Learn more → `gbp_replacement_post`

**Repurposing:** still → carousel "the three numbers that matter before startup"; quote graphic "Performing a procedure is not the same as verifying the result."

---

## POST 03 — THE FILTER ISN'T THE WHOLE AIRFLOW STORY

| | |
| --- | --- |
| **Publish** | Week 2 · Tuesday, Oct 20, 2026 |
| **Engine / funnel** | A · Awareness → Consideration |
| **Audience** | Comfort/airflow homeowner (seg 2) + maintenance customer (seg 3) |
| **Objective** | Teach system-level airflow thinking; position static pressure as the SCS measurement. |
| **Landing page** | `/services/airflow-ductwork/` |
| **Primary CTA** | Request airflow/comfort diagnostics |
| **Channels** | FB · IG (carousel) · TikTok · GBP · LinkedIn (technical adaptation optional) |
| **UTM** | FB `facebook_airflow_post` · GBP `gbp_airflow_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/dirty-return-filter.jpg` (heavily soiled pleated filter in its grille).
- **SECONDARY** — `src/content/site/images/filter-return-size.jpg` (filter size label), `src/content/site/images/filter-rack-maintenance.jpg` (rack during a visit).
- **BACKUP / measurement** — `src/content/site/images/static-pressure-display.jpg` (Alnor readout), `src/content/site/images/airflow-measurement-at-grille.jpg`.
- **VIDEO INSERT** — `public/videos/air-handler-service.mp4` (1.8 s loop).
- **VIDEO HOST** — **NEW CAPTURE — VID-03 (§9): static-pressure walk-and-explain.**
- **Status: READY (carousel from stills); NEW CAPTURE for the video.**

**Hook:** "Everyone blames the filter for airflow problems. Sometimes they're right."

**Instagram carousel (built from stills):** slide 1 cover "The filter isn't the whole airflow story." · slides 2–6: FILTER (`dirty-return-filter.jpg`) → COIL (`dirty-coil-detail.jpg`) → BLOWER (`blower-wheel-condition.jpg`) → DUCTWORK (`metal-duct-interior.jpg`) → STATIC PRESSURE (`static-pressure-display.jpg`) · slide 7 "Measure the system."

**Platform copy**

**Facebook** —
> "Just change the filter."
> Sometimes that's the answer. Sometimes it's only the beginning.
> Airflow problems can involve: filter → coil → blower → ductwork → registers → return system → static pressure.
> A new filter doesn't automatically mean the system has proper airflow. That's why we don't automatically blame the filter when a system isn't moving air correctly — we measure. Static pressure can tell us about resistance within the air distribution system, and then we interpret that measurement alongside the rest of the system.
> The goal isn't to find something easy to blame. It's to understand what's actually happening.
> 🔗 [facebook_airflow_post link]

**Instagram** — *A dirty filter can restrict airflow. But airflow problems don't stop there.*
> FILTER · COIL · BLOWER · DUCTWORK · RETURN · STATIC PRESSURE
> A new filter doesn't automatically mean the system is moving the correct amount of air. That's why measurements matter. Don't diagnose an airflow problem by looking at one component — look at the system.
> #HVAC #Airflow #StaticPressure #HVACDiagnostics #FloridaHVAC #TampaHVAC

**LinkedIn (commercial adaptation available)** —
> Airflow is a system problem, not necessarily a filter problem. A technician evaluating airflow may need to consider filter resistance, coil condition, blower performance, supply/return ductwork, registers and grilles, static pressure, equipment characteristics, and actual delivered airflow.
> Changing a filter may solve one restriction. It doesn't prove the system has appropriate airflow. That is one reason field measurement is so valuable — the objective isn't to identify a component that looks questionable, it's to understand how the system performs as a whole.
> #Airflow #HVAC #BuildingPerformance #HVACDiagnostics #TAB

**TikTok (VID-03)** — hook: "Everyone blames the filter for airflow problems." (show dirty filter) "Sometimes they're right. But look at everything else that's part of the airflow path." Quick cuts: filter → coil → blower → duct → return → measurement. "That's why I don't diagnose airflow by looking at one piece."
> End text: **"Measure the system."**

**YouTube** — Short title: *Your Filter Isn't the Whole Airflow Story* · Anchor recommendation: absorb into OS Week 2/3 airflow + static pressure anchors; title *Is Your HVAC Filter Causing Low Airflow? Maybe — But Check the Whole System.*

**GBP** — *A dirty filter can restrict airflow, but it isn't the only possible cause of poor HVAC airflow. Filters, coils, blowers, ductwork, return systems and static pressure can all affect performance. Sunshine Climate Solutions evaluates the system rather than assuming one component is responsible.* Learn more → `gbp_airflow_post`

**Repurposing:** carousel doubles as the LinkedIn carousel document; single still (filter) for Nextdoor; measurement photo for the future airflow Field Proof package.

---

## POST 04 — THE PART NOBODY SEES

| | |
| --- | --- |
| **Publish** | Week 2 · Friday, Oct 23, 2026 |
| **Engine / funnel** | A · Authority (installation quality) |
| **Audience** | Replacement shoppers (seg 4) + GCs/contractors (seg 6, secondary) |
| **Objective** | Sell workmanship, not equipment; raise the bar for what customers should expect from any installer. |
| **Landing page** | `/services/replacement-installation/` |
| **Primary CTA** | Free written estimate |
| **Channels** | FB · IG · LinkedIn · TikTok · YouTube Short |
| **UTM** | FB `facebook_replacement_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/nitrogen-purge-during-brazing.jpg` (nitrogen purge at a flow indicator during brazing).
- **SECONDARY** — `src/content/site/images/brazed-lineset-detail.jpg`, `src/content/site/images/custom-ductboard-supply-plenum.jpg`, `src/content/site/images/copper-bend-air-handler.jpg`.
- **BACKUP** — `src/content/site/images/sheet-metal-trunk-hung.jpg`, `src/content/site/images/linehide-and-disconnect.jpg`, `src/content/site/images/furnace-install.jpg`.
- **VIDEO** — **NEW CAPTURE — VID-04 (§9)**: brazing + evacuation + startup verification capture during a real installation.
- **Status: READY (stills); NEW CAPTURE for video.**

**Platform copy**

**Facebook** —
> The most important part of an HVAC installation is often the part the homeowner never sees: the evacuation, the brazing, the electrical connections, the drain, the airflow, the startup measurements — the details behind the equipment.
> A new system can look fantastic sitting on a pad and still have problems that aren't visible from the outside. That's why workmanship matters. **Installation isn't finished simply because the equipment turns on.** The details matter because those details become the conditions the system has to operate under for years.
> Free written estimates for replacement or installation planning — itemized, scope spelled out. 🔗 [facebook_replacement_post link]

**Instagram** — *The part nobody sees can be the part that matters most.*
> Evacuation. Brazing. Electrical. Drainage. Airflow. Startup. Verification.
> The equipment may be the most visible part of an installation. The workmanship behind it determines much more than appearance. **Details matter.**
> #HVACInstallation #HVAC #HVACTechnician #FloridaHVAC #TampaHVAC #HVACContractor

**LinkedIn** —
> One of the biggest misconceptions about HVAC installation is that the equipment itself represents the quality of the installation. It doesn't.
> Installation quality also involves refrigeration practices, evacuation, electrical work, drainage, airflow, startup procedures, measurements, documentation and verification. Many of those become invisible once the project is complete — which is exactly why they deserve attention while the work is being performed.
> **Good installation is more than equipment placement.**
> Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.

**TikTok (VID-04)** — hook: "You can have brand-new HVAC equipment and still have a bad installation. Here's why." Cut through details: refrigeration / evacuation / electrical / drain / airflow / startup / verification. "The equipment turning on doesn't prove the installation was done correctly."

**YouTube** — Short title: *The Part of an HVAC Installation Nobody Sees* · Anchor: *A New HVAC System Can Still Have a Bad Installation — Here's Why.*

**GBP** — *A quality HVAC installation involves much more than installing the equipment: refrigeration practices, evacuation, electrical work, drainage, airflow, startup measurements and verification all matter. Sunshine Climate Solutions focuses on the details behind the finished installation.* Estimate → `gbp_replacement_post`

**Repurposing:** workmanship stills feed the website's Quality Workmanship carousels (already live); quote graphic "Installation isn't finished simply because the equipment turns on."

---

## POST 05 — BEFORE YOU REPLACE YOUR AC

| | |
| --- | --- |
| **Publish** | Week 3 · Tuesday, Oct 27, 2026 |
| **Engine / funnel** | A · Consideration (replacement buyer journey) |
| **Audience** | Replacement shopper (seg 4) |
| **Objective** | Own the honest repair-vs-replace conversation; route decision-makers to a real evaluation. |
| **Landing page** | `/services/replacement-installation/` (cross-link Repair) |
| **Primary CTA** | Diagnostic or free replacement estimate — customer's situation decides |
| **Channels** | FB · IG · LinkedIn · TikTok · GBP |
| **UTM** | FB `facebook_replacement_post` · GBP `gbp_replacement_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/condenser-replacement-in-progress.jpg` (replacement underway beside a home).
- **SECONDARY** — `src/content/site/images/condenser-installation-complete.jpg`, `src/content/site/images/side-discharge-copper-bend.jpg`.
- **BACKUP** — `src/content/site/images/package-unit-install.jpg`, `src/content/site/images/work-truck.jpg`.
- **VIDEO** — **NEW SHOOT — VID-05 optional talking-head** ("when I recommend replacement, here's what I show you").
- **Status: READY (stills).**

**Platform copy**

**Facebook** —
> Before replacing an air conditioner, ask one question: **Why does it need to be replaced?**
> Sometimes replacement is absolutely the right decision. But "old" isn't a diagnosis. Neither is "it's not cooling," "it's running constantly," "it's making noise," or "your refrigerant is low." Those observations tell us something — they don't necessarily tell us the entire story.
> A good recommendation considers the system's condition, measurements, repair options, equipment age, expected future reliability, and what the customer actually wants. Sometimes the answer is repair. Sometimes it's replacement. The important part is knowing **why**.
> Free written estimates, itemized, scope spelled out — no obligation. 🔗 [facebook_replacement_post link]

**Instagram** — *Before you replace your AC, ask: WHY?*
> Old ≠ automatically failed. Not cooling ≠ automatically replacement. Low refrigerant ≠ automatically replacement.
> A proper evaluation should determine what's happening and what options actually exist. **Get the information first. Then decide.**
> #HVAC #ACRepair #ACReplacement #HVACDiagnostics #TampaHVAC #FloridaHVAC

**LinkedIn** —
> Equipment replacement should be a decision supported by information: system age, condition, measurements, repair history, expected reliability, customer objectives.
> A symptom alone doesn't establish that replacement is the correct solution. The better question isn't **"Can this system be replaced?"** — it is **"What is the condition of this system, what are the realistic options, and which option makes sense?"**
> That distinction matters for homeowners and commercial facilities alike.

**TikTok** — hook: "Your AC being old doesn't automatically mean you need a new one. Age is information. It's not a diagnosis. Neither is 'it's not cooling.' Before replacement, you should understand what's actually wrong with the system and what your options are."
> End: **"Know what's wrong. Then decide what to do."**

**YouTube** — *Does an Old AC Need to Be Replaced? What a Proper HVAC Evaluation Looks At* (fold into OS Week 6 anchor "Should You Repair or Replace Your AC?").

**GBP** — *Before replacing an HVAC system, determine why replacement is being recommended. Age, condition, repair history, system measurements, reliability and customer goals can all matter. Sunshine Climate Solutions provides HVAC evaluations so customers can understand their system's condition before deciding what to do.* Estimate → `gbp_replacement_post`

**Repurposing:** feeds the OS replacement mini-campaign (Weeks 6–8) with stills and the quote card.

---

## POST 06 — FLORIDA HVAC HAS A DIFFERENT PROBLEM

| | |
| --- | --- |
| **Publish** | Week 4 · Tuesday, Nov 3, 2026 |
| **Engine / funnel** | A · Awareness (local relevance) |
| **Audience** | Homeowners across the service area (seg 1–3) |
| **Objective** | Local credibility: SCS understands the operating environment here, not generic HVAC. |
| **Landing page** | `/services/ac-repair-diagnostics/` |
| **Primary CTA** | Call/text; request diagnostics when something is off |
| **Channels** | FB · IG · TikTok · GBP · Nextdoor |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` · Nextdoor `nextdoor_ac_repair_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/condenser-installed-pad.jpg` (unit on its pad, Florida home context).
- **SECONDARY** — `src/content/site/images/dirty-condenser-coils.jpg` (heat + outdoor exposure), `src/content/site/images/service-truck-oaks.jpg` (local environment).
- **BACKUP** — `src/content/site/images/condenser-lineset-detail.jpg`, `src/content/site/images/package-unit-install.jpg`.
- **Status: READY.**

**Platform copy**

**Facebook** —
> Florida doesn't exactly make HVAC equipment's job easy: heat, humidity, long cooling seasons, coastal conditions, attics that become extremely hot, systems that run for long periods.
> All of those conditions affect equipment differently than in a mild climate. That's why Florida HVAC requires more than knowing how to replace a component — you have to understand the environment the equipment is operating in.
> Serving Spring Hill, Tampa Bay and surrounding counties. 🔗 [facebook_ac_repair_post link]

**Instagram** — *Florida HVAC has its own challenges.*
> ☀️ Heat · 💧 Humidity · 🏠 Hot attics · 🌊 Coastal exposure · ⏱️ Long operating seasons
> Your HVAC system lives in that environment every day. Understanding the environment is part of understanding the system.
> #FloridaHVAC #TampaHVAC #HVAC #AirConditioning #HVACTechnician

**LinkedIn** —
> Florida's operating environment creates a unique set of HVAC challenges: high ambient temperatures, humidity, long cooling seasons, coastal exposure in some markets, hot attic conditions, extended equipment runtime.
> These factors influence equipment performance, component aging, drainage, heat transfer and overall system operation. Context matters in HVAC diagnosis — a system doesn't operate in a laboratory. It operates inside a building, in a particular climate, under particular loads and conditions.

**TikTok** — hook: "Florida HVAC gets abused." (show Florida equipment) "Heat. Humidity. Long cooling seasons. Hot attics. Coastal conditions. Your system is dealing with this for months at a time. That's why understanding the environment matters when diagnosing HVAC problems."

**YouTube** — *Why Florida HVAC Systems Work So Hard | Heat, Humidity & Long Cooling Seasons.*

**GBP** — *Florida HVAC systems operate under demanding conditions: heat, humidity, long cooling seasons, hot attics and, in some areas, coastal exposure. Understanding those conditions is an important part of evaluating HVAC performance. Sunshine Climate Solutions serves Tampa Bay and surrounding counties.* Call → `gbp_ac_repair_post`

---

## POST 07 — THREE MEASUREMENTS

| | |
| --- | --- |
| **Publish** | Week 4 · Friday, Nov 6, 2026 |
| **Engine / funnel** | A · Authority |
| **Audience** | Comfort homeowners + technically-minded readers |
| **Objective** | Show the measurement triad (airflow / electrical / refrigeration) and the interpretation layer. |
| **Landing page** | `/services/ac-repair-diagnostics/` |
| **Primary CTA** | Request diagnostics |
| **Channels** | FB · IG (carousel) · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` |

**Media assignment**
- **Carousel (built from stills):** cover `field-service-manifold-gauges.jpg` · 1 AIRFLOW `static-pressure-manometer.jpg` · 2 ELECTRICAL `clamp-meter-reading.jpg` · 3 REFRIGERATION `digital-manifold-readings.jpg` · final "Numbers → Context → Diagnosis" text card.
- **BACKUP** — `static-pressure-display.jpg`, `unit-panel-diagnostics.jpg`, `refrigerant-gauges-diagnostic.jpg`.
- **VIDEO INSERT** — `manometer-reading-unit.mp4`.
- **Status: READY (carousel).**

**Platform copy**

**Facebook** —
> There isn't one magic HVAC number — but there are measurements that can tell us a tremendous amount about how a system is operating.
> **AIRFLOW** — Is the system actually moving the air it should?
> **ELECTRICAL** — Are motors, controls and electrical components operating appropriately?
> **REFRIGERATION** — Do pressures, temperatures, superheat/subcooling, evacuation and related measurements make sense?
> Then comes the most important part: how do those measurements interact? A technician can collect numbers all day — the value comes from knowing what those numbers mean. 🔗 [facebook_ac_repair_post link]

**Instagram carousel** — caption: *3 areas we measure when diagnosing HVAC systems:* 1️⃣ Airflow · 2️⃣ Electrical · 3️⃣ Refrigeration
> But measurements don't diagnose themselves. The real skill is interpreting them together. **Numbers → Context → Diagnosis.**
> #HVACDiagnostics #HVAC #Airflow #Refrigeration #Electrical #HVACTechnician

**LinkedIn** —
> One of the most important parts of HVAC diagnostics is understanding that measurements are interconnected. Airflow affects system performance. Electrical conditions affect equipment operation. Refrigeration measurements tell us about another portion of the system.
> Those measurements shouldn't exist in isolation — the technician's job is to interpret the information together and determine whether the system's behavior makes sense. **Collecting data is not the same as understanding data.**
> Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.

**TikTok** — hook: "Three things I want to know when diagnosing an HVAC system." Rapid cuts: "Airflow." "Electrical." "Refrigeration." Then: "But here's the part people miss — those numbers have to make sense together."

**YouTube Short** — *3 HVAC Measurements That Tell You More Than Your Thermostat.*

**GBP** — *HVAC diagnosis can involve multiple types of measurements, including airflow, electrical conditions and refrigeration performance. The value isn't simply collecting numbers — it's interpreting them together to understand what the system is actually doing.* Learn more → `gbp_ac_repair_post`

---

## POST 08 — HALLOWEEN HVAC HORROR

| | |
| --- | --- |
| **Publish** | Week 3 · Friday, Oct 30, 2026 (Halloween Friday) |
| **Engine / funnel** | A · Awareness (seasonal) |
| **Audience** | Broad local audience + homeowners |
| **Objective** | Seasonal reach with a real lesson: hidden system conditions. No gore, no fear marketing. |
| **Landing page** | `/services/ac-repair-diagnostics/` (light CTA) |
| **Primary CTA** | Follow + call/text if something looks wrong |
| **Channels** | FB · IG · TikTok · GBP · LinkedIn (professional framing) |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/dirty-evaporator-coil.jpg` (grimy coil inside the cabinet — genuinely unsettling, genuinely real).
- **SECONDARY** — `src/content/site/images/dirty-condenser-coils.jpg`, `src/content/site/images/blower-wheel-condition.jpg`.
- **BACKUP** — `src/content/site/images/connector-heat-discoloration.jpg`, `src/content/site/images/failed-component-removed.jpg`.
- **VIDEO** — **READY (EDIT)**: quick montage from stills + `air-handler-service.mp4` loop; or shoot a 15 s "look at this coil" capture if one is available in the field.
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** — 🎃 **HVAC HORROR STORY**
> No haunted house required. We've all seen HVAC systems that make you stop and look twice: dirty coils, restricted airflow, improper installations, neglected equipment, electrical failures, drain problems — and systems that have been "repaired" repeatedly without anyone identifying why the problem keeps returning.
> The scariest part? Sometimes the equipment looks completely normal from the outside. 👻 Don't diagnose HVAC problems by appearance alone. **Measure it. Understand it. Then decide.**
> Happy Halloween from Sunshine Climate Solutions. 🔗 [facebook_ac_repair_post link]

**Instagram** — 🎃 **HVAC HORROR STORY**
> The scariest thing in Florida isn't always the weather. Sometimes it's what's hiding inside the HVAC system: dirty coils, restricted airflow, neglected equipment, bad installation details, recurring failures.
> 👻 The lesson: **don't diagnose HVAC by appearance alone.**
> #HVACHorror #Halloween #HVAC #FloridaHVAC #HVACTechnician

**TikTok** — opening: "Want to see something scarier than a haunted house?" → cut to dirty coil → "HVAC equipment nobody has looked at properly in years." Quick montage → "Happy Halloween."

**LinkedIn** —
> Halloween is a good excuse to talk about one of the least visible problems in HVAC: **hidden system conditions.**
> A system can look normal from the outside while experiencing airflow restrictions, contamination, electrical problems, drainage issues or other performance concerns. That is one reason field measurement matters — the equipment's appearance is only one piece of information.
> Happy Halloween from Sunshine Climate Solutions.

**GBP** — 🎃 *Happy Halloween from Sunshine Climate Solutions. Some of the scariest HVAC problems aren't visible from the outside — dirty coils, airflow restrictions, electrical problems, drainage issues and poor installation details can all affect system performance.* Learn more → `gbp_ac_repair_post`

---

## POST 09 — WHAT YOU'RE ACTUALLY PAYING FOR

| | |
| --- | --- |
| **Publish** | Week 5 · Tuesday, Nov 10, 2026 |
| **Engine / funnel** | A · Consideration |
| **Audience** | Homeowners who have been burned by guesswork (seg 1, 2, 4) |
| **Objective** | Reframe service value as diagnosis and judgment — not parts and labor. |
| **Landing page** | `/services/ac-repair-diagnostics/` |
| **Primary CTA** | Request diagnostics ($50 service call applies, waived when you proceed with the repair) |
| **Channels** | FB · IG · LinkedIn · TikTok · GBP |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/unit-panel-diagnostics.jpg` (panel removed, instruments connected).
- **SECONDARY** — `src/content/site/images/failed-component-removed.jpg` (the failed part in hand), `src/content/site/images/micron-gauge-reading.jpg`.
- **BACKUP** — `src/content/site/images/refrigerant-gauges-diagnostic.jpg`, `src/content/site/images/clamp-meter-reading.jpg`.
- **Status: READY.**

**Platform copy**

**Facebook** —
> When you hire an HVAC technician, you're not really paying for someone to turn a screwdriver. You're paying for the ability to determine:
> **What is wrong? What isn't wrong? What caused the problem? What options exist? What happens if you repair it? What happens if you don't?**
> Tools matter. Equipment matters. Experience matters. But the value is knowing how to use those things together. That's professional diagnosis.
> Service call is $50, waived when you proceed with the repair. 🔗 [facebook_ac_repair_post link]

**Instagram** — *You're not just paying for someone to turn a screwdriver.*
> You're paying for the ability to determine: **What's wrong. What's not wrong. Why it happened. What your options are. What happens next.**
> That's the value of diagnosis.
> #HVAC #HVACDiagnostics #HVACTechnician #TampaHVAC

**LinkedIn** —
> The value of technical service isn't simply the physical act of repairing equipment. It's the ability to gather information, interpret it, determine the actual problem, identify realistic options, communicate those findings, and execute the selected solution correctly.
> The tools are important. The equipment is important. The technician's technical judgment is what connects the two.

**TikTok** — hook: "You're not really paying an HVAC technician to turn a screwdriver. You're paying for them to know: what to measure, what the measurement means, what isn't wrong, what actually failed, and what your options are."

**YouTube** — *What Are You Actually Paying For When You Hire an HVAC Technician?*

**GBP** — *Professional HVAC service isn't simply about replacing components. Diagnosis involves evaluating system conditions, taking appropriate measurements, interpreting those findings, identifying options and explaining the recommendation. That's where technical service provides value.* Learn more → `gbp_ac_repair_post`

---

## POST 10 — THANKSGIVING

| | |
| --- | --- |
| **Publish** | Week 7 · Tuesday, Nov 24, 2026 (single-post week — Thanksgiving is Nov 26) |
| **Engine / funnel** | A+B · Retention / Referral (brand) |
| **Audience** | All customers, past and present; local community |
| **Objective** | Human moment; thank the community; reinforce owner-operated story. No sales CTA. |
| **Landing page** | None (brand post) — optional `/contact/` |
| **Primary CTA** | None; if a link is included use the prepared Facebook contact link |
| **Channels** | FB · IG · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | Optional only (`facebook_contact_post`) — brand posts may stay link-free |

**Media assignment**
- **PRIMARY** — `src/content/site/images/work-truck.jpg` (branded truck — the "thing of our own").
- **SECONDARY** — `src/content/site/images/bottling-factory-field-visit.jpg` (commercial work this year), `src/content/site/images/commercial-rooftop-walkway.jpg`.
- **BACKUP** — `src/content/site/images/owner-headshot.jpg`.
- **VIDEO** — **READY (EDIT)**: 15–20 s montage from the three field clips + stills (truck → tools → work → commercial → Aaron).
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** —
> This Thanksgiving, we're thankful for something pretty simple: **the opportunity to build something of our own and earn trust one job at a time.**
> Every service call. Every installation. Every measurement. Every commercial project. Every customer conversation. Every recommendation. It all adds up.
> Sunshine Climate Solutions is still growing, and we're grateful to every person who has trusted us with their home, business or HVAC system. Thank you for supporting a local business.
> **Happy Thanksgiving from Sunshine Climate Solutions.**

**Instagram** —
> This Thanksgiving, we're thankful for the opportunity to build something of our own and earn trust one job at a time.
> Every job. Every customer. Every measurement. Every installation. Every lesson. It all matters.
> Thank you to everyone who has supported Sunshine Climate Solutions. **Happy Thanksgiving.** 🦃
> #Thanksgiving #SmallBusiness #LocalBusiness #HVAC #TampaBay

**LinkedIn** —
> This Thanksgiving, I'm grateful for the opportunity to build Sunshine Climate Solutions one project, one customer and one job at a time.
> Building a small technical business is a long process. Every customer interaction matters. Every project teaches something. Every completed job becomes part of the company's reputation.
> Thank you to everyone who has trusted SCS with their HVAC work and supported the business along the way. Happy Thanksgiving.

**TikTok** — visual: quick montage of the year (truck → tools → HVAC work → commercial → Aaron). Text: "Thankful for every job that helped build SCS." Caption: Grateful for every customer, project, lesson and opportunity this year. Happy Thanksgiving from Sunshine Climate Solutions.

**YouTube Short** — *Thankful for Every Job That Built SCS This Year.*

**GBP** — *Happy Thanksgiving from Sunshine Climate Solutions. We're grateful for every customer, project and opportunity to serve our local community this year. Thank you for supporting a local business.*

---

---

## POST 11 — YOUR AC DOESN'T KNOW WHAT BRAND IT IS

| | |
| --- | --- |
| **Publish** | Week 6 · Friday, Nov 20, 2026 |
| **Engine / funnel** | A · Consideration (replacement quality) |
| **Audience** | Replacement shoppers comparing quotes (seg 4) |
| **Objective** | Shift the quote conversation from "which brand" to "how is the installation verified." |
| **Landing page** | `/services/replacement-installation/` |
| **Primary CTA** | Free written estimate |
| **Channels** | FB · IG · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | FB `facebook_replacement_post` · GBP `gbp_replacement_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/package-unit-install.jpg` (completed packaged unit).
- **SECONDARY** — `src/content/site/images/condenser-installation-complete.jpg`, `src/content/site/images/linehide-and-disconnect.jpg`.
- **BACKUP** — `src/content/site/images/custom-ductboard-supply-plenum.jpg`, `src/content/site/images/installing-line-hide.jpg`.
- **Note:** do **not** build a logo-wall ad. The eight `public/images/brand-*.png` marks exist for the website grid; this post stays photo-led and never implies dealership. (Brand names are mentioned only as equipment SCS services.)
- **Status: READY.**

**Platform copy**

**Facebook** —
> Daikin. Mitsubishi Electric. Carrier. Trane. Rheem. Lennox. Goodman. The name on the equipment matters — but it isn't the only thing that matters.
> A great piece of equipment installed poorly is still a poorly performing system. Airflow matters. Electrical work matters. Refrigeration work matters. Drainage matters. Startup matters. Commissioning matters. Maintenance matters. The equipment is one part of the system — **the installation is part of the system too.**
> Free written estimates, itemized, scope spelled out. 🔗 [facebook_replacement_post link]

**Instagram** — *The equipment brand matters. But it isn't the whole equation.*
> Equipment + Installation + Airflow + Refrigeration + Electrical + Startup + Maintenance = the system.
> Don't just ask "what brand?" Ask **"how are you verifying the installation?"**
> #HVAC #HVACInstallation #FloridaHVAC #TampaHVAC #HVACContractor

**LinkedIn** —
> Equipment selection matters. But brand alone doesn't determine system performance. Installation quality, airflow, refrigeration practices, electrical work, drainage, startup, commissioning and maintenance all contribute to the finished system.
> A premium piece of equipment does not eliminate the need for competent installation. In many cases, installation quality determines how well the equipment can perform within the actual building.
> Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.

**TikTok** — hook: "Here's something homeowners don't hear enough. The equipment brand matters — but the installation matters too." (show equipment) "Good equipment + poor installation is still a problem."

**YouTube Short** — *Does HVAC Brand Matter More Than Installation Quality?*

**GBP** — *HVAC equipment brand is important, but system performance also depends on installation quality, airflow, refrigeration work, electrical work, startup, commissioning and maintenance. When comparing HVAC contractors, ask how the completed installation will be verified.* Estimate → `gbp_replacement_post`

---

## POST 12 — COMMERCIAL HVAC IS DIFFERENT

| | |
| --- | --- |
| **Publish** | Week 8 · Tuesday, Dec 1, 2026 |
| **Engine / funnel** | B (commercial/TAB) · Commercial Authority |
| **Audience** | Mechanical contractors, GCs, engineers, facility/property managers, building owners (seg 5–6) |
| **Objective** | Open Engine B: commercial problems live in the building/system relationship, not just the box. |
| **Landing page** | `/services/commercial-service-maintenance/` (TAB cross-link) |
| **Primary CTA** | Commercial service discussion (call/text/email or request form) |
| **Channels** | LinkedIn (primary) · FB · IG · TikTok · YouTube · GBP |
| **UTM** | FB `facebook_commercial_post` · GBP `gbp_commercial_post` · LinkedIn: tracked profile link |

**Media assignment**
- **PRIMARY** — `src/content/site/images/airflow-measurement-at-grille.jpg` (Alnor matrix measuring total building exhaust at an exhaust terminal louver).
- **SECONDARY** — `src/content/site/images/building-pressure-manometer.jpg`, `src/content/site/images/commercial-rooftop-unit.jpg`, `src/content/site/images/commercial-ahu-field-work.jpg`.
- **BACKUP** — `src/content/site/images/vfd-motor-readings.jpg`, `src/content/site/images/equipment-control-wiring.jpg`, `src/content/site/images/metal-duct-interior.jpg`, `src/content/site/images/commercial-rooftop-walkway.jpg`, `src/content/site/images/psychrometric-measurement-report.jpg`.
- **VIDEO** — `public/videos/static-pressure-balancing.mp4` (2.9 s TAB loop) + **NEW CAPTURE — VID-06 (§9)** commercial walk-through (roof → pressure readings → exhaust).
- **Status: READY (stills + loop); NEW CAPTURE for video.**

**Platform copy**

**Facebook** —
> Commercial HVAC isn't simply residential HVAC with bigger equipment. Commercial systems can involve building pressure, outside air, exhaust, VAV systems, airflow verification, controls, equipment performance, balancing, documentation and commissioning.
> Sometimes the problem isn't inside the HVAC unit — it can be the relationship between the building and the systems serving it. That's where measurement becomes especially important.
> **You can't troubleshoot what you haven't measured.**
> Commercial contractors and property teams: 🔗 [facebook_commercial_post link]

**Instagram** — *Commercial HVAC isn't just "bigger residential."*
> 🏢 Building pressure · 🌬️ Outside air · 💨 Exhaust · 📊 Airflow verification · ⚙️ Controls · 📐 TAB · 📋 Documentation · 🔧 Commissioning
> Sometimes the problem isn't inside the unit — it's the relationship between the systems and the building.
> #CommercialHVAC #TAB #Commissioning #HVAC #BuildingPerformance #TampaBay

**LinkedIn (primary)** —
> Commercial HVAC problems don't always originate inside the HVAC equipment. Building pressure, outside air, exhaust, VAV systems, controls, airflow and equipment performance can all interact.
> That's why commercial troubleshooting often requires looking beyond the equipment itself. Our commercial/TAB support can include field measurement, airflow verification, building pressure and exhaust measurement, documentation and system verification.
> **You can't troubleshoot what you haven't measured.**
> Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.
> #CommercialHVAC #TAB #Commissioning #BuildingPerformance #HVAC

**TikTok (VID-06)** — hook: "Commercial HVAC isn't just residential HVAC with bigger equipment." (show Alnor) "Sometimes I'm not looking for the problem inside the RTU — I'm looking at the building. Pressure. Exhaust. Outside air. Airflow. Controls. That's why measurement matters."

**YouTube** — *Why Commercial HVAC Troubleshooting Is Different From Residential HVAC* (fold into OS Week 9 anchor "What Is Testing, Adjusting & Balancing?").

**GBP** — *Sunshine Climate Solutions provides commercial HVAC and TAB/commissioning support involving field measurement, airflow verification, building pressure and exhaust evaluation, documentation and system verification. Commercial HVAC problems aren't always isolated to the equipment itself.* Learn more → `gbp_commercial_post`

**Repurposing:** this post and its stills seed the OS Weeks 9–11 commercial anchors; keep the exhaust-measurement still as the Engine B signature image.

---

## POST 13 — THE DIRTY COIL

| | |
| --- | --- |
| **Publish** | Week 8 · Friday, Dec 4, 2026 |
| **Engine / funnel** | A · Consideration / Retention (maintenance) |
| **Audience** | Maintenance customer (seg 3) + comfort homeowner (seg 2) |
| **Objective** | Show maintenance value with real contamination evidence — and outcome-based maintenance. |
| **Landing page** | `/services/ac-maintenance/` ($75 Premium AC Maintenance; per system, per visit) |
| **Primary CTA** | Schedule maintenance |
| **Channels** | FB · IG · TikTok · GBP · Nextdoor |
| **UTM** | FB `facebook_maintenance_post` · GBP `gbp_maintenance_post` · Nextdoor `nextdoor_maintenance_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/dirty-evaporator-coil.jpg` (heavily soiled coil inside the cabinet).
- **SECONDARY** — `src/content/site/images/coil-cleaning-wash.jpg` (washing during the visit), `src/content/site/images/dirty-condenser-coils.jpg`.
- **BACKUP** — `src/content/site/images/dirty-coil-detail.jpg`, `src/content/site/images/filter-rack-maintenance.jpg`.
- **VIDEO** — `public/videos/air-handler-service.mp4` (1.8 s loop) + **NEW CAPTURE — VID-07 (§9): before/after coil-cleaning clip.**
- **Status: READY (stills); NEW CAPTURE for video.**

**Platform copy**

**Facebook** —
> This is why maintenance isn't just about changing a filter. A dirty evaporator coil can affect heat transfer and system performance — but even here, the answer isn't simply "spray it."
> The condition matters. The contamination matters. The coil construction matters. Access matters. And after maintenance, the system should still be evaluated to determine whether the intended result was achieved.
> Maintenance should have a purpose: **keep the system operating properly and identify developing problems before they become bigger problems.**
> $75 Premium AC Maintenance — per system, per visit. 🔗 [facebook_maintenance_post link]

**Instagram** — *This coil didn't get dirty overnight. And changing the filter alone wasn't going to clean it.*
> Maintenance is more than a checklist — it's understanding the condition of the equipment and addressing the things that affect performance. **Look at the system. Not just the filter.**
> #HVACMaintenance #DirtyCoil #AirConditioning #HVAC #FloridaHVAC

**LinkedIn** —
> Maintenance should be more than a checklist of actions. A contaminated evaporator coil can affect heat transfer and system performance, but the appropriate procedure depends on the actual condition of the equipment.
> Good maintenance asks: What condition is the equipment in? What is affecting performance? What work is actually necessary? Did the work produce the intended result?
> That final question is important — maintenance should be evaluated by its outcome, not simply by whether someone completed a list of tasks.

**TikTok (VID-07)** — hook: "This is why changing your filter isn't the same thing as maintaining your HVAC system." (show dirty coil) "Your filter can look fine while the coil behind it becomes heavily contaminated." (show cleaning) "Maintenance means looking at the equipment."

**YouTube Short** — *This Is Why Changing Your HVAC Filter Isn't Enough.*

**GBP** — *HVAC maintenance involves more than changing filters. Coil condition, airflow, drainage, electrical components and other system factors can affect performance. Sunshine Climate Solutions provides maintenance and system evaluations for residential HVAC equipment.* Learn more → `gbp_maintenance_post`

---

## POST 14 — WHAT HAPPENS WHEN YOU CALL SCS?

| | |
| --- | --- |
| **Publish** | Week 9 · Friday, Dec 11, 2026 |
| **Engine / funnel** | A · Conversion support |
| **Audience** | Anyone considering a first call (all residential segments) |
| **Objective** | Remove uncertainty about the process; make the first contact easy and predictable. |
| **Landing page** | `/contact/` |
| **Primary CTA** | Call, text, or send the short request form |
| **Channels** | FB · IG (process carousel) · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | FB `facebook_contact_post` · GBP `gbp_contact` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/owner-headshot.jpg` (the person you actually deal with).
- **CAROUSEL (built from stills):** cover `field-service-manifold-gauges.jpg` · LISTEN `owner-headshot.jpg` · INSPECT `unit-panel-diagnostics.jpg` · MEASURE `static-pressure-manometer.jpg` · INTERPRET `digital-manifold-readings.jpg` · EXPLAIN `psychrometric-measurement-report.jpg` · YOU DECIDE `work-truck.jpg`.
- **VIDEO** — **READY (EDIT)**: 20 s process edit from existing clips/stills; upgrading to a talking-head is VID-08 (optional).
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** —
> What actually happens when you call Sunshine Climate Solutions?
> **1. We listen.** What is the system doing? When did it start? What have you noticed?
> **2. We inspect.** We evaluate the equipment and system conditions.
> **3. We measure.** Airflow. Electrical. Refrigeration. Temperature. Pressure. Other relevant conditions.
> **4. We interpret.** The measurements have to make sense together.
> **5. We explain.** You should understand what we're recommending and why.
> **6. You decide.** The work doesn't move forward simply because someone arrived with a toolbox — you decide what happens next.
> 🔗 [facebook_contact_post link]

**Instagram** — *What happens when you call SCS?*
> **01 Listen · 02 Inspect · 03 Measure · 04 Interpret · 05 Explain · 06 You decide**
> That's the process.
> #HVAC #HVACService #TampaHVAC #FloridaHVAC #SunshineClimateSolutions

**LinkedIn** —
> Our service process is intentionally simple: **Listen → Inspect → Measure → Interpret → Explain → Decide.**
> The important part is what happens between "inspect" and "recommend": field data needs to be interpreted, the customer needs to understand the findings, and the recommendation needs to connect the technical findings to the customer's actual situation.
> That's how technical service becomes useful information rather than a list of parts.

**TikTok** — hook: "Here's what happens when you call SCS." Text appears one at a time: LISTEN · INSPECT · MEASURE · INTERPRET · EXPLAIN · YOU DECIDE. Voiceover: "We don't need to make the process complicated. We need to do the technical work correctly."

**YouTube Short** — *What Happens When You Call Sunshine Climate Solutions?*

**GBP** — *Our HVAC service process: 1. Listen to the problem · 2. Inspect the system · 3. Take appropriate measurements · 4. Interpret the findings · 5. Explain the recommendation · 6. Let the customer decide. Serving Tampa Bay and surrounding counties.* Contact → `gbp_contact`

---

## POST 15 — FLORIDA WINTER

| | |
| --- | --- |
| **Publish** | Week 6 · Tuesday, Nov 17, 2026 |
| **Engine / funnel** | A · Awareness → Consideration (seasonal maintenance) |
| **Audience** | Maintenance customer (seg 3) + comfort homeowner (seg 2) |
| **Objective** | Convert the cooler season into an evaluation opportunity — before the next cooling season. |
| **Landing page** | `/services/ac-maintenance/` |
| **Primary CTA** | Schedule maintenance or call/text |
| **Channels** | FB · IG · TikTok · GBP · Nextdoor |
| **UTM** | FB `facebook_maintenance_post` · GBP `gbp_maintenance_post` · Nextdoor `nextdoor_maintenance_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/dirty-return-filter.jpg` (what winter checks find).
- **SECONDARY** — `coil-cleaning-wash.jpg`, `filter-return-size.jpg`, `static-pressure-manometer.jpg`.
- **BACKUP** — `condenser-installation-complete.jpg` (idle system), `service-truck-oaks.jpg`.
- **VIDEO** — `air-handler-service.mp4` loop; **NEW CAPTURE optional (VID-09 short): 20 s "winter checklist" field piece.**
- **Status: READY (stills).**

**Platform copy**

**Facebook** —
> Meanwhile in Florida… everyone else is talking about winterizing their homes. Your air conditioner is still working. Florida doesn't always get the memo.
> Even during cooler months, HVAC systems can still experience humidity problems, weak airflow, dirty coils, drain issues, electrical wear, aging components, short cycling and performance problems.
> The cooler season can be a good opportunity to address problems before the next stretch of serious Florida heat. **Don't wait for the first 95° day to discover something isn't right.**
> $75 Premium AC Maintenance — per system, per visit. 🔗 [facebook_maintenance_post link]

**Instagram** —
> Winter in Florida is different. Your HVAC system didn't necessarily get a vacation.
> ☀️ Heat · 💧 Humidity · 🌬️ Airflow · 💦 Drainage · ⚡ Electrical · 🧊 Cooling performance
> Cooler months can be a good time to address problems before summer puts the system back under heavy load.
> #FloridaHVAC #TampaHVAC #HVACMaintenance #HVACService

**LinkedIn** —
> Florida's cooler months can provide an opportunity to evaluate HVAC equipment before the next period of sustained cooling demand. Potential concerns can include airflow, drainage, electrical conditions, coil contamination, equipment aging and other performance issues.
> The best time to discover a problem isn't necessarily the day the system is needed most.
> Property managers and facility teams: commercial HVAC service and TAB/commissioning support is available for your buildings.

**TikTok** — hook: "Florida winter doesn't mean your HVAC gets a vacation." (show condenser) "Your system can still have airflow, drainage, electrical and performance problems. Use the cooler season to get ahead of them."

**YouTube Short** — *Why Florida Homeowners Shouldn't Ignore HVAC Problems During Winter.*

**GBP** — *Florida's cooler season can be a good time to address HVAC problems before the next period of heavy cooling demand. If your system has weak airflow, unusual noises, drainage issues or performance problems, consider having it evaluated before summer arrives.* Learn more → `gbp_maintenance_post`

---

## POST 16 — STATIC PRESSURE

| | |
| --- | --- |
| **Publish** | Week 5 · Friday, Nov 13, 2026 |
| **Engine / funnel** | A · Authority |
| **Audience** | Comfort/airflow homeowner (seg 2) + technically-minded readers |
| **Objective** | Make static pressure the SCS signature measurement — and teach that a number isn't a diagnosis. |
| **Landing page** | `/services/airflow-ductwork/` |
| **Primary CTA** | Request airflow diagnostics |
| **Channels** | FB · IG · TikTok · LinkedIn (commercial adaptation) · YouTube · GBP |
| **UTM** | FB `facebook_airflow_post` · GBP `gbp_airflow_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/static-pressure-display.jpg` (Alnor readout in inches of water column; orientation-corrected).
- **SECONDARY** — `src/content/site/images/static-pressure-manometer.jpg` (manometer at the plenum), `src/content/site/images/metal-duct-interior.jpg`.
- **BACKUP** — `src/content/site/images/airflow-measurement-at-grille.jpg`.
- **VIDEO** — `public/videos/static-pressure-balancing.mp4` (2.9 s loop) + **NEW CAPTURE — VID-10 (§9): 30–45 s static-pressure walk-and-explain.**
- **Status: READY (stills + loop); NEW CAPTURE for the signature video.**

**Platform copy**

**Facebook** —
> Most homeowners have seen a thermostat. Far fewer have seen someone actually measure the air their HVAC system is moving.
> Static pressure helps us understand what the air distribution system is experiencing. But here's the important part: a pressure number doesn't exist in isolation. We have to consider the equipment, blower, filter, coil, duct system, return, supply side and other conditions around that measurement.
> That's why HVAC diagnosis isn't "here's a number" — it's **here's the number, here's what it means, here's how it fits into the system.** That's technical diagnosis. 🔗 [facebook_airflow_post link]

**Instagram** — *Most homeowners have never seen this measurement.*
> **STATIC PRESSURE.** It can tell us important information about what the HVAC air distribution system is experiencing. But one number doesn't diagnose the system — context matters.
> **Measurement + system knowledge = useful information.**
> #StaticPressure #Airflow #HVACDiagnostics #HVAC #TAB #FloridaHVAC

**LinkedIn** —
> Static pressure is one of the measurements that can help technicians understand HVAC airflow conditions. But a static-pressure measurement should not be treated as an isolated diagnosis — its meaning depends on the equipment, duct system, filter, coil, blower, return, supply and the conditions under which the measurement was taken.
> **A measurement provides information. Interpretation provides understanding.**
> For commercial buildings, the same discipline scales to building pressure, outside air and system-level verification. Commercial contractors and facility teams can contact SCS for field measurement, HVAC, TAB and commissioning support.

**TikTok (VID-10)** — hook: "Most homeowners have never seen an HVAC technician measure this." (show instrument) "Static pressure. This tells me something about what the air distribution system is experiencing — but the number doesn't diagnose itself. Context matters."

**YouTube** — *What Is HVAC Static Pressure? Why Technicians Measure It* (fold into OS Week 3 anchor "What HVAC Static Pressure Actually Tells Us").

**GBP** — *Static-pressure measurements can provide useful information when evaluating HVAC airflow conditions. However, the measurement needs to be interpreted in the context of the equipment and air distribution system. Sunshine Climate Solutions uses field measurements to help evaluate HVAC performance.* Learn more → `gbp_airflow_post`

---

## POST 17 — BEFORE THE HOLIDAYS

| | |
| --- | --- |
| **Publish** | Week 9 · Tuesday, Dec 8, 2026 |
| **Engine / funnel** | A · Conversion (maintenance) |
| **Audience** | Maintenance customer (seg 3), homeowners hosting for the holidays |
| **Objective** | Practical seasonal checklist that converts into maintenance bookings. No fake urgency. |
| **Landing page** | `/services/ac-maintenance/` |
| **Primary CTA** | Schedule maintenance / call or text |
| **Channels** | FB · IG · TikTok · GBP · Nextdoor |
| **UTM** | FB `facebook_maintenance_post` · GBP `gbp_maintenance_post` · Nextdoor `nextdoor_maintenance_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/filter-return-size.jpg` (check the filter).
- **SECONDARY** — `dirty-return-filter.jpg`, `coil-cleaning-wash.jpg`, `condenser-lineset-detail.jpg`.
- **BACKUP** — `static-pressure-manometer.jpg`, `owner-headshot.jpg`.
- **VIDEO** — **READY (EDIT)**: text-forward 20 s checklist over stills; optional quick capture.
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** —
> Before the holidays get completely hectic, give your HVAC system five minutes of attention. Check:
> ✓ Filter condition · ✓ Unusual sounds · ✓ Weak airflow · ✓ Strange odors · ✓ Water around the indoor unit · ✓ Outdoor equipment condition · ✓ Whether the system is struggling to maintain temperature
> And don't ignore a small problem simply because the system is still running. HVAC failures don't always begin dramatically — sometimes the warning signs are subtle. If something doesn't seem right, investigate it before it becomes a holiday problem.
> $75 Premium AC Maintenance — per system, per visit. 🔗 [facebook_maintenance_post link]

**Instagram** — *Before the holidays get crazy, check your HVAC.*
> ✓ Filter · ✓ Airflow · ✓ Sounds · ✓ Odors · ✓ Water · ✓ Temperature performance
> Small warning signs are easier to deal with before they become a major problem. 🎄
> #HVAC #HVACMaintenance #FloridaHVAC #HomeMaintenance #TampaBay

**LinkedIn** —
> Before the holiday season gets busy, it's worth checking the condition of the HVAC systems serving your home or facility. Look for unusual equipment noise, weak airflow, water or drainage issues, unusual odors, unexpected temperature problems, or equipment operating differently than normal.
> Small changes in system behavior can provide useful information. The goal isn't to create unnecessary concern — it's to avoid discovering an existing problem when the system is needed most.
> Facility teams and property managers: SCS provides commercial service and TAB/commissioning support across Hernando, Pasco, Pinellas and Hillsborough counties.

**TikTok** — hook: "Five HVAC things to check before the holidays." Rapid list: "Filter. Weak airflow. Strange noises. Water. Is it actually maintaining temperature?" End: "Catch problems before they become holiday problems."

**YouTube Short** — *5 HVAC Things to Check Before the Holidays.*

**GBP** — *Before the holidays, check your HVAC system for unusual sounds, weak airflow, strange odors, water around the indoor unit, or difficulty maintaining temperature. Addressing warning signs early can help prevent unexpected problems during the busiest part of the season.* Learn more → `gbp_maintenance_post`

---

## POST 18 — THE WORST CHRISTMAS PRESENT

| | |
| --- | --- |
| **Publish** | Week 10 · Tuesday, Dec 15, 2026 |
| **Engine / funnel** | A · Consideration (seasonal) |
| **Audience** | Homeowners with systems showing warning signs |
| **Objective** | Convert warning-sign awareness into evaluations — without fear marketing or availability promises. |
| **Landing page** | `/services/ac-repair-diagnostics/` |
| **Primary CTA** | Call/text or request a diagnostic |
| **Channels** | FB · IG · TikTok · GBP |
| **UTM** | FB `facebook_ac_repair_post` · GBP `gbp_ac_repair_post` |

**Media assignment**
- **PRIMARY** — `src/content/site/images/failed-component-removed.jpg` (the failed part in hand).
- **SECONDARY** — `connector-heat-discoloration.jpg` (heat damage found), `recovery-machine-reading.jpg`.
- **BACKUP** — `unit-panel-diagnostics.jpg`, `blower-wheel-condition.jpg`.
- **Status: READY.**

**Platform copy**

**Facebook** — 🎁 The worst Christmas present? **An HVAC breakdown** — especially when the system has been giving you warning signs for months.
> Running constantly. Weak airflow. Unusual noises. Water. Electrical problems. Repeated service calls. Performance that just doesn't seem right.
> Don't assume the problem will disappear because the weather changed. If something isn't right, have it evaluated before it becomes the problem you didn't plan for. Your holiday schedule is already full — your HVAC doesn't need to become part of it. 🔗 [facebook_ac_repair_post link]

**Instagram** — 🎁 **THE WORST CHRISTMAS PRESENT: an HVAC problem you saw coming.**
> Weak airflow. Noise. Water. Long runtimes. Poor performance. Don't wait for the system to choose the worst possible day to get worse.
> #HVAC #Christmas #FloridaHVAC #HVACService #TampaHVAC

**LinkedIn** —
> The worst HVAC failure is often the one that occurs when the equipment is needed most — which makes early identification of unusual system behavior valuable.
> Repeated problems, declining airflow, unusual noise, drainage issues and unexpected operating behavior shouldn't be ignored simply because the system is still running. Good maintenance and timely evaluation are often about reducing uncertainty before the system is under maximum demand.

**TikTok** — hook: "Here's the Christmas present nobody wants." (cut to failed equipment) "An HVAC problem — especially when the system was already giving you warning signs."

**GBP** — 🎁 *The worst holiday surprise is an unexpected HVAC problem. If your system has been showing warning signs such as weak airflow, unusual noise, water, long runtimes or declining performance, consider having it evaluated before the holidays get busier.* Call → `gbp_ac_repair_post`

---

## POST 19 — WHAT WE WANT SCS TO BE

| | |
| --- | --- |
| **Publish** | Week 10 · Friday, Dec 18, 2026 |
| **Engine / funnel** | A+B · Retention / Referral (brand) |
| **Audience** | Everyone who followed the year's work |
| **Objective** | Close the year on standards and gratitude; no sales ask. |
| **Landing page** | None (brand) — optional `/about/` or `/contact/` |
| **Primary CTA** | None |
| **Channels** | FB · IG · LinkedIn · TikTok (montage) · YouTube Short · GBP |
| **UTM** | None required |

**Media assignment**
- **PRIMARY** — `src/content/site/images/work-truck.jpg` (brand anchor).
- **MONTAGE STILLS** — `owner-headshot.jpg`, `bottling-factory-field-visit.jpg`, `commercial-rooftop-walkway.jpg`, `custom-ductboard-supply-plenum.jpg`, `nitrogen-purge-during-brazing.jpg`, `commercial-ahu-field-work.jpg`.
- **VIDEO** — **READY (EDIT)**: best-of-year montage from the three field clips + selected stills (VID-M1, §9).
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** —
> We're not trying to become the HVAC company that talks the loudest. We're trying to become the HVAC company people remember when they need someone who actually knows what they're looking at.
> That means: **Measure instead of guess. Explain instead of overwhelm. Document the work. Respect the customer's decision. Do the details correctly.** And keep improving.
> Sunshine Climate Solutions is still building — but the standard doesn't have to wait until the company gets bigger. That's the point. Thank you to everyone who supported SCS this year. We're just getting started.

**Instagram** —
> We're not trying to be the loudest HVAC company. We're trying to be the one people remember because the work speaks for itself.
> **Measure. Understand. Explain. Document. Execute. Improve.**
> That's the standard. And we're still building.
> #SunshineClimateSolutions #HVAC #SmallBusiness #TampaBay #FloridaHVAC

**LinkedIn** —
> We're not trying to build Sunshine Climate Solutions around being the loudest company in the market. We're trying to build it around technical competence and consistent execution.
> Measure instead of guess. Explain instead of overwhelm. Document the work. Respect the customer's decision. Do the details correctly. Keep improving.
> A company's reputation is built through repeated execution — not slogans. That's the standard we're working toward at SCS.

**TikTok (VID-M1)** — best-of-year montage. Voiceover: "We're not trying to become the HVAC company that talks the loudest. We're trying to become the HVAC company people remember because the work speaks for itself. That's what we're building."

**YouTube Short** — *What We're Building at Sunshine Climate Solutions.*

**GBP** — *Sunshine Climate Solutions is continuing to build a local HVAC company around technical competence, careful workmanship, field measurement, documentation and clear communication. Thank you to everyone who has trusted SCS with their HVAC work this year.*

---

## POST 20 — THE NEW YEAR STARTS WITH THE WORK

| | |
| --- | --- |
| **Publish** | Year-end coda · Tuesday, Dec 29, 2026 (outside the 10-week core cadence; holiday hold) |
| **Engine / funnel** | A+B · Referral / Retention (brand) |
| **Audience** | Followers, customers, commercial contacts |
| **Objective** | Start the next cycle with the standard front and center. |
| **Landing page** | None (brand) — optional `/contact/` |
| **Primary CTA** | None |
| **Channels** | FB · IG · LinkedIn · TikTok · YouTube Short · GBP |
| **UTM** | None required |

**Media assignment**
- **PRIMARY** — `bottling-factory-field-visit.jpg` (the year's most distinctive field image).
- **MONTAGE STILLS** — `service-truck-oaks.jpg`, `commercial-rooftop-unit.jpg`, `sheet-metal-trunk-hung.jpg`, `psychrometric-measurement-report.jpg`, `owner-headshot.jpg`.
- **VIDEO** — **READY (EDIT)**: fast-paced best-of montage (reuse VID-M1 selects, new end card: "See you in the field").
- **Status: READY (EDIT).**

**Platform copy**

**Facebook** —
> A new year doesn't magically make a company better. **The work does.**
> Every installation. Every diagnosis. Every measurement. Every difficult problem. Every customer interaction. Every commercial project. Every lesson. Every improvement. That's how a reputation is built.
> Sunshine Climate Solutions is heading into the new year focused on: **Better HVAC work. Better documentation. Better communication. Better results.**
> Thank you for being here. We'll see you in the field.

**Instagram** —
> A new year doesn't make a company better. **The work does.**
> Every job. Every measurement. Every customer. Every lesson. Every improvement.
> That's how a reputation gets built. Here's to another year of doing better work. **Sunshine Climate Solutions**
> #NewYear #HVAC #SmallBusiness #TampaBay #FloridaHVAC

**LinkedIn** —
> A new year is an opportunity to improve, but improvement doesn't happen because the calendar changes. It happens through the work.
> Better field measurements. Better documentation. Better communication. Better installation practices. Better technical understanding. Better customer experience.
> That's where we're putting our attention as Sunshine Climate Solutions moves into the new year. Thank you to everyone who supported the business along the way.

**TikTok** — montage. Opening text: "2026 → 2027". Voiceover: "A new year doesn't make a company better. The work does. Every job. Every measurement. Every lesson. Every improvement. That's what we're taking into the new year." Final screen: SUNSHINE CLIMATE SOLUTIONS — "See you in the field."

**YouTube Short** — *What We're Taking Into the New Year | Sunshine Climate Solutions.*

**GBP** — *As the year comes to a close, Sunshine Climate Solutions is focused on continuing to improve: better HVAC work, better documentation, better communication, better results. Thank you to everyone who supported SCS this year.*

---

---

# 9. VIDEO DIRECTING SHEETS

Full sheets for the priority videos; compact sheets for the optional ones. All capture happens
during **real work** — nothing staged. Safety first: never create unsafe conditions, never
open equipment beyond normal service practice, never delay a customer for a take.

## VID-01 — "Your thermostat isn't the diagnosis" (Post 01)
- **Objective:** establish the diagnostic philosophy in 30–45 s. **Audience:** homeowners. **Funnel:** awareness → authority.
- **Hook (0–2 s):** thermostat on wall, hand pointing — "This is not a diagnosis."
- **Location:** any service call (thermostat + equipment).
- **Camera A:** iPhone 16 Pro Max, 9:16, handheld at chest height, subject at 1.2 m.
- **Camera B / b-roll:** gauge close-up, meter leads, panel open, air handler.
- **Aaron's action:** point at thermostat → walk to equipment → connect gauges/meters.
- **Exact talking points:** "It tells me the system isn't meeting the condition you're asking for. It doesn't tell me whether I've got an airflow problem, electrical problem, refrigeration problem, duct issue, control issue — or something else. That's why we measure before deciding what needs to happen."
- **Field proof:** the actual instruments on screen (manifold + clamp meter).
- **On-screen text:** "YOUR THERMOSTAT IS NOT THE DIAGNOSIS" → "Don't guess. Diagnose."
- **Shot list:** 1) thermostat + hand (3 s) 2) walking to unit (3 s) 3) gauges connecting (5 s) 4) meter reading (4 s) 5) talking close-up (15 s) 6) end card (3 s).
- **Length:** 30–45 s vertical + a 4–6 min anchor cut later.
- **Style:** natural audio, one location, no music bed or a very low one. **Ending:** end card. **CTA:** profile link. **Thumbnail:** gauge close-up + "NOT THE DIAGNOSIS".
- **Platform versions:** TikTok (raw), Reel (same cut, tighter caption), Short (same), LinkedIn (still + text version).
- **Repurposing:** stills for FB/GBP; evidence clip for the Week 1 anchor.

## VID-02 — "412 microns" (Post 02 — HIGHEST PRIORITY)
- **Objective:** show verification in action. **Audience:** replacement shoppers + commercial contacts. **Funnel:** authority.
- **Hook (0–2 s):** gauge in frame — "412 microns. Here's why I care about this number."
- **Location:** an actual evacuation during an installation or repair.
- **Camera A:** 9:16, gauge screen filled in frame, tripod/lean stable.
- **Camera B:** hands/hoses, unit context, isolation valve action.
- **Aaron's action:** gauge watch → close isolation → watch decay → note.
- **Talking points:** "When you evacuate a system you're removing moisture and non-condensables. I'm not just watching the pump run — I'm watching the micron reading, and then what happens when the system is isolated. The number gives me information; the behavior gives me more."
- **Field proof:** the falling micron number + hold/decay behavior (record the real reading; never fabricate a number).
- **On-screen text:** "412 MICRONS" → "Measure the work."
- **Shot list:** gauge start (5 s), gauge falling (10 s), isolation + timer (10 s), reaction/read (10 s), end card (3 s).
- **Length:** 30–45 s. **Style:** natural sound, no music. **Ending:** end card. **CTA:** profile link. **Thumbnail:** gauge at 412 + "412 MICRONS".
- **Platform versions:** TikTok, Reel, Short; LinkedIn still + paragraph; FB still + story; GBP still.
- **Repurposing:** the strongest single technical asset in the campaign — also future website Field Proof.

## VID-03 — "The airflow path" (Post 03)
- **Objective:** show airflow as a system path. **Audience:** comfort homeowners. **Funnel:** consideration.
- **Hook:** dirty filter in hand — "Everyone blames the filter."
- **Camera A:** 9:16 walk: filter → coil → blower → duct → instrument.
- **Talking points:** the chain from the FB caption; end "Measure the system."
- **Field proof:** static-pressure instrument reading at the equipment. **Length:** 30–40 s.
- **Style:** fast cuts, natural audio. **CTA:** profile link. **Thumbnail:** filter + "NOT THE WHOLE STORY".
- **Repurposing:** the carousel stills double as the IG carousel; measurement still for GBP.

## VID-04 — "The part nobody sees" (Post 04)
- **Objective:** installation quality evidence. **Audience:** replacement shoppers; GCs. **Funnel:** authority/consideration.
- **Hook:** open equipment bay — "You can have brand-new equipment and a bad installation."
- **Camera A:** 9:16 detail shots; **Camera B:** wide install context.
- **Talking points:** refrigeration → evacuation → electrical → drain → airflow → startup → verification; end "Turning on isn't proof."
- **Field proof:** nitrogen purge indicator, brazed joints, micron gauge, startup readings. **Length:** 30–45 s.
- **Style:** deliberate, close-up, craftsmanship tone. **CTA:** free estimate (FB link). **Thumbnail:** brazing close-up + "NOBODY SEES THIS".
- **Repurposing:** five stills already feed the site's workmanship carousels.

## VID-05 — "Before you replace" (Post 05 — optional talking head)
- **Objective:** explain what a replacement recommendation should include. **Audience:** replacement shoppers. **Funnel:** consideration/conversion.
- **Hook:** "Before you replace your AC, ask this one question."
- **Camera A:** 9:16 subject, service truck/equipment background. **B-roll:** condition photos, measurements.
- **Talking points:** "Why does it need to be replaced?" — condition, measurements, repair options, age, reliability, your goals. **Length:** 30–45 s.
- **CTA:** estimate (FB link). **Thumbnail:** Aaron + "ASK WHY FIRST". **Repurposing:** OS Weeks 6–8 anchors.

## VID-06 — "Commercial is different" (Post 12)
- **Objective:** Engine B proof of building-level measurement. **Audience:** contractors, engineers, facility/property managers. **Funnel:** commercial authority.
- **Hook:** on a roof with instrument — "Sometimes I'm not looking inside the RTU."
- **Camera A:** 9:16 walk (roof → gauge → louver). **Camera B:** wide rooftop, reading close-ups.
- **Talking points:** building pressure, exhaust, outside air, airflow, controls; "You can't troubleshoot what you haven't measured."
- **Field proof:** real building-pressure and exhaust readings with context. **Length:** 30–45 s (+ 5–8 min anchor possible).
- **Style:** documentary, no hype. **CTA:** commercial discussion. **Thumbnail:** exhaust measurement + "NOT INSIDE THE UNIT".
- **Repurposing:** seeds OS Weeks 9–11; LinkedIn native upload.

## VID-07 — "The dirty coil" (Post 13)
- **Objective:** maintenance value with before/after. **Audience:** maintenance customers. **Funnel:** consideration/conversion.
- **Hook:** coil close-up — "This is why changing a filter isn't maintenance."
- **Camera A:** 9:16 before (dirty) → cleaning action → after (clean). **Talking points:** condition → procedure depends on condition → outcome verified.
- **Field proof:** same coil, before/after; post-clean operating check. **Length:** 30–45 s.
- **Style:** honest, unglamorous, satisfying. **CTA:** schedule maintenance. **Thumbnail:** split before/after + "THIS COIL".
- **Repurposing:** stills already in the maintenance evidence strip.

## VID-08 — "What happens when you call" (Post 14 — optional)
- **Objective:** process clarity. **Audience:** first-time callers. **Funnel:** conversion support.
- **Hook:** "Here's what actually happens when you call SCS."
- **Format:** text-timed sequence (LISTEN→INSPECT→MEASURE→INTERPRET→EXPLAIN→YOU DECIDE) over b-roll; optional talking head. **Length:** 20–30 s.
- **CTA:** contact. **Thumbnail:** "THE PROCESS". **Repurposing:** works as a pinned video on TikTok/FB.

## VID-09 — "Florida winter checklist" (Post 15 — optional)
- Short 20 s text-forward checklist over winter-season stills; CTA schedule maintenance.

## VID-10 — "Static pressure walk-and-explain" (Post 16 — SIGNATURE VIDEO)
- **Objective:** make static pressure the SCS measurement. **Audience:** comfort homeowners + commercial prospects. **Funnel:** authority.
- **Hook:** instrument in frame — "Most homeowners have never seen this."
- **Camera A:** 9:16 drill/port → meter reading → explanation. **Camera B:** duct/plenum context, grille.
- **Talking points:** what it measures → why context matters → supply vs return → "the number doesn't diagnose itself."
- **Field proof:** real reading with system context. **Length:** 30–45 s (+ 6–8 min anchor later).
- **Style:** calm, technical, close-up. **CTA:** airflow diagnostics. **Thumbnail:** meter + "STATIC PRESSURE".
- **Repurposing:** the Week 3 OS anchor; LinkedIn technical cut; GBP still.

## VID-M1 / VID-M2 — year montages (Posts 10, 19, 20)
- 15–25 s best-of-year montages: truck → tools → diagnostics → installation → commercial → Aaron;
  end cards "Thankful for every job" / "The work speaks for itself" / "See you in the field."
- Built entirely from existing clips + selected stills (no new capture). Music optional, low,
  licensed-free only. Export 9:16 + 16:9 versions.

**Shared editing rules:** captions burned in (all verticals); no fake readings ever on screen
(a number shown must be the real number captured); no customer identifiers; no competitor
mentions; keep technical footage real — do not over-edit.

---

# 10. 10-WEEK PRODUCTION CALENDAR

**Cadence:** Tuesdays = technical authority; Fridays = local/brand/seasonal. Thanksgiving week
carries a single post (Nov 24). Post 20 publishes as a year-end coda on Dec 29.

| Week | Date | Day | Post | Core topic | Platforms | Asset type | Media | Status | CTA | UTM (channel link) | Landing | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Oct 13 | Tue | P01 | Thermostat isn't the diagnosis | FB·IG·LI·TT·YT·GBP | Reel/Short + stills | `field-service-manifold-gauges` + VID-01 | READY + NEW SHOOT | Request diagnostics | `facebook_ac_repair_post` / `gbp_ac_repair_post` | `/services/ac-repair-diagnostics/` | Authority |
| 1 | Oct 16 | Fri | P02 | 412 microns | FB·IG·LI·TT·YT·GBP | Photos + video | `micron-gauge-reading` + VID-02 | READY + NEW CAPTURE | Estimate | `facebook_replacement_post` / `gbp_replacement_post` | `/services/replacement-installation/` | Authority |
| 2 | Oct 20 | Tue | P03 | Filter isn't the whole airflow story | FB·IG(car.)·TT·GBP·LI | Carousel + video | filter/coil/blower/duct statics + VID-03 | READY + NEW CAPTURE | Airflow diagnostics | `facebook_airflow_post` / `gbp_airflow_post` | `/services/airflow-ductwork/` | Awareness→Consideration |
| 2 | Oct 23 | Fri | P04 | The part nobody sees | FB·IG·LI·TT·YT | Photos + video | `nitrogen-purge-during-brazing` + VID-04 | READY + NEW CAPTURE | Free estimate | `facebook_replacement_post` | `/services/replacement-installation/` | Authority |
| 3 | Oct 27 | Tue | P05 | Before you replace your AC | FB·IG·LI·TT·GBP | Photos (+opt. video) | `condenser-replacement-in-progress` | READY (opt. VID-05) | Diagnostic / estimate | `facebook_replacement_post` / `gbp_replacement_post` | `/services/replacement-installation/` | Consideration |
| 3 | Oct 30 | Fri | P08 | HVAC horror story | FB·IG·TT·GBP·LI | Photo + quick cut | `dirty-evaporator-coil` + montage | READY (EDIT) | Follow + call | `facebook_ac_repair_post` / `gbp_ac_repair_post` | `/services/ac-repair-diagnostics/` | Awareness |
| 4 | Nov 3 | Tue | P06 | Florida HVAC is different | FB·IG·TT·GBP·ND | Photos | `condenser-installed-pad` + env stills | READY | Diagnostics | `facebook_ac_repair_post` / `gbp_ac_repair_post` / `nextdoor_ac_repair_post` | `/services/ac-repair-diagnostics/` | Awareness |
| 4 | Nov 6 | Fri | P07 | Three measurements | FB·IG(car.)·LI·TT·YT·GBP | Carousel + insert | gauge stills + `manometer-reading-unit.mp4` | READY | Diagnostics | `facebook_ac_repair_post` / `gbp_ac_repair_post` | `/services/ac-repair-diagnostics/` | Authority |
| 5 | Nov 10 | Tue | P09 | What you're actually paying for | FB·IG·LI·TT·GBP | Photos | `unit-panel-diagnostics` | READY | Diagnostics ($50 waived w/ repair) | `facebook_ac_repair_post` / `gbp_ac_repair_post` | `/services/ac-repair-diagnostics/` | Consideration |
| 5 | Nov 13 | Fri | P16 | Static pressure | FB·IG·TT·LI·YT·GBP | Photos + video | `static-pressure-display` + VID-10 | READY + NEW CAPTURE | Airflow diagnostics | `facebook_airflow_post` / `gbp_airflow_post` | `/services/airflow-ductwork/` | Authority |
| 6 | Nov 17 | Tue | P15 | Florida winter | FB·IG·TT·GBP·ND | Photos | `dirty-return-filter` + maintenance stills | READY | Schedule maintenance | `facebook_maintenance_post` / `gbp_maintenance_post` / `nextdoor_maintenance_post` | `/services/ac-maintenance/` | Awareness→Consideration |
| 6 | Nov 20 | Fri | P11 | Brand ≠ installation | FB·IG·LI·TT·YT·GBP | Photos | `package-unit-install` + details | READY | Free estimate | `facebook_replacement_post` / `gbp_replacement_post` | `/services/replacement-installation/` | Consideration |
| 7 | Nov 24 | Tue | P10 | Thanksgiving | FB·IG·LI·TT·YT·GBP | Montage | VID-M1 | READY (EDIT) | None | — | — | Retention/Referral |
| 8 | Dec 1 | Tue | P12 | Commercial HVAC is different | LI·FB·IG·TT·YT·GBP | Photos + video | `airflow-measurement-at-grille` + VID-06 | READY + NEW CAPTURE | Commercial discussion | `facebook_commercial_post` / `gbp_commercial_post` | `/services/commercial-service-maintenance/` | Commercial Authority |
| 8 | Dec 4 | Fri | P13 | The dirty coil | FB·IG·TT·GBP·ND | Photos + video | `dirty-evaporator-coil` + `coil-cleaning-wash` + VID-07 | READY + NEW CAPTURE | Schedule maintenance | `facebook_maintenance_post` / `gbp_maintenance_post` / `nextdoor_maintenance_post` | `/services/ac-maintenance/` | Consideration/Retention |
| 9 | Dec 8 | Tue | P17 | Before the holidays | FB·IG·TT·GBP·ND | Checklist carousel | `filter-return-size` + stills | READY (EDIT) | Schedule maintenance | `facebook_maintenance_post` / `gbp_maintenance_post` / `nextdoor_maintenance_post` | `/services/ac-maintenance/` | Conversion |
| 9 | Dec 11 | Fri | P14 | What happens when you call SCS | FB·IG(car.)·LI·TT·YT·GBP | Process carousel | stills + VID-08 (opt.) | READY (EDIT) | Contact | `facebook_contact_post` / `gbp_contact` | `/contact/` | Conversion support |
| 10 | Dec 15 | Tue | P18 | Worst Christmas present | FB·IG·TT·GBP | Photos | `failed-component-removed` | READY | Diagnostic | `facebook_ac_repair_post` / `gbp_ac_repair_post` | `/services/ac-repair-diagnostics/` | Consideration |
| 10 | Dec 18 | Fri | P19 | What we want SCS to be | FB·IG·LI·TT·YT·GBP | Montage | VID-M1 selects | READY (EDIT) | None | — | — | Retention/Referral |
| Coda | Dec 29 | Tue | P20 | The new year starts with the work | FB·IG·LI·TT·YT·GBP | Montage | `bottling-factory-field-visit` + montage | READY (EDIT) | None | — | — | Referral/Retention |

**Copy-paste CSV (social layer — append to the tracker or keep beside it):**

```csv
week,date,day,post,core_topic,platforms,asset_type,status,cta,utm,landing,purpose
1,2026-10-13,Tue,P01,Thermostat isn't the diagnosis,"FB,IG,LI,TT,YT,GBP",Reel/Short + stills,READY+NEW SHOOT,Request diagnostics,facebook_ac_repair_post; gbp_ac_repair_post,/services/ac-repair-diagnostics/,Authority
1,2026-10-16,Fri,P02,412 microns,"FB,IG,LI,TT,YT,GBP",Photos + video,READY+NEW CAPTURE,Estimate,facebook_replacement_post; gbp_replacement_post,/services/replacement-installation/,Authority
2,2026-10-20,Tue,P03,Filter isn't the whole airflow story,"FB,IG(carousel),TT,GBP,LI",Carousel + video,READY+NEW CAPTURE,Airflow diagnostics,facebook_airflow_post; gbp_airflow_post,/services/airflow-ductwork/,Awareness/Consideration
2,2026-10-23,Fri,P04,The part nobody sees,"FB,IG,LI,TT,YT",Photos + video,READY+NEW CAPTURE,Free estimate,facebook_replacement_post,/services/replacement-installation/,Authority
3,2026-10-27,Tue,P05,Before you replace your AC,"FB,IG,LI,TT,GBP",Photos,READY,Diagnostic / estimate,facebook_replacement_post; gbp_replacement_post,/services/replacement-installation/,Consideration
3,2026-10-30,Fri,P08,HVAC horror story,"FB,IG,TT,GBP,LI",Photo + quick cut,READY(EDIT),Follow + call,facebook_ac_repair_post; gbp_ac_repair_post,/services/ac-repair-diagnostics/,Awareness
4,2026-11-03,Tue,P06,Florida HVAC is different,"FB,IG,TT,GBP,ND",Photos,READY,Diagnostics,facebook_ac_repair_post; gbp_ac_repair_post; nextdoor_ac_repair_post,/services/ac-repair-diagnostics/,Awareness
4,2026-11-06,Fri,P07,Three measurements,"FB,IG(carousel),LI,TT,YT,GBP",Carousel + insert,READY,Diagnostics,facebook_ac_repair_post; gbp_ac_repair_post,/services/ac-repair-diagnostics/,Authority
5,2026-11-10,Tue,P09,What you're actually paying for,"FB,IG,LI,TT,GBP",Photos,READY,Diagnostics ($50 waived w/ repair),facebook_ac_repair_post; gbp_ac_repair_post,/services/ac-repair-diagnostics/,Consideration
5,2026-11-13,Fri,P16,Static pressure,"FB,IG,TT,LI,YT,GBP",Photos + video,READY+NEW CAPTURE,Airflow diagnostics,facebook_airflow_post; gbp_airflow_post,/services/airflow-ductwork/,Authority
6,2026-11-17,Tue,P15,Florida winter,"FB,IG,TT,GBP,ND",Photos,READY,Schedule maintenance,facebook_maintenance_post; gbp_maintenance_post; nextdoor_maintenance_post,/services/ac-maintenance/,Awareness/Consideration
6,2026-11-20,Fri,P11,Brand ≠ installation,"FB,IG,LI,TT,YT,GBP",Photos,READY,Free estimate,facebook_replacement_post; gbp_replacement_post,/services/replacement-installation/,Consideration
7,2026-11-24,Tue,P10,Thanksgiving,"FB,IG,LI,TT,YT,GBP",Montage,READY(EDIT),None,,,Retention/Referral
8,2026-12-01,Tue,P12,Commercial HVAC is different,"LI,FB,IG,TT,YT,GBP",Photos + video,READY+NEW CAPTURE,Commercial discussion,facebook_commercial_post; gbp_commercial_post,/services/commercial-service-maintenance/,Commercial Authority
8,2026-12-04,Fri,P13,The dirty coil,"FB,IG,TT,GBP,ND",Photos + video,READY+NEW CAPTURE,Schedule maintenance,facebook_maintenance_post; gbp_maintenance_post; nextdoor_maintenance_post,/services/ac-maintenance/,Consideration/Retention
9,2026-12-08,Tue,P17,Before the holidays,"FB,IG,TT,GBP,ND",Checklist carousel,READY(EDIT),Schedule maintenance,facebook_maintenance_post; gbp_maintenance_post; nextdoor_maintenance_post,/services/ac-maintenance/,Conversion
9,2026-12-11,Fri,P14,What happens when you call SCS,"FB,IG(carousel),LI,TT,YT,GBP",Process carousel,READY(EDIT),Contact,facebook_contact_post; gbp_contact,/contact/,Conversion support
10,2026-12-15,Tue,P18,Worst Christmas present,"FB,IG,TT,GBP",Photos,READY,Diagnostic,facebook_ac_repair_post; gbp_ac_repair_post,/services/ac-repair-diagnostics/,Consideration
10,2026-12-18,Fri,P19,What we want SCS to be,"FB,IG,LI,TT,YT,GBP",Montage,READY(EDIT),None,,,Retention/Referral
Coda,2026-12-29,Tue,P20,The new year starts with the work,"FB,IG,LI,TT,YT,GBP",Montage,READY(EDIT),None,,,Referral/Retention
```

---

# 11. FUNNEL MAPPING

| Post | Primary funnel role | Feeds |
| --- | --- | --- |
| P01 | Authority | Awareness of the diagnostic difference → repair evaluations |
| P02 | Authority | Installation credibility → replacement/estimate trust |
| P03 | Awareness → Consideration | Airflow diagnostic requests |
| P04 | Authority | Replacement consideration; GC/contractor respect |
| P05 | Consideration | Replacement estimates + honest repair path |
| P06 | Awareness | Local trust → service calls |
| P07 | Authority | Repair diagnostics |
| P08 | Awareness | Seasonal reach → followers; light service CTA |
| P09 | Consideration | Repair diagnostics |
| P10 | Retention / Referral | Brand affinity; no ask |
| P11 | Consideration | Replacement estimates |
| P12 | **Commercial Authority** | Engine B conversations, TAB inquiries |
| P13 | Consideration / Retention | Maintenance bookings |
| P14 | Conversion support | First-call confidence |
| P15 | Awareness → Consideration | Maintenance bookings |
| P16 | Authority | Airflow diagnostics; commercial adaptation |
| P17 | Conversion | Maintenance bookings |
| P18 | Consideration | Diagnostics before failure becomes urgent |
| P19 | Retention / Referral | Brand standard; no ask |
| P20 | Referral / Retention | New-year brand; no ask |

Conversion posts are deliberately limited (P14, P17) plus the persistent profile links; the
campaign's job is authority and consideration, per the operating system.

---

# 12. UTM & ATTRIBUTION MAPPING

**Rules (from the OS, unchanged):** every website link in posts/descriptions uses the exact
prepared link from `UTM-MASTER-LINKS.md`. Instagram, TikTok, LinkedIn and YouTube carry
profile-level tracked links only ("link in bio" / channel link). No one-off UTMs; no UTMs in
internal navigation.

| Post | Facebook link (exact) | GBP link (exact) | Notes |
| --- | --- | --- | --- |
| P01, P06, P07, P08, P09, P18 | `…/services/ac-repair-diagnostics/?utm_source=facebook&utm_medium=organic_social&utm_campaign=ac_repair&utm_content=post` | `…/services/ac-repair-diagnostics/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_ac_repair` | Nextdoor variant for P06: `nextdoor_ac_repair_post` |
| P02, P04, P05, P11 | `…/services/replacement-installation/?utm_source=facebook&utm_medium=organic_social&utm_campaign=replacement&utm_content=post` | `…/services/replacement-installation/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_replacement` | New GBP entry added 2026-10-08 |
| P03, P16 | `…/services/airflow-ductwork/?utm_source=facebook&utm_medium=organic_social&utm_campaign=airflow&utm_content=post` | `…/services/airflow-ductwork/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_airflow` | New GBP entry added 2026-10-08 |
| P12 | `…/services/commercial-service-maintenance/?utm_source=facebook&utm_medium=organic_social&utm_campaign=commercial_hvac&utm_content=post` | `…/services/commercial-service-maintenance/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_commercial` | LinkedIn uses the live tracked profile link |
| P13, P15, P17 | `…/services/ac-maintenance/?utm_source=facebook&utm_medium=organic_social&utm_campaign=maintenance&utm_content=post` | `…/services/ac-maintenance/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_maintenance` | Nextdoor variant: `nextdoor_maintenance_post` |
| P14 | `…/contact/?utm_source=facebook&utm_medium=organic_social&utm_campaign=contact&utm_content=post` | `…/contact/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=contact_button` | |
| P10, P19, P20 | — (brand posts; optional `facebook_contact_post`) | — | No forced CTA |

Profile/channel links (bio fields + video descriptions): Facebook, Instagram, TikTok, YouTube,
LinkedIn, Nextdoor — all tracked per the registry (LinkedIn activated 2026-10-08).

**Attribution operations:** record campaign/UTM per lead in the private lead sheet (OS §12);
form submissions already carry first/latest-touch fields; trust the UTM when present and ask
new callers how they found SCS when it isn't.

---

# 13. LANDING PAGE MAPPING

| Owning page | Posts routed | Why |
| --- | --- | --- |
| `/services/ac-repair-diagnostics/` | P01, P06, P07, P08, P09, P18 | Diagnosis intent |
| `/services/airflow-ductwork/` | P03, P16 | Airflow/static-pressure intent |
| `/services/ac-maintenance/` | P13, P15, P17 | Maintenance intent ($75 per system, per visit) |
| `/services/replacement-installation/` | P02, P04, P05, P11 | Installation/replacement intent |
| `/services/commercial-service-maintenance/` | P12 | Commercial intent |
| `/tab-commissioning-support/` | P12 (cross-link), future Engine B posts | TAB intent |
| `/contact/` | P14 | Conversion support |

**Never route service intent to the homepage.** Internal cross-links per the OS: Repair ↔
Maintenance; Repair ↔ Replacement; Airflow ↔ Replacement; Commercial ↔ TAB.

---

# 14. HOLIDAY STRATEGY

| Date | Post | Approach |
| --- | --- | --- |
| Oct 30 (Fri) | P08 Halloween | Humor with a real lesson (hidden system conditions). No gore, no fear. |
| Nov 24 (Tue) | P10 Thanksgiving | Single-post week; gratitude only; no sales CTA; thank customers and the trade. |
| Dec 8 (Tue) | P17 Before the Holidays | Practical checklist; converts naturally to maintenance. No "book before it's too late" urgency. |
| Dec 15 (Tue) | P18 Worst Christmas Present | Warning-sign awareness; no availability promises or emergency claims. |
| Dec 18 (Fri) | P19 Year close | Standards + gratitude; no ask. |
| Dec 29 (Tue) | P20 Coda | New-year standard; no ask. |

**Rules:** holiday posts still feel like SCS (technical, restrained); no fabricated deadlines,
no "limited slots"; no exploiting weather events.

---

# 15. DAVINCI RESOLVE 19 PRODUCTION NOTES

**Project setup (per format):**
- Vertical (TikTok/Reels/Shorts): **1080×1920, 30 fps**, square pixels; timeline named `SCS-<post>-9x16`.
- Anchor (YouTube): **3840×2160 or 1920×1080, 30 fps**; timeline `SCS-<post>-16x9`.
- Color management: Rec.709 / Gamma 2.4 (SDR). No HDR pipeline needed. iPhone footage: "Rec.709" project setting is fine; use the iPhone's standard (non-HDR) capture setting where possible to avoid tone-mapping artifacts.

**Editing:**
- Cut pacing: verticals 2–4 s per shot; no shot longer than 6 s unless it is a talking close-up.
- Text via **Text+** using **Archivo** (install from `public/fonts/`; SIL OFL). Brand: white `#ffffff`, accent gold `#f4b631`, navy scrim `#203549` at 70–85% for readability.
- Safe areas (9:16): keep text ≥250 px from top, ≥420 px from bottom (TikTok UI), ≥120 px
  each side.
- Captions: burn in with a subtitle track (Fairlight auto-transcribe OK, then correct); white
  with subtle shadow; never full-width paragraphs.
- B-roll: place field clips (`public/videos/*`) as **inserts only** — they are 2–3 s loops.
  Loop them only if a texture beat needs it.

**Audio:**
- Talking videos: natural audio, normalize to about **-14 LUFS integrated** for social
  delivery; light noise reduction only.
- Music (optional): low bed, licensed-free, ducked -18 to -22 dB under speech; no music on
  instructional measurement videos.

**Color:** minimal correction — balance whites, slight contrast +8 to +12, saturation +3 to +5
on equipment shots only; never crush blacks on dark equipment cabinets. Match iPhone clips to
camera footage with the Color page's basic tools only.

**Delivery presets (Resolve 19 built-ins):**
- "YouTube – 1080p" or "2160p" for anchors (H.264, 16–20 Mbps).
- "TikTok 1080p" / custom H.264 9:16 at 10–14 Mbps for verticals.
- Export one **thumbnail frame** per video (grab a clean frame, add 3–5 word Archivo text in
  the still, export PNG 1920×1080).

**Do not** rely on Resolve 21-only features (no AI tools, no newer FX not present in v19).
Keep the edit simple: Edit page, Text+, Fairlight, basic Color. The footage should feel
professional and real — not "produced."

---

# 16. TOP 10 POSTS (ranked)

Scoring 1–5 across nine criteria, total /45.

| Rank | Post | Reach | Authority | Local | Conversion | Visual | Search | Differentiation | Reusability | Commercial | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **P12 Commercial is different** | 3 | 5 | 4 | 4 | 5 | 4 | 5 | 5 | 5 | **40** |
| 2 | **P16 Static pressure** | 4 | 5 | 4 | 3 | 5 | 5 | 4 | 5 | 4 | **39** |
| 3 | **P02 412 microns** | 4 | 5 | 3 | 3 | 5 | 5 | 5 | 4 | 4 | **38** |
| 4 | **P04 The part nobody sees** | 3 | 5 | 3 | 4 | 5 | 4 | 5 | 5 | 4 | **38** |
| 5 | **P07 Three measurements** | 3 | 5 | 3 | 3 | 5 | 4 | 4 | 5 | 4 | **36** |
| 6 | **P03 Filter isn't the airflow story** | 5 | 4 | 4 | 3 | 4 | 5 | 3 | 4 | 3 | **35** |
| 7 | **P05 Before you replace** | 4 | 4 | 4 | 5 | 3 | 5 | 3 | 4 | 3 | **35** |
| 8 | **P01 Thermostat isn't the diagnosis** | 5 | 4 | 4 | 3 | 4 | 4 | 3 | 4 | 3 | **34** |
| 9 | **P13 The dirty coil** | 5 | 3 | 4 | 4 | 5 | 4 | 3 | 3 | 2 | **33** |
| 10 | **P11 Brand ≠ installation** | 3 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 3 | **33** |

**Why the top five:** P12 and P16 are the two posts no local competitor can credibly copy —
real building-level measurement and real static-pressure instrumentation; P02 and P04 show
verification and workmanship most installers cannot evidence; P07 packages the measurement
triad into one shareable carousel.

---

# 17. LEAD-POTENTIAL RANKING

### Residential lead potential
1. **P05 Before you replace** — highest buyer intent; routes to estimates.
2. **P03 Filter/airflow** — high search volume; routes to airflow diagnostics.
3. **P01 Thermostat** — broad no-cool intent; routes to repair diagnostics.
4. **P18 Worst Christmas present / P17 Before the holidays** — seasonal warning-sign posts that convert to service calls and maintenance.
5. **P13 The dirty coil** — maintenance conversion with visual proof.

### Commercial lead potential
1. **P12 Commercial is different** — the Engine B flagship; targets facility/property managers and GCs directly.
2. **P04 The part nobody sees** — GC/contractor credibility; invites scope conversations.
3. **P06 Florida HVAC** — property managers with hot attics and long runtimes.
4. **P02 412 microns** — quality-conscious commercial buyers evaluating installation practices.

### TAB / commissioning lead potential
1. **P12** — building pressure/exhaust/outside air framing; the direct TAB conversation starter.
2. **P16 (LinkedIn adaptation)** — static pressure as the entry drug for system-level work.
3. **P07 (LinkedIn adaptation)** — the measurement triad; positions SCS for verification scopes.

**Reasoning:** lead generation is concentrated in posts that either carry explicit decision
intent (replace/diagnose/maintain) or prove building-level capability (P12). The remainder are
authority and reach assets that make those conversion posts believable.

---

# 18. GAPS

### Media we already have (can publish immediately)
P01 (stills), P02 (stills), P03 (carousel), P05, P06, P07 (carousel), P08, P09, P11, P13
(stills), P14 (carousel), P15, P17 (checklist), P18 — all photo-led posts are ready today.

### Media we should capture (highest value first)
1. **Evacuation/micron video (VID-02)** — the campaign's strongest missing asset; capture at the next install/repair with an evacuation.
2. **Static-pressure walk-and-explain (VID-10)** — the SCS signature measurement.
3. **Commercial walk-through (VID-06)** — roof → building pressure → exhaust, at the next commercial job.
4. **Installation detail capture (VID-04)** — brazing, nitrogen, evacuation, startup during a real install.
5. **Coil cleaning before/after (VID-07)** — maintenance job.
6. **Optional talking heads (VID-01, VID-05, VID-08)** — two to three total; do not over-produce.

### Content we are missing (recommended additions, not invented here)
- **Engine B depth:** dedicated traverse/total-airflow and outside-air/building-pressure posts
  (already scheduled as OS Weeks 10–11 anchors) — promote them into the next social cycle.
- **Humidity** — the OS Week 12 anchor ("clammy house") is a strong social subject not yet in this 20.
- **Maintenance scope walkthrough** — OS Week 5 ($75 visit) — high-value social subject; keep to the documented scope.
- **Reviews as content** — two genuine Google reviews exist; a "what customers say" local post is legitimate and unused.
- **Equipment brands backup notice** — "we service most common residential and light commercial equipment" (approved wording) as a future post.

### Website pages to connect
Owning pages are already connected by design. Additional opportunities:
- Activate **Our Work** by adding genuine project entries to `src/content/projects/` (content
  collection is intentionally empty; the page and nav stay hidden until then) — the campaign's
  best stills could become the first entries. **Owner decision required.**
- Consider a future **Field Proof / media page** referenced from posts (see §19).

### Commercial opportunities
- P12/P04/P16 LinkedIn posts are the organic top-of-funnel; pair each Engine B post with 10–20
  qualified outbound contacts per the OS §14 (prepared `commercial_outreach` and `tab_outreach`
  email links exist in the registry).
- Target facilities visible in the archive (gyms, retail, food-processing commercial work) for
  direct outreach with the matching Field Proof stills.

---

# 19. RECOMMENDED FUTURE WEBSITE IMPROVEMENTS (documented — NOT implemented)

Per task rules, no website changes were made. These are recommendations only:

1. **Activate the projects collection:** add 3–5 genuine project entries (photos + honest
   outcomes) so `/our-work/` goes live and campaign Field Proof can live permanently on the
   site. Owner approval + real jobs required.
2. **Video embedding on owning pages:** once anchors exist, embed the 2–3 strongest on their
   owning pages (the site already has an approved field-clip pattern to reuse).
3. **GBP service-link coverage:** the registry now includes airflow/replacement GBP post links;
   if future GBP posts cover TAB or maintenance-adjacent topics, add matching registry entries
   first (never hand-build).
4. **Campaign landing experiment (paid readiness only):** if paid demand capture ever starts,
   the OS §15 preconditions apply; nothing to build now.

---

# 20. MEASUREMENT AND DECISION RULES

- Record weekly KPIs in `WEEKLY-MARKETING-SCORECARD.md` (production, demand, sales,
  commercial, content quality). Followers are secondary; leads/bookings/revenue are primary.
- Per-post measurement focus: P01/P06/P07/P08/P09/P18 → repair-page sessions + `scs_call_click`
  / `scs_request_click` / form starts; P03/P16 → airflow-page sessions + qualified airflow
  leads; P13/P15/P17 → maintenance bookings by source; P02/P04/P05/P11 → replacement-page
  sessions + estimates issued; P12 → commercial/TAB inquiries + LinkedIn profile visits;
  P10/P19/P20 → engagement/retention only.
- Apply the OS §18 decision rules before changing anything: high views/no leads → sharpen the
  CTA or retarget the topic; clicks/no calls → check the landing page; calls/low booking → fix
  response process; qualified leads from a topic → make more of it.
- At the end of the 10 weeks: **60–70% of the next cycle repeats proven topics/channels,
  30–40% experiments** (OS §20).

---

# 21. MAINTENANCE OF THIS DOCUMENT

- **Never edit generated docs** (`UTM-MASTER-LINKS.*`, `WHERE-TO-PASTE-UTM-LINKS.md`); change
  `src/config/marketing-links.ts` and run `npm run marketing:links`, then `npm run
  marketing:verify`.
- Update post statuses in this file and in the tracker as assets are captured.
- When a new shoot is completed, replace the **NEW CAPTURE** tag with the actual file path in
  the post block and in the media inventory (§5) once imported to the repo.
- Do not add UTMs, claims, pricing, service-area statements, or credentials that are not from
  `src/config/business.ts` and the registry.

**Changelog**
- **2026-10-08** — created from the owner's 20-post campaign; reconciled to the live site
  (service-area wording, pricing, service names, CTAs, landing pages); mapped real media;
  activated the `linkedin_profile` link and added `gbp_airflow_post` /
  `gbp_replacement_post` (registry now 62 links, 0 pending; QR verification exact-match).

