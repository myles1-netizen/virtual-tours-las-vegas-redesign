# Security Checklist — Hard Requirements

The client explicitly asked for zero vulnerabilities and everything up to date. Treat every item below as required, not optional, for anything touching authentication, user input, or the editing system.

## Authentication

- [ ] Never store plaintext passwords. If any custom auth exists at all, use a proper adaptive hash (bcrypt/argon2/scrypt) with a per-user salt — never MD5/SHA1/SHA256 alone.
- [ ] Prefer a maintained auth provider (Cloudflare Access, GitHub OAuth via a standard library, etc.) over hand-rolled session/password logic. Every line of custom auth code is a line that needs to be right.
- [ ] Rate-limit login attempts. No unlimited-retry login endpoint.
- [ ] Sessions/cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict` at minimum.
- [ ] Any OAuth proxy/worker (e.g. for a git-based CMS) must validate the `state` parameter to prevent CSRF on the OAuth flow, and must never log or expose the client secret.

## Secrets

- [ ] No API keys, tokens, or credentials committed to the git repo, ever — check `.gitignore` covers `.env*` (it already does in this repo).
- [ ] Any required secret (OAuth client secret, form endpoint token, etc.) goes in the hosting platform's environment/secrets store (Cloudflare Pages env vars, GitHub Actions secrets), never in a config file that's committed.
- [ ] Before any commit, sanity-check `git status`/`git diff` for anything that looks like a credential, even in a file that looks innocuous.

## Content/input handling

- [ ] Any content editable via the CMS and later rendered on the public site must be properly escaped/sanitized on render — this is exactly the surface where stored XSS lives if a CMS field is treated as trusted raw HTML without sanitization. If rich-text/HTML fields are offered, sanitize with an allowlist-based sanitizer, don't trust the CMS UI alone to prevent malicious input.
- [ ] Validate/constrain any user-uploaded images (file type, size limits) if an image-upload feature is built.

## Dependencies

- [ ] Run `npm audit` (or equivalent) before considering the build done, and address any high/critical findings.
- [ ] Use current major versions of everything where reasonable — Astro 7 requires Node ≥22.12; whatever CMS/tooling gets added should target current stable releases, not something abandoned/unmaintained.
- [ ] Avoid adding dependencies from unverified/unknown publishers without checking their legitimacy first (this came up during development — a plausible-looking "MCP server" package turned up in an untrusted context and was correctly not installed without verification first; apply the same scrutiny to any new package).

## Headers / transport

- [ ] HTTPS enforced everywhere (Cloudflare Pages does this by default — confirm it stays on).
- [ ] The existing CSP meta tag and referrer-policy meta in `src/layouts/Base.astro` should be preserved/updated to match whatever new resources (CMS admin scripts, OAuth worker domain, etc.) get added — don't silently loosen it to `unsafe-inline`/wildcard sources without reason, and don't let it go stale (blocking legitimate new resources) either.

## Production safety

- [ ] Never touch or deploy directly against the live production WordPress site (virtualtourslasvegas.com) as part of this build — it's explicitly out of scope. Everything here is a parallel replacement, not a live-site modification.
- [ ] Whatever ends up as the final login credential for Mike, make sure it's something he can reset/rotate himself without needing a developer, and document that process clearly for him.
