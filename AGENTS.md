# Working instructions for the Pignatelli family project

Read `docs/CURSOR_HANDOFF.md` before working on the family site. These instructions apply to family features; the repository also contains Paolo's academic website.

## Roles and scope

Paolo and ChatGPT lead research, family-facing demos, agent behavior, and product direction. Cursor owns routine implementation and administration: repository hygiene, deployment checks, bugs, documentation, access setup, contribution plumbing, and practical verification. Suggest improvements, but do not silently expand the product or rewrite the research program. Preserve unrelated academic pages and domain configuration.

Act autonomously on reversible work within Paolo's requests. Make changes reviewable and report results. Do not force-push, discard local work, change domains, remove authentication, expose paid endpoints, or introduce subscriptions as routine maintenance. Do not contact relatives or send WhatsApp/email messages without an explicit request.

## Evidence and family content

- Every relationship edge needs a source and an attribution/status. Distinguish records, published genealogies, attributed family testimony, and hypotheses.
- Do not infer ancestry from a surname, title succession, shared historical context, or AI agreement. Preserve identity ambiguity and unresolved links.
- Public family content must use public or explicitly approved material. Do not add references to private family papers or confidential conversations.
- Keep people, families, branches, publications/editions/pages, events, and crest variants distinct. Preserve corrections and their provenance.
- JEV distributions assess supplied evidence against defined alternatives. They are not calibrated probabilities of kinship. Never accept a graph edge solely because a score exceeds a threshold.
- Agent role calls using one model do not provide independent corroboration. Repeated books may copy one underlying source.

## Operations

Public hosting: GitHub Pages at paolopignatelli.com. Private agent service: Vercel project pignatelli-family-agents, root directory family-agent-service. Keep these hosting roles distinct.

Never print credentials or put them in source, commits, browser JavaScript, URLs, or logs. Paolo's Mac has `~/.config/typesafe/env`; parse it as data, never source/execute it. Check key availability without displaying its value. Cloud workspaces cannot assume access to that Mac file. No paid smoke test is authorized merely by this handoff.

Before editing, inspect git status and current remote head; preserve local work. Use branches for substantial changes. Run appropriate checks (`npm test --prefix family-agent-service` for service logic), inspect desktop/mobile behavior for UI changes, and verify deployed commit/status when publishing. Documentation-only edits do not need model calls or application tests.

Shared graph/widgets exist in family-agent-service and are served by both sites. Inspect public and private behavior after changes. GitHub Pages serves repository files publicly, including service source: server-side secrets must remain in hosting environment variables.

Finish with what changed, validation, unresolved blockers, and one recommended next step. Maintain a short dated operations log in docs; record no secrets or private family content.
