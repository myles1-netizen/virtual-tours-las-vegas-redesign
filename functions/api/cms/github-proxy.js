// Cloudflare Pages Function — CMS API proxy.
//
// This keeps the GitHub PAT entirely server-side. The browser NEVER sees or
// holds the token. Mike logs into /admin with username + password only; every
// save/read the admin does is proxied through this endpoint, which injects the
// PAT from the GH_TOKEN environment variable (set in the Cloudflare dashboard).
//
// Supported operations (POST JSON body):
//   { op: "read",   path }                                  → file contents + sha
//   { op: "write",  path, content, message?, sha? }         → commit
//   { op: "upload", path, content(b64), message? }          → binary upload
//   { op: "delete", path, sha, message? }                   → delete
//   { op: "list",   path }                                  → directory listing
//   { op: "user" }                                          → repo metadata
//   { op: "commits", path?, perPage? }                      → git history
//
// Auth: the browser sends X-CMS-Auth = SHA-256(CMS_PASSWORD). We compare it
// against a hash of the env var CMS_PASSWORD. The password itself is never
// sent. This is a convenience gate, not a hard boundary — the marketing-site
// content is already public. The real credential is the server-side PAT.

const REPO = "MylesThePro1/virtual-tours-las-vegas-redesign";
const BRANCH = "main";
const API = "https://api.github.com";

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

async function ghFetch(path, opts = {}) {
  const token = globalThis.GH_TOKEN;
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
      ...opts.headers,
    },
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error(
      (data && data.message) || `GitHub API error ${res.status}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function onRequestPost({ request, env }) {
  // Bind env at request time (Cloudflare Pages exposes env to the handler).
  globalThis.GH_TOKEN = env.GH_TOKEN;
  globalThis.CMS_PASSWORD = env.CMS_PASSWORD;

  if (!env.GH_TOKEN) {
    return json({ error: "Server is missing the GH_TOKEN environment variable." }, 500);
  }
  if (!env.CMS_PASSWORD) {
    return json({ error: "Server is missing the CMS_PASSWORD environment variable." }, 500);
  }

  // Auth check — compare sent hash to hash of the real password.
  const sentAuth = request.headers.get("x-cms-auth") || "";
  const expectedHash = await sha256Hex(env.CMS_PASSWORD);
  if (sentAuth !== expectedHash) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }
  const { op } = body;

  try {
    switch (op) {
      case "user": {
        const repoData = await ghFetch(`/repos/${REPO}`);
        return json({ repo: { name: repoData.name, full_name: repoData.full_name, default_branch: repoData.default_branch } });
      }

      case "read": {
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}?ref=${BRANCH}`);
        // Contents API returns base64 (for files) or array (for dirs).
        let content = "";
        if (data.content) {
          content = atob(data.content.replace(/\n/g, ""));
        }
        return json({ content, sha: data.sha, path: data.path });
      }

      case "write": {
        const payload = {
          message: body.message || `CMS edit: ${body.path}`,
          content: body.content, // already base64-encoded by the browser
          branch: BRANCH,
        };
        // Include sha if provided (update-in-place). For new files, omit it.
        if (body.sha) payload.sha = body.sha;
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        return json({ ok: true, sha: data.content && data.content.sha, path: body.path, commit: data.commit && data.commit.sha });
      }

      case "upload": {
        const payload = {
          message: body.message || `CMS upload: ${body.path}`,
          content: body.content, // raw base64
          branch: BRANCH,
        };
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        return json({ ok: true, sha: data.content && data.content.sha, path: body.path });
      }

      case "delete": {
        const payload = {
          message: body.message || `CMS delete: ${body.path}`,
          sha: body.sha,
          branch: BRANCH,
        };
        await ghFetch(`/repos/${REPO}/contents/${body.path}`, {
          method: "DELETE",
          body: JSON.stringify(payload),
        });
        return json({ ok: true });
      }

      case "list": {
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}?ref=${BRANCH}`);
        // Normalize: return name, path, sha, type, size for each entry.
        const items = Array.isArray(data)
          ? data.map((e) => ({ name: e.name, path: e.path, sha: e.sha, type: e.type, size: e.size }))
          : [{ name: data.name, path: data.path, sha: data.sha, type: data.type, size: data.size }];
        return json({ items });
      }

      case "commits": {
        const perPage = Math.min(body.perPage || 20, 100);
        const pathParam = body.path ? `&path=${encodeURIComponent(body.path)}` : "";
        const data = await ghFetch(`/repos/${REPO}/commits?sha=${BRANCH}&per_page=${perPage}${pathParam}`);
        return json({
          commits: data.map((c) => ({
            sha: c.sha,
            message: c.commit.message,
            date: c.commit.author && c.commit.author.date,
            author: c.commit.author && c.commit.author.name,
          })),
        });
      }

      default:
        return json({ error: `Unknown op: ${op}` }, 400);
    }
  } catch (err) {
    const status = err.status || 500;
    return json({ error: err.message, details: err.data }, status);
  }
}

// Respond to HEAD/GET with a simple health check (used by the admin's
// connection test) — still requires auth.
export async function onRequestGet({ request, env }) {
  globalThis.GH_TOKEN = env.GH_TOKEN;
  globalThis.CMS_PASSWORD = env.CMS_PASSWORD;
  if (!env.GH_TOKEN) return json({ error: "Missing GH_TOKEN" }, 500);
  const sentAuth = request.headers.get("x-cms-auth") || "";
  const expectedHash = await sha256Hex(env.CMS_PASSWORD || "");
  if (sentAuth !== expectedHash) return json({ error: "Unauthorized" }, 401);
  return json({ ok: true, message: "CMS proxy is live" });
}
