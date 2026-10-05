# Pignatelli family research pilot

Node 22 Vercel service, linked alongside the GitHub Pages family tab. This is a live bounded model workflow, not the static investigation replay.

An explorer calls a fixed `read_family_source` tool for up to three source pages. The reader returns an access log and bounded selected HTML excerpts. A reviewer gets the actual excerpts and explorer output; a coordinator gets both prior outputs and the same evidence. Separate role calls use one OpenAI model; there is no claim of independent corroboration or original-record verification. No general web search, relatives contacted, genealogy mutation, file upload or personal-data form.

Authentication uses the Vercel deployment's OIDC token, or an optional server-only AI Gateway key. No secrets are in source. The deployed pilot should retain the hosting team's preview protection. Do not expose an unlimited model endpoint through the public GitHub Pages site. Future public use requires persistent quotas and membership access.

Each run has at most six bounded model calls and three fixed-host HTTP source reads. Sources cannot redirect to unrelated hosts. Requests are same-origin POST only. Provider failures, quota failure and partial runs are visible. Completed reports can be downloaded; this app does not persist reports.

Run `npm test` for orchestration, input, and source-access tests. Deploy this directory as the Vercel project's root. The static GitHub Pages site stays on its existing domain and hosting.
