// ─────────────────────────────────────────────────────────────────────────────
// Central marketing link registry — the single source of truth for every
// inbound campaign URL (UTMs) used by Sunshine Climate Solutions.
//
// RULES (enforced by scripts/generate-marketing-links.mjs):
//  - UTMs are for INBOUND marketing links only. Never add them to internal
//    navigation, canonical URLs, sitemap entries, tel:/sms:/mailto: links, or
//    the Google-review QR. The site never forces UTMs to persist.
//  - Lowercase snake_case values only; no spaces, no uppercase, no PII.
//  - No manual Google Ads UTMs: Google Ads must use auto-tagging (gclid /
//    gbraid / wbraid / gad_*), which the site preserves untouched.
//  - Every definition must be unique — duplicate campaign definitions fail
//    verification.
//
// Generated documents (do not edit by hand):
//   docs/marketing/UTM-MASTER-LINKS.md
//   docs/marketing/UTM-MASTER-LINKS.csv
//   docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md
//   public/marketing/qr/*.svg|.png|.png (print)
// ─────────────────────────────────────────────────────────────────────────────

export const siteUrl = 'https://sunshineclimatesolutions.com';

/** Internal destination pages that campaign links may point at. */
export const destinations = {
  home: '/',
  acRepair: '/services/ac-repair-diagnostics/',
  maintenance: '/services/ac-maintenance/',
  replacement: '/services/replacement-installation/',
  airflow: '/services/airflow-ductwork/',
  commercial: '/services/commercial-service-maintenance/',
  tab: '/tab-commissioning-support/',
  contact: '/contact/',
  support: '/support/',
};

export type UtmParams = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

export type MarketingLink = {
  /** Stable, unique id (lowercase snake_case). */
  id: string;
  /** Human channel label (CSV "Channel"). */
  channel: string;
  /** Human campaign label (CSV "Campaign"). */
  campaign: string;
  /** Where the link lives (CSV "Placement"). */
  placement: string;
  /** Internal destination path from `destinations`. */
  path: string;
  utm: UtmParams;
  /** What this link is for (CSV "Purpose"). */
  purpose: string;
  /** True when the owner must place this link/asset outside the repo. */
  manual: boolean;
  /** Exact owner action (CSV "Where Owner Must Paste It"). */
  whereToPaste: string;
  /**
   * Prepared but NOT active: the public profile URL does not exist yet (or is
   * not final). Pending links never appear in the owner "paste this" cheat
   * sheet as ready-to-use — they are listed in a separate PENDING section.
   */
  pending?: boolean;
};

const CHANNEL = {
  gbp: 'Google Business Profile',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  nextdoor: 'Nextdoor',
  yelp: 'Yelp',
  gab: 'Gab',
  linkedin: 'LinkedIn',
  parler: 'Parler',
  bing: 'Bing Places',
  apple: 'Apple Business Connect',
  email: 'Email',
  sms: 'SMS',
  truck: 'Truck QR',
  print: 'Print QR',
  referral: 'Referral card QR',
};

export const marketingLinks: MarketingLink[] = [
  // ── Base channel links (profile/placement level) ──────────────────────────
  {
    id: 'gbp_home',
    channel: CHANNEL.gbp,
    campaign: 'gbp',
    placement: 'Business profile website field',
    path: destinations.home,
    utm: { source: 'google', medium: 'organic', campaign: 'gbp' },
    purpose: 'Identify visits that start from the Google Business Profile listing.',
    manual: true,
    whereToPaste: 'Google Business Profile → Edit profile → Contact → Website field',
  },
  {
    id: 'gbp_contact',
    channel: CHANNEL.gbp,
    campaign: 'gbp',
    placement: 'Appointment/contact link',
    path: destinations.contact,
    utm: { source: 'google', medium: 'organic', campaign: 'gbp', content: 'contact_button' },
    purpose: 'Attribute GBP appointment/contact-link clicks that go straight to the request form.',
    manual: false,
    whereToPaste: 'Prepared link — use for the GBP appointment/contact link.',
  },
  {
    id: 'facebook_profile',
    channel: CHANNEL.facebook,
    campaign: 'profile',
    placement: 'Page website field',
    path: destinations.home,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the Facebook page profile link.',
    manual: true,
    whereToPaste: 'Facebook Page → About → Website',
  },
  {
    id: 'instagram_profile',
    channel: CHANNEL.instagram,
    campaign: 'profile',
    placement: 'Profile website field',
    path: destinations.home,
    utm: { source: 'instagram', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the Instagram profile website link.',
    manual: true,
    whereToPaste: 'Instagram → Edit profile → Website',
  },
  {
    id: 'tiktok_profile',
    channel: CHANNEL.tiktok,
    campaign: 'profile',
    placement: 'Profile website field',
    path: destinations.home,
    utm: { source: 'tiktok', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the TikTok profile website link.',
    manual: true,
    whereToPaste: 'TikTok → Edit profile → Website',
  },
  {
    id: 'youtube_profile',
    channel: CHANNEL.youtube,
    campaign: 'profile',
    placement: 'Channel links / About page',
    path: destinations.home,
    utm: { source: 'youtube', medium: 'organic_video', campaign: 'profile' },
    purpose: 'Identify visits from the YouTube channel links and video descriptions.',
    manual: true,
    whereToPaste: 'YouTube Studio → Customization → Basic info → Links (and video descriptions)',
  },
  {
    id: 'x_profile',
    channel: CHANNEL.x,
    campaign: 'profile',
    placement: 'Profile website field',
    path: destinations.home,
    utm: { source: 'x', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the X profile website link.',
    manual: true,
    whereToPaste: 'X → Edit profile → Website',
  },
  {
    id: 'nextdoor_profile',
    channel: CHANNEL.nextdoor,
    campaign: 'profile',
    placement: 'Business page website field',
    path: destinations.home,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the Nextdoor business page.',
    manual: true,
    whereToPaste: 'Nextdoor business page → Edit → Website',
  },
  {
    id: 'yelp_profile',
    channel: CHANNEL.yelp,
    campaign: 'profile',
    placement: 'Business page website field',
    path: destinations.home,
    utm: { source: 'yelp', medium: 'referral', campaign: 'profile' },
    purpose: 'Identify visits from the Yelp business page (directory referral).',
    manual: true,
    whereToPaste: 'Yelp business page → Edit → Website',
  },
  {
    id: 'gab_profile',
    channel: CHANNEL.gab,
    campaign: 'profile',
    placement: 'Profile website field',
    path: destinations.home,
    utm: { source: 'gab', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the Gab profile website link.',
    manual: true,
    whereToPaste: 'Gab → Edit profile → Links → Website',
  },
  {
    id: 'parler_profile',
    channel: CHANNEL.parler,
    campaign: 'profile',
    placement: 'Profile website field',
    path: destinations.home,
    utm: { source: 'parler', medium: 'organic_social', campaign: 'profile' },
    purpose: 'Identify visits from the Parler profile website link.',
    manual: true,
    whereToPaste: 'Parler → Edit profile → Links → Website',
  },
  {
    id: 'bing_places',
    channel: CHANNEL.bing,
    campaign: 'places',
    placement: 'Business listing website field',
    path: destinations.home,
    utm: { source: 'bing', medium: 'organic', campaign: 'places' },
    purpose:
      'Identify visits from the Bing Places listing once the profile is approved and live.',
    manual: true,
    whereToPaste: 'Bing Places → Business info → Website (after approval)',
  },
  {
    id: 'apple_business_connect',
    channel: CHANNEL.apple,
    campaign: 'business_connect',
    placement: 'Business listing website field',
    path: destinations.home,
    utm: { source: 'apple_maps', medium: 'organic', campaign: 'business_connect' },
    purpose:
      'Identify visits from the Apple Business Connect / Apple Maps listing once approved and live.',
    manual: true,
    whereToPaste: 'Apple Business Connect → Business details → Website (after approval)',
  },
  {
    id: 'linkedin_profile',
    channel: CHANNEL.linkedin,
    campaign: 'profile',
    placement: 'Company Page website field',
    path: destinations.home,
    utm: { source: 'linkedin', medium: 'organic_social', campaign: 'profile' },
    purpose: 'PENDING — LinkedIn Company Page identity verification is not complete.',
    manual: true,
    whereToPaste:
      'PENDING URL — do not paste anywhere until the owner supplies the final public Company Page URL',
    pending: true,
  },
  {
    id: 'email_signature',
    channel: CHANNEL.email,
    campaign: 'signature',
    placement: 'Email signature',
    path: destinations.home,
    utm: { source: 'email', medium: 'email', campaign: 'signature' },
    purpose: 'Identify visits from the company email signature.',
    manual: true,
    whereToPaste: 'Email signature — link the company name to this URL',
  },
  {
    id: 'sms_outreach',
    channel: CHANNEL.sms,
    campaign: 'customer_outreach',
    placement: 'Saved SMS link',
    path: destinations.home,
    utm: { source: 'sms', medium: 'direct_message', campaign: 'customer_outreach' },
    purpose: 'Identify visits from text-message outreach to customers.',
    manual: true,
    whereToPaste: 'Saved SMS reply / messaging shortcut',
  },

  // ── Print / QR channel links (all resolve to the homepage) ───────────────
  {
    id: 'truck_qr',
    channel: CHANNEL.truck,
    campaign: 'vehicle_branding',
    placement: 'Vehicle decal QR',
    path: destinations.home,
    utm: { source: 'truck', medium: 'qr', campaign: 'vehicle_branding' },
    purpose: 'Identify scans from the QR on the work vehicle.',
    manual: true,
    whereToPaste: 'Print public/marketing/qr/truck.svg (or -print.png) onto the vehicle decal',
  },
  {
    id: 'business_card_qr',
    channel: CHANNEL.print,
    campaign: 'business_card',
    placement: 'Business card QR',
    path: destinations.home,
    utm: { source: 'print', medium: 'qr', campaign: 'business_card' },
    purpose: 'Identify scans from the business card QR.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/business-card.svg in the card artwork',
  },
  {
    id: 'door_hanger_qr',
    channel: CHANNEL.print,
    campaign: 'door_hanger',
    placement: 'Door hanger QR',
    path: destinations.home,
    utm: { source: 'print', medium: 'qr', campaign: 'door_hanger' },
    purpose: 'Identify scans from door hangers.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/door-hanger.svg in the hanger artwork',
  },
  {
    id: 'flyer_qr',
    channel: CHANNEL.print,
    campaign: 'flyer',
    placement: 'Flyer QR',
    path: destinations.home,
    utm: { source: 'print', medium: 'qr', campaign: 'flyer' },
    purpose: 'Identify scans from printed flyers.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/flyer.svg in the flyer artwork',
  },
  {
    id: 'yard_sign_qr',
    channel: CHANNEL.print,
    campaign: 'yard_sign',
    placement: 'Yard sign QR',
    path: destinations.home,
    utm: { source: 'print', medium: 'qr', campaign: 'yard_sign' },
    purpose: 'Identify scans from yard signs.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/yard-sign.svg in the sign artwork',
  },
  {
    id: 'referral_card_qr',
    channel: CHANNEL.referral,
    campaign: 'customer_referral',
    placement: 'Referral card QR',
    path: destinations.home,
    utm: { source: 'referral', medium: 'qr', campaign: 'customer_referral' },
    purpose: 'Identify scans from customer referral cards.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/referral-card.svg in the card artwork',
  },

  // ── Service campaigns: organic social posts (Facebook) ───────────────────
  {
    id: 'facebook_ac_repair_post',
    channel: CHANNEL.facebook,
    campaign: 'ac_repair',
    placement: 'Organic post',
    path: destinations.acRepair,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'ac_repair', content: 'post' },
    purpose: 'Attribute Facebook posts that promote AC repair / diagnostics.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_maintenance_post',
    channel: CHANNEL.facebook,
    campaign: 'maintenance',
    placement: 'Organic post',
    path: destinations.maintenance,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'maintenance', content: 'post' },
    purpose: 'Attribute Facebook posts that promote the $75 Premium AC Maintenance visit.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_replacement_post',
    channel: CHANNEL.facebook,
    campaign: 'replacement',
    placement: 'Organic post',
    path: destinations.replacement,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'replacement', content: 'post' },
    purpose: 'Attribute Facebook posts that promote replacement / installation.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_airflow_post',
    channel: CHANNEL.facebook,
    campaign: 'airflow',
    placement: 'Organic post',
    path: destinations.airflow,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'airflow', content: 'post' },
    purpose: 'Attribute Facebook posts about airflow / ductwork.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_commercial_post',
    channel: CHANNEL.facebook,
    campaign: 'commercial_hvac',
    placement: 'Organic post',
    path: destinations.commercial,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'commercial_hvac', content: 'post' },
    purpose: 'Attribute Facebook posts about commercial HVAC service.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_tab_post',
    channel: CHANNEL.facebook,
    campaign: 'tab_commissioning',
    placement: 'Organic post',
    path: destinations.tab,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'tab_commissioning', content: 'post' },
    purpose: 'Attribute Facebook posts about TAB / commissioning support.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'facebook_contact_post',
    channel: CHANNEL.facebook,
    campaign: 'contact',
    placement: 'Organic post',
    path: destinations.contact,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'contact', content: 'post' },
    purpose: 'Attribute Facebook posts that link straight to the request form.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },

  // ── Service campaigns: organic social posts (Nextdoor) ───────────────────
  {
    id: 'nextdoor_ac_repair_post',
    channel: CHANNEL.nextdoor,
    campaign: 'ac_repair',
    placement: 'Organic post',
    path: destinations.acRepair,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'ac_repair', content: 'post' },
    purpose: 'Attribute Nextdoor posts that promote AC repair / diagnostics.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_maintenance_post',
    channel: CHANNEL.nextdoor,
    campaign: 'maintenance',
    placement: 'Organic post',
    path: destinations.maintenance,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'maintenance', content: 'post' },
    purpose: 'Attribute Nextdoor posts that promote the $75 maintenance visit.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_replacement_post',
    channel: CHANNEL.nextdoor,
    campaign: 'replacement',
    placement: 'Organic post',
    path: destinations.replacement,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'replacement', content: 'post' },
    purpose: 'Attribute Nextdoor posts that promote replacement / installation.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_airflow_post',
    channel: CHANNEL.nextdoor,
    campaign: 'airflow',
    placement: 'Organic post',
    path: destinations.airflow,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'airflow', content: 'post' },
    purpose: 'Attribute Nextdoor posts about airflow / ductwork.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_commercial_post',
    channel: CHANNEL.nextdoor,
    campaign: 'commercial_hvac',
    placement: 'Organic post',
    path: destinations.commercial,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'commercial_hvac', content: 'post' },
    purpose: 'Attribute Nextdoor posts about commercial HVAC service.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_tab_post',
    channel: CHANNEL.nextdoor,
    campaign: 'tab_commissioning',
    placement: 'Organic post',
    path: destinations.tab,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'tab_commissioning', content: 'post' },
    purpose: 'Attribute Nextdoor posts about TAB / commissioning support.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },
  {
    id: 'nextdoor_contact_post',
    channel: CHANNEL.nextdoor,
    campaign: 'contact',
    placement: 'Organic post',
    path: destinations.contact,
    utm: { source: 'nextdoor', medium: 'organic_social', campaign: 'contact', content: 'post' },
    purpose: 'Attribute Nextdoor posts that link straight to the request form.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when publishing this post.',
  },

  // ── Service campaigns: email outreach ────────────────────────────────────
  {
    id: 'email_commercial_outreach',
    channel: CHANNEL.email,
    campaign: 'commercial_outreach',
    placement: 'Contractor email',
    path: destinations.commercial,
    utm: { source: 'email', medium: 'email', campaign: 'commercial_outreach', content: 'contractor_email' },
    purpose: 'Attribute commercial / contractor email outreach.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this email.',
  },
  {
    id: 'email_tab_outreach',
    channel: CHANNEL.email,
    campaign: 'tab_outreach',
    placement: 'Contractor email',
    path: destinations.tab,
    utm: { source: 'email', medium: 'email', campaign: 'tab_outreach', content: 'contractor_email' },
    purpose: 'Attribute TAB / commissioning contractor email outreach.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this email.',
  },
  {
    id: 'email_maintenance_outreach',
    channel: CHANNEL.email,
    campaign: 'maintenance_outreach',
    placement: 'Customer email',
    path: destinations.maintenance,
    utm: { source: 'email', medium: 'email', campaign: 'maintenance_outreach', content: 'customer_email' },
    purpose: 'Attribute maintenance reminder emails to existing customers.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this email.',
  },
  {
    id: 'email_replacement_outreach',
    channel: CHANNEL.email,
    campaign: 'replacement_outreach',
    placement: 'Customer email',
    path: destinations.replacement,
    utm: { source: 'email', medium: 'email', campaign: 'replacement_outreach', content: 'customer_email' },
    purpose: 'Attribute replacement / installation follow-up emails.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this email.',
  },
  {
    id: 'email_signature_contact',
    channel: CHANNEL.email,
    campaign: 'signature',
    placement: 'Email signature (contact button)',
    path: destinations.contact,
    utm: { source: 'email', medium: 'email', campaign: 'signature', content: 'contact_button' },
    purpose: 'Attribute signature clicks that go straight to the request form.',
    manual: false,
    whereToPaste: 'Prepared link — use for the signature "Request service" button.',
  },

  // ── Service campaigns: SMS reminders ─────────────────────────────────────
  {
    id: 'sms_ac_repair_reminder',
    channel: CHANNEL.sms,
    campaign: 'ac_repair_reminder',
    placement: 'Saved SMS link',
    path: destinations.acRepair,
    utm: { source: 'sms', medium: 'direct_message', campaign: 'ac_repair_reminder', content: 'sms_link' },
    purpose: 'Attribute SMS reminders that link to AC repair / diagnostics.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this text message.',
  },
  {
    id: 'sms_maintenance_reminder',
    channel: CHANNEL.sms,
    campaign: 'maintenance_reminder',
    placement: 'Saved SMS link',
    path: destinations.maintenance,
    utm: { source: 'sms', medium: 'direct_message', campaign: 'maintenance_reminder', content: 'sms_link' },
    purpose: 'Attribute SMS maintenance reminders.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this text message.',
  },

  // ── Service campaigns: Google Business Profile posts ─────────────────────
  {
    id: 'gbp_ac_repair_post',
    channel: CHANNEL.gbp,
    campaign: 'gbp',
    placement: 'Business profile post',
    path: destinations.acRepair,
    utm: { source: 'google', medium: 'organic', campaign: 'gbp', content: 'post_ac_repair' },
    purpose: 'Attribute GBP posts about AC repair / diagnostics.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this GBP post.',
  },
  {
    id: 'gbp_maintenance_post',
    channel: CHANNEL.gbp,
    campaign: 'gbp',
    placement: 'Business profile post',
    path: destinations.maintenance,
    utm: { source: 'google', medium: 'organic', campaign: 'gbp', content: 'post_maintenance' },
    purpose: 'Attribute GBP posts about the $75 maintenance visit.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this GBP post.',
  },
  {
    id: 'gbp_commercial_post',
    channel: CHANNEL.gbp,
    campaign: 'gbp',
    placement: 'Business profile post',
    path: destinations.commercial,
    utm: { source: 'google', medium: 'organic', campaign: 'gbp', content: 'post_commercial' },
    purpose: 'Attribute GBP posts about commercial HVAC service.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into this GBP post.',
  },

  // ── Service QR links (print assets that point at a service page) ─────────
  {
    id: 'print_ac_repair_qr',
    channel: CHANNEL.print,
    campaign: 'ac_repair',
    placement: 'Print QR to AC repair page',
    path: destinations.acRepair,
    utm: { source: 'print', medium: 'qr', campaign: 'ac_repair' },
    purpose: 'Identify scans from print pieces that point at AC repair / diagnostics.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/ac-repair.svg wherever a repair-specific QR is needed',
  },
  {
    id: 'print_maintenance_qr',
    channel: CHANNEL.print,
    campaign: 'maintenance',
    placement: 'Print QR to maintenance page',
    path: destinations.maintenance,
    utm: { source: 'print', medium: 'qr', campaign: 'maintenance' },
    purpose: 'Identify scans from print pieces that point at the $75 maintenance page.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/maintenance.svg wherever a maintenance-specific QR is needed',
  },
  {
    id: 'print_commercial_qr',
    channel: CHANNEL.print,
    campaign: 'commercial_hvac',
    placement: 'Print QR to commercial page',
    path: destinations.commercial,
    utm: { source: 'print', medium: 'qr', campaign: 'commercial_hvac' },
    purpose: 'Identify scans from print pieces aimed at commercial clients.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/commercial-hvac.svg on commercial print pieces',
  },
  {
    id: 'print_tab_qr',
    channel: CHANNEL.print,
    campaign: 'tab_commissioning',
    placement: 'Print QR to TAB page',
    path: destinations.tab,
    utm: { source: 'print', medium: 'qr', campaign: 'tab_commissioning' },
    purpose: 'Identify scans from print pieces aimed at contractors / TAB clients.',
    manual: true,
    whereToPaste: 'Place public/marketing/qr/tab-commissioning.svg on contractor print pieces',
  },

  // ── Support-page campaigns (fundraiser sharing) ──────────────────────────
  // Inbound links TO /support/ for fundraiser sharing. The external fundraiser
  // destinations themselves are deliberately NOT in this registry — it is the
  // source of truth for inbound links only; the external campaign URLs live in
  // business.fundraising (see src/config/business.ts).
  {
    id: 'facebook_support_post',
    channel: CHANNEL.facebook,
    campaign: 'support',
    placement: 'Fundraiser share post',
    path: destinations.support,
    utm: { source: 'facebook', medium: 'organic_social', campaign: 'support', content: 'post' },
    purpose: 'Attribute fundraiser sharing on Facebook.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when sharing the fundraiser.',
  },
  {
    id: 'instagram_support_post',
    channel: CHANNEL.instagram,
    campaign: 'support',
    placement: 'Fundraiser share post/story',
    path: destinations.support,
    utm: { source: 'instagram', medium: 'organic_social', campaign: 'support', content: 'post' },
    purpose: 'Attribute fundraiser sharing on Instagram.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when sharing the fundraiser.',
  },
  {
    id: 'youtube_support',
    channel: CHANNEL.youtube,
    campaign: 'support',
    placement: 'Founder video description',
    path: destinations.support,
    utm: { source: 'youtube', medium: 'organic_video', campaign: 'support', content: 'video' },
    purpose: 'Attribute the founder video link to the support page.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into the founder video description.',
  },
  {
    id: 'x_support_post',
    channel: CHANNEL.x,
    campaign: 'support',
    placement: 'Fundraiser share post',
    path: destinations.support,
    utm: { source: 'x', medium: 'organic_social', campaign: 'support', content: 'post' },
    purpose: 'Attribute fundraiser sharing on X.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when sharing the fundraiser.',
  },
  {
    id: 'gab_support_post',
    channel: CHANNEL.gab,
    campaign: 'support',
    placement: 'Fundraiser share post',
    path: destinations.support,
    utm: { source: 'gab', medium: 'organic_social', campaign: 'support', content: 'post' },
    purpose: 'Attribute fundraiser sharing on Gab.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when sharing the fundraiser.',
  },
  {
    id: 'parler_support_post',
    channel: CHANNEL.parler,
    campaign: 'support',
    placement: 'Fundraiser share post',
    path: destinations.support,
    utm: { source: 'parler', medium: 'organic_social', campaign: 'support', content: 'post' },
    purpose: 'Attribute fundraiser sharing on Parler.',
    manual: false,
    whereToPaste: 'Prepared link — copy it when sharing the fundraiser.',
  },
  {
    id: 'email_support',
    channel: CHANNEL.email,
    campaign: 'support',
    placement: 'Fundraiser announcement email',
    path: destinations.support,
    utm: { source: 'email', medium: 'email', campaign: 'support', content: 'announcement' },
    purpose: 'Attribute fundraiser announcement emails.',
    manual: false,
    whereToPaste: 'Prepared link — copy it into the fundraiser email.',
  },
];

export type QrAsset = {
  /** File base name under public/marketing/qr/. */
  id: string;
  /** Human label. */
  label: string;
  /** References MarketingLink.id — the QR encodes that link's exact URL. */
  linkId: string;
};

export const qrAssets: QrAsset[] = [
  { id: 'truck', label: 'Truck QR', linkId: 'truck_qr' },
  { id: 'business-card', label: 'Business card QR', linkId: 'business_card_qr' },
  { id: 'door-hanger', label: 'Door hanger QR', linkId: 'door_hanger_qr' },
  { id: 'flyer', label: 'Flyer QR', linkId: 'flyer_qr' },
  { id: 'yard-sign', label: 'Yard sign QR', linkId: 'yard_sign_qr' },
  { id: 'referral-card', label: 'Referral card QR', linkId: 'referral_card_qr' },
  { id: 'ac-repair', label: 'AC repair QR', linkId: 'print_ac_repair_qr' },
  { id: 'maintenance', label: 'Maintenance QR', linkId: 'print_maintenance_qr' },
  { id: 'commercial-hvac', label: 'Commercial HVAC QR', linkId: 'print_commercial_qr' },
  { id: 'tab-commissioning', label: 'TAB / commissioning QR', linkId: 'print_tab_qr' },
];
