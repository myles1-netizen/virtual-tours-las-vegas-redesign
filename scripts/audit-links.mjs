// Audits the built dist/ for broken internal links and missing images.
import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  let results = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results = results.concat(walk(full));
    else if (e.name.endsWith(".html")) results.push(full);
  }
  return results;
}

const htmlFiles = walk("dist");
const brokenLinks = [];
const missingImages = [];
let totalLinks = 0;
let totalImgs = 0;

function resolves(clean) {
  // Bundled Astro assets (CSS, JS) — check directly in dist/_astro/
  if (clean.startsWith("/_astro/")) {
    return fs.existsSync(path.join("dist", clean));
  }
  // Static files with an extension (images, icons, etc.) — check directly
  if (/\.[a-z0-9]+$/i.test(clean)) {
    return fs.existsSync(path.join("dist", clean));
  }
  // Page routes: /path/ -> dist/path/index.html, /path -> dist/path.html
  const trimmed = clean.replace(/\/$/, "");
  const candidates = [
    path.join("dist", trimmed, "index.html"),
    path.join("dist", trimmed + ".html"),
    trimmed === "" ? path.join("dist", "index.html") : null,
  ].filter(Boolean);
  return candidates.some((c) => fs.existsSync(c));
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = file.replace(/\\/g, "/").replace(/^dist\//, "");

  // HREF links
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    // Skip external, anchors, mailto, tel, sms, data URIs
    if (/^(https?:|mailto:|tel:|sms:|#|data:|javascript:)/.test(href)) continue;
    let clean = href.split("#")[0].split("?")[0];
    if (!clean) continue;
    totalLinks++;
    if (!resolves(clean)) {
      brokenLinks.push(`${clean}  (in ${rel})`);
    }
  }

  // IMG src (for completeness — images should exist in dist/)
  for (const m of html.matchAll(/src="([^"]+)"/g)) {
    const src = m[1];
    if (/^(https?:|data:|blob:)/.test(src)) continue;
    if (src.startsWith("/_astro/")) continue; // bundled assets
    let clean = src.split("#")[0].split("?")[0];
    if (!clean.startsWith("/")) continue;
    totalImgs++;
    const target = path.join("dist", clean);
    if (!fs.existsSync(target)) {
      missingImages.push(`${clean}  (in ${rel})`);
    }
  }
}

console.log("=== LINK AUDIT ===");
console.log(`HTML files: ${htmlFiles.length}`);
console.log(`Internal links checked: ${totalLinks}`);
console.log(`Broken links: ${brokenLinks.length}`);
brokenLinks.sort().forEach((b) => console.log("  BROKEN:", b));

console.log("\n=== IMAGE AUDIT ===");
console.log(`Image srcs checked: ${totalImgs}`);
console.log(`Missing images: ${missingImages.length}`);
missingImages.sort().forEach((m) => console.log("  MISSING:", m));

console.log(
  brokenLinks.length === 0 && missingImages.length === 0
    ? "\n✅ ALL CLEAN — no broken links or missing images."
    : `\n⚠️  ${brokenLinks.length} broken links, ${missingImages.length} missing images.`
);
