---
name: frontend-taste
description: Makes AI-built websites and UIs look professionally designed. Picks a domain-appropriate, contrast-checked color palette and font pairing, builds mobile-first responsive layouts, and adds purposeful microinteractions. Use whenever building, redesigning or styling any website, landing page, web app UI, dashboard, component or HTML/CSS/React/Tailwind frontend, even from a one-line prompt like "build me a school website" where no design direction is given.
---

# frontend-taste

When the user asks for a frontend and gives little or no design direction, **you are the designer**. Make confident, specific choices automatically and don't ask about colors or fonts. Then build it to a standard where nobody could tell it was AI-generated.

## The workflow (follow in order)

### 1. Brief (internal: about 30 seconds of thought, don't ask the user)
Decide and write down, as a short comment at the top of the main file:
- **Domain & audience:** for example, "private K-12 school; audience = parents 30–50, secondary = students".
- **Three tone adjectives:** for example, "trustworthy, warm, optimistic".
- **Primary conversion:** for example, "Book a campus tour / Apply".
- **Hero archetype + signature moment:** pick ONE archetype from the "Hero archetypes" table in `references/layout.md` that fits the domain, plus one memorable visual idea specific to *this* brand. Don't reach for the same arch-image + floating-card + hand-drawn-underline combination every time. That combination has become a template of its own. Ask yourself: "Would this hero work unchanged for a different business?" If yes, it isn't specific enough.

### 2. Pick the palette (don't invent one from scratch)
- Run `node scripts/palettes.mjs pick "<the user's prompt>"` and then `node scripts/palettes.mjs css <id>`, if Node is available.
- Otherwise, open `references/palettes.md` and pick from the **Quick map** by domain, then by mood.
- If the user supplied brand colors, keep them as `--primary` and use the "Deriving a custom palette" steps for the rest.
- Use semantic tokens only (`--bg --surface --surface2 --ink --muted --border --primary --on-primary --accent --on-accent`). **No hard-coded colors outside `:root`**, except transparent mixes via `color-mix()`.
- Follow 60-30-10: neutrals dominate, primary marks actions, accent is ≤10% (highlights, one underline, badges).
- Ship both light and dark tokens (the `css` command outputs both). Default to the palette's `prefer` mode.

### 3. Pick the fonts
Use the palette's `fonts` id, and find the pairing and exact Google Fonts URL in `references/typography.md`. Use two families, the fluid `--step-*` scale, a dominant h1, and body text at 16px or larger.

### 4. Plan the page
Use the matching **page recipe** in `references/layout.md` (school, restaurant, SaaS, clinic, portfolio, nonprofit, e-commerce). Plan 8–12 sections with **alternating rhythm**: vary backgrounds (bg / surface2 / a primary-colored band) and layouts (split, grid, bento, full-bleed, timeline). Never stack identical "heading + 3 cards" sections.

### 5. Build: mobile-first, from the starter
- Start from `assets/starter.css`. Replace section 0 with the palette and font tokens and keep the rest. Include `assets/micro.js` for reveals, count-ups, the sticky header, and the mobile nav. Inline both when delivering a single HTML file.
- Base styles target a 375px phone. Enhance at 600/900/1200px. Use intrinsic grids (`repeat(auto-fit, minmax(min(100%, 260px), 1fr))`) and `clamp()` padding.
- Use semantic HTML: skip link, `header/nav/main/section/footer`, one `h1`, and real `<button>`/`<a>` elements.
- Use inline SVG icons (`currentColor`, stroke 1.75–2). **No emoji icons** unless the brand is playful/kids.
- For imagery, the hero deserves a **drawn inline-SVG scene or an HTML/CSS product mock** built from the palette (a schoolhouse on a hill, a cup with steam, a kanban board). These beat an empty gradient box. Use the `.ph` placeholder only for secondary photos. No random hotlinked stock photos.
- Write **specific, plausible copy**: names, numbers, dates, places. No lorem ipsum, no "Welcome to X".

### 6. Add microinteractions (pick 5–8 from `references/motion.md`)
Always include these:
1. Button hover lift, press scale, and arrow nudge
2. A working mobile menu (burger→X morph, slide-in panel, Esc closes, scroll lock)
3. Sticky header that compacts and blurs on scroll
4. `:focus-visible` rings on everything interactive

Then choose two to four more that fit the domain: card lift with image zoom, staggered scroll reveals, count-up stats, animated link underlines, accordion FAQ, hero entrance stagger, marquee, tabs indicator, form validation states. Add **one** signature delight touch (hand-drawn underline, floating shape, magnetic CTA…).
Use the motion tokens (`--ease-out`, `--dur-*`) and animate only transform and opacity. Gate hover effects behind `@media (hover: hover)`. Always honor `prefers-reduced-motion`.

### 7. Verify before you say "done"
- Walk through `references/checklist.md`.
- If you can run Node + Playwright: `node scripts/audit.mjs path/to/index.html`. It checks for overflow at 320–1440px, contrast, tap targets, focus styles, reduced motion, alt text, and font count. Fix every ❌.
- **Look at it.** Run the audit with `--shots out/` (or screenshot it any way you can) and view the desktop and mobile images. The audit can't catch blown-up SVG icons, misaligned avatars, awkward headline wraps, tiny stat numbers, or cramped mock-ups, but one look at the screenshots does.
- Re-read `references/anti-patterns.md` and remove any AI tells.
- Don't game the audit. Its checks are heuristics; fix the real problem, not just the number.

## Non-negotiables
- Body text contrast ≥ 4.5:1 (palettes are pre-checked; don't lighten `--muted`).
- No horizontal scroll at 320px. Tap targets 44px or larger. Inputs use font-size 16px or larger.
- Two font families or fewer. No pure `#000` on `#fff`. No purple-blue gradient default.
- Every hover state has a `:focus-visible` twin. `prefers-reduced-motion` is respected.
- Use `svh`/`dvh` (or min-height), never a raw `100vh` hero.
- The current year goes in the footer.

## Framework notes
- **Tailwind:** map tokens in `@theme { --color-bg: var(--bg); --color-primary: var(--primary); … --font-display: …; }` (v4) or `theme.extend.colors` (v3), then use `bg-bg text-ink bg-primary text-on-primary`. Never use raw `blue-500`-style classes.
- **React/Next/Vue:** put tokens and the base layer in the global CSS. Port micro.js behaviors to a small `useReveal` hook / IntersectionObserver. Use `next/font` with the same families.
- **shadcn/ui:** set `--background --foreground --primary --primary-foreground --accent --muted-foreground --border --radius` from the palette tokens.
- **Single-file deliverable:** inline the CSS and JS. The only external resource is Google Fonts.

## Files
- `references/palettes.md`: 20 contrast-checked palettes (light + dark) with a domain map. Generated from `assets/palettes.json`.
- `references/typography.md`: 13 font pairings, Google Fonts URLs, fluid type scale.
- `references/motion.md`: motion tokens and 14 microinteraction recipes.
- `references/layout.md`: responsive system, composition rules, imagery, page recipes.
- `references/anti-patterns.md`: AI-generated-site tells to remove.
- `references/checklist.md`: pre-ship QA.
- `assets/starter.css`, `assets/micro.js`: base layer and interaction helpers.
- `scripts/palettes.mjs`: pick, print CSS, contrast-check palettes. `scripts/audit.mjs`: rendered-page quality audit.
