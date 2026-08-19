import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "static-site");
const clientDir = path.join(rootDir, "dist", "client");
const workerPath = path.join(rootDir, "dist", "server", "index.js");
const seoDataPath = path.join(rootDir, "data", "generated", "seo-pages.json");
const regionsDataPath = path.join(rootDir, "data", "generated", "regions.json");
const regionServiceDataPath = path.join(rootDir, "data", "generated", "region-service-pages.json");

function stripClientRuntime(html) {
  return html
    .replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\sdata-rsc-css-href="[^"]*"/gi, "");
}

function routeToFilePath(route) {
  if (route === "/") return path.join(outputDir, "index.html");

  const segments = route
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  return path.join(outputDir, ...segments, "index.html");
}

async function renderRoute(worker, route) {
  const url = `http://localhost${route
    .split("/")
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/")}`;

  const response = await worker.fetch(
    new Request(url, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to render ${route}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("text/html")) {
    throw new Error(`Expected HTML for ${route}, received ${contentType}`);
  }

  return stripClientRuntime(await response.text());
}

async function writeRoute(worker, route) {
  const html = await renderRoute(worker, route);
  const filePath = routeToFilePath(route);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
}

async function main() {
  const seoData = JSON.parse(await readFile(seoDataPath, "utf8"));
  const regionsData = JSON.parse(await readFile(regionsDataPath, "utf8"));
  const regionServiceData = JSON.parse(await readFile(regionServiceDataPath, "utf8"));
  const routes = [
    "/",
    "/services",
    ...seoData.pages.map((page) => `/services/${page.slug}`),
    "/regions",
    ...regionsData.regions.map((region) => `/regions/${region.slug}`),
    ...regionServiceData.pages.map((page) => `/regions/${page.slug}`),
  ];

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await cp(clientDir, outputDir, { recursive: true });

  const workerUrl = pathToFileURL(workerPath);
  workerUrl.searchParams.set("export", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const startedAt = Date.now();
  for (let index = 0; index < routes.length; index += 1) {
    await writeRoute(worker, routes[index]);

    const completed = index + 1;
    if (completed % 500 === 0 || completed === routes.length) {
      const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.log(`Exported ${completed}/${routes.length} pages in ${elapsedSeconds}s`);
    }
  }

  console.log(`Static HTML export complete: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
