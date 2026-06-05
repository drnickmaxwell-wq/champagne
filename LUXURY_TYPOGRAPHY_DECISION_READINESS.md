# LUXURY_TYPOGRAPHY_DECISION_READINESS

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Readiness verdict

The repository is **not ready for implementation** of a final luxury typography system, but it **is ready for a structured decision pack**. The current evidence is sufficient to define decision questions, risks, and migration boundaries.

## What is already knowable

1. Runtime body typography is Inter-first with system fallbacks.
2. Active token utilities imply Playfair Display for hero/title and Inter for body/lead/eyebrow.
3. Historical imports conflict with active utilities by naming Montserrat/Lora/Inter and Poppins/Inter/IBM Plex Mono.
4. No web font loading is implemented.
5. Tailwind has no typography extension.
6. Component typography is distributed and drift-prone.
7. No typography guard exists.

## What is not yet decided

| Decision | Current state |
| --- | --- |
| Final luxury display font | Undecided; evidence conflicts. |
| Final heading font | Undecided; runtime mostly inherits Inter. |
| Final body font | Runtime Inter-first; historical Lora conflict unresolved. |
| UI font | Runtime Inter-first; historical Director also names Inter UI. |
| Numeric/mono font | Historical IBM Plex Mono mention only; no active implementation. |
| Font loading strategy | Not implemented. |
| Tailwind type token strategy | Not implemented. |
| Global heading binding strategy | Not implemented. |
| Component migration strategy | Not implemented. |
| Typography guard strategy | Not implemented. |

## Decision pack readiness checklist

| Input | Status | Notes |
| --- | --- | --- |
| Runtime truth | Ready | Active theme/type files and component usage are identifiable. |
| Canon conflict inventory | Ready | Playfair vs Montserrat vs Poppins; Inter vs Lora. |
| Font loading inventory | Ready | No loading found. |
| Component drift inventory | Ready | High-level map complete. |
| Performance risk framing | Ready | Need budgets and chosen loading method. |
| Accessibility framing | Partial | Requires chosen fonts and contrast/legibility testing. |
| Brand/legal licensing | Missing | No license/provenance evidence for future fonts. |
| Migration plan | Missing | Needs final typography authority. |
| Guard plan | Missing | Needs agreed allowed APIs/classes/variables. |

## Recommended decision pack structure

A future luxury typography decision pack should contain:

1. **Typography authority statement**
   - Display font.
   - Heading font.
   - Body font.
   - UI font.
   - Numeric/mono font if any.
   - Fallback stacks for each role.

2. **Runtime loading strategy**
   - Self-hosted or Next/font.
   - Weights/subsets.
   - Preload/display policy.
   - Performance budget.

3. **Token architecture**
   - CSS variables such as `--font-display`, `--font-body`, `--font-ui`, `--font-mono`.
   - Semantic size/line-height/letter-spacing tokens.
   - Relationship between CSS token classes and Tailwind theme.

4. **Component binding rules**
   - Hero/title usage.
   - Section heading/body/eyebrow usage.
   - CTA/nav/footer usage.
   - Portal/ops exceptions if applicable.

5. **Migration and guard plan**
   - Allowed files.
   - Sacred file restrictions.
   - Audit-only vs implementation phases.
   - New guard coverage.

6. **Validation plan**
   - Visual regression targets.
   - Font loading inspection.
   - Lighthouse/Core Web Vitals.
   - Accessibility/legibility checks.

## Non-goals for the decision pack

- Do not change fonts without Director authorization.
- Do not edit sacred hero engine files unless explicitly authorized.
- Do not introduce raw colors or style bypasses.
- Do not rely on imported historical docs as active authority without explicit promotion.

## Readiness conclusion

The future agent should begin with a decision record, not code. The current repo provides enough evidence to define typography truth and mismatch, but it does not contain a final approved luxury typography canon or a safe implementation pathway.
