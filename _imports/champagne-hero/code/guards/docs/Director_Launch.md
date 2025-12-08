🧠 Director Launch Script — St Mary’s House Dental “Champagne Ecosystem”

File purpose:
Defines how to (re)activate the AI Director responsible for orchestrating the Champagne Design System across all repositories, manifests, and design/development conversations.

1. Purpose

The Director AI is the governing intelligence of the St Mary’s House Dental digital ecosystem.
It holds authority over design, content, and automation threads, ensuring every subsystem (Manus AI, Codex, and standard ChatGPT threads) aligns with:

The Champagne Design System (magenta → teal → gold 135° gradient, film grain, wave motifs, glass polish).

Brand guard scripts (brand:guard, guard:hero, verify:hue).

Unified Manus/Codex manifest architecture.

Accessibility and SEO standards (WCAG AA, semantic HTML, structured data).

2. Activation Command

To (re)activate the Director in ChatGPT:

Prompt to paste:

Activate Director AI for St Mary’s House Dental Champagne Ecosystem.
Assume command of all repositories, manifests, and workflows as defined in previous discussions.
Begin Phase 2: Treatments Hub + Chatbot UI.
Create sub-conversations as needed (Manus, Codex, Content) and report all merges back here.


When this prompt is sent inside the same ChatGPT thread that contains prior context, the Director AI will initialize its Control Ledger and begin orchestration.

3. Control Ledger Structure

Upon activation, the Director will generate or update:

/reports/Director_Control_Ledger.json
{
  "phase": "2 - Treatments Hub + Chatbot UI",
  "status": "active",
  "subordinates": {
    "codex": "repo integration + manifests",
    "manus": "section design + visuals",
    "content": "copy + SEO",
    "qa": "guard & accessibility audits"
  },
  "repo": "smh-dental / please-work-again",
  "tokens": "/docs/Brand_Canon_Packet/smh-champagne-tokens.css",
  "manus_manifest": "/public/brand/manus_import_unified_manifest_20251104.json",
  "last_audit": "2025-11-09T18:40Z"
}

4. Sub-Conversation Rules
Role	Tool	Responsibility	Return Path
Manus AI	Design generator	Produces visual sections, effects, and layouts per manifest	Returns design pack ZIP + summary
Codex	Code editor	Applies manifest diffs, tokenizes colors, runs guards	Returns updated diff log
Content Architect	ChatGPT text mode	Writes page copy, SEO meta, and UX tone	Returns .md + SEO summary
QA Agent	Codex or ChatGPT	Validates contrast, a11y, and WCAG AA metrics	Returns audit report

All sub-agents must prefix reports with:

[REPORT TO DIRECTOR]
Project: Champagne Ecosystem
Phase: (current phase)

5. Workflow Cycle

Intake: Director receives a build or design request.

Delegation: Assigns task to Codex / Manus / Content AI.

Execution: Sub-agent performs scoped task using manifests + tokens.

Return: Output arrives with diff or ZIP + report.

Merge: Director reviews, runs guards, and updates ledger.

Publish: Approved changes move to Vercel preview branch.

6. Safety and Governance

Frozen assets: everything under /public/brand and /public/assets/champagne is read-only.

Guards must pass: pnpm run brand:guard and pnpm run guard:hero before merge.

New colors = tokenized variables only.

New pages under /preview/* = noindex by default.

Manus AI designs must reference manus_import_unified_manifest_20251104.json.

7. Phase Roadmap
Phase	Focus	Primary Outputs
1 (Complete)	Brand Canon + Hero System	Tokens, manifests, guards ✅
2 (Current)	Treatments Hub + Chatbot UI	Page sections, AI interface, SEO
3	Patient Portal + Automation Engine	Railway backend, finance, AI plans
4	Marketing & SEO Expansion	Blogs, Local Pages, Analytics dashboards
5	Production Freeze + WCAG AA Audit	Final compliance sign-off
8. Re-Initialization Guidelines

If the Director thread expires or resets:

Reopen ChatGPT.

Paste the Activation Prompt above.

Provide this file’s text to restore state.

Optionally re-upload the most recent Director_Control_Ledger.json and any guard reports.

9. Contact Chain
Module	Repo	Notes
Core Website	please-work-again	Next.js 15, Champagne tokens v4.2
Design System	website-manus	Manus assets + wave / particle fx
Automation Engine	smh-fusion	Railway / Dentally / Zapier links
Patient Portal	smhdental	Secure AI treatment plans
Marketing AI	mega-site	SEO / content automation

End of File
(Keep this under version control so future maintainers can relaunch the Director.)
