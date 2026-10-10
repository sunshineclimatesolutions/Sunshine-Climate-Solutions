import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Residential + commercial service pages (src/content/services/*.md)
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Optional SEO title override. Default page title is "<title> in Tampa Bay";
      // use this only where a specific local intent justifies different wording.
      metaTitle: z.string().optional(),
      summary: z.string(),
      metaDescription: z.string(),
      icon: z.enum(['wrench', 'thermometer', 'wind', 'briefcase', 'shield']),
      order: z.number().int(),
      // Optional field-evidence strip (genuine work photos + an optional short
      // muted clip) rendered under the page hero. Captions must describe only
      // what the asset visibly shows.
      evidence: z
        .object({
          photos: z
            .array(
              z.object({
                image: image(),
                alt: z.string(),
                caption: z.string(),
                // Optional focal point for the fixed 4:3 crop.
                position: z.string().optional(),
              }),
            )
            .max(3)
            .default([]),
          clip: z
            .object({
              // Public path to the transcoded MP4 (public/videos/).
              src: z.string(),
              poster: image(),
              caption: z.string(),
            })
            .optional(),
        })
        .optional(),
    }),
});

// FAQ entries (src/content/faqs/*.md)
const faqs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    category: z.enum([
      'pricing',
      'process',
      'service-area',
      'repairs',
      'brands',
      'payments',
      'warranty',
      'communication',
      'commercial',
    ]),
    order: z.number().int().default(99),
  }),
});

// Project portfolio — EMPTY by design. Genuine entries are added by the owner
// (see docs/CONTENT-GUIDE.md). The Our Work page and nav link stay hidden
// until at least one entry exists.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum([
        'residential-repair',
        'residential-installation',
        'airflow-ductwork',
        'diagnostics',
        'commercial',
        'tab',
        'deficiency-findings',
        'other',
      ]),
      city: z.string(),
      summary: z.string().optional(),
      outcome: z.string(),
      photos: z
        .array(
          z.object({
            // Image files live next to the entry (src/content/projects/images/)
            image: image(),
            alt: z.string(),
            label: z.enum(['before', 'after', 'during', 'detail', 'other']).default('other'),
            // Optional focal point for responsive crops — any CSS object-position
            // value, e.g. "center 30%" or "left top". Default: center.
            position: z.string().optional(),
          }),
        )
        .default([]),
      featured: z.boolean().default(false),
      order: z.number().int().default(99),
    }),
});

// Customer reviews/testimonials — EMPTY by design until the owner supplies
// genuine review text. Sections render only when entries exist.
const reviews = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/reviews' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    context: z.string().optional(),
    source: z.enum(['google', 'direct', 'other']).default('direct'),
    order: z.number().int().default(99),
  }),
});

// Editable copy for standalone pages (src/content/site/*.md). One entry per page:
// home.md, about.md, contact.md, service-area.md, tab.md. Page files read their
// entry by id and render the copy from frontmatter; business facts still come
// from src/config/business.ts (never duplicated here).
const siteIconEnum = z.enum([
  'phone',
  'message',
  'mail',
  'calendar',
  'clock',
  'shield',
  'check-circle',
  'check',
  'star',
  'chevron-down',
  'arrow-right',
  'menu',
  'x',
  'map-pin',
  'wrench',
  'wind',
  'briefcase',
  'thermometer',
  'clipboard',
  'alert-circle',
  'activity',
  'badge',
  'sun',
  'flag',
  'share',
  'users',
  'heart',
  'bulb',
  'duct-traverse',
  'pressure-diff',
  'outside-air',
]);

const site = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
    // SEO — every entry must define these; pages pass them to BaseLayout.
    metaTitle: z.string(),
    metaDescription: z.string(),

    hero: z
      .object({
        // Eyebrow intentionally optional: the September 2026 design change
        // order removes the small dashed label above the hero headline.
        eyebrow: z.string().optional(),
        // Either a single heading, or (home only) a split headline:
        // headline + headlineAccent + headlineTail.
        heading: z.string().optional(),
        headline: z.string().optional(),
        headlineAccent: z.string().optional(),
        headlineTail: z.string().optional(),
        // Optional: pages that lead straight into an action (contact) omit it.
        lead: z.string().optional(),
        ctaLabel: z.string().optional(),
        // Optional editorial hero media (home): a large genuine work photograph.
        image: image().optional(),
        imageAlt: z.string().optional(),
        imagePosition: z.string().optional(),
      })
      .optional(),

    // home.md + tab.md — section intro; home adds the custom TAB card + footnote,
    // tab adds the scope-of-work cards grid.
    services: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        lead: z.string().optional(),
        cards: z
          .array(z.object({ icon: siteIconEnum, title: z.string(), text: z.string() }))
          .default([]),
        tabCard: z.object({ title: z.string(), text: z.string(), ctaLabel: z.string() }).optional(),
        // Optional definition-style line under the services heading.
        servingNote: z.string().optional(),
        footnote: z.string().optional(),
      })
      .optional(),

    // home.md — diagnostics strengths section.
    diagnostics: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        lead: z.string(),
        cards: z.array(z.object({ icon: siteIconEnum, title: z.string(), text: z.string() })),
        footnote: z.object({ lead: z.string(), linkLabel: z.string() }).optional(),
        // Optional evidence photograph for the technical authority section.
        image: image().optional(),
        imageAlt: z.string().optional(),
        imageCaption: z.string().optional(),
      })
      .optional(),

    // home.md — dark TAB band after the diagnostics section.
    tabBand: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        text: z.string(),
        note: z.string().optional(),
        ctaLabel: z.string().optional(),
        secondaryLabel: z.string().optional(),
        // Optional field photograph for the full-width TAB band.
        image: image().optional(),
        imageAlt: z.string().optional(),
      })
      .optional(),

    // home.md — service-area section (county/city cards render from business.ts).
    serviceArea: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        linkLabel: z.string(),
        // Optional link to the primary-market city hub (Spring Hill).
        hubLinkLabel: z.string().optional(),
      })
      .optional(),

    // home.md — reviews + final contact sections. `note` is the honest
    // provenance line shown while no genuine review text is published.
    reviews: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        note: z.string().optional(),
        followLabel: z.string().optional(),
        workLink: z.string().optional(),
      })
      .optional(),
    final: z.object({ heading: z.string(), lead: z.string() }).optional(),

    // home.md + contact.md — "process" section heading (Steps component supplies
    // the fixed steps); tab.md uses steps[] for its own TAB process.
    process: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      })
      .optional(),

    // about.md — card titles in the business-info grid.
    infoTitles: z
      .object({
        call: z.string(),
        hours: z.string(),
        area: z.string(),
        pricing: z.string(),
      })
      .optional(),

    // about.md — owner-authored introduction (the largest body heading).
    intro: z
      .object({
        heading: z.string(),
        paragraphs: z.array(z.string()),
      })
      .optional(),

    // about.md — story sections rendered in order (first gets the section anchor id).
    story: z
      .array(
        z.object({
          heading: z.string(),
          paragraphs: z.array(z.string()).default([]),
          list: z.array(z.string()).default([]),
          footnote: z.string().optional(),
        }),
      )
      .optional(),

    // about.md — grouped customer-experience statements (not testimonials).
    experience: z
      .object({
        heading: z.string(),
        intro: z.string(),
        statements: z.array(z.string()),
        closing: z.string(),
      })
      .optional(),

    // about.md — owner/credential facts block (name, role, clean credential list).
    owner: z
      .object({
        name: z.string(),
        role: z.string(),
        credentials: z.array(z.string()),
        footnote: z.string().optional(),
      })
      .optional(),

    // about.md — support-campaign note near the bottom of the page.
    supportNote: z.object({ lead: z.string(), linkLabel: z.string() }).optional(),

    // contact.md — section headings (card bodies interpolate business facts in markup).
    waysHeading: z.string().optional(),
    hoursHeading: z.string().optional(),
    pricingHeading: z.string().optional(),

    // service-area.md — counties list + beyond-the-bay callout.
    counties: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        list: z.array(z.object({ name: z.string(), communities: z.array(z.string()) })),
        // Optional primary-market hub note + link (Spring Hill).
        hubNote: z.string().optional(),
        hubLinkLabel: z.string().optional(),
      })
      .optional(),
    beyond: z.object({ strong: z.string(), suffix: z.string() }).optional(),
    coverage: z.object({ eyebrow: z.string(), heading: z.string(), lead: z.string() }).optional(),

    // tab.md — scope callout under the services grid.
    callout: z.object({ strong: z.string(), text: z.string() }).optional(),

    // leave-review.md — Google review submission page.
    reviewCta: z
      .object({
        buttonLabel: z.string(),
        qrNote: z.string(),
      })
      .optional(),

    // home.md — "Quality Workmanship" section (maximum three cards, each a
    // different work category with a looping photo carousel; factual alt text
    // only, no outcome claims).
    workmanship: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        lead: z.string(),
        cards: z
          .array(
            z.object({
              title: z.string(),
              text: z.string().optional(),
              linkHref: z.string(),
              images: z
                .array(
                  z.object({
                    image: image(),
                    alt: z.string(),
                    // Optional focal point for the fixed 4:3 card crop.
                    position: z.string().optional(),
                  }),
                )
                .min(1)
                .max(14),
            }),
          )
          .max(3),
      })
      .optional(),

    // home.md — three-column pricing strip (maintenance / service call /
    // estimates). Money values render from these strings; business.ts stays
    // the source of truth for the underlying facts.
    pricing: z
      .object({
        heading: z.string(),
        items: z
          .array(
            z.object({
              price: z.string(),
              title: z.string(),
              text: z.string(),
              linkLabel: z.string().optional(),
              linkHref: z.string().optional(),
            }),
          )
          .min(2)
          .max(3),
      })
      .optional(),

    // home.md — equipment brands strip (claims service familiarity only —
    // never dealership, certification or endorsement).
    brands: z
      .object({
        heading: z.string(),
        lead: z.string().optional(),
      })
      .optional(),




    // tab.md — field measurement and system verification photos.
    visuals: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        lead: z.string(),
        photos: z
          .array(
            z.object({
              image: image(),
              alt: z.string(),
              caption: z.string(),
              // Optional focal point for the fixed 4:3 card crop.
              position: z.string().optional(),
            }),
          )
          .max(3),
        // Optional short muted field clip shown with the photos.
        clip: z
          .object({ src: z.string(), poster: image(), caption: z.string() })
          .optional(),
      })
      .optional(),

    // faq.md — educational "conditions we investigate" section. Captions must
    // state only what is visibly shown; no diagnosis, no remediation claim.
    conditions: z
      .object({
        eyebrow: z.string(),
        heading: z.string(),
        lead: z.string(),
        photo: z.object({
          image: image(),
          alt: z.string(),
          caption: z.string(),
          // Optional focal point for the fixed 4:3 card crop.
          position: z.string().optional(),
        }),
        approach: z.string(),
        ctaLabel: z.string(),
      })
      .optional(),

    // Shared — closing CtaBand copy (about, service-area, tab).
    ctaBand: z
      .object({
        title: z.string(),
        text: z.string().optional(),
        requestLabel: z.string().optional(),
      })
      .optional(),

    // spring-hill.md — primary-market location hub (/service-area/spring-hill-fl/).
    // Every claim must stay factual: no fabricated jobs, counts, response times
    // or neighborhood projects (see docs/seo/LOCAL-PAGE-ROADMAP.md).
    cityHub: z
      .object({
        hero: z.object({ heading: z.string(), lead: z.string() }),
        intro: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
        serviceHighlights: z.object({
          heading: z.string(),
          lead: z.string().optional(),
          cards: z.array(
            z.object({
              icon: siteIconEnum,
              title: z.string(),
              text: z.string(),
              linkLabel: z.string(),
              linkHref: z.string(),
            }),
          ),
        }),
        local: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
        communities: z.object({
          heading: z.string(),
          lead: z.string().optional(),
          list: z.array(z.string()),
        }),
        faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
        ctaBand: z.object({ title: z.string(), text: z.string().optional() }),
      })
      .optional(),

    // support.md — /support/ founder-led fundraising page (noindex, direct/
    // referral only). Truthfulness rules: the ~$25,000 founder-investment
    // figure, the $20,000 allocation and the qualifying-arrangement planning
    // estimate are the only financial figures allowed; never fabricate
    // progress, donor counts, testimonials, outcomes, or promises of
    // licensing/revenue. The allocation is owner-approved. Fundraiser URLs
    // come from business.fundraising — never from this content file. Photo
    // captions describe only what each photograph actually shows.
    support: z
      .object({
        hero: z.object({
          headingKicker: z.object({
            before: z.string(),
            linkLabel: z.string(),
            linkHref: z.string(),
            after: z.string(),
          }),
          heading: z.string(),
          paragraphs: z.array(z.string()),
          goalAmount: z.string(),
          goalLabel: z.string(),
          secondaryLinkLabel: z.string(),
          secondaryLinkHref: z.string(),
          portrait: z.object({ image: image(), alt: z.string() }),
        }),
        founderVideo: z.object({
          heading: z.string(),
          description: z.string(),
          pending: z.string(),
        }),
        investment: z.object({
          heading: z.string(),
          subheading: z.string(),
          paragraphs: z.array(z.string()),
          photos: z.array(z.object({ image: image(), alt: z.string() })),
        }),
        budget: z.object({
          heading: z.string(),
          paragraphs: z.array(z.string()),
          allocationLabel: z.string(),
          totalLabel: z.string(),
          items: z.array(z.object({ label: z.string(), amount: z.number().int().positive() })),
          priorities: z.array(z.object({ title: z.string(), text: z.string() })),
          remainingNote: z.string(),
          outcomesNote: z.string(),
          disclosure: z.string(),
        }),
        otherWays: z.object({
          heading: z.string(),
          lead: z.string(),
          items: z.array(
            z.object({
              icon: siteIconEnum,
              title: z.string(),
              text: z.string(),
              actions: z.array(
                z.object({
                  label: z.string(),
                  href: z.string().optional(),
                  behavior: z.enum(['link', 'reviews', 'copy', 'share']).default('link'),
                }),
              ),
            }),
          ),
        }),
        faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
      })
      .optional(),
  }),
});

export const collections = { services, faqs, projects, reviews, site };
