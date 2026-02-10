# Avero Landing A/B Test Plan

Date: 2026-02-10

## Goal

Increase qualified `Get Access` conversions while preserving signup completion quality.

## Primary Metric

- `cta_click` to `/signup` from landing pages.

## Secondary Metrics

- `signup_step_continue` completion rate by step.
- `signup_complete` rate.
- `login_submit` rate (returning-user signal).

## Guardrail Metrics

- Bounce-like proxy: page views with no CTA or step interaction.
- Signup blockage events: `signup_step_blocked`.

## Initial Experiments

1. Hero value proposition variant
- Control: current headline.
- Variant: tighter outcome-first headline.

2. Pricing clarity variant
- Control: current pricing section.
- Variant: stronger plan-fit copy with clearer onboarding expectations.

3. Trust strip variant
- Control: current trust bullets.
- Variant: reordered trust bullets emphasizing compliance first.

## Tracking Events (already implemented)

- `page_view`
- `cta_click`
- `login_submit`
- `signup_step_view`
- `signup_step_continue`
- `signup_step_back`
- `signup_step_blocked`
- `signup_complete`

## Execution Notes

- Run one major narrative experiment at a time.
- Keep test windows long enough for stable signal.
- Segment by source and device where possible.

