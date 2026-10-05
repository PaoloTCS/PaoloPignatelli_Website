# Pignatelli family research pilot

Node 22 Vercel service, linked alongside the GitHub Pages family tab. This is a live bounded model workflow, not the static investigation replay.

An explorer calls a fixed `read_family_source` tool for up to three source pages. The reader returns an access log and bounded selected HTML excerpts. A reviewer gets the actual excerpts and explorer output; a coordinator gets both prior outputs and the same evidence. Separate role calls use one OpenAI model; there is no claim of independent corroboration or original-record verification. No general web search, relatives contacted, genealogy mutation, file upload.

Authentication uses the Vercel deployment's OIDC token, or an optional server-only AI Gateway key. No secrets are in source. The deployed pilot should retain the hosting team's preview protection. Do not expose an unlimited model endpoint through the public GitHub Pages site. Future public use requires persistent quotas and membership access.

Each run has at most six bounded model calls and three fixed-host HTTP source reads. Sources cannot redirect to unrelated hosts. Requests are same-origin POST only. Provider failures, quota failure and partial runs are visible. Completed reports can be downloaded; this app does not persist reports.

Run `npm test` for orchestration, input, and source-access tests. Deploy this directory as the Vercel project's root. The static GitHub Pages site stays on its existing domain and hosting.

## Relationship explorer and Jev

Shared `relationships.js` holds the same attributed paternal links used by both public widgets. The explorer calculates recorded kinship in code and preserves the unconnected Lucio entry. The XIX edition of Libro d’Oro, page 1257, supplied by Paolo, adds explicit sibling and spouse edges. Generic sibling/spouse rules derive in-law relationships. No parents are invented to encode a sibling statement. It is not a complete family graph.

The private room can send one user-supplied source excerpt (40–6000 characters), source label, and one selected path link to TypeSafe Jev. `/api/relationship` uses a server-only `TYPESAFE_API_KEY`; configure that variable in Vercel project settings for Production and redeploy. Do not put the credential in chat, browser scripts, source files, URLs or logs. Without a key the endpoint returns an explicit unavailable status with no invented assessment.

Jev uses Choice to assess textual support, contradiction, ambiguous identity/relationship, or unrelated text. Display the complete distribution, concentration confidence, model version, rubric version and timestamp. These probabilities are not a validated probability of historical truth or biological kinship. No threshold accepts an edge automatically; all results require human review. Supplied excerpts and source labels are not independently authenticated. Neither excerpts nor assessments are persisted by this app. Provider processing still applies.

The endpoint retains same-origin POST and deployment sign-in protection. The public GitHub Pages widget computes relationships locally and opens the private room for Jev assessments.
