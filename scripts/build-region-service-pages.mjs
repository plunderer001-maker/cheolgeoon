import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("data", "generated");
const regionsPath = path.join(dataDir, "regions.json");
const outputPath = path.join(dataDir, "region-service-pages.json");

const services = [
  {
    slug: "상가-철거",
    keyword: "상가 철거",
    intent: "상업 공간 철거",
    image: "/images/cheolgeoon/hero/store-clearance-hero.webp",
    titleTails: ["원상복구와 방문 견적 안내", "퇴거 전 작업 범위 체크", "집기 정리와 내부 철거 상담"],
    focus: "매장 집기, 바닥재, 천장 마감, 벽체 마감",
  },
  {
    slug: "상가-철거-비용",
    keyword: "상가 철거 비용",
    intent: "비용 확인",
    image: "/images/cheolgeoon/sections/commercial-unit-demolition.webp",
    titleTails: ["평수별 견적 기준과 준비사항", "방문 견적 전 확인할 비용 기준", "원상복구 비용 상담 체크"],
    focus: "평수, 마감재 종류, 폐기물 양, 반출 동선",
  },
  {
    slug: "사무실-철거",
    keyword: "사무실 철거",
    intent: "업무 공간 철거",
    image: "/images/cheolgeoon/hero/office-clearance-hero.webp",
    titleTails: ["파티션과 바닥 원상복구 안내", "퇴실 전 내부 철거 상담", "업무 공간 정리와 견적 기준"],
    focus: "파티션, OA 바닥, 전기 배선, 회의실 구조",
  },
  {
    slug: "식당-철거",
    keyword: "식당 철거",
    intent: "주방 설비 철거",
    image: "/images/cheolgeoon/hero/restaurant-demolition-hero.webp",
    titleTails: ["주방 설비와 덕트 철거 상담", "폐업 정리와 원상복구 기준", "집기 반출과 방문 견적 안내"],
    focus: "주방 설비, 후드, 덕트, 배수 설비",
  },
  {
    slug: "카페-철거",
    keyword: "카페 철거",
    intent: "매장 정리 철거",
    image: "/images/cheolgeoon/sections/interior-removal.webp",
    titleTails: ["인테리어 철거와 원상복구 안내", "카운터 철거와 비용 기준", "퇴거 전 매장 정리 상담"],
    focus: "카운터, 붙박이 가구, 조명, 바닥 마감",
  },
  {
    slug: "학원-철거",
    keyword: "학원 철거",
    intent: "강의실 철거",
    image: "/images/cheolgeoon/hero/academy-demolition.webp",
    titleTails: ["강의실 칸막이와 원상복구 안내", "교습 공간 철거 견적 기준", "퇴실 전 내부 정리 상담"],
    focus: "강의실 칸막이, 게시판, 조명, 바닥재",
  },
  {
    slug: "원상복구-철거",
    keyword: "원상복구 철거",
    intent: "퇴거 원상복구",
    image: "/images/cheolgeoon/sections/final-inspection.webp",
    titleTails: ["임대차 종료 전 체크사항", "퇴거 기준과 방문 견적 안내", "마감 복구 범위 상담"],
    focus: "임대차 원상복구 기준, 훼손 부위, 마감 상태",
  },
  {
    slug: "폐업-철거",
    keyword: "폐업 철거",
    intent: "폐업 정리",
    image: "/images/cheolgeoon/ai-pool/ai-cleanup-01.webp",
    titleTails: ["집기 정리와 철거 일정 상담", "매장 폐업 전 준비사항", "원상복구와 반출 범위 안내"],
    focus: "폐업 일정, 집기 반출, 폐기물 정리, 원상복구 범위",
  },
  {
    slug: "철거-비용",
    keyword: "철거 비용",
    intent: "비용 상담",
    image: "/images/cheolgeoon/sections/floor-removal.webp",
    titleTails: ["견적 기준과 비용 변동 요인", "방문 견적 전 확인사항", "평수보다 중요한 현장 조건"],
    focus: "평수, 작업 난이도, 폐기물 양, 인력 투입",
  },
  {
    slug: "철거-업체",
    keyword: "철거 업체",
    intent: "업체 상담",
    image: "/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp",
    titleTails: ["방문 견적과 작업 범위 상담", "원상복구 가능한 업체 확인", "상담 전 확인할 체크사항"],
    focus: "작업 가능 범위, 방문 견적, 일정 조율, 제외 작업",
  },
];

const regionsData = JSON.parse(fs.readFileSync(regionsPath, "utf8"));
const regions = regionsData.regions;

function hasFinalConsonant(text) {
  const lastChar = [...text.trim()].at(-1);
  if (!lastChar) {
    return false;
  }

  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) {
    return false;
  }

  return (code - 0xac00) % 28 !== 0;
}

function withObjectParticle(text) {
  return `${text}${hasFinalConsonant(text) ? "을" : "를"}`;
}

function checksum(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function buildDescription(region, service, variant) {
  const templates = [
    `${region.name} ${service.keyword} 상담 전에는 ${service.focus}처럼 비용에 영향을 주는 조건을 먼저 나눠보는 것이 좋습니다. 방문 견적이 필요한 경우와 사진으로 1차 확인 가능한 범위를 함께 안내합니다.`,
    `${region.name}에서 ${withObjectParticle(service.keyword)} 알아보신다면 원상복구 기준, 철거 범위, 폐기물 반출 동선, 일정 조율 여부를 미리 확인하세요. 현장 상황에 맞춰 비용이 달라지는 지점을 쉽게 정리해드립니다.`,
    `${region.name} ${service.keyword}는 같은 평수라도 ${service.focus}에 따라 견적이 달라질 수 있습니다. 상담 전에 준비할 사진, 주소 조건, 작업 가능 범위와 제외되는 의뢰 조건을 함께 확인하세요.`,
  ];

  return templates[variant % templates.length];
}

const pages = regions.flatMap((region) =>
  services.map((service) => {
    const slug = `${region.slug}/${service.slug}`;
    const variant = checksum(slug) % 3;

    return {
      slug,
      regionSlug: region.slug,
      serviceSlug: service.slug,
      keyword: `${region.name} ${service.keyword}`,
      title: `${region.name} ${service.keyword} ${service.titleTails[variant]}`,
      description: buildDescription(region, service, variant),
      h1: `${region.name} ${service.keyword}`,
      variant,
      region,
      service,
    };
  }),
);

const output = {
  source: regionsData.summary.source,
  regionCount: regions.length,
  serviceCount: services.length,
  pageCount: pages.length,
  services,
  pages,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
console.log(`Generated ${pages.length} region service pages for ${regions.length} regions`);
