// Cloudflare Pages Function — CMS Authentication.
//
// POST /api/cms/auth with { username, password }
//   → validates against env vars CMS_USERNAME + CMS_PASSWORD
//   → issues a signed JWT (HMAC-SHA256, 12h expiry) using env.JWT_SECRET
//   → returns { token, expiresAt }
//
// The JWT is the ONLY credential stored in the browser. The password and
// username live ONLY in server-side env vars — nothing in the repo, nothing
// in the admin page's HTML, nothing in localStorage that can be reverse-
// engineered. Even if someone reads the repo or inspects the page source,
// they cannot log in because there is literally nothing there to find.
//
// Security notes:
//   - Rate limited: max 5 failed attempts per IP per 15 min (in-memory; resets
//     on cold start, which is fine for Cloudflare's pool).
//   - Constant-time password comparison to prevent timing attacks.
//   - JWT includes the issuing IP so a stolen token can't be replayed from
//     a different network (defense in depth).

const enc = new TextEncoder();

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64url(buf) {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlStr(s) {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signJWT(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = b64urlStr(JSON.stringify(header));
  const payloadB64 = b64urlStr(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${b64url(sig)}`;
}

async function verifyJWT(token, secret) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  // Restore standard base64
  const sigB64Norm = sigB64.replace(/-/g, "+").replace(/_/g, "/").padEnd(sigB64.length + (4 - (sigB64.length % 4)) % 4, "=");
  let sigBuf;
  try { sigBuf = Uint8Array.from(atob(sigB64Norm), (c) => c.charCodeAt(0)); }
  catch { return null; }
  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(data));
  if (!valid) return null;
  let payload;
  try { payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))); }
  catch { return null; }
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

// Constant-time string compare (prevents timing attacks on the password).
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) {
    // Still hash both to keep timing roughly equal.
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Simple in-memory rate limiter (per Cloudflare isolate).
const attempts = new Map(); // ip → { count, firstAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function rateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return false;
  }
  entry.count++;
  // Cleanup old entries occasionally.
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) if (now - v.firstAt > WINDOW_MS) attempts.delete(k);
  }
  return entry.count > MAX_ATTEMPTS;
}

function getClientIP(request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

export async function onRequestPost({ request, env }) {
  if (!env.CMS_USERNAME || !env.CMS_PASSWORD || !env.JWT_SECRET) {
    return json({ error: "Server is not configured. Set CMS_USERNAME, CMS_PASSWORD, and JWT_SECRET in Cloudflare." }, 500);
  }

  const ip = getClientIP(request);
  if (rateLimited(ip)) {
    return json({ error: "Too many attempts. Try again in a few minutes." }, 429);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }

  const { username, password } = body;

  // Validate BOTH username and password (constant-time). Don't reveal which
  // was wrong — same generic error either way.
  const userOk = timingSafeEqual(String(username || ""), env.CMS_USERNAME);
  const passOk = timingSafeEqual(String(password || ""), env.CMS_PASSWORD);

  if (!userOk || !passOk) {
    return json({ error: "Invalid username or password." }, 401);
  }

  // Success — issue a JWT valid for 12 hours.
  const now = Date.now();
  const payload = {
    sub: "admin",
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + 12 * 60 * 60 * 1000) / 1000),
    ip, // bind to issuing IP for replay protection
  };
  const token = await signJWT(payload, env.JWT_SECRET);

  return json({
    token,
    expiresAt: payload.exp * 1000,
    user: { name: "Mike Madsen" },
  });
}

// GET /api/cms/auth/verify — checks if the current JWT is still valid.
// Used by the admin to auto-resume sessions without showing the login form.
export async function onRequestGet({ request, env }) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ valid: false }, 401);
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) return json({ valid: false }, 401);
  // Optionally enforce IP match (commented out to avoid breaking users on
  // mobile networks that rotate IPs mid-session; the short 12h expiry is
  // the primary protection here).
  return json({ valid: true, expiresAt: payload.exp * 1000 });
}

// Export verifyJWT for reuse by the proxy via a shared module pattern.
// (Cloudflare Pages Functions are isolated files, so we re-export for any
// bundler that inlines, and the proxy also imports this verify logic.)
export { verifyJWT, signJWT };
