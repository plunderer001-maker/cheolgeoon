import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
}

test("server-renders the cheolgeoon homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko"/i);
  assert.match(html, /철거온/);
  assert.match(html, /<title>철거업체 순위보다 중요한 기준 \| 철거비용 무료견적 \| 철거온<\/title>/);
  assert.match(html, /<h1>철거업체 순위보다 중요한 건,<br\/>우리 현장 철거비용입니다<\/h1>/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(html, /견적 신청/);
  assert.match(html, /href="https:\/\/naver\.me\/FLEWiPhf"/);
  assert.match(html, /좋은 철거업체 고르는/);
  assert.match(html, /href="\/guide\/폐업-철거지원금\/"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("uses project assets and product metadata", async () => {
  const [page, landing, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Landing.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(landing, /main-hero\.webp/);
  assert.match(landing, /NAVER_FORM_URL/);
  assert.doesNotMatch(landing, /ai-pool/);
  assert.match(page, /LandingHero/);
  assert.match(page, /\/guide\/원상복구-철거\//);
  assert.match(layout, /cheolgeoon\.netlify\.app/);
  assert.match(layout, /전국 철거 무료견적/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
