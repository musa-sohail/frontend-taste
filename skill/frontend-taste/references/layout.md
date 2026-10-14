# Layout, responsiveness & page recipes

## The responsive system (mobile-first, always)

Write the base CSS for a **375px** phone, then add `min-width` queries. Use these breakpoints and no others:

```css
/* sm 600 · md 900 · lg 1200 */
@media (min-width: 600px) { … }
@media (min-width: 900px) { … }   /* nav switches from burger to inline here */
@media (min-width: 1200px) { … }
```

Prefer **intrinsic layouts** that need no breakpoints:

```css
.container { width: min(100% - 2rem, 1200px); margin-inline: auto; }    /* 16px gutter on phones */
.container--narrow { width: min(100% - 2rem, 760px); margin-inline: auto; }
.grid-auto { display: grid; gap: clamp(1rem, 2vw, 1.5rem); grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
.section { padding-block: clamp(3.5rem, 8vw, 7rem); }
.stack > * + * { margin-top: var(--space, 1rem); }
.cluster { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
```

### Spacing scale (4/8 based). Use only these values.
`--s-1: .25rem; --s-2: .5rem; --s-3: .75rem; --s-4: 1rem; --s-5: 1.5rem; --s-6: 2rem; --s-7: 3rem; --s-8: 4rem; --s-9: 6rem;`

### Radius & shadow: pick one personality and apply it everywhere
| Personality | radius | radius-lg | pill buttons? | Shadow |
|---|---|---|---|---|
| Friendly (schools, kids, apps) | 12px | 20–28px | yes | soft, tinted with primary |
| Crisp (SaaS, fintech) | 8px | 14px | optional | 1px border + faint shadow |
| Editorial / luxury | 0–2px | 4px | no | none (use hairlines) |
| Bold (fitness, trades) | 4px | 8px | no | hard offset `6px 6px 0 var(--ink)` |

```css
--shadow-sm: 0 1px 2px rgb(16 24 40 / .06), 0 1px 3px rgb(16 24 40 / .08);
--shadow-lg: 0 2px 4px rgb(16 24 40 / .04), 0 12px 32px -8px rgb(16 24 40 / .16);
```
Tint shadows toward the ink hue (e.g. `rgb(27 42 39 / .14)`) rather than using pure black.

### Mobile musts
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **No horizontal scroll at 320–375px.** Use `min()` for widths, `overflow-wrap: anywhere` on long words/emails, and `img, svg, video { max-width: 100%; height: auto; display: block; }`.
- **Tap targets of 44×44px or larger.** Nav links on mobile get `padding-block: .75rem` or more.
- **Use `100svh`/`100dvh`, never `100vh`**, for full-height heroes. Better still, don't force full height; use `min-height: min(88svh, 820px)`.
- Inputs use `font-size: 16px` or larger, otherwise iOS zooms in. Use the right `type`/`inputmode`/`autocomplete` attributes.
- Phone numbers as `tel:` links and addresses as map links. Sticky bottom CTA bar only for conversion-critical apps.
- Cards stack to one column, stats become a 2×2 grid, and tables get a scroll wrapper (`overflow-x:auto`) or turn into cards.
- Hero images: use `aspect-ratio` to prevent layout shift, `object-fit: cover`, and `fetchpriority="high"` on the LCP image. Add `loading="lazy"` to all other images.

## Composition rules that make it look designed

1. **One focal point per section.** Every section has a single thing the eye lands on first.
2. **Alternate rhythm:** bg → surface2 → bg … and alternate layouts (split → grid → full-bleed quote → split reversed). Six identical "title + 3 cards" sections in a row is the #1 AI tell.
3. **Asymmetry beats symmetry.** Split heroes 7/5 or 3/2, not 50/50. Put an offset image with a decorative shape behind it.
4. **Left-align body text.** Center only short headings and CTAs.
5. **Generous whitespace.** When in doubt, add more section padding. Leave less space inside cards.
6. **Overlap and depth:** a stat card overlapping the hero image edge, a badge breaking a card border, or a section that tucks under the previous one with a negative margin. Use one or two of these per page.
7. **Real-feeling content.** Use specific names, numbers, dates, and quotes. "Founded 1987 · 1,240 students · 18:1 ratio" beats "Excellence in education".

## Hero archetypes (choose one per site, and vary between sites)

| Archetype | What it looks like | Fits |
|---|---|---|
| **Split + illustrated scene** | 7/5 split; right side is an inline-SVG scene built from palette shapes | schools, kids, cafés, clinics, nonprofits |
| **Split + product mock** | right side is a real-looking UI built in HTML/CSS (board, dashboard, chat) | SaaS, apps, fintech, devtools |
| **Full-bleed image + overlay** | edge-to-edge photo/illustration, gradient scrim, headline bottom-left | restaurants, hotels, travel, real estate |
| **Giant type** | the headline IS the visual: `--step-5`+ display type, one small detail | portfolios, agencies, fashion, editorial |
| **Centered statement + bento below** | short centered headline, CTAs, then a bento grid of 4–6 tiles peeking above the fold | startups, events, product launches |
| **Collage / scattered cards** | 3–5 rotated photo/quote/stat cards around the headline | community, camps, festivals, kids |
| **Search/booking-first** | headline + a prominent booking or search bar as the focal element | clinics, travel, real estate, restaurants |
| **Video/loop-style** | CSS-animated gradient or slow SVG motion behind a short headline | music, gaming, fitness |

Composition guards for the hero:
- A floating card may overlap the edge of the visual, but never cover its focal subject or a caption.
- Use at most **two** decorative devices (e.g. underline + one floating card). Not underline + badge + card + blob + dots.

## Imagery without stock photos

Don't use hotlinked random stock images that may 404 or show unrelated content. Use one of these, in order of preference:
1. **Inline SVG illustration or patterns** built from the palette (blobs, arches, grids, dots, hand-drawn squiggles). These always load and always match.
2. **Photo placeholders that look intentional:** `aspect-ratio` boxes with a palette gradient, a subtle grain/pattern, an icon, and a caption, e.g. "Photo: Science lab, Grade 9". Real images can be swapped in later.
3. If real photos are explicitly wanted: `https://images.unsplash.com/photo-<id>?w=1200&q=70&auto=format` with known IDs, always with `alt`, explicit `width`/`height`, and a colored `background` while loading.

Icons: inline SVG (Lucide/Heroicons-style 24px, stroke 1.75–2, `currentColor`). **Never use emoji as UI icons** except in playful kids brands, and even there, sparingly.

## Page recipes (section order that works)

Each list is a top-to-bottom order. Adapt the content, keep the rhythm.

### School / college / academy
1. **Header:** logo (crest SVG + name), Home · About · Academics · Admissions · Campus Life · News, CTA "Apply now" / "Book a visit".
2. **Hero (split):** eyebrow ("Admissions open for 2026–27"), headline with one accent word, lead, two CTAs (Apply / Book a tour), an image collage or illustrated arch with a floating stat card ("98% university placement").
3. **Trust strip:** accreditations, board affiliation, years founded, rankings.
4. **Stats band (count-up):** students, faculty, student:teacher ratio, clubs.
5. **Programs / levels:** Early Years · Primary · Middle · Senior cards with age ranges and a "Learn more" link.
6. **Why us / approach:** split layout, 3–4 pillars with icons, and a photo.
7. **Campus life:** a masonry/bento grid of activities (sports, arts, STEM, clubs).
8. **Admissions timeline:** a numbered 4-step process (Enquire → Visit → Assess → Enrol) with dates.
9. **Testimonials:** a parent and student quote with names and grades.
10. **News & events:** 3 dated cards plus an upcoming-events list.
11. **FAQ** (accordion).
12. **CTA band:** "Visit us this Saturday", with a form or button.
13. **Footer:** address, map link, phone, email, hours, quick links, socials, and a small-print accreditation line.

### Restaurant / café
Header (Menu · About · Visit · Reserve) → full-bleed hero with dish image and "Reserve a table" → signature dishes (3 with prices) → story split → menu tabs (Breakfast/Lunch/Dinner) with dotted leaders → reviews strip → hours + map + address → reservation form → footer.

### SaaS / product landing
Header → hero (headline + product screenshot/mock built in HTML/CSS) → logo marquee → 3 feature rows that alternate left and right, each with a UI mock → bento grid of secondary features → metrics → testimonials → pricing (3 tiers, middle highlighted) → FAQ → final CTA → footer.

### Clinic / healthcare
Header with phone CTA → hero ("Book an appointment" + search/select) → services grid → doctors (photo cards with specialty) → how it works (3 steps) → insurance accepted → testimonials → locations & hours → FAQ → footer with emergency notice.

### Portfolio / agency
Minimal header → huge typographic hero (name + one-line positioning) → selected work (large alternating case-study cards) → services list → clients marquee → about with portrait → contact CTA with email in display type → footer.

### Nonprofit
Header with "Donate" → hero with an urgent, human headline → impact stats → programs → story/testimonial → how donations are used (bar breakdown) → donate tiers → partners → newsletter → footer.

### E-commerce / boutique
Announcement bar → header with search/cart → hero campaign → category tiles → product grid (hover shows alternate image + quick add) → USP strip (shipping/returns) → editorial story → reviews → newsletter → footer.
