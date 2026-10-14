# Evals: does the skill actually help?

**You don't need this folder to use the skill.** It's the experiment that measures the skill's impact.

## How the test works
1. Each prompt in `prompts.json` (e.g. *"build me a school website"*) is given to the **same model twice**:
   - `baseline/`: the plain prompt, no skill.
   - `with-skill/`: the same prompt with the `frontend-taste` skill loaded.
2. Both runs produce a single `index.html`.
3. `run-audit.mjs` renders every page in a real browser, scores it with `skills/frontend-taste/scripts/audit.mjs` (overflow at 5 screen widths, mobile nav, contrast, tap targets, type scale, motion, etc.), and saves desktop + mobile screenshots to `shots/`.
4. The results land in `results.md` / `results.json`.

## Rerun it yourself
```bash
npm i
node evals/run-audit.mjs
```
To test a new prompt, add it to `prompts.json`, generate `runs/<id>/baseline/index.html` and `runs/<id>/with-skill/index.html` with your agent, then rerun.
