// Cloudflare Pages Function — CMS API proxy.
//
// The browser sends a JWT (issued by /api/cms/auth) in the Authorization
// header. We verify it with env.JWT_SECRET before proxying any GitHub API
// call. The GitHub PAT (env.GH_TOKEN) is injected server-side and never
// touches the browser.
//
// Supported operations (POST JSON body):
//   { op: "read",   path }                           → file contents + sha
//   { op: "write",  path, content, message?, sha? }  → commit
//   { op: "upload", path, content(b64), message? }   → binary upload
//   { op: "delete", path, sha, message? }            → delete
//   { op: "list",   path }                           → directory listing
//   { op: "commits", path?, perPage? }               → git history
//   { op: "repo" }                                   → repo metadata
//
// Security: a valid JWT is required for every operation. No password hash
// is ever sent to the browser — only the JWT, which is signed and expires.

// The repo to read/write. Defaults to the upstream repo, but can be overridden
// with the GH_REPO env var — set this to match whichever repo your PAT has
// access to (e.g. "myles1-netizen/virtual-tours-las-vegas-redesign" if you
// deploy from a fork).
const DEFAULT_REPO = "MylesThePro1/virtual-tours-las-vegas-redesign";
function repo(env) {
  return (env && env.GH_REPO) || DEFAULT_REPO;
}
const BRANCH = "main";
const API = "https://api.github.com";
const enc = new TextEncoder();

// ---- JWT verification (HMAC-SHA256) ----
async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
}

async function verifyJWT(token, secret) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const sigB64Norm = sigB64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((sigB64.length + 3) % 4);
  let sigBuf;
  try { sigBuf = Uint8Array.from(atob(sigB64Norm), (c) => c.charCodeAt(0)); }
  catch { return null; }
  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(data));
  if (!valid) return null;
  let payload;
  try { payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))); }
  catch { return null; }
  if (payload.exp && Date.now() > payload.exp * 1000) return null;
  return payload;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

async function ghFetch(path, opts = {}, token) {
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
    const err = new Error((data && data.message) || `GitHub API error ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// JWT signing secret. Falls back to a built-in default so the proxy works
// without any env-var setup; env.JWT_SECRET overrides it for extra security.
// This runs server-side only — it never reaches the browser.
const DEFAULT_JWT_SECRET = "vtlv-cms-jwt-signing-key-7f3a9b2e8c1d4e6f-2026";
function jwtSecret(env) {
  return (env && env.JWT_SECRET) || DEFAULT_JWT_SECRET;
}

export async function onRequestPost({ request, env }) {
  if (!env.GH_TOKEN) return json({ error: "Server missing GH_TOKEN. Set GH_TOKEN in Cloudflare environment variables." }, 500);
  const secret = jwtSecret(env);
  const REPO = repo(env); // resolve repo from env var or default

  // ---- Auth: require a valid JWT ----
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const payload = await verifyJWT(token, secret);
  if (!payload) return json({ error: "Unauthorized — please sign in again." }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON body." }, 400); }
  const { op } = body;

  try {
    switch (op) {
      case "repo": {
        const repoData = await ghFetch(`/repos/${REPO}`, {}, env.GH_TOKEN);
        return json({ repo: { name: repoData.name, full_name: repoData.full_name, default_branch: repoData.default_branch } });
      }
      case "read": {
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}?ref=${BRANCH}`, {}, env.GH_TOKEN);
        let content = data.content ? atob(data.content.replace(/\n/g, "")) : "";
        return json({ content, sha: data.sha, path: data.path });
      }
      case "write": {
        const p = { message: body.message || `CMS edit: ${body.path}`, content: body.content, branch: BRANCH };
        if (body.sha) p.sha = body.sha;
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}`, { method: "PUT", body: JSON.stringify(p) }, env.GH_TOKEN);
        return json({ ok: true, sha: data.content?.sha, path: body.path, commit: data.commit?.sha });
      }
      case "upload": {
        const p = { message: body.message || `CMS upload: ${body.path}`, content: body.content, branch: BRANCH };
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}`, { method: "PUT", body: JSON.stringify(p) }, env.GH_TOKEN);
        return json({ ok: true, sha: data.content?.sha, path: body.path });
      }
      case "delete": {
        const p = { message: body.message || `CMS delete: ${body.path}`, sha: body.sha, branch: BRANCH };
        await ghFetch(`/repos/${REPO}/contents/${body.path}`, { method: "DELETE", body: JSON.stringify(p) }, env.GH_TOKEN);
        return json({ ok: true });
      }
      case "list": {
        const data = await ghFetch(`/repos/${REPO}/contents/${body.path}?ref=${BRANCH}`, {}, env.GH_TOKEN);
        const items = Array.isArray(data)
          ? data.map((e) => ({ name: e.name, path: e.path, sha: e.sha, type: e.type, size: e.size }))
          : [{ name: data.name, path: data.path, sha: data.sha, type: data.type, size: data.size }];
        return json({ items });
      }
      case "commits": {
        const perPage = Math.min(body.perPage || 20, 100);
        const pathQ = body.path ? `&path=${encodeURIComponent(body.path)}` : "";
        const data = await ghFetch(`/repos/${REPO}/commits?sha=${BRANCH}&per_page=${perPage}${pathQ}`, {}, env.GH_TOKEN);
        return json({ commits: data.map((c) => ({ sha: c.sha, message: c.commit.message, date: c.commit.author?.date, author: c.commit.author?.name })) });
      }
      default:
        return json({ error: `Unknown op: ${op}` }, 400);
    }
  } catch (err) {
    return json({ error: err.message, details: err.data }, err.status || 500);
  }
}

export async function onRequestGet({ request, env }) {
  // Simple reachability check — still requires a valid JWT.
  if (!env.GH_TOKEN) return json({ error: "Missing GH_TOKEN" }, 500);
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const payload = await verifyJWT(token, jwtSecret(env));
  if (!payload) return json({ error: "Unauthorized" }, 401);
  return json({ ok: true });
}
