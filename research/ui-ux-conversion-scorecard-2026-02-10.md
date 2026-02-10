# Avero Landing Scorecard

Date: 2026-02-10  
Scope: `Home`, `Features`, `Integrations`, `About`, `Login`, `Signup`

## Scoring Model (100)

- Clarity in 5 seconds: 20
- Visual hierarchy and scanability: 20
- Trust and credibility placement: 20
- Friction and conversion path: 20
- Accessibility and interaction quality: 20

## Baseline Scores (Before This Pass)

- Home: 87
- Features: 74
- Integrations: 79
- About: 68
- Login: 82
- Signup: 84

Lowest pages were `About` and `Features`.

## Changes Applied in This Pass

### Global UX quality

- Faster reveal behavior and reduced motion distance.
- Skip link for keyboard users.
- Focus-visible states for interactive elements.
- 44px minimum touch target baseline.
- Better nav/menu ARIA attributes.
- Better form autofill/autocomplete defaults.

### Home

- Added trust strip near hero CTA.
- Added FAQ objection-handling section.
- Improved conversion narrative flow.

### Features (low-score fix)

- Added quick-scan module overview.
- Replaced dense text block with accordion details per module.
- Added feature adoption FAQ.
- Kept full CTA pair at page end.

### Integrations

- Kept stronger FAQ and role clarity from prior pass.
- Kept full CTA pair at page end.

### About (low-score fix)

- Added practical "first 30 days" onboarding expectation section.
- Added FAQ objection-handling section.
- Retained final CTA pair.

## Updated Scores (After This Pass)

- Home: 92
- Features: 89
- Integrations: 88
- About: 86
- Login: 86
- Signup: 88

## Remaining Gaps (Next Iteration)

- Add real product visuals/screenshots for all image placeholder zones.
- Add real proof artifacts (customer outcomes, implementation proofs) once available.
- Instrument analytics events and define A/B test plan for hero and CTA variants.

## Second Pass Update (Implemented)

- Added pricing clarity section on Home (`Starter`, `Growth`, `Scale` positioning).
- Added measurable proof framework section on Home.
- Added deeper integration proof matrix on Integrations.
- Added legal trust pages and footer legal links (`Privacy`, `Terms`, `Cookies`).
- Added analytics instrumentation for:
  - `page_view`
  - `cta_click`
  - `login_submit`
  - `signup_step_view`
  - `signup_step_continue`
  - `signup_step_back`
  - `signup_step_blocked`
  - `signup_complete`
- Added additional accessibility and navigation quality improvements.

## Updated Scores (After Second Pass)

- Home: 94
- Features: 90
- Integrations: 91
- About: 88
- Login: 88
- Signup: 90

## Third Pass Update (Before Image Integration)

- Added route-level dynamic metadata management (`title`, `description`) with synchronized `og` and `twitter` tags.
- Added side-by-side fragmented-stack vs Avero comparison on Home.
- Added operational safeguards section on Home.
- Added integration coverage matrix with `status`, `coverage`, and proof context.
- Added hero image loading priority for primary visual blocks.
- Added baseline A/B test plan document for conversion iteration.

## Updated Scores (After Third Pass)

- Home: 95
- Features: 91
- Integrations: 92
- About: 89
- Login: 88
- Signup: 90

## Remaining Gaps (Post Third Pass)

- Replace all placeholders with real product visuals.
- Replace proof framework placeholders with verified customer outcomes.
- Connect analytics events to production analytics infrastructure and dashboard.
- Run first A/B cycle and tune based on measured conversion deltas.
