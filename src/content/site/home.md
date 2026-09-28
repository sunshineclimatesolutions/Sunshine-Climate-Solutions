---
# Homepage copy. Rendered by src/pages/index.astro.
# Rules:
# - Business facts (phone, pricing, counties) are NOT duplicated here — they render
#   from src/config/business.ts.
# - The only token supported is {serviceCall} (replaced from business.pricing).
# - After editing, run `npm run verify`.
metaTitle: Sunshine Climate Solutions | AC Repair & HVAC Service in Tampa Bay
metaDescription: >-
  Owner-operated AC repair, replacement, and HVAC service across Hernando, Pasco,
  Pinellas, and Hillsborough counties. $50 service call, waived with repair. Free
  estimates. Call (727) 661-5200.

hero:
  eyebrow: Sunshine Climate Solutions
  headline: Honest AC repair.
  headlineAccent: Clear answers.
  headlineTail: Local service.
  lead: >-
    Owner-operated heating and cooling service across Tampa Bay and surrounding
    communities. Clear explanations, straightforward options, and a repair-first
    approach when it makes sense.

services:
  eyebrow: Services
  heading: HVAC service for Tampa Bay homes and businesses
  lead: >-
    Repairs come first — and if replacement is genuinely the better call, you’ll
    hear exactly why, with real options and a free estimate.
  tabCard:
    title: Testing, Adjusting & Balancing
    text: >-
      Air and hydronic TAB, duct traverses, outside-air verification, and
      commissioning support for contractors, engineers, and property teams.
    ctaLabel: Request a TAB proposal
  footnote: >-
    We also support contractors with subcontracted installation and overflow work —
    call to talk through scope.

diagnostics:
  eyebrow: Why trust us with your system
  heading: Diagnostics done right — airflow, electrical, control boards
  lead: >-
    Many “dead” systems turn out to be a failed capacitor, a stuck contactor, a
    control-board fault, or an airflow problem nobody actually measured. We find
    the real cause before we recommend anything.
  cards:
    - icon: wind
      title: Airflow and static pressure analysis
      text: >-
        Weak airflow, hot rooms, and humidity trouble usually have measurable
        causes. We check the whole air path, not just the box outside.
    - icon: activity
      title: Electrical and control-board diagnostics
      text: >-
        Control boards, wiring, capacitors, contactors, and sensors — traced
        methodically instead of parts-swapping at your expense.
    - icon: clipboard
      title: Plain-language findings
      text: >-
        You’ll see what we found, what it means, and what your options cost —
        before any work is approved or performed.
    - icon: badge
      title: Owner-operated, EPA Section 608 certified
      text: >-
        You work directly with Aaron — five years of hands-on HVAC experience and
        a repair-first approach that puts the decision in your hands.
  footnote:
    lead: Want the full story?
    linkLabel: More about Aaron and how we work

tabBand:
  eyebrow: For contractors, engineers & property teams
  heading: Testing, adjusting & balancing, and commissioning support
  text: >-
    Air and hydronic TAB, airflow measurement and balancing reports, duct
    traverses, outside-air verification, building-pressure checks, performance
    investigation, and commissioning support within agreed scope.
  note: Project scope and certification requirements are reviewed before acceptance.
  ctaLabel: Request a TAB Proposal
  secondaryLabel: See TAB services

offerBand:
  # The band heading is composed from business.pricing (service call + waiver).
  text: >-
    Free estimates, clear options before any work begins, and hours that fit real
    schedules: 7:30 AM – 7:30 PM, every day.
  linkLabel: or request service online

aboutBand:
  eyebrow: About
  heading: Work directly with the owner
  blurb: >-
    Aaron Thomas started Sunshine Climate Solutions because he was tired of watching
    homeowners get pressured into equipment they didn’t need. With five years of
    hands-on HVAC experience, EPA Section 608 certification, and a repair-first
    approach, you’ll always know what’s going on and what your real options are.
  linkLabel: More about Aaron and our approach

serviceArea:
  eyebrow: Service area
  heading: Proudly serving Tampa Bay
  # The county cards render from business.serviceArea.counties (business.ts).
  linkLabel: See the full service area

reviews:
  eyebrow: Reviews
  heading: Hear it from customers
  workLink: See examples of our work

process:
  eyebrow: What happens next
  heading: What happens after you reach out

final:
  heading: Ready when you are
  lead: >-
    Call, text, or send a request — we’ll confirm availability with you before
    anything is scheduled. Open 7:30 AM to 7:30 PM, every day.
---
