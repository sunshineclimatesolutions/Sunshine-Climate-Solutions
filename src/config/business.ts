// ─────────────────────────────────────────────────────────────────────────────
// Central business configuration — Sunshine Climate Solutions
// Single source of truth for every fact the website displays.
// Edit values here; all components and pages read from this file.
// Business facts must stay consistent with the owner's confirmed information.
// ─────────────────────────────────────────────────────────────────────────────

export const business = {
  name: 'Sunshine Climate Solutions',
  legalName: 'Sunshine Climate Solutions LLC',
  url: 'https://sunshineclimatesolutions.com',

  phone: {
    display: '(727) 661-5200',
    href: 'tel:+17276615200',
    sms: 'sms:+17276615200',
    e164: '+1-727-661-5200',
  },

  email: 'owner@sunshineclimatesolutions.com',

  hours: {
    display: '7:30 AM – 7:30 PM',
    days: 'Every day',
    timezone: 'America/New_York',
    schema: { opens: '07:30', closes: '19:30' },
  },

  pricing: {
    serviceCall: '$50',
    serviceCallWaiver: 'waived when you proceed with the repair',
    estimates: 'Free estimates',
  },

  // ─── OWNER INPUT REQUIRED ───────────────────────────────────────────────────
  // Enter the Florida contractor license number EXACTLY as it should be shown
  // publicly (for example: CAC1819888). It renders in the footer on every page
  // and near the top of the About and Contact pages.
  // Keep this EMPTY until the owner provides the verified number — the site
  // intentionally renders no license line while this is blank.
  licenseNumber: '',

  reviewsUrl: 'https://maps.app.goo.gl/5TD44KHGmZymgndh9',
  reviewsLabel: 'Read our Google reviews',
  // Google review SUBMISSION link (QR code destination). Distinct from
  // reviewsUrl above, which only READS existing reviews. Used on /leave-review/
  // and by scripts/generate-review-qr.mjs — never change without regenerating
  // and decode-verifying the QR assets.
  reviewsSubmissionUrl:
    'https://g.page/r/CTXPJRFuZT-tEAE/review?utm_source=gbp&utm_medium=reviews&utm_campaign=qr',

  // Verified social profiles (owner-confirmed URLs). Rendered by
  // SocialLinks.astro (footer, contact, leave-review) and included in the
  // HVACBusiness sameAs structured data — never hard-code these elsewhere.
  // Yelp is a neutral business-directory link only: never solicit Yelp
  // reviews and never add Yelp review-request CTAs.
  // OUTBOUND links only: these are the clean public profile URLs. Never append
  // inbound campaign UTMs here — the tracked website-return links live in
  // src/config/marketing-links.ts and go INSIDE each platform's website field.
  // LinkedIn is the owner-approved public Company Page (supplied 2026-10-07).
  // Empty values are filtered out of the footer and sameAs automatically.
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61594659104196',
    instagram: 'https://www.instagram.com/sunshine_climate_solutions/',
    tiktok: 'https://www.tiktok.com/@sunshineclimatesolutions',
    youtube: 'https://www.youtube.com/channel/UCo4t52rEplKxuGIupnUqWIg',
    x: 'https://x.com/SCS_FL_HVAC',
    nextdoor: 'https://nextdoor.com/page/sunshine-climate-solutions/',
    yelp: 'https://www.yelp.com/biz/sunshine-climate-solutions-brooksville',
    gab: 'https://gab.com/Sunshine_Climate_Solutions',
    parler: 'https://app.parler.com/Sunshine_Climate_Solutions',
    linkedin: 'https://www.linkedin.com/company/sunshine-climate-solutions',
  },

  // Fundraising / support campaigns. These are OUTBOUND contribution
  // destinations, NOT business identity profiles: never add them to
  // business.social, the HVACBusiness sameAs structured data, the inbound UTM
  // registry, or any service-funnel CTA. Rendered only by /support/ (and
  // referenced from the About page's restrained support note and the footer's
  // low-prominence link to /support/). Copy must never imply tax deductibility,
  // equity, repayment, interest, or investment returns — see /support/.
  fundraising: {
    gofundme:
      'https://www.gofundme.com/f/building-an-hvac-company-on-faith-heritage-integrity',
    givesendgo: 'https://www.givesendgo.com/support-american-hvac-in-our-communities',
    // Optional founder video (YouTube). Leave EMPTY until the owner supplies an
    // approved public URL. Until then the support page shows a designed
    // placeholder. Once set to a normal YouTube watch/share link, it becomes a
    // privacy-enhanced click-to-play embed (youtube-nocookie) that loads only
    // when the visitor presses play — never a fake video, empty shell or
    // arbitrary third-party iframe.
    founderVideoUrl: '',
  },

  serviceArea: {
    counties: ['Hernando County', 'Pasco County', 'Pinellas County', 'Hillsborough County'],
    // Home page service-area cards: presentation order and a representative
    // city list per county (home-market cities only, not a coverage limit).
    countyDetails: [
      {
        name: 'Hillsborough County',
        cities: ['Tampa', 'Brandon', 'Plant City', 'Riverview', 'Apollo Beach'],
      },
      {
        name: 'Pinellas County',
        cities: ['St. Petersburg', 'Clearwater', 'Largo', 'Palm Harbor', 'Tarpon Springs'],
      },
      {
        name: 'Hernando County',
        cities: ['Spring Hill', 'Brooksville', 'Weeki Wachee', 'Hernando Beach'],
      },
      {
        name: 'Pasco County',
        cities: ["Land O' Lakes", 'Wesley Chapel', 'New Port Richey', 'Zephyrhills', 'Dade City'],
      },
    ],
    summary: 'Tampa Bay and surrounding communities.',
    centralFloridaNote:
      'Central Florida projects are considered depending on scope. Call or text to talk it through.',
  },

  brands: ['Daikin', 'Carrier', 'Bryant', 'Trane', 'Ruud', 'Rheem', 'Lennox', 'Goodman', 'York'],

  payments: {
    accepted: ['Credit and debit cards', 'Bank transfer (ACH)', 'Checks', 'Cash'],
    arranged: ['PayPal', 'Klarna', 'Cryptocurrency'],
  },

  owner: {
    name: 'Aaron Thomas',
    role: 'Owner / Operator',
  },

  // Web3Forms public access key. This is a client-side submission identifier
  // that is public by design (comparable to an email alias) — it is safe to
  // commit and render in page HTML. Override it with PUBLIC_WEB3FORMS_ACCESS_KEY
  // in the environment (see .env.example) after rotating the key at web3forms.com.
  web3forms: {
    endpoint: 'https://api.web3forms.com/submit',
    accessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? 'c6385a71-df8e-4352-9ba8-99ac3b35f6b5',
  },

  analytics: {
    // Umami Cloud — cookieless aggregate analytics. The website ID is a public
    // client-side identifier rendered in page HTML by design (safe to commit,
    // like the Web3Forms key). Override with PUBLIC_UMAMI_WEBSITE_ID; an empty
    // string disables tracking entirely.
    // RULE: events carry fixed names only — never send form contents, phone
    // numbers, names or any personal information to analytics.
    umami: {
      websiteId:
        import.meta.env.PUBLIC_UMAMI_WEBSITE_ID ?? '2635b6ca-2d10-4742-8838-9e6ec879a5a7',
    },

    // Google Tag Manager container that loads Google Analytics 4 (the GA4
    // measurement ID G-EQ9CBESN23 is configured INSIDE the container — the site
    // never loads gtag.js directly). Public client-side identifier, safe to
    // commit like the Umami site ID. Override with PUBLIC_GTM_CONTAINER_ID; an
    // empty string disables GTM and the consent interface entirely.
    // Consent Mode v2 defaults are denied and only the visitor's explicit
    // analytics choice is ever granted (see ConsentBanner.astro).
    gtm: {
      containerId: import.meta.env.PUBLIC_GTM_CONTAINER_ID ?? 'GTM-MBGJ8SLD',
    },
  },

  flags: {
    // Keep prominent financing promotion DISABLED until Klarna merchant
    // availability is confirmed by the owner. Payment options are stated
    // factually in the FAQ and footer instead.
    financingPromo: false,
  },
};

export function licenseDisplay(): string {
  return business.licenseNumber ? `Licensed ${business.licenseNumber}` : '';
}

export function isFormEnabled(): boolean {
  return Boolean(business.web3forms.accessKey);
}
