/**
 * 시군구 철거전문업체 페이지의 문구 변형 배정값(salt)을 고른다.
 *
 * 빌드된 서버(dist/server)로 지역마다 후보 salt 별 본문을 렌더링하고,
 * 같은 시도 지역끼리 4글자 조각(shingle) 겹침이 가장 작아지도록 탐욕적으로 배정한다.
 * 결과는 data/company-variant-salts.json. 실행 전 `npm run build` 필요.
 *
 * 사용: node scripts/tune-company-salts.mjs [후보 수=16] [반복=3]
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const CANDIDATES = Number(process.argv[2] ?? 16);
const PASSES = Number(process.argv[3] ?? 3);

const regionsData = JSON.parse(await readFile(path.join(rootDir, "data/generated/regions.json"), "utf8"));
const regions = regionsData.regions.filter((region) => region.sidoShort !== "전남광주통합");

const workerUrl = pathToFileURL(path.join(rootDir, "dist/server/index.js"));
workerUrl.searchParams.set("tune", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

function mainText(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  return main
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, "");
}

function shingles(text) {
  const set = new Set();
  for (let i = 0; i + 4 <= text.length; i += 1) set.add(text.slice(i, i + 4));
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const item of small) if (large.has(item)) inter += 1;
  return inter / (a.size + b.size - inter);
}

async function render(region, salt) {
  globalThis.__COMPANY_SALTS__ = { [region.slug]: salt };
  const url = `http://localhost${encodeURI(`/regions/${region.slug}/철거전문업체`)}`;
  const response = await worker.fetch(new Request(url, { headers: { accept: "text/html" } }), env, ctx);
  return shingles(mainText(await response.text()));
}

// 지역 × 후보 salt 본문 조각
const variants = new Map();
let done = 0;
for (const region of regions) {
  const list = [];
  for (let salt = 0; salt < CANDIDATES; salt += 1) list.push(await render(region, salt));
  variants.set(region.slug, list);
  done += 1;
  if (done % 50 === 0) console.log(`rendered ${done}/${regions.length}`);
}
delete globalThis.__COMPANY_SALTS__;

const bySido = new Map();
for (const region of regions) {
  if (!bySido.has(region.sidoShort)) bySido.set(region.sidoShort, []);
  bySido.get(region.sidoShort).push(region.slug);
}

const chosen = Object.fromEntries(regions.map((region) => [region.slug, 0]));
for (let pass = 0; pass < PASSES; pass += 1) {
  for (const slugs of bySido.values()) {
    for (const slug of slugs) {
      let best = chosen[slug];
      let bestScore = Infinity;
      for (let salt = 0; salt < CANDIDATES; salt += 1) {
        const mine = variants.get(slug)[salt];
        let worst = 0;
        let sum = 0;
        for (const other of slugs) {
          if (other === slug) continue;
          const score = jaccard(mine, variants.get(other)[chosen[other]]);
          worst = Math.max(worst, score);
          sum += score;
        }
        const total = worst * 2 + sum / Math.max(1, slugs.length - 1);
        if (total < bestScore) {
          bestScore = total;
          best = salt;
        }
      }
      chosen[slug] = best;
    }
  }
  console.log(`pass ${pass + 1} done`);
}

const outPath = path.join(rootDir, "data/company-variant-salts.json");
const current = JSON.parse(await readFile(outPath, "utf8"));
await writeFile(outPath, `${JSON.stringify({ note: current.note, salts: chosen }, null, 2)}\n`, "utf8");
console.log(`saved ${Object.keys(chosen).length} salts -> ${outPath}`);
process.exit(0);
