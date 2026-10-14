# Motion & microinteractions

Motion should **confirm, guide, or delight**, in that order of priority. Every animation answers one of three questions: *"Did my action register?"*, *"Where should I look?"*, or *"Is this alive and cared for?"*

## Tokens (always define these, never hard-code timings)

```css
:root {
  --ease-out: cubic-bezier(.22, 1, .36, 1);      /* default: fast start, soft landing */
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);   /* for things that move across the screen */
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);/* tiny overshoot: toggles, badges, likes */
  --dur-1: 120ms;  /* press, color change */
  --dur-2: 200ms;  /* hover, small UI */
  --dur-3: 320ms;  /* menus, accordions, cards */
  --dur-4: 600ms;  /* section reveals */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important;
  }
}
```

## Rules

1. **Only animate `transform`, `opacity`, `filter`, `clip-path`**, plus `background-color`/`color`/`box-shadow` on small elements. Never animate `width`, `height`, `top`, or `left`. For height, use the grid-rows trick below.
2. **Durations:** Feedback takes under 200ms. Never go over 700ms for UI. Exits run about 25% faster than entrances.
3. **Distance is small.** Hover lift is 2–4px. Reveal travel is 16–24px. Scale on press is 0.97–0.98. Big moves look cheap.
4. **Stagger lists** at 60–90ms per item, capped at about 6 items (after that, reveal the rest together).
5. **Hover is a bonus, not the only way.** Wrap hover-only effects in `@media (hover: hover) and (pointer: fine)`. Every hover style needs a `:focus-visible` equivalent.
6. **Respect `prefers-reduced-motion`** (the global rule above). Content must be visible with JS off: add `.js` to `<html>` before hiding anything for reveals.
7. **Pick 5–8 interactions per site.** Don't use all of them. Consistency matters more than variety.

## The catalog (copy-paste)

### 1. Buttons: lift on hover, press on click, arrow nudge
```css
.btn {
  display: inline-flex; align-items: center; gap: .5em;
  padding: .85em 1.4em; border-radius: var(--radius-pill, 999px);
  font-weight: 600; background: var(--primary); color: var(--on-primary);
  box-shadow: 0 1px 0 rgb(0 0 0 / .05), 0 6px 16px -6px color-mix(in oklab, var(--primary) 60%, transparent);
  transition: transform var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out), background-color var(--dur-2);
}
.btn svg { transition: transform var(--dur-2) var(--ease-out); }
@media (hover: hover) {
  .btn:hover { transform: translateY(-2px); box-shadow: 0 2px 0 rgb(0 0 0 / .04), 0 12px 24px -8px color-mix(in oklab, var(--primary) 55%, transparent); }
  .btn:hover svg { transform: translateX(3px); }
}
.btn:active { transform: translateY(0) scale(.98); transition-duration: var(--dur-1); }
.btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.btn--ghost { background: transparent; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--border); }
```

### 2. Links: animated underline
```css
.link { background: linear-gradient(currentColor 0 0) 0 100% / 0 2px no-repeat; transition: background-size var(--dur-3) var(--ease-out); text-decoration: none; }
.link:hover, .link:focus-visible { background-size: 100% 2px; }
```

### 3. Cards: lift, shadow bloom, image zoom
```css
.card { border-radius: var(--radius-lg); background: var(--surface); border: 1px solid var(--border); overflow: hidden;
  transition: transform var(--dur-3) var(--ease-out), box-shadow var(--dur-3) var(--ease-out), border-color var(--dur-3); }
.card img { transition: transform var(--dur-4) var(--ease-out); }
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: color-mix(in oklab, var(--primary) 30%, var(--border)); }
  .card:hover img { transform: scale(1.04); }
}
.card:focus-within { outline: 2px solid var(--primary); outline-offset: 2px; }
```
Make the whole card clickable with a stretched link: `.card a::after { content:""; position:absolute; inset:0 }` and `.card { position: relative }`.

### 4. Scroll reveal (stagger), using `assets/micro.js`
```html
<section data-reveal> … </section>
<ul data-reveal-stagger> <li>…</li> <li>…</li> </ul>
```
```css
.js [data-reveal], .js [data-reveal-stagger] > * { opacity: 0; transform: translateY(20px); transition: opacity var(--dur-4) var(--ease-out), transform var(--dur-4) var(--ease-out); transition-delay: calc(var(--i, 0) * 70ms); }
.js .is-in[data-reveal], .js .is-in[data-reveal-stagger] > * { opacity: 1; transform: none; }
```
CSS-only alternative for modern browsers: `animation-timeline: view()` inside `@supports`.

### 5. Sticky header: becomes compact and blurred after scroll
```css
.site-header { position: sticky; top: 0; z-index: 50; transition: background-color var(--dur-3), box-shadow var(--dur-3), padding var(--dur-3) var(--ease-out); padding-block: 1.1rem; }
.site-header.is-scrolled { padding-block: .6rem; background: color-mix(in oklab, var(--bg) 82%, transparent); backdrop-filter: saturate(1.4) blur(12px); box-shadow: 0 1px 0 var(--border); }
```

### 6. Mobile menu: hamburger morphs to X, panel slides in
```css
.burger span { display:block; width:22px; height:2px; background: currentColor; border-radius:2px; transition: transform var(--dur-3) var(--ease-out), opacity var(--dur-2); }
.burger span + span { margin-top: 5px; }
[aria-expanded="true"] .burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
[aria-expanded="true"] .burger span:nth-child(2) { opacity: 0; }
[aria-expanded="true"] .burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.mobile-nav { position: fixed; inset: 0 0 0 auto; width: min(85vw, 360px); background: var(--surface); transform: translateX(100%); transition: transform var(--dur-3) var(--ease-out); }
.mobile-nav.is-open { transform: none; }
.mobile-nav.is-open li { animation: slide-in var(--dur-3) var(--ease-out) both; animation-delay: calc(var(--i) * 50ms + 80ms); }
@keyframes slide-in { from { opacity: 0; transform: translateX(16px); } }
```
Lock body scroll while open, close on Esc and on link click, and return focus to the toggle. `micro.js` does all of this.

### 7. Accordion / FAQ (no JS, animates height)
```html
<details class="faq"><summary>When does admission open?</summary><div class="faq__body"><div><p>…</p></div></div></details>
```
```css
.faq summary { cursor: pointer; list-style: none; display:flex; justify-content:space-between; gap:1rem; padding: 1.1rem 0; font-weight:600; }
.faq summary::after { content: "+"; font-size: 1.4em; line-height: 1; transition: transform var(--dur-3) var(--ease-spring); }
.faq[open] summary::after { transform: rotate(45deg); }
.faq__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-3) var(--ease-out); }
.faq[open] .faq__body { grid-template-rows: 1fr; }
.faq__body > div { overflow: hidden; }
```
(Use `interpolate-size: allow-keywords` + `::details-content` where supported, with this as the fallback.)

### 8. Count-up stats
`<span data-count="1200" data-suffix="+">0</span>`. micro.js animates it once when it enters view (1.2s, ease-out). Reserve the width with tabular-nums so the layout doesn't shift.

### 9. Form fields: focus ring, float label, valid/invalid states
```css
.field input { border: 1.5px solid var(--border); border-radius: var(--radius); padding: .9em 1em; background: var(--surface); transition: border-color var(--dur-2), box-shadow var(--dur-2); }
.field input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 18%, transparent); }
.field input:user-invalid { border-color: #C2410C; animation: shake 300ms var(--ease-out); }
@keyframes shake { 25% { transform: translateX(-4px) } 75% { transform: translateX(4px) } }
```
On submit: the button shows a spinner and then a ✓ state. Never use `alert()`. Show an inline success message with `role="status"`.

### 10. Scroll progress bar (long pages, articles)
```css
.progress { position: fixed; inset: 0 0 auto; height: 3px; background: var(--accent); transform-origin: 0 50%; transform: scaleX(var(--p, 0)); z-index: 60; }
@supports (animation-timeline: scroll()) { .progress { animation: grow linear both; animation-timeline: scroll(); } @keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } } }
```

### 11. Marquee (logos, partners, testimonials strip)
```css
.marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.marquee__track { display: flex; gap: 3rem; width: max-content; animation: marquee 30s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }   /* duplicate the items once */
```

### 12. Tabs with a sliding indicator
Position an absolutely placed `.tabs__indicator` and set its `--x` and `--w` from the active tab's `offsetLeft`/`offsetWidth`. Transition the `transform` and `width` (`width` is fine here because the element is tiny).

### 13. Hero entrance (once, on load)
Stagger the eyebrow, headline, lead, and CTAs: `animation: rise var(--dur-4) var(--ease-out) both; animation-delay: calc(var(--i) * 90ms)`, with `@keyframes rise { from { opacity:0; transform: translateY(14px) } }`. Keep it under 1s in total.

### 14. Delight touches (pick at most one or two, and make them fit the brand rather than defaulting to the first item)
- A hand-drawn SVG underline that draws in (`stroke-dasharray` + `stroke-dashoffset`) under the hero accent word.
- A gently floating decorative blob or shape (6–10s ease-in-out alternate, 8–12px travel).
- A magnetic primary CTA on desktop (micro.js `data-magnetic`, max 6px pull).
- Emoji or icon bounce on hover for kids/playful brands (`--ease-spring`).
- Steam/smoke wisps, a ticking clock hand, or a sun rising in an SVG scene: one tiny ambient loop that belongs to the subject.
- Live-ness: "Open now" status, today's hours highlighted, the next available slot. This is real data that makes the page feel alive.
- View Transitions between pages: `@view-transition { navigation: auto; }`.

## Anti-patterns
- Everything fades in on scroll, including the hero and nav. Reveal content below the fold only.
- Parallax on text, scroll-jacking, and cursor-follower blobs on content sites.
- Animations longer than 1s, bounce on serious brands, and infinite pulsing CTAs.
- Hover transforms on mobile (sticky hover). Layout shift from reveals; use transforms only.
