#!/usr/bin/env node
// Rendered-page design-quality audit. Requires Playwright (`npm i -D playwright`).
//
//   node audit.mjs index.html                 human-readable report
//   node audit.mjs index.html --json          machine-readable
//   node audit.mjs https://site --shots out/  also save desktop + mobile full-page screenshots
//
// Scores 0–100 across: foundation, responsive, accessibility, typography, color discipline,
// interaction/motion, content. Every check is heuristic — use it to find problems, not to win.

import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

// Resolve Playwright from next to this script, else from the user's project (cwd).
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = createRequire(join(process.cwd(), "noop.js"))("playwright"));
  } catch {
    console.error("audit.mjs needs Playwright in this project:  npm i -D playwright");
    process.exit(2);
  }
}

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
const asJson = args.includes("--json");
const shotsIdx = args.indexOf("--shots");
const shotsDir = shotsIdx > -1 ? args[shotsIdx + 1] : null;
if (!target) {
  console.error("usage: audit.mjs <file|url> [--json] [--shots <dir>]");
  process.exit(2);
}
const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;
if (!/^https?:/.test(target) && !existsSync(resolve(target))) {
  console.error(`No such file: ${target}`);
  process.exit(2);
}

// Prefer Playwright's bundled Chromium; fall back to an installed Chrome / Edge.
const browser = await chromium.launch()
  .catch(() => chromium.launch({ channel: "chrome" }))
  .catch(() => chromium.launch({ channel: "msedge" }))
  .catch(() => {
    console.error("No browser found. Run: npx playwright install chromium");
    process.exit(2);
  });
const results = [];
const add = (group, name, pass, detail = "", weight = 1) => results.push({ group, name, pass: !!pass, detail, weight });

// ---------- desktop pass ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e.message || e)));
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => page.goto(url, { waitUntil: "load" }));
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(400);

const d = await page.evaluate(() => {
  const html = document.documentElement;
  const visible = (el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity !== 0;
  };
  // collect CSS text from all same-origin / inline sheets
  let cssText = "";
  for (const s of document.styleSheets) {
    try { for (const r of s.cssRules) cssText += r.cssText + "\n"; } catch { /* cross-origin (fonts) */ }
  }
  const all = [...document.querySelectorAll("body *")];
  const textEls = all.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1) && visible(el));

  // contrast
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const L = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none" && !cs.backgroundImage.startsWith("linear-gradient(currentcolor")) return null; // image/gradient: unknown
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const l of layers.reverse()) base = blend(l, base);
    return base;
  };
  let checked = 0, fails = 0; const failSamples = [];
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); const bg = bgOf(el);
    if (!fg || !bg) continue;
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    const r = ratio(fg.a < 1 ? blend(fg, bg) : fg, bg);
    checked++;
    if (r < need) { fails++; if (failSamples.length < 5) failSamples.push(`"${el.textContent.trim().slice(0, 30)}" ${r.toFixed(2)}:1`); }
  }

  // fonts actually rendered
  const fams = new Set(textEls.map((el) => getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase()));
  const loadedFonts = [...(document.fonts || [])].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, ""));

  // colors in use
  const colors = new Set();
  for (const el of all) { if (!visible(el)) continue; const cs = getComputedStyle(el); colors.add(cs.color); if (parse(cs.backgroundColor)?.a > 0) colors.add(cs.backgroundColor); }

  const rootStyle = getComputedStyle(html);
  let rootVars = 0; for (let i = 0; i < rootStyle.length; i++) if (rootStyle[i].startsWith("--")) rootVars++;

  const h1 = document.querySelectorAll("h1");
  const h1Size = h1[0] ? parseFloat(getComputedStyle(h1[0]).fontSize) : 0;
  const h1Weight = h1[0] ? +getComputedStyle(h1[0]).fontWeight : 400;
  const h1Family = h1[0] ? getComputedStyle(h1[0]).fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase() : "";
  // body size = the most common font size among visible paragraphs (ignores captions / hidden menus)
  const ps = [...document.querySelectorAll("main p, p")].filter(visible).filter((p) => p.textContent.trim().length > 40);
  const freq = {};
  for (const p of ps) { const fs = parseFloat(getComputedStyle(p).fontSize); freq[fs] = (freq[fs] || 0) + p.textContent.length; }
  const modal = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  const pEl = ps.find((p) => modal && parseFloat(getComputedStyle(p).fontSize) === +modal[0]) || null;
  const bodySize = pEl ? parseFloat(getComputedStyle(pEl).fontSize) : parseFloat(getComputedStyle(document.body).fontSize);
  const lhRaw = pEl ? getComputedStyle(pEl).lineHeight : "normal";
  const lineHeight = lhRaw === "normal" ? 1.2 : parseFloat(lhRaw) / bodySize;

  const withTransition = all.filter((el) => { const cs = getComputedStyle(el); return cs.transitionDuration.split(",").some((t) => parseFloat(t) > 0) && cs.transitionProperty !== "none"; }).length;
  const keyframes = (cssText.match(/@keyframes/g) || []).length;
  const hoverRules = (cssText.match(/:hover/g) || []).length;
  const imgs = [...document.images];
  const text = document.body.innerText;
  const emoji = (text.match(/\p{Extended_Pictographic}/gu) || []).length;

  return {
    doctype: !!document.doctype, lang: html.lang, title: document.title,
    metaDesc: !!document.querySelector('meta[name="description"]'),
    viewport: !!document.querySelector('meta[name="viewport"]'),
    contrast: { checked, fails, failSamples },
    families: [...fams], loadedFonts: [...new Set(loadedFonts)],
    colorCount: colors.size, rootVars,
    h1Count: h1.length, h1Size, h1Weight, h1Family, bodySize, lineHeight,
    focusVisible: /:focus-visible|:focus\b/.test(cssText),
    reducedMotion: /prefers-reduced-motion/.test(cssText),
    hoverGated: /\(hover:\s*hover\)/.test(cssText),
    uses100vh: /100vh/.test(cssText) && !/(s|d)vh/.test(cssText),
    clamp: /clamp\(/.test(cssText),
    mediaQueries: (cssText.match(/@media/g) || []).length,
    withTransition, keyframes, hoverRules,
    imgNoAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
    imgBroken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
    landmarks: ["header", "nav", "main", "footer"].filter((t) => document.querySelector(t)).length,
    skipLink: !!document.querySelector('a[href^="#"][class*="skip"], a.skip-link, a[href="#main"], a[href="#content"]'),
    emoji, lorem: /lorem ipsum/i.test(text),
    year: new Date().getFullYear(), hasYear: text.includes(String(new Date().getFullYear())),
    sections: document.querySelectorAll("section").length,
    alert: /\balert\(/.test([...document.scripts].map((s) => s.textContent).join("\n")),
  };
});


// ---------- responsive pass ----------
const overflow = {};
for (const w of [320, 375, 768, 1024, 1440]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(150);
  overflow[w] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

const m = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const mp = await m.newPage();
await mp.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => mp.goto(url, { waitUntil: "load" }));
await mp.waitForTimeout(400);
const mobile = await mp.evaluate(() => {
  const visible = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const targets = [...document.querySelectorAll("a, button, input, select, textarea, summary, [role=button]")].filter(visible).filter((el) => {
    if (el.tagName === "A" && el.closest("p, li p, blockquote")) return false; // inline links are exempt
    return true;
  });
  const small = targets.filter((el) => { const r = el.getBoundingClientRect(); return r.height < 40 || r.width < 40; });
  const minFont = Math.min(...[...document.querySelectorAll("p, li, a, button, input")].filter(visible).map((el) => parseFloat(getComputedStyle(el).fontSize)));
  const inputsSmall = [...document.querySelectorAll("input, select, textarea")].filter(visible).filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16).length;
  return { targets: targets.length, small: small.length, smallSamples: small.slice(0, 4).map((e) => (e.textContent || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 24)), minFont, inputsSmall };
});

// mobile nav: find a visible toggle in the header and see whether nav links appear
const navWorks = await (async () => {
  const before = await mp.evaluate(() => [...document.querySelectorAll("header a, nav a, [class*=nav] a, [class*=menu] a")].filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.left < innerWidth && r.right > 0 && getComputedStyle(a).visibility !== "hidden"; }).length);
  // most specific selectors first; skip theme/dark-mode toggles
  const sels = ['[data-nav-toggle]', 'button[aria-controls*="nav" i], button[aria-controls*="menu" i]', 'button[aria-label*="menu" i], button[aria-label*="navigation" i]',
    '[class*="burger" i], [class*="hamburger" i], button[class*="menu" i], button[class*="nav-toggle" i]', 'header button[aria-expanded]', 'header button'];
  let toggle = null;
  for (const sel of sels) {
    for (const h of await mp.$$(sel)) {
      const label = await h.evaluate((el) => (el.getAttribute("aria-label") || el.className || el.textContent || "").toString().toLowerCase());
      if (/theme|dark|light|mode|search|cart/.test(label)) continue;
      if (await h.isVisible()) { toggle = h; break; }
    }
    if (toggle) break;
  }
  if (!toggle) return { found: false, works: false, before };
  await toggle.click().catch(() => {});
  await mp.waitForTimeout(500);
  const after = await mp.evaluate(() => [...document.querySelectorAll("a")].filter((a) => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 0 && r.height > 0 && r.top >= 0 && r.top < innerHeight && r.left >= 0 && r.right <= innerWidth + 1 && cs.visibility !== "hidden" && +cs.opacity > 0.1; }).length);
  return { found: true, works: after > before + 2, before, after };
})();

// ---------- screenshots ----------
// Fresh contexts at 1x DPR (2x full-page shots exceed Chromium's 16384px texture limit and tile).
// Scroll slowly so IntersectionObserver reveals fire, then pin any still-invisible in-flow content
// visible (some pages hide content again once it leaves the viewport). Applied identically to every page.
async function capture(viewport, prefix, extra = {}) {
  const c = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
  const p = await c.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => p.goto(url, { waitUntil: "load" }));
  await p.evaluate(() => document.fonts?.ready);
  await p.waitForTimeout(900); // let hero entrance animations finish
  await p.screenshot({ path: join(shotsDir, `${prefix}-hero.png`) });
  await p.evaluate(async () => {
    const step = Math.round(innerHeight * 0.5);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); }
    await new Promise((r) => setTimeout(r, 900));
    const st = document.createElement("style");
    st.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(st);
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (+cs.opacity >= 0.05 || cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
      if (el.closest("[aria-hidden=true], [hidden], dialog, [role=dialog], [role=status], [aria-live], header nav, .mobile-nav, [class*=menu], [class*=toast]")) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) { el.style.setProperty("opacity", "1", "important"); el.style.setProperty("transform", "none", "important"); }
    }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
    // sticky/fixed top bars would otherwise be painted mid-page in a stitched capture
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if ((cs.position === "sticky" || cs.position === "fixed") && r.top <= 5 && r.height < 200 && r.width > innerWidth * 0.6) {
        el.style.setProperty("position", "absolute", "important"); el.style.setProperty("top", r.top + "px", "important");
        el.style.setProperty("left", "0", "important"); el.style.setProperty("right", "0", "important");
      }
    }
  });
  await p.screenshot({ path: join(shotsDir, `${prefix}-full.png`), fullPage: true });
  await c.close();
}
if (shotsDir) {
  mkdirSync(shotsDir, { recursive: true });
  await capture({ width: 1440, height: 900 }, "desktop");
  await capture({ width: 390, height: 844 }, "mobile", { isMobile: true, hasTouch: true });
}
await browser.close();

// ---------- scoring ----------
const F = "Foundation", R = "Responsive", A = "Accessibility", T = "Typography", C = "Color", I = "Interaction", X = "Content";
add(F, "doctype + lang + title", d.doctype && d.lang && d.title, `lang="${d.lang}"`);
add(F, "meta viewport", d.viewport, "", 2);
add(F, "meta description", d.metaDesc);
add(F, "design tokens (≥8 :root custom props)", d.rootVars >= 8, `${d.rootVars} vars`, 2);
add(F, "no runtime errors", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));

const worstOverflow = Math.max(...Object.values(overflow));
add(R, "no horizontal overflow 320–1440px", worstOverflow <= 1, Object.entries(overflow).filter(([, v]) => v > 1).map(([w, v]) => `${w}px:+${v}`).join(" ") || "clean", 3);
add(R, "fluid sizing (clamp)", d.clamp, "", 1);
add(R, "media queries present", d.mediaQueries >= 2, `${d.mediaQueries}`, 1);
add(R, "mobile nav toggle opens menu", navWorks.works, navWorks.found ? `links ${navWorks.before}→${navWorks.after}` : "no toggle found", 3);
add(R, "tap targets ≥40px (≤10% small)", mobile.small <= Math.max(2, mobile.targets * 0.1), `${mobile.small}/${mobile.targets} small ${mobile.smallSamples.join(", ")}`, 2);
add(R, "no raw 100vh", !d.uses100vh);
add(R, "inputs ≥16px on mobile", mobile.inputsSmall === 0, `${mobile.inputsSmall} small`);

const failPct = d.contrast.checked ? d.contrast.fails / d.contrast.checked : 0;
add(A, "text contrast (≤2% failing)", failPct <= 0.02, `${d.contrast.fails}/${d.contrast.checked} fail ${d.contrast.failSamples.join("; ")}`, 3);
add(A, "focus styles", d.focusVisible, "", 2);
add(A, "prefers-reduced-motion", d.reducedMotion, "", 2);
add(A, "img alt", d.imgNoAlt === 0, `${d.imgNoAlt} missing`);
add(A, "landmarks header/nav/main/footer", d.landmarks === 4, `${d.landmarks}/4`);
add(A, "skip link", d.skipLink);
add(A, "single h1", d.h1Count === 1, `${d.h1Count}`);

const nonGeneric = d.families.filter((f) => !/^(arial|helvetica|times|system-ui|-apple-system|ui-sans-serif|sans-serif|serif|segoe ui|roboto|inter)$/.test(f));
add(T, "custom typefaces (not system/Inter/Roboto/Arial only)", nonGeneric.length >= 1, d.families.join(", "), 2);
add(T, "≤3 font families rendered", d.families.length <= 3, `${d.families.length}`, 1);
add(T, "heading/body contrast (2 families, or one family with h1 ≥700)", d.families.length >= 2 || d.h1Weight >= 700, `h1: ${d.h1Family} ${d.h1Weight}`, 1);
add(T, "h1 ≥ 2.5× body on desktop", d.h1Size >= d.bodySize * 2.5, `${d.h1Size}px / ${d.bodySize}px`, 2);
add(T, "body ≥16px & line-height 1.4–1.9", d.bodySize >= 16 && d.lineHeight >= 1.4 && d.lineHeight <= 1.9, `${d.bodySize}px / ${d.lineHeight.toFixed(2)}`, 1);

add(C, "color discipline (≤24 distinct colors)", d.colorCount <= 24, `${d.colorCount} colors`, 2);

add(I, "transitions on ≥15 elements", d.withTransition >= 15, `${d.withTransition}`, 2);
add(I, "hover gated by (hover:hover)", d.hoverGated, "");
add(I, "keyframe animations", d.keyframes >= 1, `${d.keyframes}`, 1);
add(I, "no alert()", !d.alert);

add(X, "no lorem ipsum", !d.lorem, "", 2);
add(X, "≤6 emoji in text", d.emoji <= 6, `${d.emoji}`);
add(X, "current year present", d.hasYear, `${d.year}`);
add(X, "≥6 sections", d.sections >= 6, `${d.sections}`);
add(X, "no broken images", d.imgBroken === 0, `${d.imgBroken}`, 2);

const total = results.reduce((s, r) => s + r.weight, 0);
const got = results.reduce((s, r) => s + (r.pass ? r.weight : 0), 0);
const score = Math.round((got / total) * 100);

if (asJson) {
  console.log(JSON.stringify({ target, score, results, raw: { ...d, overflow, mobile, navWorks, consoleErrors } }, null, 2));
} else {
  console.log(`\nfrontend-taste audit — ${target}\n`);
  let g = "";
  for (const r of results) {
    if (r.group !== g) { g = r.group; console.log(`\n${g}`); }
    console.log(`  ${r.pass ? "✅" : "❌"} ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
  }
  console.log(`\nScore: ${score}/100\n`);
}
