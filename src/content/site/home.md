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
  headline: Know what's wrong.
  headlineAccent: Then decide what to do.
  headlineTail: ''
  lead: >-
    Locally owned heating and cooling for Spring Hill and Tampa Bay. We diagnose
    the system, show you what we found, and lay out the options — then you decide.
  image: './images/condenser-installed-pad.jpg'
  imageAlt: 'Completed outdoor condenser unit set and leveled on a concrete pad beside a home, with refrigerant lines connected and the service cart on site'
  imagePosition: '68% 58%'

pricing:
  heading: Pricing, Up Front
  items:
    - price: $75
      title: Premium AC Maintenance
      text: >-
        A scheduled maintenance visit for a system that's running: routine coil
        cleaning, condensate drain flushing, blower-compartment cleaning,
        electrical testing, and a full operating evaluation. Per system, per
        visit.
      linkLabel: More Details
      linkHref: /services/ac-maintenance/
    - price: $0
      title: Service Call When You Proceed With the Repair
      text: >-
        A {serviceCall} service call applies up front and is waived when you
        proceed with the repair. You hear the findings and the price before any
        work begins.
      linkLabel: Schedule Service
      linkHref: /contact/
    - price: Free
      title: Free Estimates
      text: >-
        For replacement or installation planning: free written estimates,
        itemized, with the scope of work spelled out. No obligation.
      linkLabel: More Details
      linkHref: /contact/

services:
  eyebrow: Services
  heading: HVAC Service for Tampa Bay Homes & Businesses
  lead: >-
    Repairs come first. If replacement is genuinely the better call, you'll hear
    why, with the options and price in writing.
  servingNote: >-
    Every visit is documented: what was measured, what was found, and what we
    recommend.
  tabCard:
    title: Testing, Adjusting & Balancing
    text: >-
      Air and hydronic TAB, duct traverses, outside-air verification, and
      commissioning support for contractors, engineers, and property teams.
    ctaLabel: Request a TAB proposal

diagnostics:
  eyebrow: Expert Diagnostics
  heading: How We Find the Actual Cause
  lead: >-
    Many systems that won't run turn out to be a failed capacitor, a stuck
    contactor, a control-board fault, or an airflow problem nobody measured.
    We find the actual cause before we recommend anything, and back it with
    readings you can see.
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
      title: Findings in Writing
      text: >-
        You'll see what was measured, what it means, and what each option
        costs — before any work is approved.
    - icon: badge
      title: Local Owner-Operator
      text: >-
        You work directly with the owner on every visit — EPA Section 608
        certified, hands-on, and accountable for the result.
  footnote:
    lead: Want the full story?
    linkLabel: More about the owner and how we work
  image: './images/micron-gauge-reading.jpg'
  imageAlt: 'Digital vacuum gauge connected to an outdoor unit service port, reading 412 microns during an evacuation'
  imageCaption: 'Evacuation verified at 412 microns — documented, not guessed.'

tabBand:
  eyebrow: For Contractors, Engineers & Property Teams
  heading: Testing, Adjusting & Balancing and Commissioning Support
  text: >-
    Air and hydronic TAB, airflow measurement and balancing reports, duct
    traverses, outside-air verification, building-pressure checks, performance
    investigation, and commissioning support within agreed scope.
  ctaLabel: Request a TAB Proposal
  secondaryLabel: See TAB services
  image: './images/rooftop-mechanical-equipment.jpg'
  imageAlt: 'Rooftop commercial HVAC equipment with service access panels on a flat roof'

serviceArea:
  eyebrow: Service Area
  heading: Proudly Serving Spring Hill & Tampa Bay
  # County cards render from business.serviceArea.countyDetails (business.ts).
  linkLabel: View our service area
  hubLinkLabel: HVAC service in Spring Hill

workmanship:
  eyebrow: Workmanship
  heading: What the Work Looks Like
  lead: >-
    These photographs are from our jobs. They show the details that affect how a
    system performs long after the installation is finished.
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
        - image: './images/package-unit-install.jpg'
          alt: 'Packaged rooftop-style unit set and connected at a residential service, with the supply transition sealed and secured'
        - image: './images/nitrogen-purge-during-brazing.jpg'
          alt: 'Nitrogen purge flowing through refrigerant lines during brazing, verified at a flow indicator'
    - title: AC Repair & Diagnostics
      linkHref: /services/ac-repair-diagnostics/
      text: >-
        Capacitors, controls, and refrigerant work: the cause is confirmed
        first, and the repair is documented.
      images:
        - image: './images/refrigerant-gauges-diagnostic.jpg'
          alt: 'Manifold gauges and a vacuum pump connected to an outdoor unit during a diagnostic service call'
        - image: './images/static-pressure-manometer.jpg'
          alt: 'Digital manometer taking a static-pressure reading at the supply plenum during a diagnostic visit'
        - image: './images/condenser-lineset-detail.jpg'
          alt: 'Close view of refrigerant line-set connections and service valves at an outdoor unit'
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
  lead: 'We service and install most common residential and light commercial equipment. Call or text with your system model and what it''s doing.'
---
