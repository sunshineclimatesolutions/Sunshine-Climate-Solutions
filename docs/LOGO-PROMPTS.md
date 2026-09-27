# Logo generation prompts (Ideogram — free hosted generator)

The current SCS mark in `public/brand/logo.svg` + `src/components/Logo.astro` is a **provisional**
typographic monogram. Generate a final concept with the prompts below, then send the chosen
image to your engineer (or paste the requirements into any converter) to integrate.

Rules baked into every prompt: readable S C S letters, original strong geometry, balanced
spacing, max two solid colors (navy #10263D + gold #F4B631), flat background, no mockups,
shadows, gradients, 3D, clipart, tiny decoration, or imitation of an existing brand. One
concept per image. Must stay legible for embroidery, truck graphics, web headers, and small
avatars. The symbol is generated separately — final "Sunshine Climate Solutions" typography is
applied afterward, not generated.

## Prompt 1 — Angular interlocking SCS with restrained airflow negative space

```
Flat vector logo symbol, three bold angular interlocking letters S C S, custom geometric
sans-serif letterforms with sharp 45-degree cuts, the letters connected by shared vertical
strokes, subtle airflow channel carved through the negative space between the letters as a
single clean horizontal current, maximum of two solid colors: dark navy #10263D letters and
gold #F4B631 current, solid flat white background, centered, generous clear space, high
contrast, crisp edges, no gradients, no shadows, no 3D, no mockups, no extra decoration, no
text besides the three letters S C S, designed to remain readable at small avatar size and
suitable for embroidery on work shirts and truck graphics
```

## Prompt 2 — Architectural SCS with subtle solar geometry

```
Flat vector logo symbol, three letters S C S built from architectural drafting geometry,
letterforms constructed with drafting-compass precision, a single restrained gold circle arc
passing behind the letters suggesting a sun rising over a horizon line integrated into the
baseline, maximum two solid colors: dark navy #10263D and gold #F4B631, flat solid white
background, balanced optical spacing between letters, strong simple silhouette, no gradients,
no shadows, no 3D render, no mockups, no clipart details, no letters other than S C S, must
scale cleanly from website header to small avatar and embroidery
```

## Prompt 3 — Strong horizontal SCS with controlled directional motion

```
Flat vector logo symbol, three wide bold letters S C S arranged on one strong horizontal axis,
the final S extended into a controlled horizontal motion stroke suggesting steady airflow,
stroke terminals cut square and confident, maximum two solid colors: dark navy #10263D letters
with one gold #F4B631 motion stroke, flat solid white background, even letter spacing, simple
memorable silhouette readable at a glance, no gradients, no shadows, no 3D, no mockups, no
tiny decorative elements, no text besides the letters S C S, suitable for web headers, truck
graphics, and embroidered patches
```

## After you choose a concept

1. Send the generated image to your engineer. If it is reconstructed as SVG, the letterforms
   will be inspected for fidelity and readability — a raster image (PNG/JPG) embedded in an
   SVG is **not** true vector art, and automatic "vectorization" is not professional
   vectorization.
2. It will replace `public/brand/logo.svg`, the mark in `src/components/Logo.astro`, and
   `public/favicon.svg`, then `scripts/generate-brand-images.mjs` regenerates
   `public/brand/icon-180.png`, `icon-512.png`, and `og-default.png`.
3. The final "Sunshine Climate Solutions" wordmark typography is applied in code (real HTML
   text), so only the symbol needs to come from the generator.
