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
  assert.match(html, /전국 철거 무료견적 상담/);
  assert.match(html, /견적 신청/);
  assert.match(html, /가능 작업/);
  assert.match(html, /지원금은 받을 수 있는 조건인지부터 확인합니다/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("uses project assets and product metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /main-hero\.webp/);
  assert.match(page, /ai-consultation-01\.webp/);
  assert.match(page, /NAVER_FORM_URL/);
  assert.match(page, /강릉 철거/);
  assert.match(layout, /cheolgeoon\.com/);
  assert.match(layout, /전국 철거 무료견적/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
