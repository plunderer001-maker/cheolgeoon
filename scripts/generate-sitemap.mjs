import fs from "node:fs";
import path from "node:path";

const siteUrl = "https://cheolgeoon.netlify.app";
const staticDir = path.resolve("static-site");
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.name === "index.html" ? [fullPath] : [];
  });
}

function routeFromIndex(filePath) {
  const relative = path.relative(staticDir, filePath).replaceAll(path.sep, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/\/index\.html$/, "/")}`;
  return route
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
    .replaceAll("%2F", "/");
}

const urls = walk(staticDir)
  .map(routeFromIndex)
  .sort((a, b) => a.localeCompare(b, "ko"))
  .map((route) => `${siteUrl}${route}`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === `${siteUrl}/` ? "1.0" : "0.7"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(staticDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(staticDir, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml with ${urls.length} URLs`);
