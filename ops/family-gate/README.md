# Family password gate — prepared, not activated

Paolo authorized password protection on 7 October 2026 and authorized Cloudflare access or Cursor deployment. The cloud browser's Cloudflare login reports a verification error; no live hosting change was made. Main remains e60f4e313f3eb6266ef3bc0fabec43fe4736f0a7 at preparation.

This is a small shared-read-access gate, not individual member accounts, guardian permissions, uploads, or authorization for paid agents. The Vercel research room keeps its existing protection.

## Implementation

Cloudflare Worker serves bundled family pages after HTTPS Basic authentication. Username: `famiglia`. Password: secret `FAMILY_PASSWORD`, minimum 16 characters, no fallback. Enter a new passphrase directly through Wrangler's secret prompt or Cloudflare's secret UI; never in chat, command arguments, source or logs. Do not reuse the earlier phrase discussed in chat. Browsers prompt for username and password; Basic authentication does not have a reliable cross-browser logout button. Closing the browser or using a private window is useful on shared devices.

All `/family-*` paths, branch data, historical script, and crest are guarded. Auth runs before assets (`run_worker_first: true`). Private responses forbid caching and indexing. Missing assets do not fall through to the public origin. Ordinary academic requests pass through to existing GitHub Pages with Authorization stripped. No paid API is connected. Worker default URL and preview URLs are disabled.

`prepare-assets.mjs` creates a strict allowlist bundle, excluding backend code and credentials. Root styles.css and script.js remain public shared dependencies. The broad apex route makes encoded family paths reach the same authentication check; confirm existing Worker route precedence before adding it. No DNS/CNAME change is required if apex DNS is already proxied.

## Cursor: deployment sequence

1. Fetch this branch through the `github` remote, preserve local documentation work, and inspect current head. Never push website changes to the unrelated `origin`. This preparation does not change main.
2. Run `node --test ops/family-gate/test/gate.test.mjs` and `node ops/family-gate/prepare-assets.mjs` from repository root. Use the official Wrangler package and log in from the Mac normally. Inspect existing routes/proxy status; preserve unrelated Workers. Stop if a subscription or paid upgrade is required.
3. From `ops/family-gate`, deploy first WITHOUT the production `routes` entry, and without enabling workers.dev or preview URLs. Use a temporary local configuration file excluded from git; restore it afterward. Missing password fails closed. Set `FAMILY_PASSWORD` with `wrangler secret put FAMILY_PASSWORD`; Paolo supplies and submits the value directly. Do not expose it to either assistant. Then apply the reviewed production configuration to add the route, checking for conflicts first. If dashboard credential entry is used, Paolo must perform credential creation/entry/submission himself.
4. Verify no credential -> 401; wrong credential -> 401; valid credential -> family page; companion pages and graph/data direct URLs also gated; academic homepage and pages still load. Verify on phone/private window; no credential/header values in logs. Confirm deployed Worker version and configuration, not just local tests.
5. IMPORTANT: a Cloudflare gate alone does NOT make the existing PUBLIC GitHub source private. Existing family HTML/graph remains readable from GitHub/raw URLs. Before claiming family content is private, create a private family source/deployment location and move the maintained family files there. Preserve existing Vercel integration/protection; inspect migration effects before moving service source. Do not rewrite/delete repository history. Previously published material cannot be made unseen.
6. Once the protected deployment works, remove family content from the public Pages publishing output (e.g. isolated academic-only publish directory/build) and remove maintained family-content files from the public repository in a normal commit. Preserve navigation links to the protected URL and shared academic assets. Verify the default GitHub Pages hostname and origin no longer serve family content. Purge relevant cached family URLs after removal. A private repo alone does not make GitHub Pages private: never use Pages as the private family origin.
7. Only report completion after live authentication AND public-origin cleanup have passed. If account access blocks deployment, report that clearly: the page is still public.

Paolo has authorized the password protection and necessary reversible setup. Do not ask for general permission again. Ask only for actual missing account access, secret entry, a paid commitment, or a consequential unanticipated change.

## Rollback

Do not remove the gate as routine rollback: that reopens access. Roll back Worker code/assets to a known protected version or fail closed (503). Retain the password secret and public publishing exclusions. Removing the route is allowed only with Paolo's explicit decision to reopen the family section. Keep GitHub Pages academic hosting and Vercel protection intact.

## Verification limits

Seven Node tests passed at preparation: family/data challenges, invalid credentials, absent secret, accepted credentials with no caching, academic pass-through/credential stripping, HTTPS redirect and no-origin-fallback/write refusal. Assets prepared successfully. Tests use a mock ASSETS binding; no live Cloudflare deployment or runtime integration test has occurred. Deployment, route precedence, real asset routing, rate limiting/brute-force monitoring and public-source migration remain operational tasks. Use a long random passphrase for this shared gate; move to managed individual sign-in before private submissions or permissioned member/child features.

References:
- https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- https://developers.cloudflare.com/workers/configuration/routing/routes/
- https://developers.cloudflare.com/workers/examples/basic-auth/
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site


## Public tree after cleanup

The allowlisted family files are no longer in this public repository. Rebuild the Worker bundle from the private repository `PaoloTCS/pignatelli-family-source`, not from GitHub Pages. Do not publish that private repository with GitHub Pages.
