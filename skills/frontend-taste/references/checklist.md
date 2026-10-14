# Pre-ship checklist

Run through this before calling a frontend "done". If the audit script is available (`node scripts/audit.mjs <file-or-url>`), run it. It automates most of the checks marked ⚙.

## Foundation
- [ ] ⚙ `<!doctype html>`, `<html lang>`, `<title>`, meta description, viewport meta
- [ ] ⚙ All colors come from `:root` tokens (palette from `assets/palettes.json`)
- [ ] ⚙ Two font families or fewer, loaded with `display=swap` + preconnect
- [ ] Type uses the fluid `--step-*` scale. The h1 is clearly dominant.
- [ ] Spacing uses the scale. Sections have generous `clamp()` padding.
- [ ] One radius and shadow personality, applied consistently

## Responsive
- [ ] ⚙ No horizontal overflow at 320, 375, 768, 1024, and 1440px
- [ ] ⚙ Tap targets are 44px or larger on mobile
- [ ] Mobile nav opens, closes (button, Esc, link click), locks scroll, and is keyboard reachable
- [ ] Grids collapse gracefully. Nothing is squished, text is never under 16px.
- [ ] Hero uses `svh`/`dvh` or min-height, never a raw `100vh`

## Accessibility
- [ ] ⚙ Body text contrast ≥ 4.5:1 (aim for 7:1). Large text and UI ≥ 3:1.
- [ ] ⚙ Every `<img>` has `alt`. Decorative SVGs have `aria-hidden="true"`.
- [ ] ⚙ `:focus-visible` styles exist and are visible on every interactive element
- [ ] ⚙ `prefers-reduced-motion` is respected
- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`), a single `h1`, and no skipped heading levels
- [ ] Skip link ("Skip to content")
- [ ] Form inputs have `<label>`s, errors are announced, and success uses `role="status"`

## Delight
- [ ] 5–8 purposeful microinteractions: buttons, links, cards, header, nav, reveals, plus one signature touch
- [ ] Hover effects are gated behind `(hover: hover)` and have focus equivalents
- [ ] No anti-patterns from `anti-patterns.md`

## Content
- [ ] Specific, plausible copy with names, numbers, and dates. No lorem ipsum.
- [ ] Current year in the footer. Real `tel:`/`mailto:` links. Nav anchors scroll to real sections.
- [ ] No broken images. Placeholders look intentional.
