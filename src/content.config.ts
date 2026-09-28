import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Residential + commercial service pages (src/content/services/*.md)
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    metaDescription: z.string(),
    icon: z.enum(['wrench', 'thermometer', 'wind', 'briefcase']),
    order: z.number().int(),
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
]);

const site = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/site' }),
  schema: z.object({
    // SEO — every entry must define these; pages pass them to BaseLayout.
    metaTitle: z.string(),
    metaDescription: z.string(),

    hero: z
      .object({
        eyebrow: z.string(),
        // Either a single heading, or (home only) a split headline:
        // headline + headlineAccent + headlineTail.
        heading: z.string().optional(),
        headline: z.string().optional(),
        headlineAccent: z.string().optional(),
        headlineTail: z.string().optional(),
        lead: z.string(),
        ctaLabel: z.string().optional(),
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
      })
      .optional(),

    // home.md — gold offer band (heading is composed from business.pricing).
    offerBand: z.object({ text: z.string(), linkLabel: z.string() }).optional(),

    // home.md — about + service-area duo section.
    aboutBand: z
      .object({ eyebrow: z.string(), heading: z.string(), blurb: z.string(), linkLabel: z.string() })
      .optional(),
    serviceArea: z
      .object({ eyebrow: z.string(), heading: z.string(), linkLabel: z.string() })
      .optional(),

    // home.md — reviews + final contact sections.
    reviews: z
      .object({ eyebrow: z.string(), heading: z.string(), workLink: z.string().optional() })
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

    // Shared — closing CtaBand copy (about, service-area, tab).
    ctaBand: z
      .object({
        title: z.string(),
        text: z.string().optional(),
        requestLabel: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { services, faqs, projects, reviews, site };
