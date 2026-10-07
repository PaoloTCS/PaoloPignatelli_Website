# Operations log

## 7 October 2026 — family password protection preparation

Paolo requested password protection for the family section and authorized Cloudflare access or Cursor deployment. Prepared an isolated Cloudflare Worker gate and allowlist asset builder on a branch; no production change. Seven local security behavior tests passed, assets prepared. Cloudflare dashboard sign-in was blocked by a verification error after one reload. Live authentication and public-origin/source cleanup remain pending. Cursor should follow ops/family-gate/README.md, preserve existing local documentation and Vercel protection, and not expose credentials.


## 7 October 2026 — public family source removed

The apex gate was already live. Removed the maintained family pages, crest, historical script, branch catalogue, and shared relationship graph from this public tree in a normal commit. Navigation now points at https://paolopignatelli.com/family-ai.html, which the Worker still serves after sign-in. The same tree at removal time is on the private repository PaoloTCS/pignatelli-family-source. Git history was not rewritten. `family-agent-service/vercel.json` ignores the next Vercel build (`ignoreCommand` exits 0) so this deletion does not replace the existing protected deployment. `CNAME` was not changed.
