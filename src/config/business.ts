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
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61594915980759',
    nextdoor: 'https://nextdoor.com/page/sunshine-climate-solutions/',
    yelp: 'https://www.yelp.com/biz/sunshine-climate-solutions-brooksville',
  },

  serviceArea: {
    counties: ['Hernando County', 'Pasco County', 'Pinellas County', 'Hillsborough County'],
    summary: 'Tampa Bay and surrounding communities.',
    centralFloridaNote:
      'Central Florida projects are considered depending on scope — call or text to talk it through.',
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
