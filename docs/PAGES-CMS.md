# Editing your website with Pages CMS

Pages CMS is a visual editor that saves changes straight to your GitHub repository — the same
files a developer would edit. There is no separate database: GitHub *is* the database, and
every edit is a commit you can see (and revert) in the repository's history.

## One-time setup (owner, ~5 minutes)

1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
   - Sign in with the **sunshineclimatesolutions** account (the one that owns the repository).
2. Install the Pages CMS **GitHub App** when prompted. Choose the `sunshineclimatesolutions`
   organization and grant it access to the **Sunshine-Climate-Solutions** repository.
3. Back in Pages CMS, open the repository. It reads `.pages.yml` (already in this repo) and
   shows the editors described below.

> Until you approve the merge, open the branch **`pages-cms`** in Pages CMS (branch selector
> at the top) — that is where this configuration lives. After merging to `main`, use `main`.

## What you can edit

| Editor | What it controls | Where it lives |
| --- | --- | --- |
| **Pages → Homepage** | Hero headline/text/photo, services intro, about excerpt, final section text, SEO title & description | `src/content/site/home.md` |
| **Pages → About page** | The full About story (why the company exists, how we work, Aaron's background), SEO | `src/content/site/about.md` |
| **Pages → TAB page** | Intro text + SEO | `src/content/site/tab.md` |
| **Pages → Contact page** | Intro text + SEO | `src/content/site/contact.md` |
| **Services** | Add/edit service pages (title, summary, details, SEO, card icon) | `src/content/services/*.md` |
| **FAQs** | Add/edit questions and answers, organized by category | `src/content/faqs/*.md` |
| **Customer reviews** | Add genuine reviews (quote, name, context, source) | `src/content/reviews/*.md` |
| **Our work projects** | Add genuine projects with photos (before/after, labels, story, verified outcome) | `src/content/projects/*.md` |
| **Photos (media library)** | Upload, replace, and manage all photographs | `public/images/` |

## How an edit becomes live

1. You click **Save** in Pages CMS → it commits the change to GitHub.
2. If the edit is on the branch your Cloudflare Pages project builds (currently `main`), the
   site rebuilds automatically and goes live in a couple of minutes. (Edits on `pages-cms`
   stay on that branch until you approve the merge.)
3. If something looks wrong, every change is reversible: GitHub → repository → commits →
   **Revert** (or ask your engineer).

## Photos: practical tips

- Upload web-sized photos (roughly 1200–1600px wide, JPG/PNG/WebP). The CMS will keep
  filenames URL-safe automatically.
- For project photos, fill in the optional **width/height** fields (right-click the file →
  Properties/Get info) — it prevents the page from shifting while photos load.
- Every photo needs **alt text** — describe what the photo shows ("Condenser replaced on a
  concrete pad in Trinity"). Good alt text is required for accessibility and helps search.
- For before/after pairs, label one photo `before` and the next one `after`; the site shows
  them side by side with visible labels.
- Never publish a customer's street address, full name without permission, or anything you
  wouldn't want public. Only genuine photos of real jobs.

## Rules baked into the editors

- Page editors for Homepage/About/TAB/Contact can't be created or deleted — only edited.
- The review and project editors include reminders, but honesty is enforced by you:
  **no fabricated reviews, photos, projects, prices, or credentials.** The site (and Google)
  trust that everything published is real.
- Business facts — phone number, hours, pricing, counties, license number — are deliberately
  **not** in the CMS. They live in `src/config/business.ts` so they stay consistent on every
  page. Changing them is a one-line edit (ask your engineer, or see `docs/CONTENT-GUIDE.md`).

## What "SEO title" and "SEO description" do

They become the page's `<title>` and meta description — what Google shows in search results.
Keep titles under ~60 characters and descriptions under ~160, keep them specific, and don't
stuff them with repeated city names; the site already handles the technical SEO (canonical
URLs, sitemap, structured data) automatically.

## Troubleshooting

- **The CMS shows an old version of a page:** check the branch selector (top of Pages CMS)
  and make sure you're on the branch you intend to edit.
- **The site didn't update after saving:** look at the repository's commit history — if the
  commit is there, the build/deployment is the next step (Cloudflare Pages dashboard).
- **A build failed after an edit:** the most common cause is a required field left empty
  (for example a missing SEO description). Fill it in and save again; the error message in
  the Cloudflare Pages build log will name the file.
