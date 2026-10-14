# Anti-patterns: the "AI-generated website" tells

If a reviewer can tell the site was AI-generated in 3 seconds, it failed. Check for these and remove them.

## Color
- **Purple→blue (or indigo→pink) gradient on a white page.** This is the default AI look. Use the domain palette instead.
- **Gradient text on every heading.** Use it at most once, if at all.
- **Pure `#000` text on pure `#FFF`.** It's harsh. Use tinted ink on tinted off-white.
- **Light gray body text** (`#999` on white is 2.8:1 and fails). Muted text must be 4.5:1 or higher.
- **Too many hues.** Use a primary, an accent, and neutrals. Status colors only for status.
- **Random Tailwind colors** (`blue-500` here, `indigo-600` there). Use tokens only.
- **Dark mode that is just inverted.** Lift saturated colors and tint the dark neutrals.

## Typography
- **Inter/Roboto/system font for everything** with no display face.
- **Timid scale:** an h1 at 36px on desktop above 16px body text.
- **Everything bold, or nothing bold.** Use 2–3 weights with clear roles.
- **Centered paragraphs** longer than two lines, and lines wider than 80 characters.
- **ALL CAPS headings without letter-spacing.**

## Layout
- **"Hero + 3 identical icon cards + 3 identical icon cards + CTA"** all the way down.
- **Everything centered,** every section the same height and padding.
- **Cards inside cards inside cards.**
- **Inconsistent radius** (some 4px, some 16px, some pill) and inconsistent shadows.
- **Full-width text** on desktop with no `max-width`.
- **Fixed `100vh` hero** that hides content on mobile or jumps when the URL bar collapses.

## Content
- **"Welcome to [Name]"** as the hero headline. Lead with the value or the feeling instead.
- **Lorem ipsum, "Feature 1/2/3", or "John Doe".** Write specific, plausible copy.
- **Generic claims** ("We are committed to excellence"). Prefer specifics such as numbers, names, dates, and places.
- **Emoji as icons** (🎓📚🏆) on a serious brand.
- **Broken images:** random Unsplash/placeholder URLs that 404 or show unrelated subjects.
- **Copyright 2023** or other stale years. Use the current year.

## Interaction
- **No hover or focus states**, or a hover state with no `:focus-visible` equivalent.
- **`outline: none`** with nothing in its place.
- **Mobile nav that doesn't work:** the burger opens nothing, the panel can't be closed, the page scrolls behind it, or links stay hidden.
- **Animations everywhere:** bouncing CTAs, everything fading in, slow (>1s) transitions, parallax text.
- **No `prefers-reduced-motion` support.**
- **`alert()` on form submit.** Show inline success instead.
- **Fake buttons** (`<div onclick>`) and links that go nowhere (`href="#"` everywhere). Use real anchors to sections at least.

## Code
- **Magic numbers everywhere** instead of tokens.
- **Hundreds of lines of near-duplicate CSS** for each card variant.
- **Hidden horizontal overflow** (`overflow-x: hidden` on body) masking a layout bug. Fix the cause instead.
