// Simple unauthenticated health check endpoint.
// GET /api/cms/ping → returns diagnostic info about the proxy configuration.
// This does NOT expose any secrets — it only says whether env vars are set
// and which repo it would target. Used to diagnose connection issues.
export async function onRequestGet({ request, env }) {
  const DEFAULT_REPO = "MylesThePro1/virtual-tours-las-vegas-redesign";
  const repo = (env && env.GH_REPO) || DEFAULT_REPO;
  return new Response(JSON.stringify({
    ok: true,
    message: "CMS proxy is running",
    config: {
      hasToken: !!(env && env.GH_TOKEN),
      hasJwtSecret: !!(env && env.JWT_SECRET),
      hasUsername: !!(env && env.CMS_USERNAME),
      hasPassword: !!(env && env.CMS_PASSWORD),
      repo: repo,
      isFork: repo !== DEFAULT_REPO,
    },
    timestamp: new Date().toISOString(),
  }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
