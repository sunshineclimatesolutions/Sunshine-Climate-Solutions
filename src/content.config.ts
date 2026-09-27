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

export const collections = { services, faqs, projects, reviews };
