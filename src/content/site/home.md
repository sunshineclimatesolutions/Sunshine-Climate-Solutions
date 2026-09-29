---
# Homepage copy. Rendered by src/pages/index.astro.
# Rules:
# - Business facts (phone, pricing, counties) are NOT duplicated here — they render
#   from src/config/business.ts.
# - The only token supported is {serviceCall} (replaced from business.pricing).
# - After editing, run `npm run verify`.
metaTitle: Sunshine Climate Solutions | HVAC Service in Spring Hill & Tampa Bay
metaDescription: >-
  Spring Hill AC repair, installation and $75 maintenance. Serving Hernando,
  Pasco, Pinellas and Hillsborough counties. Call or text Sunshine Climate
  Solutions.

hero:
  headline: Honest HVAC. Expert Diagnostics.
  headlineAccent: Clear Solutions.
  headlineTail: ''
  lead: >-
    Repair-first heating and cooling service, backed by measurement-driven
    diagnostics and straightforward recommendations.

services:
  eyebrow: Services
  heading: HVAC Service for Tampa Bay Homes and Businesses
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
  eyebrow: Why Trust Us With Your System
  heading: Diagnostics Done Right — Airflow, Electrical, Control Boards
  lead: >-
    Many “dead” systems turn out to be a failed capacitor, a stuck contactor, a
    control-board fault, or an airflow problem nobody actually measured. We find
    the real cause before we recommend anything.
  cards:
    - icon: wind
      title: Airflow & Static Pressure
      text: >-
        Weak airflow, hot rooms, and humidity trouble usually have measurable
        causes. We check the whole air path, not just the box outside.
    - icon: activity
      title: Electrical & Control Boards
      text: >-
        Control boards, wiring, capacitors, contactors, and sensors — traced
        methodically instead of parts-swapping at your expense.
    - icon: clipboard
      title: Plain-Language Findings
      text: >-
        You’ll see what we found, what it means, and what your options cost —
        before any work is approved or performed.
    - icon: badge
      title: Owner-Operated & EPA 608 Certified
      text: >-
        Personal service from the owner, hands-on accountability, and a
        repair-first approach built around clear explanations.
  footnote:
    lead: Want the full story?
    linkLabel: More about the owner and how we work

tabBand:
  eyebrow: For Contractors, Engineers & Property Teams
  heading: Testing, Adjusting & Balancing and Commissioning Support
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
  heading: Work Directly With the Owner
  blurb: >-
    Sunshine Climate Solutions was started to end the pressure to buy equipment
    you don’t need. With five years of hands-on HVAC experience, EPA Section 608
    certification, and a repair-first approach, you’ll always know what’s going
    on and what your real options are.
  linkLabel: More about the owner and our approach

serviceArea:
  eyebrow: Service Area
  heading: Proudly Serving Tampa Bay
  # The county cards render from business.serviceArea.counties (business.ts).
  linkLabel: View our service area

reviews:
  eyebrow: Reviews
  heading: Hear It from Customers
  workLink: See examples of our work

process:
  eyebrow: What Happens Next
  heading: What Happens After You Reach Out

final:
  heading: Ready When You Are
  lead: >-
    Call, text, or send a request — we’ll confirm availability with you before
    anything is scheduled. Open 7:30 AM to 7:30 PM, every day.
proof:
  eyebrow: Workmanship
  heading: See the work behind the service
  lead: >-
    From installation details to airflow verification, take a closer look at the
    workmanship and measurements behind our service.
  cards:
    - image: './images/linehide-and-disconnect.jpg'
      alt: 'Refrigerant line-set concealment (line hide) and electrical disconnect installed beside an outdoor unit'
      title: Installation details that matter
      text: 'Line-set concealment and a disconnect installed cleanly beside the outdoor unit.'
      linkLabel: AC installation services
      linkHref: '/services/replacement-installation/'
    - image: './images/custom-ductboard-supply-plenum.jpg'
      alt: 'Custom ductboard supply plenum fitted during an HVAC installation'
      title: Custom Ductboard Supply Plenum
      text: 'A custom ductboard supply plenum, measured, cut and fitted for the installation.'
      linkLabel: Airflow services
      linkHref: '/services/airflow-ductwork/'
    - image: './images/airflow-measurement-at-grille.jpg'
      alt: 'Instrument taking an airflow reading at a supply grille during commercial/TAB field work'
      title: Measurements, not guesswork
      text: 'Field airflow measurement at a supply grille during commercial/TAB work.'
      linkLabel: 'TAB & commissioning support'
      linkHref: '/tab-commissioning-support/'

brands:
  heading: Equipment Brands We Service
  lead: 'Service experience across a range of common HVAC equipment. Call with your system model and issue.'

maintenanceBand:
  title: $75 Premium AC Maintenance
  text: 'Routine coil cleaning, condensate drain flushing, blower-compartment cleaning and a comprehensive system check.'
  ctaLabel: Schedule Maintenance
---
