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
  headline: HVAC Solutions for
  headlineAccent: Every Problem
  headlineTail: ''
  lead: >-
    Locally owned heating, ventilation, and air-conditioning company serving
    Tampa Bay and surrounding counties. Our diagnostics are integral and
    data-driven, our pricing is affordable, and the honor is OURS!
  image: './images/bottling-factory-field-visit.jpg'
  imageAlt: 'The owner in a high-visibility vest walking a commercial bottling facility production line during a field visit'
  imagePosition: '42% 45%'

pricing:
  heading: Competitive Pricing. No Hidden Fees.
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
        proceed with the repair.
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
  servingNote: >-
    Every visit is documented: Photographs before and after, all data, relevant
    reports, including any and all recommendations.
  tabCard:
    title: Testing, Adjusting & Balancing
    text: >-
      Air and hydronic TAB, duct traverses, outside-air verification, and
      commissioning support for contractors, engineers, and property teams.
    ctaLabel: Request a TAB proposal

diagnostics:
  eyebrow: Expert Diagnostics
  heading: Follow the Numbers
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
      title: Refrigerants & Contaminants
      text: >-
        Refrigerant charge and system behavior are checked against real
        readings — and we look for the contaminants and conditions, from
        moisture to dirt and wear, that quietly change how a system performs.
    - icon: badge
      title: The Complete Picture
      text: >-
        No single number tells the whole story. We bring airflow and static
        pressure, electrical and control operation, and refrigerant-system
        condition together — that combined picture is what leads to an accurate
        diagnosis and a recommendation you can act on.
  footnote:
    lead: Want the full story?
    linkLabel: More about the owner
  image: './images/micron-gauge-reading.jpg'
  imageAlt: 'Digital vacuum gauge connected to an outdoor unit service port, reading 412 microns during an evacuation'
  imageCaption: 'Evacuation verified at 412 microns — photographic documentation, every step of the way.'

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
  heading: Quality Workmanship
  lead: >-
    These photographs demonstrate the attention to detail that affects how a
    system performs long after the installation is finished.
  cards:
    - title: Professional AC Installation
      linkHref: /services/replacement-installation/
      images:
        - image: './images/custom-ductboard-supply-plenum.jpg'
          alt: 'Custom ductboard supply plenum measured, cut and fitted during an HVAC installation'
          position: '50% 62%'
        - image: './images/linehide-and-disconnect.jpg'
          alt: 'Refrigerant line-set concealment (line hide) and electrical disconnect installed beside an outdoor unit'
          position: '50% 45%'
        - image: './images/nitrogen-purge-during-brazing.jpg'
          alt: 'Nitrogen purge flowing through refrigerant lines during brazing, verified at a flow indicator'
        - image: './images/condenser-installation-complete.jpg'
          alt: 'Completed outdoor condenser installation set on a concrete pad beside a home'
        - image: './images/condenser-replacement-in-progress.jpg'
          alt: 'Outdoor condenser replacement in progress beside a home during an installation visit'
        - image: './images/copper-bend-air-handler.jpg'
          alt: 'Refrigerant line-set bend fitted to an air handler during an installation'
        - image: './images/installing-line-hide.jpg'
          alt: 'Line-set cover (line hide) being installed on an exterior wall'
        - image: './images/sheet-metal-trunk-hung.jpg'
          alt: 'Sheet-metal trunk duct hung and secured in an attic'
        - image: './images/new-roll-copper-line-set.jpg'
          alt: 'New copper line-set roll staged on site before installation'
        - image: './images/double-45-copper-bend.jpg'
          alt: 'Double 45-degree offset bend formed in a copper line set'
        - image: './images/furnace-install.jpg'
          alt: 'Gas furnace set and connected in a closet during a system installation'
        - image: './images/side-discharge-copper-bend.jpg'
          alt: 'Side-discharge condenser with the copper line set bent and connected'
    - title: AC Repair & Diagnostics
      linkHref: /services/ac-repair-diagnostics/
      images:
        - image: './images/refrigerant-gauges-diagnostic.jpg'
          alt: 'Manifold gauges and a vacuum pump connected to an outdoor unit during a diagnostic service call'
        - image: './images/static-pressure-manometer.jpg'
          alt: 'Digital manometer taking a static-pressure reading at the supply plenum during a diagnostic visit'
        - image: './images/condenser-lineset-detail.jpg'
          alt: 'Close view of refrigerant line-set connections and service valves at an outdoor unit'
        - image: './images/evacuation-micron-gauge.jpg'
          alt: 'Digital vacuum gauge reading 412 microns during system evacuation'
        - image: './images/blower-wheel-condition.jpg'
          alt: 'Blower wheel inspected during service, showing debris from years of return air'
        - image: './images/connector-heat-discoloration.jpg'
          alt: 'Heat discoloration at an electrical plug connection found during diagnostics'
        - image: './images/failed-component-removed.jpg'
          alt: 'Failed electrical component after removal during a repair'
        - image: './images/unit-panel-diagnostics.jpg'
          alt: 'Outdoor unit panel removed with test instruments connected during diagnostics'
        - image: './images/clamp-meter-reading.jpg'
          alt: 'Clamp meter taking an amperage reading at system wiring during diagnostics'
        - image: './images/dirty-coil-detail.jpg'
          alt: 'Close view of a soiled coil photographed during an inspection'
        - image: './images/digital-manifold-readings.jpg'
          alt: 'Digital manifold gauges showing refrigerant-system pressures during a diagnostic visit'
        - image: './images/dirty-condenser-coils.jpg'
          alt: 'Soiled condenser coil photographed during service'
        - image: './images/recovery-machine-reading.jpg'
          alt: 'Refrigerant recovery machine running during service work'
    - title: Testing, Adjusting & Balancing
      linkHref: /tab-commissioning-support/
      images:
        - image: './images/airflow-measurement-at-grille.jpg'
          alt: 'Total building exhaust measured at an exhaust terminal louver during TAB field work'
          position: '50% 48%'
        - image: './images/rooftop-mechanical-equipment.jpg'
          alt: 'Rooftop commercial HVAC equipment with service access panels on a flat roof'
        - image: './images/commercial-rooftop-walkway.jpg'
          alt: 'Rooftop walkway between commercial mechanical units during a TAB visit'
        - image: './images/commercial-rooftop-unit.jpg'
          alt: 'Packaged commercial rooftop unit during a testing and balancing visit'
        - image: './images/commercial-ahu-field-work.jpg'
          alt: 'Commercial air-handling equipment during a TAB field visit'
        - image: './images/equipment-control-wiring.jpg'
          alt: 'Low-voltage control wiring at commercial equipment during a TAB visit'
        - image: './images/building-pressure-manometer.jpg'
          alt: 'Digital manometer taking a building-pressure reading inside a commercial facility'
        - image: './images/metal-duct-interior.jpg'
          alt: 'Interior of a metal duct photographed during system verification'
        - image: './images/psychrometric-measurement-report.jpg'
          alt: 'Psychrometric measurement report from a commercial testing and balancing visit'
        - image: './images/vfd-motor-readings.jpg'
          alt: 'Variable-frequency drive display showing motor operating values at commercial equipment'
        - image: './images/vfd-operating-screen.jpg'
          alt: 'Variable-frequency drive screen showing operating frequency, current and voltage'

reviews:
  eyebrow: Reviews
  heading: Customer Reviews
  followLabel: Follow Us
  workLink: See examples of our work

process:
  eyebrow: Our Process
  heading: What Happens Next

final:
  heading: Ready?
  lead: >-
    Call, text, or send a request — we’ll confirm availability with you before
    anything is scheduled.

brands:
  heading: Equipment Brands We Service
---
