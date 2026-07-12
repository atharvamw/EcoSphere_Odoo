# EcoSphere — Gamification Logic

## 0. Who this is for

Gamification in EcoSphere exists for one audience: **employees**, to encourage participation in CSR activities, challenges, and sustainable behavior — with the **CSR/ESG team** acting as the "game master" (configuring challenges, approving participation, granting recognition badges). This doc defines the mechanics precisely enough that an AI agent or developer can implement it without guessing.

The model borrows its core shape from Odoo's Gamification module (Goals → Challenges → Badges), which is a proven pattern for exactly this kind of internal, org-wide gamification — adapted here to fit ESG/CSR data instead of sales KPIs.

---

## 1. Core concepts (glossary)

| Term | Definition |
|---|---|
| **Goal Definition** | A reusable, named metric — e.g. "CSR Activities Completed", "kg CO₂e Reduced", "Policies Acknowledged". Defines *what* is measured and *how* (which table/field, count vs. sum). |
| **Goal** | An instance of a Goal Definition attached to a Challenge, with a **Condition** (`≥`, `≤`) and a **Target** value. |
| **Challenge** | A time-boxed container of one or more Goals, assigned to a set of employees, with a Reward attached. This is the thing employees actually see and join. |
| **XP** | Status currency. Earned only from completing Challenges. Never spent. Drives Badge unlocks and Leaderboard rank. |
| **Points** | Spendable currency. Earned only from approved CSR Activity participation. Spent on Rewards. |
| **Badge** | A recognition object. Either **auto-unlocked** (via a Goal-based Unlock Rule) or **manually granted** (by an authorized role, e.g. CSR team recognizing a peer nomination). |
| **Reward** | A catalog item redeemable with Points, subject to stock. |
| **Leaderboard** | A ranked view of XP (or a chosen Goal metric) over a period, scoped to Individual or Department. |

**Why two currencies, not one:** XP measures *standing* (how much you've done, forever climbing) and must never be spendable, or the leaderboard becomes meaningless the moment someone cashes out. Points measure *spendable value* and reset in the sense that they deplete — they're a wallet, not a scoreboard. Conflating them is the single most common gamification design mistake; EcoSphere avoids it deliberately.

---

## 2. Goal Definitions (the measurable building blocks)

A Goal Definition is configured once, then reused across many Challenges. Each one specifies:

| Field | Example |
|---|---|
| Name | "CSR Activities Completed" |
| Source | `EMPLOYEE_PARTICIPATION` where `approval_status = Approved` |
| Computation | `count` |
| Scope | Employee / Department |
| Suffix (unit shown to user) | "activities" |

Starter set of Goal Definitions EcoSphere should ship with:

1. **CSR Activities Completed** — count of Approved `Employee Participation` records.
2. **Challenges Completed** — count of `Challenge Participation` records with status `Completed`.
3. **Policy Acknowledgements** — count of `Policy Acknowledgement` records (drives compliance-adjacent gamification, e.g. "100% team acknowledgement" challenges).
4. **kg CO₂e Reduced** — sum of a delta tracked against a baseline (only usable in Challenges tied to a specific reduction initiative, e.g. "cut fleet emissions 5% this quarter" — requires a defined baseline period).
5. **Diversity/Training Metric Contribution** — for Social-module goals not tied to CSR Activity specifically (e.g. training completion).

**Rule:** Goal Definitions are read-only computed metrics — never a manually-entered number. If a metric can't be computed from existing Transactional data (Section 4 of `rules.md`), it isn't eligible to be a Goal Definition until that data exists.

---

## 3. Challenges

### 3.1 Structure
A Challenge = Title + Category + one or more Goals (with Condition + Target) + Periodicity + Assignment Rule + Evidence Required (toggle, inherited default from Settings but overridable per-Challenge) + Reward + Difficulty + Deadline.

### 3.2 Assignment rules
Who a Challenge applies to is defined by a rule, not a hardcoded list — so it stays correct as employees join/move departments:

- **All employees** (org-wide challenge)
- **Specific Department(s)**
- **Specific role** (e.g. only Department Heads)
- **Manual employee list** (rare — for pilot/test challenges)

### 3.3 Periodicity
Matches how the Goal is re-evaluated:
- **One-time** — runs once between start and deadline, then closes.
- **Recurring** (Daily / Weekly / Monthly / Quarterly) — the Goal resets and re-evaluates each period; XP/Badges can be earned again each cycle. Use for habit-building challenges (e.g. "log 1 CSR activity every month").

### 3.4 Lifecycle
Fixed states, matching the product spec exactly — do not add states without updating this doc and `rules.md` together:

```
Draft → Active → Under Review → Completed
                              ↘ Archived (from any state)
```

- **Draft** — being configured, not visible to employees.
- **Active** — visible, joinable, progress tracked live.
- **Under Review** — deadline passed or manually closed; CSR team reviews evidence/approvals before finalizing.
- **Completed** — rewards distributed, immutable record kept for reporting.
- **Archived** — withdrawn at any point (e.g. cancelled initiative); no rewards distributed if archived before Completed.

### 3.5 Completion & reward distribution
A Challenge Participation is marked **Completed** when all of its Goals' Conditions are satisfied by the Target (per the Odoo pattern: multi-goal challenges require all goals met unless explicitly configured as "any one goal"). On Challenge completion:

1. XP is awarded to the employee per the Challenge's defined XP amount (see Section 5 for how XP amount is set).
2. If the Challenge defines reward badges, they're granted:
   - **Badge for 1st completer** — optional, awarded only to whoever finishes first within the period.
   - **Badge for every completer** — the standard case; everyone who completes gets it.
3. Leaderboard and Department Score aggregates update as a side effect of this event (event-driven, not a delayed batch job, unless real-time isn't required for that org).

**Approval-gated, always:** even with Evidence Requirement off, Challenge Participation still requires an approval step from the CSR team (or auto-approval rule, see 3.6) before it counts as Completed — participation ≠ completion. This mirrors the CSR Activity approval rule in `rules.md` §1.4 and prevents self-reported gaming.

### 3.6 Evidence & approval
- When **Evidence Requirement** is on (global default, overridable per-Challenge/Activity): a proof file is mandatory before an approver can mark the participation Approved.
- Approval is a human action by default (CSR team or Department Head). An org may configure **auto-approval rules** for low-stakes, easily-verified Goals (e.g. "Policy Acknowledgement" — system-verified, no human judgment needed) — but auto-approval must be explicitly opted into per Goal Definition, never a silent default for CSR-judged activities like volunteering photos.

---

## 4. Badges

Two ways a Badge gets awarded — both must be supported, matching Odoo's model:

### 4.1 Auto-unlocked (Unlock Rule)
A Badge's Unlock Rule references a Goal Definition + threshold, evaluated as a side effect whenever the underlying metric changes (e.g. "unlock when Challenges Completed ≥ 10"). This check runs at the moment XP/participation is recorded — not on a nightly batch — so the unlock feels immediate.

### 4.2 Manually granted
Some recognition doesn't fit a formula — e.g. a CSR team member wants to recognize an employee's above-and-beyond effort. For these:
- **Allowance to Grant** — configured per Badge: `Anyone`, `A selected list of roles` (e.g. only CSR team / Department Heads), or `People who already hold a specific badge` (peer-recognition chains).
- **Limitation Number** — optional cap on how many times a given granter can award a specific badge per period (e.g. max 3 per month), to prevent one manager inflating their team's recognition.

### 4.3 Badge rules
- Badges are never revoked once awarded (they're a historical record — "you did this," not a status that can lapse).
- A Badge's Unlock Rule, once published (Challenge/Badge is no longer Draft), should not be silently changed — that invalidates the meaning of "already-unlocked" instances. If a rule must change, version it (new Badge) rather than mutating the old one.

---

## 5. XP economy

XP amount per Challenge is set at Challenge-creation time by the CSR team, using Difficulty as a guide, not a rigid auto-formula (a human should be able to say "this one's worth more because it requires real effort") — but provide a suggested default so it's not fully arbitrary:

| Difficulty | Suggested XP |
|---|---|
| Easy | 50 |
| Medium | 150 |
| Hard | 300 |
| Milestone / org-wide initiative | 500+ (set explicitly, not from the table) |

**Rules:**
- XP is additive and permanent — it never decreases (no "XP decay"). It represents cumulative contribution, like a resume, not a live-service rank.
- Leaderboards can still run over a rolling window (e.g. "this quarter's leaderboard") by summing XP *earned within that window*, without touching the employee's lifetime total.
- XP is never directly convertible to Points or Rewards. If an org wants XP to unlock a Reward tier, that's modeled as a Badge-gated Reward, not a currency conversion (keeps the two economies clean).

---

## 6. Points economy

- Points are earned exclusively from **Approved** CSR Activity participation (`Employee Participation.points_earned`), set per-Activity by the CSR team when the Activity is created.
- Points are spent via **Reward Redemption**: deduct on redemption, check stock first, reject if insufficient Points or zero stock (see `rules.md` §1.5 — this is a hard rule, not a suggestion).
- Points balance is per-employee, never per-department (departments earn *Score*, not Points — don't conflate the two).
- **Open decision, flag before building:** whether unspent Points expire at fiscal year-end. Not specified in the source brief — default to "no expiry" unless the org configures otherwise, and surface this as a Settings toggle rather than hardcoding either behavior.

---

## 7. Rewards & redemption

- Reward = Name, Description, Points Required, Stock, Status.
- Redemption flow: employee selects Reward → system checks `points_balance ≥ points_required` AND `stock > 0` → on success, deduct points, decrement stock, create `Reward Redemption` record with status (e.g. `Pending Fulfillment` → `Fulfilled`) → notify employee and fulfillment owner.
- Redemption is **not instantly reversible** by the employee — cancellation/refund is an admin action, logged, to prevent stock/points abuse.

---

## 8. Leaderboards

- Two scopes, both should exist: **Individual** (ranked by XP) and **Department** (ranked by Department Score or by summed department XP — pick one and be explicit; recommend Department Score, since that's the org's real KPI, with a secondary "Most Active Department" board by XP for pure engagement).
- Time windows: **All-time** and **Current period** (matches the org's chosen Challenge periodicity, e.g. this quarter) — both should be selectable, not just one.
- **Tie-breaking:** earliest to reach the tied value ranks higher (rewards early action, avoids arbitrary tie display).
- Leaderboards are read-only projections — never a source of truth. Recompute from XP/Score records; don't let the leaderboard itself hold authoritative state.

---

## 9. Anti-gaming safeguards

These exist because gamification without them gets abused fast:

- No self-approval: an employee can never approve their own CSR Activity or Challenge Participation, even if they hold an approver role elsewhere.
- Evidence Requirement should default **on** for any Goal Definition that isn't system-verified (i.e. anything that depends on someone's word — volunteering, off-site activity).
- Badge Limitation Number (§4.2) prevents any single granter from mass-issuing manual badges.
- Reward stock and Points balance must never go negative (hard constraint, enforced at the transaction level, not just in the UI).
- Challenge Goals sourced from Carbon Transaction data (e.g. "reduce emissions X%") must be compared against a locked baseline set *before* the Challenge starts — never a moving baseline, or employees could game the comparison period.

---

## 10. Notifications tied to gamification

Per `rules.md` §1.7, these gamification-specific events must trigger a notification (in-app and/or email, per Notification Settings):
- Badge unlocked
- Challenge Participation approved/rejected
- CSR Activity participation approved/rejected
- Reward redemption confirmed / fulfilled
- New Challenge available to the employee (per their Assignment Rule)
- Reward stock low (to CSR/admin, not the employee) — operational, not employee-facing

---

## 11. Admin configuration surface (Settings)

Everything above that's a toggle, not a fixed rule, should live in Settings so the CSR team can tune it without a code change:

- `evidence_requirement_enabled` (global default; per-Challenge override)
- `badge_auto_award_enabled`
- Default XP-by-difficulty table (Section 5) — editable, not hardcoded
- Points expiry policy (Section 6 — open decision, must be a toggle once decided)
- Leaderboard default scope (Individual vs Department) shown on the main dashboard

---

## 12. Example walkthrough (ties it all together)

1. CSR team creates Challenge **"Plant-Based Week"**: Category = CSR, Goal = "CSR Activities Completed ≥ 1" (specifically tagged to a "Plant-Based Meal Log" Category), Periodicity = One-time, Assignment = All Employees, Evidence Required = On, Difficulty = Easy → suggested 50 XP, Reward Badge = "Green Plate" (awarded to every completer).
2. Employee logs a CSR Activity participation with a photo (proof) tagged to that Category.
3. Department Head (approver) reviews proof, marks Approved → `points_earned` credited (say, 20 Points, set on the Activity) → system checks Challenge Goal conditions → satisfied → Challenge Participation marked Completed → 50 XP credited → "Green Plate" Badge auto-granted → notification sent → Individual and Department leaderboards update → Department Score recalculation picks up the new Social-module data point on its next cycle.

This is the full loop every gamification feature in EcoSphere should trace back to: **real action → approval → currency awarded → recognition/rank updated → score updated.** If a proposed feature can't be traced through this loop, it doesn't belong in EcoSphere's gamification model without first extending this document.
