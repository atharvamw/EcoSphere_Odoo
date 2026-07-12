# EcoSphere — Brand & Visual Identity Guide

This document defines the brand personality, visual system, and design rules for EcoSphere. It exists so any designer, developer, or AI agent building UI for this product arrives at the same look and feel without needing to ask. When in doubt, this file is the source of truth — follow it exactly rather than defaulting to generic SaaS or "AI-generated" patterns.

---

## 1. Brand Concept: "Field Ledger"

EcoSphere sits at the intersection of two worlds that don't normally meet:

- **The field notebook** — where sustainability is measured: emissions, growth, participation, real physical activity.
- **The corporate ledger** — where operations are recorded: departments, transactions, audits, compliance, scores.

The brand should feel like **a precise, trustworthy instrument for measuring real-world impact** — not a marketing site for "going green." Think measurement tools, survey grids, growth rings, and structured data — not leaves, globes, or glossy gradients.

**In one sentence:** *EcoSphere looks like a scientific instrument that happens to also be a game.*

### Personality traits
| Trait | Means | Does not mean |
|---|---|---|
| Precise | Real numbers, clear units, honest data | Vague eco-marketing claims |
| Grounded | Earthy, material colors; structured layouts | Corporate-blue "enterprise software" blandness |
| Encouraging | Gamification feels earned, celebratory | Gimmicky confetti/emoji overload |
| Accountable | Governance and audit content reads as serious | Cold, punitive, bureaucratic tone |

---

## 2. Color System

**Avoid the three current AI-design defaults:** warm cream (#F4F1EA) + terracotta (#D97757); near-black + neon accent; broadsheet hairlines with zero border-radius. EcoSphere uses a **field-paper + module-coded palette** instead — each ESG pillar gets its own identity color, used consistently across the whole product (charts, badges, nav icons, status tags).

### Neutrals
| Name | Hex | Use |
|---|---|---|
| Ledger Ink | `#152019` | Primary text, dark-mode background, headers |
| Field Paper | `#EDEEE3` | Primary light background (not pure white — warm, slightly sage-tinted) |
| Paper Line | `#D8D9CC` | Hairline dividers, table borders, input outlines |
| Slate Fog | `#6B7268` | Secondary/muted text, placeholder text |

### Module colors (functional, not decorative — never swap these)
| Module | Name | Hex | Where it appears |
|---|---|---|---|
| Environmental | Canopy Green | `#2F5D3A` | Carbon module, environmental charts, emission tags |
| Social | Ochre Clay | `#C97B3D` | CSR module, participation charts, social tags |
| Governance | Slate Blue | `#3E5266` | Policy/audit module, compliance tags |
| Gamification | Signal Gold | `#E4B343` | XP, badges, leaderboards, rewards — used sparingly, as a reward moment, never as a default button color |
| Alert | Rust Red | `#B0392C` | Overdue compliance issues, failed validations, destructive actions |
| Success | Moss Bright | `#4F8B5B` | Confirmations, approvals, "completed" states |

**Rule:** a screen showing Environmental data should read green-forward, Social ochre-forward, Governance slate-forward. This color-coding IS the navigation system — a user should be able to tell which module they're in without reading the label.

---

## 3. Typography

Three type roles, each doing a distinct job — never substitute one for another.

| Role | Typeface | Why |
|---|---|---|
| **Display** (H1, hero numbers, module titles) | **Fraunces** (serif, high-contrast, slightly organic) | Gives the "field notebook" warmth without looking decorative or corporate-cold |
| **Body / UI** (paragraphs, labels, nav, buttons) | **Inter** or **Public Sans** | Neutral, highly legible at small sizes, standard for dense dashboard UI |
| **Data / Ledger** (scores, numbers, tables, timestamps, IDs) | **IBM Plex Mono** | Reinforces the "ledger" concept — every number in EcoSphere should feel measured and exact, not just styled text |

**Rule:** any raw number (scores, XP, kg CO₂e, %) is always set in the mono face. This is a load-bearing brand signal — it's how a screenshot of EcoSphere is instantly recognizable.

Type scale (base 16px): 12 / 14 / 16 / 20 / 26 / 34 / 48 — use restraint; most dashboard screens should only need 3–4 of these sizes.

---

## 4. Signature Element: Contour Score Rings

The one visual EcoSphere should be remembered by: **concentric rings representing stacked E / S / G scores**, styled like topographic contour lines / tree growth rings rather than a generic donut chart.

- Outer ring = Governance, middle = Social, inner = Environmental (or reorder by weight — stay consistent once chosen).
- Rendered with slightly irregular, hand-drawn-feeling stroke weight (not perfectly uniform vector arcs) to nod to the "field measurement" concept.
- Used as: the hero visual on the Organization Dashboard, the shape behind Badge icons, and the base shape for the Leaderboard rank markers.

This element earns the brand's one "bold" moment. Everything else in the UI stays quiet and disciplined around it.

---

## 5. Layout & Components

- **Grid, not gradient.** Structure comes from a visible ledger-like grid (rows, columns, hairline `Paper Line` dividers) — this is functionally honest for a data-heavy ERP-style app, not decoration.
- **Cards:** subtle radius (6–8px, not 0, not fully rounded) — feels like a printed index card, not a glossy SaaS tile. 1px `Paper Line` border, no heavy drop shadows.
- **Buttons:** primary actions use `Ledger Ink` (light mode) or `Field Paper` (dark mode) — never a rainbow of module colors on buttons. Module colors are for *data*, not for *chrome*.
- **Status tags/pills:** small, solid-fill in the relevant module color at reduced opacity (e.g., `Canopy Green` at 12% background + full-opacity text) — used for module tags, workflow states (Draft/Active/Under Review/Completed/Archived), severity levels.
- **Tables:** dense, mono numerals, zebra-striping optional but hairline row dividers mandatory — this is an ERP; tables are a primary surface, not an afterthought.
- **Dashboards:** lead with the Contour Score Ring + one clear headline number, then supporting charts below. Avoid stacking more than 4 charts above the fold.

---

## 6. Iconography & Imagery

- **Icons:** simple line icons (1.5–2px stroke), geometric, no filled/glossy icon sets. Icons should read as measurement/survey tools where possible (gauge, ruler, checkmark-in-box, leaf-as-line-not-fill) rather than generic "eco" clip-art (no globe-with-leaves, no glossy Earth icons).
- **Imagery:** if photography is used, it should look like real operational photography (warehouses, fleets, offices, real employees at CSR events) — never stock "hands holding a small plant" imagery.
- **Badges (gamification):** built from the Contour Ring shape + Signal Gold accents. Each badge should look like it was *earned*, not clip-art.

---

## 7. Motion

- Motion should feel like **instrument feedback**, not decoration: a score ring animating from 0 to its value on load, a number ticking up when a challenge is completed, a badge unlock with a brief, restrained celebratory pulse.
- No scroll-jacking, no parallax, no gratuitous hover effects on dashboard/data screens (this is a working tool, not a marketing site).
- Respect `prefers-reduced-motion` everywhere.
- Reserve any "delight" motion (confetti, badge pop) for genuine achievement moments — reward redemption, badge unlock, challenge completion. Never on routine CRUD actions.

---

## 8. Voice & Writing

- Write from the employee/manager's side of the screen: **"Log your activity"**, not "Submit CSR record."
- Numbers speak for themselves — don't editorialize sustainability claims ("Amazing progress!"). State the fact, let the score/ring do the emotional work.
- Errors are specific and instructive: *"Compliance issue needs an Owner before it can be saved"* — not *"Something went wrong."*
- Gamification copy can be warmer and more celebratory ("Badge unlocked: Carbon Cutter 🎖") — this is the one place a lighter tone is earned.

---

## 9. Do / Don't Summary

**Do:**
- Color-code by ESG module consistently everywhere (charts, tags, nav).
- Use mono type for every real number.
- Keep the Contour Ring as the one signature visual, reused across dashboard/badges/leaderboard.
- Keep light-mode background off-white/sage (`Field Paper`), not stock white or cream.

**Don't:**
- Don't default to cream-background + terracotta-accent or near-black + neon-green — these read as generic AI-generated design.
- Don't use leaf/globe/planet clip-art icons.
- Don't use gamification gold as a general UI accent color — it's reserved for earned moments.
- Don't apply heavy shadows, glassmorphism, or gradient buttons — this is a precision tool, not a landing page.
