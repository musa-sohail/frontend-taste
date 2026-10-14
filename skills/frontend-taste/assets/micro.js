/* micro.js — tiny, dependency-free microinteraction helpers (~2KB min).
 * Drop in at the end of body as an external deferred script, or inline it.
 * In head, run  document.documentElement.classList.add('js')  in a tiny inline script
 * so reveal styles only hide content when JS is running.
 * (This comment intentionally contains no closing script tag, so the file is safe to inline.)
 *
 * Attributes:
 *   data-reveal                 fade/slide element in when it enters the viewport
 *   data-reveal-stagger         same, for each child, staggered (sets --i)
 *   data-count="1200"           count up once in view (data-suffix, data-prefix, data-decimals)
 *   data-magnetic               subtle pointer pull on desktop
 *   .site-header                gets .is-scrolled after 8px of scroll
 *   [data-nav-toggle]           button controlling #id from aria-controls (mobile nav)
 *   .progress                   gets --p (0..1) page scroll progress (fallback for no scroll-timeline)
 */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---- reveal on scroll ----
  $$("[data-reveal-stagger]").forEach((el) => [...el.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 6))));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      if (e.target.dataset.count !== undefined) countUp(e.target);
      io.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  $$("[data-reveal],[data-reveal-stagger],[data-count]").forEach((el) => io.observe(el));

  // ---- count up ----
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
    const fmt = (n) => (el.dataset.prefix || "") + n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || "");
    if (reduce) return (el.textContent = fmt(end));
    const t0 = performance.now(), dur = 1200;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(end * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---- header + progress on scroll ----
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".progress");
  const onScroll = () => {
    const y = scrollY;
    header?.classList.toggle("is-scrolled", y > 8);
    if (progress) progress.style.setProperty("--p", y / Math.max(1, document.documentElement.scrollHeight - innerHeight));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- mobile nav ----
  $$("[data-nav-toggle]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    $$("li", panel).forEach((li, i) => li.style.setProperty("--i", i));
    const set = (open) => {
      btn.setAttribute("aria-expanded", open);
      panel.classList.toggle("is-open", open);
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) panel.querySelector("a,button")?.focus({ preventScroll: true });
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => e.target.closest("a") && set(false));
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { set(false); btn.focus(); }
    });
    matchMedia("(min-width: 900px)").addEventListener("change", (m) => m.matches && set(false));
  });

  // ---- magnetic buttons (fine pointers only) ----
  if (!reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 12, y = ((e.clientY - r.top) / r.height - 0.5) * 12;
        el.style.translate = `${x}px ${y}px`;
      });
      el.addEventListener("pointerleave", () => (el.style.translate = ""));
      el.style.transition += ", translate 250ms cubic-bezier(.22,1,.36,1)";
    });
  }
})();
