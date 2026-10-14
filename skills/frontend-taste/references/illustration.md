# Illustration: drawing on-brand art with inline SVG

Without real photos, the difference between "designed" and "template" is whether the page has **bespoke, varied visuals**. A flat-vector scene built from 6–20 palette-colored shapes beats any gradient placeholder box and always loads. Draw them.

## Rules
1. **Every visual is different.** The hero scene, each program/service card, the news thumbnails, and the campus-life tiles each get their own little drawing. Never repeat the same gradient box down the page. Three identical placeholders in a row is an AI tell.
2. **Use the palette only:** `var(--primary)`, `var(--accent)`, `var(--surface2)`, `var(--ink)`, plus `color-mix()` tints. Set `fill="currentColor"` or inline `style="fill:var(--primary)"` so dark mode works.
3. **Flat and geometric:** circles, rounded rects, simple paths, and one or two curves for hills or waves. No gradients or one subtle one, no outlines (or all outlines at the same stroke width), and no tiny detail that turns to mush on mobile.
4. **Give the scene a sky/ground or a framed backdrop** (rounded rect in `surface2` or a tint of primary) so it reads as a picture.
5. **Size with `viewBox` + `width:100%`**, add `role="img"` + `aria-label` (or `aria-hidden="true"` if purely decorative), and set an `aspect-ratio` on the container.
6. **Add one tiny ambient motion at most** per scene: a cloud drifting, steam rising, a sun slowly pulsing. Respect reduced motion.

## Subject ideas by domain
| Domain | Hero scene | Small spot art (cards/tiles) |
|---|---|---|
| School | schoolhouse/bell tower on a hill, sun, trees, path | ABC blocks, beaker, paintbrush + palette, football, book stack, robot, globe |
| Café / bakery | cup with steam on saucer, window with awning | croissant, beans, kettle, cake slice, leaf latte |
| Dental / clinic | calm room with chair + window + plant; or a big friendly tooth with sparkle | toothbrush, calendar, shield (insurance), smile, stethoscope |
| SaaS | HTML/CSS product UI (board, chart, inbox), not SVG art | mini UI fragments: toggle, chart bars, avatars stack, chip list |
| Restaurant | plated dish top-down, table with candle | pasta, wine glass, herb sprig, flame |
| Nonprofit | hands, hearts, a community of simple figures | water drop, book, seedling, house |
| Fitness | abstract figure in motion, bold stripes | dumbbell, stopwatch, heart-rate line |

## Example: hero scene (school), about 20 lines
```html
<svg viewBox="0 0 480 400" role="img" aria-label="Illustration of the schoolhouse on the hill" style="width:100%;height:auto;border-radius:var(--radius-lg)">
  <rect width="480" height="400" fill="color-mix(in oklab, var(--primary) 12%, var(--surface))"/>
  <circle cx="380" cy="90" r="46" fill="var(--accent)"/>
  <g fill="var(--surface)" opacity=".9"><ellipse cx="120" cy="80" rx="48" ry="14"/><ellipse cx="150" cy="70" rx="30" ry="14"/></g>
  <path d="M0 290 Q120 230 240 270 T480 250 V400 H0Z" fill="color-mix(in oklab, var(--primary) 55%, var(--surface))"/>
  <path d="M0 330 Q160 290 300 320 T480 310 V400 H0Z" fill="var(--primary)"/>
  <rect x="180" y="190" width="130" height="90" fill="var(--surface)"/>
  <path d="M168 194 L245 140 L322 194Z" fill="var(--accent)"/>
  <rect x="232" y="118" width="26" height="40" fill="var(--surface)"/><circle cx="245" cy="132" r="7" fill="var(--ink)"/>
  <rect x="234" y="232" width="22" height="48" rx="11" fill="var(--primary)"/>
  <rect x="196" y="212" width="24" height="20" rx="3" fill="color-mix(in oklab, var(--primary) 35%, var(--surface))"/>
  <rect x="270" y="212" width="24" height="20" rx="3" fill="color-mix(in oklab, var(--primary) 35%, var(--surface))"/>
  <path d="M245 280 Q230 340 200 400 H290 Q262 340 257 280Z" fill="color-mix(in oklab, var(--accent) 40%, var(--surface))"/>
  <g fill="var(--ink)"><rect x="98" y="250" width="6" height="40"/><rect x="398" y="240" width="6" height="40"/></g>
  <circle cx="101" cy="240" r="26" fill="color-mix(in oklab, var(--primary) 80%, var(--ink))"/>
  <circle cx="401" cy="230" r="22" fill="color-mix(in oklab, var(--primary) 80%, var(--ink))"/>
</svg>
```

## Example: spot art tile (an icon-scale scene for a card)
```html
<div class="spot" style="aspect-ratio:4/3;border-radius:var(--radius);background:color-mix(in oklab,var(--accent) 22%,var(--surface));display:grid;place-items:center">
  <svg viewBox="0 0 120 90" width="60%" aria-hidden="true">
    <rect x="18" y="40" width="26" height="26" rx="4" fill="var(--primary)"/><text x="31" y="59" font-size="16" text-anchor="middle" fill="var(--on-primary)" font-weight="700">A</text>
    <rect x="47" y="40" width="26" height="26" rx="4" fill="var(--accent)"/><text x="60" y="59" font-size="16" text-anchor="middle" fill="var(--on-accent)" font-weight="700">B</text>
    <rect x="76" y="40" width="26" height="26" rx="4" fill="var(--ink)"/><text x="89" y="59" font-size="16" text-anchor="middle" fill="var(--bg)" font-weight="700">C</text>
    <rect x="33" y="12" width="26" height="26" rx="4" fill="color-mix(in oklab,var(--primary) 50%,var(--surface))"/>
  </svg>
</div>
```
Vary the tile background between `primary`, `accent`, and `surface2` tints across a grid so neighbors never match.

## When to use the `.ph` photo placeholder instead
Only for slots that clearly *must* be a real photo later (a staff portrait, a specific venue), and at most about three per page. Vary them with `.ph--accent` / `.ph--soft`, and always caption what the photo should be.
