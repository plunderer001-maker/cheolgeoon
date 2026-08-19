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
  },
  {
    slug: "상가-철거-비용",
    keyword: "상가 철거 비용",
    intent: "비용 확인",
    image: "/images/cheolgeoon/sections/commercial-unit-demolition.webp",
  },
  {
    slug: "사무실-철거",
    keyword: "사무실 철거",
    intent: "업무 공간 철거",
    image: "/images/cheolgeoon/hero/office-clearance-hero.webp",
  },
  {
    slug: "식당-철거",
    keyword: "식당 철거",
    intent: "주방 설비 철거",
    image: "/images/cheolgeoon/hero/restaurant-demolition-hero.webp",
  },
  {
    slug: "카페-철거",
    keyword: "카페 철거",
    intent: "매장 정리 철거",
    image: "/images/cheolgeoon/sections/interior-removal.webp",
  },
  {
    slug: "학원-철거",
    keyword: "학원 철거",
    intent: "강의실 철거",
    image: "/images/cheolgeoon/hero/academy-demolition.webp",
  },
  {
    slug: "원상복구-철거",
    keyword: "원상복구 철거",
    intent: "퇴거 원상복구",
    image: "/images/cheolgeoon/sections/final-inspection.webp",
  },
  {
    slug: "폐업-철거",
    keyword: "폐업 철거",
    intent: "폐업 정리",
    image: "/images/cheolgeoon/ai-pool/ai-cleanup-01.webp",
  },
  {
    slug: "철거-비용",
    keyword: "철거 비용",
    intent: "비용 상담",
    image: "/images/cheolgeoon/sections/floor-removal.webp",
  },
  {
    slug: "철거-업체",
    keyword: "철거 업체",
    intent: "업체 상담",
    image: "/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp",
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

const pages = regions.flatMap((region) =>
  services.map((service) => ({
    slug: `${region.slug}/${service.slug}`,
    regionSlug: region.slug,
    serviceSlug: service.slug,
    keyword: `${region.name} ${service.keyword}`,
    title: `${region.name} ${service.keyword} | 철거온`,
    description: `${region.name}에서 ${withObjectParticle(service.keyword)} 알아보신다면 현장 범위, 원상복구 기준, 비용 변동 요인, 방문 견적 필요 여부를 먼저 확인하세요. 철거온은 ${region.name} 지역 철거 상담에 필요한 준비 정보와 진행 흐름을 안내합니다.`,
    h1: `${region.name} ${service.keyword}`,
    region,
    service,
  })),
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
