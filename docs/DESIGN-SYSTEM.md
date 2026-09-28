# Design system

Tokens are defined once in `src/styles/tokens.css` and consumed by `src/styles/global.css`.
Change values there only — never hard-code colors/sizes in components.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--c-navy` | `#10263D` | Brand surfaces (header, hero, footer bands), button text on gold |
| `--c-navy-deep` | `#0B1A2B` | Action bar, mobile nav panel, footer background |
| `--c-navy-raised` | `#1B3550` | CTA band surface on navy |
| `--c-gold` | `#F4B631` | Primary accent: CTAs (gold bg + navy text), icon accents, eyebrow text on dark |
| `--c-gold-strong` | `#E9A41B` | Gold hover state, list markers |
| `--c-bg` / `--c-bg-soft` | `#FFFFFF` / `#F4F6F8` | Page and alternating section surfaces |
| `--c-ink` / `--c-ink-soft` | `#14283C` / `#44586C` | Body / muted text on light (muted ≥ 5.9:1 on both surfaces) |
| `--c-on-navy` / `--c-on-navy-soft` | `#FFFFFF` / `#C9D6E3` | Text / muted text on navy (muted ≈ 9:1 on navy) |
| `--c-line` / `--c-line-strong` / `--c-line-navy` | borders on light / inputs / navy surfaces |
| `--c-danger` `#B3261E` / `--c-success` `#1E6B3C` | Validation message colors (both ≥ 4.5:1 on their surfaces) |

Gold is used as an accent or as a button background with navy text (≈ 7.5:1) — never as
small text on light surfaces.

**Eyebrow labels** (small-caps section headings): gold (`--c-gold`) on dark/navy surfaces;
navy (`--c-navy`) on light surfaces (gold at eyebrow size measured 1.97–2.14:1 on
white/soft-gray — below the 4.5:1 WCAG AA minimum, so light surfaces use navy ≈ 13:1).

## Typography

- **Headings:** Archivo (self-hosted variable WOFF2, weights 500–800, latin subset, OFL).
- **Body:** Public Sans (variable WOFF2, weights 400–700, latin subset, OFL).
- Both preload with `font-display: swap`; fallback stack is the native UI sans of the OS.
- Fluid scale (clamp-based): `--text-h1` up to 3.875rem (hero up to 4.375rem), `--text-h2` up
  to 2.375rem, `--text-h3` up to 1.5rem, lead text via `--text-lead`.
- Headings: weight 800, tracking −0.02em, line-height 1.08. Body line-height 1.65.

## Spacing & layout

- Scale: `--sp-3xs` 4px → `--sp-3xl` 96px. Section rhythm: `clamp(2.75rem, 7vw, 5rem)`.
- Containers: `--container` 68rem (default), `--container-narrow` 46rem (prose), gutter
  `clamp(1.25rem, 4vw, 2rem)`.
- Grids use `minmax(min(<min>, 100%), 1fr)` patterns so cards never overflow at any width.

## Radii, borders, shadows, layers

- Radii: `--r-sm` 6 · `--r-md` 10 · `--r-lg` 14 (cards) · `--r-xl` 20 (form card) · full (small
  chips/step numbers only — deliberately no pill-shaped cards).
- Shadows used sparingly: `--sh-sm` (sticky header), `--sh-md` (form card, hover lift),
  `--sh-lg` (reserved).
- Z-index: header 20 → action bar 30 → mobile nav 40 → skip link 50.

## Focus & motion

- Focus: 3px outline, 2px offset — navy on light surfaces, gold on dark
  (`.theme-dark`/`.on-dark` contexts), never removed.
- Motion: 140/240/360ms with `--ease-out`; all motion durations collapse to 0 under
  `prefers-reduced-motion: reduce`, and no content depends on animation or JavaScript.

## Touch & sticky UI

- Buttons ≥ 48px tall (`--sp` based); header/nav targets ≥ 44px.
- Mobile action bar: 3.25rem + `env(safe-area-inset-bottom)`; body reserves matching padding
  so content is never covered; the bar hides while the on-screen keyboard is open.
