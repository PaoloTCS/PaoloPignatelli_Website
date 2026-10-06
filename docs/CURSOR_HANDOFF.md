# PignatelliWebsite — Cursor handoff

Prepared 6 October 2026 for Paolo's Cursor project, `PignatelliWebsite`.

## Purpose and working relationship

The family has welcomed the prototype. Paolo wants a modern AI family site that connects relatives and branches, helps members contribute useful evidence, and demonstrates agents through engaging historical connections. Family members already know much of their genealogy; the emphasis is connecting their knowledge and recovering missing links, rather than teaching everyone their own pedigree.

ChatGPT and Paolo retain research and demo direction. Cursor should carry the administrative and engineering load: keep the site working, make deployments understandable, organize contributions, fix defects, and bring back concrete decisions when scope or access needs Paolo's input. Work in small reviewable increments. Do not turn every routine fix into a permission question.

## Source of truth and hosting

Repository: https://github.com/PaoloTCS/PaoloPignatelli_Website

- Public family tab: https://paolopignatelli.com/family-ai.html
- Historical demo: https://paolopignatelli.com/family-ai.html#historical-connections
- Private agent room: https://pignatelli-family-agents.vercel.app/
- Original family genealogy: https://famigliapignatelli.org/genealogia/

The original family website is managed by other family members. Our project is a development space on Paolo's website; we do not currently administer or mirror the original site's database.

The public site is static GitHub Pages from main/root, using the existing CNAME. Vercel deploys the same repository with `family-agent-service` as its root. Runtime is Node 22. GitHub integration builds on main updates. Preserve existing Vercel sign-in protection; it currently requires access through Paolo's hosting account. Family membership login is not implemented.

Baseline implementation commit: `99080fdebc1690d69faad0bf8add36029a87c47f` (5 October 2026). GitHub Pages deployment succeeded and Vercel deployment `dpl_6wb9QABAXhLezRcvzEN9P229dbS4` was READY for this commit. The public historical selector was checked in the browser. This handoff will be a later documentation commit. Always inspect the current remote head rather than resetting to the baseline.

## File map

| Path | Role |
| --- | --- |
| `family-ai.html`, `family-ai.css`, `family-ai.js` | Public family page, investigation replay, branch prompts and proposed errands |
| `history-connection.js` | Public historical selector and copyable ChatGPT research question |
| `images/pignatelli-coat-of-arms.png` | Approved crest beneath the family name; retain attribution and allow future variants |
| `family-agent-service/relationships.js` | Shared attributed family graph and deterministic relationship rules |
| `family-agent-service/relationship-widget.*` | Shared relationship UI |
| `family-agent-service/index.html`, `room.js`, `room.css` | Private research room UI |
| `family-agent-service/api/research.js`, `lib/agents.js` | Bounded explorer/reviewer/coordinator workflow and fixed source reader |
| `family-agent-service/api/relationship.js`, `lib/jev.js` | JEV assessment of one supplied excerpt against a selected relationship link |
| `family-agent-service/api/historical.js`, `lib/historical-jev.js`, `historical-jev.js` | A–D/none assessment and session evidence rounds |
| `family-agent-service/test/`, `package.json`, `vercel.json` | Tests, Node runtime and function/security configuration |

The academic homepage and linguistics/philosophy/protocols/network pages are separate existing content. Avoid incidental changes to them. The older root README is introductory and incomplete; this handoff describes family functionality more accurately.

## Current behavior

### Public page

The crest is visible beneath Famiglia Pignatelli. The relationship explorer selects two people and filters types of relationships; it derives relations from the recorded graph locally. It includes marriage and sibling edges and preserves an unconnected Lucio entry. The Montecalvo-to-Lucio section is a replay of an earlier investigation, explicitly labeled as such. Branch instructions and proposed errands generate text for family members; they do not contact anyone or run models.

The historical demonstration lets a visitor begin with Paolo, Guido, Pompeo, or Elena Naryshkina Pignatelli. It shows the recorded path to Elena, an unresolved Elena-to-Felix Yusupov stretch, and Felix's documented role in Rasputin's assassination. It generates a research question to copy into ChatGPT. No model or JEV call runs on this public page.

The public sources used for that example are Elena's American Aristocracy entry and the University College Oxford historical account. They establish the starting family segment and the event role respectively; neither establishes Elena's relationship to Felix. The UI therefore reports unknown degrees and unassessed evidence for the missing stretch.

### Private research room

The explorer reads a bounded selection from a fixed source catalogue; reviewer and coordinator receive the actual excerpts. These are separate calls to one OpenAI model. There is no arbitrary web search or original-record verification. Available missions include Lucio, individual links/branches, and the historical connection. Reports can be downloaded but are not persisted by the app.

Research uses Vercel AI Gateway with deployment OIDC or an optional server-only Gateway key; inspect `api/research.js` for actual configuration. Existing request and source limits, same-origin restrictions, and deployment protection must be retained.

JEV uses the server-only `TYPESAFE_API_KEY`. At the last checkpoint it was not configured for the deployed room, and no live numerical historical assessment had been made. Verify current configuration by checking availability/status only; do not retrieve or log secret values.

The historical panel requires four distinct named alternatives A–D and includes a fixed none option. It accumulates up to four attributed excerpts, bounded to 12,000 characters, and reassesses the evidence packet. Changing the people or alternatives starts a new packet. Rounds live only in the page session. The investigate-other-paths button selects the history mission; a user still starts it and reviews/transfers proposed candidates manually. Candidate generation, JEV assessment, new-source retrieval and subsequent rounds are not yet one autonomous loop.

## Genealogy decisions already made

- Paolo confirmed Guido as his father and Pompeo as his grandfather.
- Guido's birth year is 1900. The prior 1906 value was corrected.
- Paolo supplied the Libro d'Oro della Nobilità Italiana, XIX edition, p. 1257. Publication year remains unspecified in the site.
- The book records Paolo and Natalia as siblings and Natalia's marriage to Guido d'Aquino di Caramanico. The widget derives Paolo's brother-in-law relationship from these two edges.
- Elena Naryshkina is Paolo's grandmother; a published compilation lists her spouse Pompeo and child Guido.
- The recorded paternal line reaches Tommaso. There is no verified continuous path from Tommaso to Lucio, traditionally placed around 1102. Lucio's identification is disputed. Do not fill that gap by invention.

## Intended AI/JEV design

Treat persons and events as nodes with typed, attributed edges. A path has a number of links and a separate evidence assessment. Parentage, marriage and participation in an event have different meanings; display edge types. A missing path in our limited graph does not prove that no real-world relationship exists.

The agent proposes exact candidate connections and seeks evidence. JEV assesses supplied evidence against the fixed named fields A, B, C, D, none. If none is favored, the agent seeks other candidates or missing evidence and returns for another round. Record candidate-set identity, sources and assessment metadata so a change can be explained.

Current scores are model choice distributions conditional on a supplied packet and alternatives. They are not calibrated kinship probabilities or automatic Bayesian updates. Do not multiply link scores to obtain a path probability without a defensible joint model; copied claims and shared sources create dependence. Do not directly compare percentages across changed candidate sets. Human review remains the authority for accepting a genealogy edge.

## Administrative backlog, in recommended order

1. Inventory the checkout, GitHub Pages configuration and Vercel root/settings. Run local tests. Return a concise status with actual blockers. Do not spend on model calls for this inventory.
2. Make the service README cover the historical panel and document deployment/rollback procedures. Keep deployment checks lightweight.
3. Help Paolo configure the existing JEV credential securely in the hosting environment when requested. On his Mac it is at `~/.config/typesafe/env`; parse as data without displaying it. Never commit or log it. A later live test needs explicit paid-call authorization.
4. Prepare a simple family login design and implementation proposal. Paolo deferred adding a password earlier; no family password or membership login is currently in use. Preserve hosting protection while developing family access, quotas and membership permissions. Do not expose paid endpoints to anonymous use.
5. Design a contribution flow around phone snapshots of book pages plus source title, edition, page, contributor, and sharing permission. Keep originals, OCR/transcription, proposed claims and reviewed graph edges distinct. Accepted changes must preserve attribution and correction history. File uploads, OCR, review queues and durable storage are not yet implemented.
6. Add durable run/evidence history when the storage and access design is agreed. Do not claim current session-only reports survive a reload.

Leave new research demos, which historical connections to feature, scoring semantics, and the automatic agent/JEV loop to discussion with Paolo and ChatGPT. Offer concrete implementation options when needed.

## Verification and first response

Check `git status`, remote origin and current main before editing. If this Cursor project is an empty folder, clone the existing repository into it only if it is empty; otherwise choose a subdirectory or identify the existing checkout. Do not initialize a competing repository or overwrite work.

For service changes: `npm test --prefix family-agent-service`. The baseline three test files passed before the 5 October release. Syntax checks passed for changed JavaScript. No live JEV assessment was part of that validation. For UI changes verify public and private views, mobile/desktop layouts, selector changes, copied prompts and clear unavailable/error states. For publishing confirm the deployment's commit SHA and status. Keep credentials and supplied private evidence out of logs.

Cursor's first response should report: repository/current branch; local changes; test result; known live hosting; administrative tasks it will handle next; and any input genuinely required from Paolo. It should not claim that reading this handoff means it accessed Vercel, the Mac credential, or the family database.
