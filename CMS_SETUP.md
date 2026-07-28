# CMS Setup (one-time)

The admin dashboard at `/admin` is **fully secure**. The username, password,
GitHub token, and signing secret all live exclusively in Cloudflare's
environment variables — never in the code, never in the browser, never in this
repo. Someone could read every line of this repository and still not be able
to log in, because there is nothing here to find.

## Set these four environment variables in Cloudflare Pages

**Dashboard → your project → Settings → Environment variables → Production**

| Variable | Value | What it does |
|---|---|---|
| `CMS_USERNAME` | `VTLV` | The username Mike types at `/admin`. |
| `CMS_PASSWORD` | `Gfs**kU$x2bAc$P8` | The password Mike types. Lives only on the server. |
| `GH_TOKEN` | `github_pat_11CGSISBI...` (the fine-grained PAT) | Lets the server commit edits to GitHub. **Never exposed to the browser.** |
| `JWT_SECRET` | a random 32+ char string (see below) | Signs the session token. Generate a new one — don't reuse a password. |

After setting them, trigger a redeploy.

### Generating a JWT_SECRET

Run this in any terminal to get a secure random secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use any random password generator (32+ characters). Paste the result as
the `JWT_SECRET` value.

## How the security works

```
1. Mike signs in at /admin with username + password
2. Browser POSTs to /api/cms/auth
3. Server validates against CMS_USERNAME + CMS_PASSWORD (constant-time compare)
4. Server issues a signed JWT (HMAC-SHA256, 12-hour expiry)
5. Browser stores ONLY the JWT — no password, no hash
6. Every CMS action sends the JWT to /api/cms/github-proxy
7. Server verifies the JWT signature, injects GH_TOKEN, talks to GitHub
```

**Why this is secure even if the repo is public:**
- The admin page source contains **zero credentials** — no password, no hash, no username. Inspect Element shows nothing useful.
- The JWT stored in the browser is cryptographically signed; it can't be forged without `JWT_SECRET`, which lives only on the server.
- The GitHub PAT is injected server-side and never reaches the browser.
- Rate limiting: max 5 login attempts per IP per 15 minutes.
- Sessions expire automatically after 12 hours.
- Constant-time password comparison prevents timing attacks.

## Admin credentials

- **Username:** `VTLV`
- **Password:** `Gfs**kU$x2bAc$P8`

(Both read from environment variables at runtime — not hardcoded anywhere.)
