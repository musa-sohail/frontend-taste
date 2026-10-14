# Typography

Type does more than color to make a page look designed. Rules:

- **Two families max** (display + text). A third is allowed only for mono or numerals.
- **Never default to Inter/Roboto/Arial for everything.** These fonts are fine, but using them everywhere marks a page as a template. Pick the pairing for the palette's `fonts` id below.
- **Load 2–4 weights in total**, not the full family. Always use `display=swap` and `preconnect`.
- **Make headings tight and body text loose.** Headings use line-height 1.05–1.2 and letter-spacing −0.01 to −0.03em. Body text uses line-height 1.55–1.7.
- **Keep body text at 16px or larger** (17–18px reads better on content sites). Keep line length to 60–75 characters with `max-width: 65ch`.
- **Contrast in scale:** The h1 should be at least 2.5× the size of body text on desktop. Timid type scales look amateur.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Use `font-variant-numeric: tabular-nums` for prices, stats, tables, and timers.

## Pairings

Each id matches the `fonts` field in `assets/palettes.json`.

| id | Display (headings) | Text (body/UI) | Feel | Good for |
|---|---|---|---|---|
| `scholarly-warm` | **Fraunces** 600/700 (opsz, soft) | **Figtree** 400/500/600 | warm, literate, optimistic | schools, libraries, tutoring, publishers |
| `institutional-serif` | **Source Serif 4** 600/700 | **IBM Plex Sans** 400/500/600 | serious, credible, established | universities, law, consulting, government |
| `playful-rounded` | **Fredoka** 600/700 | **Nunito** 400/600/800 | friendly, bouncy, safe | preschool, kids, toys, camps |
| `accessible-clean` | **Lexend** 600/700 | **Source Sans 3** 400/600/700 | clear, calm, inclusive | healthcare, public services, accessibility-first |
| `product-geometric` | **Geist** 600/700 | **Geist** 400/500 + **Geist Mono** 400 | precise, technical | SaaS, devtools, fintech, AI |
| `warm-serif` | **Young Serif** 400 | **Instrument Sans** 400/500/600 | appetizing, crafted, homey | restaurants, cafés, bakeries, farms |
| `bold-condensed` | **Anton** 400 (uppercase) | **Archivo** 400/500/700 | loud, athletic, industrial | gyms, sports, construction, trades |
| `elegant-light` | **Cormorant** 500/600 (italic for accents) | **Jost** 300/400/500 | serene, airy, refined | spa, yoga, wellness, skincare |
| `luxury-serif` | **Bodoni Moda** 500/600 | **Manrope** 400/500/600 | high-contrast, aspirational | fashion, jewelry, real estate, hotels |
| `humanist-friendly` | **Bricolage Grotesque** 600/800 | **Nunito Sans** 400/600/700 | human, hopeful, characterful | nonprofits, travel, community |
| `editorial-grotesk` | **Instrument Serif** 400 (+italic) | **Inter Tight** 400/500/600 | editorial, crafted, confident | portfolios, agencies, magazines |
| `startup-grotesk` | **Plus Jakarta Sans** 700/800 | **Plus Jakarta Sans** 400/500 | fresh, modern, approachable | consumer apps, landing pages, edtech |
| `display-futurist` | **Unbounded** 600/800 | **Space Grotesk** 400/500 | electric, wide, nocturnal | gaming, events, music, esports |

### Google Fonts links (copy exactly)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

| id | `<link href="…">` |
|---|---|
| scholarly-warm | `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Figtree:wght@400;500;600&display=swap` |
| institutional-serif | `https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap` |
| playful-rounded | `https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;600;800&display=swap` |
| accessible-clean | `https://fonts.googleapis.com/css2?family=Lexend:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap` |
| product-geometric | `https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400&display=swap` |
| warm-serif | `https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:wght@400;500;600&display=swap` |
| bold-condensed | `https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;700&display=swap` |
| elegant-light | `https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap` |
| luxury-serif | `https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&family=Manrope:wght@400;500;600&display=swap` |
| humanist-friendly | `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Nunito+Sans:wght@400;600;700&display=swap` |
| editorial-grotesk | `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&display=swap` |
| startup-grotesk | `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap` |
| display-futurist | `https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Space+Grotesk:wght@400;500&display=swap` |

Always give a fallback stack that has similar metrics:

```css
--font-display: "Fraunces", ui-serif, Georgia, serif;
--font-text: "Figtree", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
```

## Fluid type scale (ratio ≈ 1.25 mobile → 1.333 desktop)

Paste this and only use these steps. Don't invent ad-hoc font sizes.

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.90rem);   /* captions, meta */
  --step-0:  clamp(1.00rem, 0.96rem + 0.20vw, 1.125rem);  /* body */
  --step-1:  clamp(1.25rem, 1.16rem + 0.45vw, 1.50rem);   /* h4, lead */
  --step-2:  clamp(1.56rem, 1.40rem + 0.80vw, 2.00rem);   /* h3 */
  --step-3:  clamp(1.95rem, 1.66rem + 1.45vw, 2.67rem);   /* h2 */
  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 3.55rem);   /* h1 (inner pages) */
  --step-5:  clamp(3.05rem, 2.20rem + 4.20vw, 5.30rem);   /* hero display */
}
h1, h2, h3 { font-family: var(--font-display); line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
p, li { text-wrap: pretty; }
.eyebrow { font: 600 var(--step--1)/1 var(--font-text); letter-spacing: .12em; text-transform: uppercase; color: var(--primary); }
.lead { font-size: var(--step-1); color: var(--muted); max-width: 52ch; }
```

## Details that signal craft

- **Eyebrow label** above section headings: small, uppercase, tracked, in primary color. Use one per section at most.
- **Accent word in the headline:** Set one word in italic display, in the accent color, or with a hand-drawn SVG underline. Do this once per page, in the hero.
- **Typographic numerals:** Set big stats ("1,200+ students", "98% pass rate") at `--step-4` in the display face with tabular-nums. Add a small muted label below.
- **Use ALL CAPS only with tracking** (≥ 0.06em) and only on short labels.
- **Never justify text on the web.** Never center body paragraphs longer than 2 lines.
- **Watch for quirky numerals.** Atkinson Hyperlegible and many mono fonts draw slashed zeros ("2Ø09"). That's fine in code and data UIs but wrong for marketing copy, prices, and dates.
- **Optical sizes:** Fraunces, Bodoni Moda, Source Serif 4, and Bricolage support `opsz`. Use `font-optical-sizing: auto`.
