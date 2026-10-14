#!/usr/bin/env node
// Audits every evals/runs/<prompt>/<variant>/index.html, saves screenshots next to it,
// and writes evals/results.json + evals/results.md (comparison table).
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const audit = join(here, "../skills/frontend-taste/scripts/audit.mjs");
const runsDir = join(here, "runs");
const variants = ["baseline", "with-skill"];
const out = {};

for (const id of readdirSync(runsDir).sort()) {
  out[id] = {};
  for (const v of variants) {
    const file = join(runsDir, id, v, "index.html");
    if (!existsSync(file)) continue;
    process.stderr.write(`auditing ${id}/${v}…\n`);
    const json = execFileSync("node", [audit, file, "--json", "--shots", join(runsDir, id, v, "shots")], { encoding: "utf8", maxBuffer: 1 << 26 });
    const r = JSON.parse(json);
    out[id][v] = { score: r.score, results: r.results, raw: { families: r.raw.families, colorCount: r.raw.colorCount, rootVars: r.raw.rootVars, contrast: r.raw.contrast, overflow: r.raw.overflow, navWorks: r.raw.navWorks, withTransition: r.raw.withTransition, keyframes: r.raw.keyframes, h1Size: r.raw.h1Size, bodySize: r.raw.bodySize, emoji: r.raw.emoji, mobile: r.raw.mobile } };
  }
}
writeFileSync(join(here, "results.json"), JSON.stringify(out, null, 2));

// markdown summary
const lines = ["| Prompt | Baseline | With skill | Δ |", "|---|---:|---:|---:|"];
let sb = 0, ss = 0, n = 0;
for (const [id, r] of Object.entries(out)) {
  if (!r.baseline || !r["with-skill"]) continue;
  const b = r.baseline.score, s = r["with-skill"].score;
  sb += b; ss += s; n++;
  lines.push(`| ${id} | ${b} | ${s} | ${s - b >= 0 ? "+" : ""}${s - b} |`);
}
if (n) lines.push(`| **average** | **${Math.round(sb / n)}** | **${Math.round(ss / n)}** | **+${Math.round((ss - sb) / n)}** |`);

// per-check pass rates
const names = [...new Set(Object.values(out).flatMap((r) => (r.baseline?.results || []).map((x) => x.name)))];
lines.push("", "| Check | Baseline pass | With-skill pass |", "|---|:-:|:-:|");
for (const name of names) {
  const rate = (v) => {
    const xs = Object.values(out).map((r) => r[v]?.results.find((x) => x.name === name)).filter(Boolean);
    return `${xs.filter((x) => x.pass).length}/${xs.length}`;
  };
  lines.push(`| ${name} | ${rate("baseline")} | ${rate("with-skill")} |`);
}
writeFileSync(join(here, "results.md"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
