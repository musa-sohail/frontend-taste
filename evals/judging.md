# Blind visual judging

A separate agent acting as a senior product designer scored screenshots (desktop + mobile, hero + full page) of each pair, labelled only **A** and **B** in a random order. It had no access to the code, the skill, or which side was which. Scores are 1–10 "overall".

## Round 1: discarded
The first capture method left scroll-reveal sections blank and tiled mobile full-page shots past Chromium's 16,384px texture limit. The judge noticed and said the comparison was unreliable, so we fixed `audit.mjs` capture (see commit history) and re-judged.

## Round 2: skill v1 vs baseline (fixed screenshots)
| Prompt | Baseline | With skill v1 | Winner |
|---|:-:|:-:|---|
| School | 8 | 6 | baseline (clear) |
| Coffee | 7 | 8 | skill (slight) |
| Dental | 7 | 6 | baseline (slight) |
| SaaS | 7 | 8 | skill (slight) |
| **Total** | **29** | **28** | **visual tie** |

What the judge said, unblinded:
- **School, skill lost:** *"every 'photo' (hero, four division cards, approach, campus, three news cards) is the same dotted green gradient … monotonous and plainly unfinished."* The baseline drew its own flat illustrations.
- **Dental, skill lost:** the Atkinson Hyperlegible body font renders slashed zeros ("2Ø09"), and the hero card covers a caption.
- **Coffee and SaaS, skill won:** *"richer brand system"* and *"each feature section pairs its text with a specific product mockup."*
- Overall, the skill pages were *"consistently tidier with fewer visible bugs"*, while baselines took more illustrative risks.

**Takeaway:** v1 gave a large technical gain (audit +22: contrast, tap targets, input sizing, skip links, hover gating) but no visual gain. Two causes were identified and fixed in v2:
1. The skill pushed a generic `.ph` gradient placeholder, which got repeated everywhere → added `references/illustration.md` (draw distinct SVG scenes/spot art, max ~3 placeholders).
2. The skill's single example "signature moment" made 3/4 heroes look alike (arch + floating card + underline) → added a hero archetype menu.
3. Also: swapped the slashed-zero font out of the `accessible-clean` pairing.

## Round 3: skill v2 vs baseline
Same baselines, new blind order, and the judge also got phone-sized mobile slices.

| Prompt | Baseline | With skill v2 | Winner |
|---|:-:|:-:|---|
| School | 7 | 7 | **skill** (slight) |
| Coffee | 6 | 8 | **skill** (clear) |
| Dental | 6 | 7 | **skill** (slight) |
| SaaS | 7 | 8 | **skill** (slight) |
| **Total** | **26** | **30** | **skill wins 4/4** |

What the judge said, unblinded:
- **Coffee:** *"storefront illustration with the crow is distinctive and on-brand … B covers much more … A feels like a thin template."*
- **SaaS:** *"builds a clear story ('handoffs') with mockups made for each feature … more brand identity."*
- **Dental:** *"puts an actual booking widget in the hero, followed by illustrated treatment cards with prices … reads as a working clinic site."*
- **School:** *"stronger heavy serif headline and a hero card that feels alive … campus-life illustrations are charming and consistent."*

Still flagged on both sides: occasional "Photo:" gradient placeholders. The dental v2 run still used Atkinson Hyperlegible (slashed zeros), because the agent read the typography file before the swap landed.

## Caveats
- n = 4 prompts, one generation per side, and one AI judge (a different agent instance, not a human panel). Treat this as directional, not statistically significant.
- Baselines and skill runs used the same model (Claude Opus 5.5). A weaker model would likely gain more from the skill.
- The audit score is partly something the skill optimizes for, since it tells the agent to run the audit. The blind visual judging is the fairer test.
