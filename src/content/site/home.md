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

pricing:
  heading: Pricing, Up Front
  items:
    - price: $75
      title: Premium AC Maintenance
      text: >-
        Per system, per visit — routine coil cleaning, condensate drain flushing,
        blower-compartment cleaning, electrical testing and a full operating
        evaluation.
      linkLabel: More Details
      linkHref: /services/ac-maintenance/
    - price: $0
      title: Service Call When You Proceed With the Repair
      text: >-
        A {serviceCall} service call applies up front — waived when you proceed
        with the repair. Findings and options are explained before any work
        begins.
      linkLabel: Schedule Service
      linkHref: /contact/
    - price: Free
      title: Free Estimates
      text: >-
        Replacement and installation estimates are free — clear written
        options, no obligation and no pressure.
      linkLabel: More Details
      linkHref: /contact/

services:
  eyebrow: Services
  heading: HVAC Service for Tampa Bay Homes & Businesses
  lead: >-
    Repairs come first — and if replacement is genuinely the better call, you’ll
    hear exactly why, with real options and a free estimate.
  servingNote: >-
    service (n.) — the act of serving. When we service your system, we are serving YOU.
  tabCard:
    title: Testing, Adjusting & Balancing
    text: >-
      Air and hydronic TAB, duct traverses, outside-air verification, and
      commissioning support for contractors, engineers, and property teams.
    ctaLabel: Request a TAB proposal

diagnostics:
  eyebrow: Expert Diagnostics
  heading: Why Trust Us With Your System
  lead: >-
    Many systems that won’t run turn out to be a failed capacitor, a stuck
    contactor, a control-board fault, or an airflow problem nobody measured.
    We find the actual cause before we recommend anything — and explain it in
    plain language.
  cards:
    - icon: wind
      title: Airflow & Static Pressure
      text: >-
        Weak airflow, hot rooms, and humidity trouble always have measurable
        causes. We use psychrometrics — the science of air and moisture — to
        find them and correct the real problem.
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
      title: Local Owner-Operator
      text: >-
        You work directly with the owner on every visit — EPA Section 608
        certified, hands-on, and accountable for the result.
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

serviceArea:
  eyebrow: Service Area
  heading: Proudly Serving Spring Hill & Tampa Bay
  # County cards render from business.serviceArea.countyDetails (business.ts).
  linkLabel: View our service area
  hubLinkLabel: HVAC service in Spring Hill

workmanship:
  eyebrow: Workmanship
  heading: Quality Workmanship
  lead: >-
    Sunshine Climate Solutions was founded to serve our community with integrity
    and honor. We take pride in what we do, and it reflects in our consistent
    quality.
  cards:
    - title: Professional AC Installation
      linkHref: /services/replacement-installation/
      text: >-
        Custom plenum work, clean line-set concealment, and pressure-tested
        brazing on every installation.
      images:
        - image: './images/custom-ductboard-supply-plenum.jpg'
          alt: 'Custom ductboard supply plenum measured, cut and fitted during an HVAC installation'
          position: '50% 62%'
        - image: './images/linehide-and-disconnect.jpg'
          alt: 'Refrigerant line-set concealment (line hide) and electrical disconnect installed beside an outdoor unit'
          position: '50% 45%'
        - image: './images/condenser-installation-complete.jpg'
          alt: 'New outdoor condenser unit set and leveled on a concrete pad with refrigerant lines connected'
        - image: './images/nitrogen-purge-during-brazing.jpg'
          alt: 'Nitrogen purge flowing through refrigerant lines during brazing, verified at a flow indicator'
    - title: AC Repair & Diagnostics
      linkHref: /services/ac-repair-diagnostics/
      text: >-
        Gauges, vacuum and measurements first — the cause is found and
        documented before any repair is recommended.
      images:
        - image: './images/refrigerant-gauges-diagnostic.jpg'
          alt: 'Manifold gauges and a vacuum pump connected to an outdoor unit during a diagnostic service call'
        - image: './images/evacuation-micron-gauge.jpg'
          alt: 'Digital vacuum gauge reading 412 microns during system evacuation'
    - title: Testing, Adjusting & Balancing
      linkHref: /tab-commissioning-support/
      text: >-
        Field airflow measurement and room-by-room duct design for balanced air
        where it belongs.
      images:
        - image: './images/airflow-measurement-at-grille.jpg'
          alt: 'Instrument taking an airflow reading at a supply grille during commercial/TAB field work'
          position: '50% 48%'
        - image: './images/duct-design-cfm-layout.jpg'
          alt: 'Hand-drawn duct design layout with room-by-room airflow targets marked in CFM'
          position: '50% 40%'

reviews:
  eyebrow: Reviews
  heading: Hear It from Customers
  note: >-
    Our Google reviews come from real customers after completed service — read
    them at the source, in their own words.
  followLabel: Follow Us
  workLink: See examples of our work

process:
  eyebrow: Our Process
  heading: What Happens Next

final:
  heading: Ready?
  lead: >-
    Call, text, or send a request — we’ll confirm availability with you before
    anything is scheduled. Open 7:30 AM to 7:30 PM, every day.

brands:
  heading: Equipment Brands We Service
  lead: 'Service experience across a range of common HVAC equipment. Call with your system model and issue.'
---
