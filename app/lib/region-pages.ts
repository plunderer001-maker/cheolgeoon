import regionData from "@/data/generated/regions.json";
import regionServiceData from "@/data/generated/region-service-pages.json";

export type Region = {
  code: string;
  sido: string;
  sidoShort: string;
  sigungu: string;
  name: string;
  slug: string;
  fullName: string;
};

export type RegionService = {
  slug: string;
  keyword: string;
  intent: string;
  image: string;
  titleTails?: string[];
  focus?: string;
};

export type RegionServicePage = {
  slug: string;
  regionSlug: string;
  serviceSlug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  variant?: number;
  region: Region;
  service: RegionService;
};

type RegionsData = {
  summary: {
    source: string;
    count: number;
    uniqueSlugCount: number;
  };
  regions: Region[];
};

type RegionServiceData = {
  source: string;
  regionCount: number;
  serviceCount: number;
  pageCount: number;
  services: RegionService[];
  pages: RegionServicePage[];
};

/**
 * 검색 색인을 허용하는 우선 지역. 홈 화면 "전국 지역 안내"에 노출되는 12곳과 동일하다.
 * 나머지 지역 페이지는 지역 고유 콘텐츠가 준비될 때까지 noindex,follow 로 내보내고
 * 사이트맵에서도 제외한다 (scripts/generate-sitemap.mjs 가 robots 메타를 읽는다).
 */
export const INDEXABLE_REGION_SLUGS = new Set([
  "서울-강남구",
  "인천-남동구",
  "수원",
  "성남",
  "고양",
  "용인",
  "대전-서구",
  "대구-수성구",
  "부산-해운대구",
  "광주-북구",
  "청주",
  "강릉",
]);

export function isIndexableRegion(regionSlug: string) {
  return INDEXABLE_REGION_SLUGS.has(decodeURIComponent(regionSlug));
}

export const NOINDEX_ROBOTS = {
  index: false,
  follow: true,
} as const;

export const regionsSource = regionData as RegionsData;
export const regions = regionsSource.regions;
export const regionServiceSource = regionServiceData as RegionServiceData;
export const regionServices = regionServiceSource.services;
export const regionServicePages = regionServiceSource.pages;

export const regionMap = new Map(regions.map((region) => [region.slug, region]));
export const regionServiceMap = new Map(
  regionServicePages.map((page) => [`${page.regionSlug}/${page.serviceSlug}`, page]),
);

export function getRegion(regionSlug: string) {
  return regionMap.get(decodeURIComponent(regionSlug));
}

export function getRegionServicePage(regionSlug: string, serviceSlug: string) {
  return regionServiceMap.get(`${decodeURIComponent(regionSlug)}/${decodeURIComponent(serviceSlug)}`);
}

export function getRegionPages(regionSlug: string) {
  const decoded = decodeURIComponent(regionSlug);
  return regionServicePages.filter((page) => page.regionSlug === decoded);
}
