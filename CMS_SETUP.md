# CMS Setup (one-time)

The admin dashboard at `/admin` lets Mike edit the entire site with **just a
username and password**. The GitHub token is never shown to him and never
entered in the browser — it lives server-side.

## Set these two environment variables in Cloudflare Pages

**Dashboard → your project → Settings → Environment variables → Production**

| Variable | Value | What it does |
|---|---|---|
| `GH_TOKEN` | `github_pat_11CGSISBI...` (the fine-grained PAT) | Lets the server commit edits to the repo. **Never exposed to the browser.** |
| `CMS_PASSWORD` | `Gfs**kU$x2bAc$P8` | The admin password Mike types at `/admin`. |
| `ADMIN_USERNAME` | `VTLV` *(optional)* | The admin username. Defaults to `VTLV`. |

After setting them, trigger a redeploy (push any commit, or hit "Retry
deployment" in Cloudflare).

## How it works

```
Mike signs in at /admin (username + password only)
        ↓
Browser hashes the password, sends the hash with every request
        ↓
Cloudflare Function (/api/cms/github-proxy) verifies the hash,
injects the real GitHub PAT, talks to the GitHub API
        ↓
GitHub commits the edit → Cloudflare rebuilds → site updates in ~90s
```

The PAT is never sent to the browser. Mike never sees or types it.

## Admin credentials

- **Username:** `VTLV`
- **Password:** `Gfs**kU$x2bAc$P8`

(Both overridable via environment variables at build time.)
