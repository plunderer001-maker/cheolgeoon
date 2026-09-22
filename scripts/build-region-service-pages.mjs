import fs from "node:fs";
import path from "node:path";

/**
 * 지역 × 주제 페이지 데이터 생성.
 *
 * - data/topics.json 의 주제마다 regions.json 의 모든 시군구 페이지를 만든다.
 * - 과거에 존재했던 서비스 슬러그(상가-철거 등)와 중복 시도 코드(전남광주통합)는
 *   retired-routes.json 에 기록해 export 단계에서 301 리다이렉트로 처리한다.
 */

const dataDir = path.resolve("data", "generated");
const regionsPath = path.join(dataDir, "regions.json");
const topicsPath = path.resolve("data", "topics.json");
const outputPath = path.join(dataDir, "region-service-pages.json");
const retiredPath = path.join(dataDir, "retired-routes.json");

// 과거 지역 페이지에 붙어 있던 서비스 슬러그. 지금은 주제(topics.json)로 대체됐다.
const RETIRED_SERVICE_SLUGS = [
  "상가-철거",
  "상가-철거-비용",
  "사무실-철거",
  "식당-철거",
  "카페-철거",
  "학원-철거",
  "원상복구-철거",
  "폐업-철거",
  "철거-업체",
];

// 법정동코드 원본에 옛 코드와 새 코드가 함께 들어 있어 중복된 시도. 옛 시도(전남·광주) 쪽을 유지한다.
const DUPLICATE_SIDO_SHORT = "전남광주통합";

const regionsData = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8")).topics;

const duplicateRegions = regionsData.regions.filter((region) => region.sidoShort === DUPLICATE_SIDO_SHORT);
const regions = regionsData.regions.filter((region) => region.sidoShort !== DUPLICATE_SIDO_SHORT);

function regionType(region) {
  const { sigungu, sido } = region;
  if (sigungu.endsWith("군")) return "군";
  if (sigungu.endsWith("구")) return /특별시|광역시/.test(sido) ? "자치구" : "일반구";
  return "시";
}

function checksum(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

const TITLE_TAILS = {
  자치구: [
    "관리사무소 협의와 양중 조건까지 확인",
    "엘리베이터·주차 조건별 견적 기준",
    "상가 밀집 지역 철거 견적 확인 순서",
  ],
  일반구: [
    "신도시 상가와 구도심 견적 기준",
    "아파트 상가·오피스 철거 비용 항목",
    "방문 견적 전 확인할 비용 변동 요인",
  ],
  시: [
    "구도심과 신시가지 상가 견적 기준",
    "평수보다 먼저 볼 비용 변동 요인",
    "방문 견적 전 확인할 비용 항목",
  ],
  군: [
    "출장 일정과 폐기물 반출 조건 안내",
    "읍면 지역 방문 견적 기준",
    "이동 거리까지 반영한 견적 확인",
  ],
};

const DESCRIPTIONS = {
  자치구: (r, t) =>
    `${r.name} ${t.keyword}은 평수보다 관리사무소 작업 시간, 엘리베이터 양중, 공용부 보양 조건에 따라 달라집니다. 사진으로 1차 범위를 보고 방문 견적이 필요한 조건을 안내합니다.`,
  일반구: (r, t) =>
    `${r.name} ${t.keyword}은 아파트 상가와 오피스 건물의 반출 규정, 폐기물 양, 마감재 종류에 따라 달라집니다. ${r.name} 현장 조건별 견적 기준과 준비물을 정리했습니다.`,
  시: (r, t) =>
    `${r.name} ${t.keyword}은 구도심 상가와 신시가지 건물의 반출 동선, 폐기물 양, 마감재 종류에 따라 달라집니다. 견적이 갈리는 항목과 상담 전 준비물을 안내합니다.`,
  군: (r, t) =>
    `${r.name} ${t.keyword}은 읍면 지역 이동 거리, 폐기물 반출 회차, 작업 일정 묶음 여부에 따라 달라집니다. 출장 견적 기준과 사진으로 먼저 확인할 수 있는 범위를 안내합니다.`,
};

const H1S = {
  자치구: (r, t) => `${r.name} ${t.keyword}, 건물 규정과 양중 조건부터 봅니다`,
  일반구: (r, t) => `${r.name} ${t.keyword}, 반출 규정과 마감 범위부터 봅니다`,
  시: (r, t) => `${r.name} ${t.keyword}, 현장 조건별 견적 기준을 안내합니다`,
  군: (r, t) => `${r.name} ${t.keyword}, 이동 거리와 반출 조건까지 봅니다`,
};

const pages = regions.flatMap((region) =>
  topics.map((topic) => {
    const slug = `${region.slug}/${topic.slug}`;
    const type = regionType(region);
    const variant = checksum(slug) % 3;

    return {
      slug,
      regionSlug: region.slug,
      serviceSlug: topic.slug,
      keyword: `${region.name} ${topic.keyword}`,
      title: `${region.name} ${topic.keyword} | ${TITLE_TAILS[type][variant]}`,
      description: DESCRIPTIONS[type](region, topic),
      h1: H1S[type](region, topic),
      variant,
      regionType: type,
      region,
      service: topic,
    };
  }),
);

const output = {
  source: regionsData.summary.source,
  regionCount: regions.length,
  serviceCount: topics.length,
  pageCount: pages.length,
  services: topics,
  pages,
};

const retired = {
  note: "export-static-html.mjs 가 _redirects 를 만들 때 사용한다.",
  retiredServiceSlugs: RETIRED_SERVICE_SLUGS,
  duplicateRegions: duplicateRegions.map((region) => {
    const counterpart = regions.find(
      (candidate) => candidate.sigungu === region.sigungu && ["전남", "광주"].includes(candidate.sidoShort),
    );
    return { slug: region.slug, counterpartSlug: counterpart?.slug ?? null };
  }),
  regionSlugs: regions.map((region) => region.slug),
  topicSlugs: topics.map((topic) => topic.slug),
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
fs.writeFileSync(retiredPath, JSON.stringify(retired, null, 2), "utf8");
console.log(
  `Generated ${pages.length} region topic pages for ${regions.length} regions × ${topics.length} topics (${duplicateRegions.length} duplicate regions retired)`,
);
