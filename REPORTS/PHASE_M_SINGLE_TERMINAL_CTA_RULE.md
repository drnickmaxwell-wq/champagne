# Phase M — Single Terminal CTA Rule

Audit generated with `scripts/phase_m_single_terminal_cta_rule.ts` to enforce a single CTA surface in the terminal zone on treatment pages.

## Summary
- Treatment pages evaluated: **71**
- Pages where a mid CTA was absorbed into the closing CTA: **17**
- Pages with more than one CTA box in the terminal zone **before** arbitration: **15**
- Pages with more than one CTA box in the terminal zone **after** arbitration: **0**

## Example pages (section order → mid/closing CTA positions)
| Page | Section order | Mid CTA index(es) | Closing CTA index(es) | Absorbed mid CTA index(es) | Suppressed closing CTA index(es) |
| --- | --- | --- | --- | --- | --- |
| /treatments/clear-aligners | treatment_overview_rich > features > treatment_overview_rich > features > features > treatment_media_feature > features > treatment_mid_cta > treatment_faq_block > treatment_closing_cta > features > treatment_overview_rich > treatment_closing_cta | [7] | [9, 12] | [] | [9] |
| /treatments/clear-aligners-spark | treatment_overview_rich > features > treatment_overview_rich > features > features > features > features > treatment_media_feature > features > features > treatment_mid_cta > treatment_faq_block > features > treatment_closing_cta > features > treatment_overview_rich > treatment_closing_cta | [10] | [13, 16] | [] | [13] |
| /treatments/veneers | treatment_overview_rich > features > treatment_overview_rich > treatment_overview_rich > features > features > treatment_overview_rich > features > treatment_media_feature > features > features > treatment_mid_cta > treatment_faq_block > treatment_overview_rich > treatment_closing_cta | [11] | [14] | [11] | [] |
| /treatments/3d-printed-veneers | treatment_overview_rich > features > treatment_overview_rich > treatment_overview_rich > features > features > features > treatment_media_feature > features > features > treatment_mid_cta > treatment_faq_block > treatment_overview_rich > treatment_closing_cta | [10] | [13] | [10] | [] |
| /treatments/injection-moulded-composite | treatment_overview_rich > features > treatment_media_feature > features > features > features > features > treatment_mid_cta > treatment_closing_cta | [7] | [8] | [7] | [] |
| /treatments/dental-crowns | treatment_overview_rich > features > treatment_overview_rich > features > features > treatment_media_feature > features > features > text > treatment_mid_cta > treatment_faq_block > treatment_overview_rich > treatment_closing_cta | [9] | [12] | [9] | [] |
| /treatments/full-smile-makeover | treatment_overview_rich > treatment_media_feature > treatment_tools_trio > clinician_insight > patient_stories_rail > treatment_mid_cta > treatment_faq_block > treatment_closing_cta | [5] | [7] | [5] | [] |
| /treatments/emergency-dentistry | treatment_overview_rich > features > features > treatment_closing_cta > treatment_media_feature > treatment_closing_cta > treatment_mid_cta > treatment_faq_block > treatment_closing_cta | [6] | [3, 5, 8] | [6] | [] |
| /treatments/emergency-dental-appointments | treatment_overview_rich > features > features > text > treatment_media_feature > treatment_mid_cta > treatment_faq_block > treatment_closing_cta | [5] | [7] | [5] | [] |
| /treatments/severe-toothache-dental-pain | treatment_overview_rich > features > features > text > treatment_media_feature > treatment_mid_cta > treatment_faq_block > treatment_closing_cta | [5] | [7] | [5] | [] |
