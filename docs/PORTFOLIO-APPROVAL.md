---
# PORTFOLIO APPROVAL — draft, not publicly served

Working document for the photography/proof milestone (branch `portfolio-conversion-proof`).
One row per selected photograph or proposed project. **Nothing here is published until the
owner marks it `approved` and the branch is merged.** Never fill a field by guessing — a
missing fact is a `needs-info` or `hold`, not an invented value.

## Selected photographs (implemented on the branch, pending approval)

| # | File | Proposed placement | Work by SCS? | Ownership/permission | What the photo shows (visible fact only) | Documented result | Same-job pair? | Privacy | Decision |
|---|------|--------------------|--------------|----------------------|------------------------------------------|-------------------|----------------|---------|----------|
| 1 | `linehide-and-disconnect.jpg` | Home proof card 1 → AC installation services | needs-info | owner-supplied; needs owner confirm | Line-set concealment + disconnect beside outdoor unit | none claimed | n/a | check for house identifiers | **needs-info** |
| 2 | `custom-ductboard-supply-plenum.jpg` | Home proof card 2 → airflow services | needs-info | owner-supplied; needs owner confirm | Custom ductboard supply plenum, measured, cut and fitted (owner-corrected: not sheet metal) | none claimed | n/a | check for identifiers | **needs-info** |
| 3 | `airflow-measurement-at-grille.jpg` | Home proof card 3 + TAB page | needs-info | owner-supplied; needs owner confirm | Instrument taking an airflow reading at a grille | no reading/outcome claimed | n/a | none apparent | **needs-info** |
| 4 | `rooftop-mechanical-equipment.jpg` | TAB page visuals | needs-info | **site permission required** | Rooftop mechanical equipment | none claimed | n/a | possible site-identifying details | **needs-info** |
| 5 | `dirty-coil-detail.jpg` | FAQ "conditions" section | needs-info | owner-supplied; needs owner confirm | Visibly soiled coil during an inspection | none claimed (educational only) | n/a | none apparent | **needs-info** |

## Explicit holds (no placement without owner facts)

| Item | Reason | Required from owner |
|------|--------|---------------------|
| `03_possible_before_after/before-return-adjustment-meter.jpg` + `01_residential/after-return-addition-meter.jpg` | Cannot present as a measured improvement | Same job? Same measurement port/location? Same operating conditions? Units? Chronological order? Actual values? |
| `04_problem_examples_review/existing-duct-condition-01..04.jpg` | Owner must identify the actual visible issue | Which photos are yours; what is the specific condition shown (neutral wording) |
| `04_problem_examples_review/ceiling-staining-near-vent.jpg` | Appearance is not evidence of cause | Only publish if needed, with neutral caption (never "mold") |
| `05_hold_unpublished/*` (3 files) | Ownership/permission unverified; low resolution | Affirmative provenance + license confirmation to use |
| Calibration certificates (IMG_6704/6705) | Possible printed identifiers | Never publish — confirmed |
| Original airflow sketch | Not supplied | Owner will provide the original locally; previous AI redraws are not used |
| `Google-Review-Symbol.png` | Official-mark status unverified | Confirm it is the permitted official asset, or keep the current star icon (current status: not used) |

## Proposed project case studies — awaiting owner facts

The `projects` schema requires `city` and `outcome`; both must come from the owner. Suggest
starting with 2–4 distinct jobs. For each: precise title, city, the situation, what was
performed, what was checked (and result only if documented).

| Draft slot | Minimum facts needed |
|-----------|---------------------|
| Residential installation (photos 1/2 candidates) | city; work performed; what was verified afterwards |
| Commercial/TAB activity (photos 3/4 candidates) | scope performed; city/site type (if disclosable); report/deliverable actually produced |
| Condition investigation (photo 5 candidate) | what was found, what was recommended/done |

**Schema note (needs approval before use):** if a genuine job is publishable but has no
documented post-job result, we propose a small schema adaptation — `outcome` becomes optional
and the detail page renders a "Work shown" section instead of "Verified outcome". Not
implemented yet; requires owner approval.

## Small questionnaire (answer only what you can)

1. **Contact sheet** (`docs/verification/screenshots/contact-sheet-selected-photos.jpg`):
   approve the five placements/crops, or tell me which to swap/remove?
2. **Rooftop photo** — is it your work, and may it be published (site permission)?
3. **Dirty-coil photo** — is it your photo, and is the coil the indoor evaporator or the
   outdoor condenser (for a precise caption)? If unsure, the current caption stays generic.
4. **Meter pair** — same job, same port, same conditions, same units, before → after?
   If yes: the actual readings to display. If no: they stay unpublished.
5. **Duct-condition photos (4 files)** — pick 0–2 you can describe factually; give the
   specific visible condition in a few words.
6. **Project stories** — the 2–4 jobs above (city + what was done + what was checked).
7. **Google review mark** — official permitted asset, or keep the current star icon?
