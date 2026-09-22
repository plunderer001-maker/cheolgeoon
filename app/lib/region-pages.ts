import regionData from "@/data/generated/regions.json";
import regionServiceData from "@/data/generated/region-service-pages.json";
import regionNotesData from "@/data/region-notes.json";

export type Region = {
  code: string;
  sido: string;
  sidoShort: string;
  sigungu: string;
  name: string;
  slug: string;
  fullName: string;
};

export type RegionType = "자치구" | "일반구" | "시" | "군";

export type Topic = {
  slug: string;
  keyword: string;
  intent: string;
  eyebrow: string;
  image: string;
  focus: string;
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
};

export type RegionTopicPage = {
  slug: string;
  regionSlug: string;
  serviceSlug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  variant: number;
  regionType: RegionType;
  region: Region;
  service: Topic;
};

export type RegionNotes = {
  cases?: string[];
  tips?: string[];
  waste?: string;
};

type RegionsData = {
  summary: {
    source: string;
    count: number;
    uniqueSlugCount: number;
  };
  regions: Region[];
};

type RegionTopicData = {
  source: string;
  regionCount: number;
  serviceCount: number;
  pageCount: number;
  services: Topic[];
  pages: RegionTopicPage[];
};

type RegionNotesData = {
  regions: Record<string, RegionNotes>;
};

/**
 * 검색 색인을 허용하는 우선 지역. 홈 화면 "전국 지역 안내"에 노출되는 12곳과 동일하다.
 * 나머지 지역 페이지는 지역 고유 콘텐츠(data/region-notes.json)가 채워질 때까지
 * noindex,follow 로 내보내고 사이트맵에서도 제외한다.
 * 지역 메모가 채워진 지역은 자동으로 색인 허용 대상이 된다.
 */
export const PRIORITY_REGION_SLUGS = new Set([
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

export const NOINDEX_ROBOTS = {
  index: false,
  follow: true,
} as const;

const DUPLICATE_SIDO_SHORT = "전남광주통합";

export const regionsSource = regionData as RegionsData;
export const regions = regionsSource.regions.filter((region) => region.sidoShort !== DUPLICATE_SIDO_SHORT);
export const regionTopicSource = regionServiceData as RegionTopicData;
export const topics = regionTopicSource.services;
export const regionTopicPages = regionTopicSource.pages;
export const regionNotes = (regionNotesData as RegionNotesData).regions;

export const regionMap = new Map(regions.map((region) => [region.slug, region]));
export const topicMap = new Map(topics.map((topic) => [topic.slug, topic]));
export const regionTopicMap = new Map(
  regionTopicPages.map((page) => [`${page.regionSlug}/${page.serviceSlug}`, page]),
);

export function getRegion(regionSlug: string) {
  return regionMap.get(decodeURIComponent(regionSlug));
}

export function getTopic(topicSlug: string) {
  return topicMap.get(decodeURIComponent(topicSlug));
}

export function getRegionTopicPage(regionSlug: string, topicSlug: string) {
  return regionTopicMap.get(`${decodeURIComponent(regionSlug)}/${decodeURIComponent(topicSlug)}`);
}

export function getRegionPages(regionSlug: string) {
  const decoded = decodeURIComponent(regionSlug);
  return regionTopicPages.filter((page) => page.regionSlug === decoded);
}

export function getRegionNotes(regionSlug: string): RegionNotes | undefined {
  return regionNotes[decodeURIComponent(regionSlug)];
}

export function hasRegionNotes(regionSlug: string) {
  const notes = getRegionNotes(regionSlug);
  return Boolean(notes && ((notes.cases?.length ?? 0) > 0 || (notes.tips?.length ?? 0) > 0 || notes.waste));
}

export function isIndexableRegion(regionSlug: string) {
  const decoded = decodeURIComponent(regionSlug);
  return PRIORITY_REGION_SLUGS.has(decoded) || hasRegionNotes(decoded);
}

export function getRegionType(region: Region): RegionType {
  const { sigungu, sido } = region;
  if (sigungu.endsWith("군")) return "군";
  if (sigungu.endsWith("구")) return /특별시|광역시/.test(sido) ? "자치구" : "일반구";
  return "시";
}

/* ---------- 시도 ---------- */

export type Sido = {
  slug: string;
  short: string;
  name: string;
  regions: Region[];
};

const SIDO_ORDER = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export const sidos: Sido[] = SIDO_ORDER.flatMap((short) => {
  const members = regions.filter((region) => region.sidoShort === short);
  if (members.length === 0) return [];
  return [
    {
      slug: short,
      short,
      name: members[0].sido,
      regions: members.sort((a, b) => a.name.localeCompare(b.name, "ko")),
    },
  ];
});

export const sidoMap = new Map(sidos.map((sido) => [sido.slug, sido]));

export function getSido(sidoSlug: string) {
  return sidoMap.get(decodeURIComponent(sidoSlug));
}

export function getSidoOfRegion(region: Region) {
  return sidoMap.get(region.sidoShort);
}

/**
 * 같은 시도 안의 다른 지역. 이름순 목록에서 앞뒤로 골라 최대 limit 개를 돌려준다.
 * 지리적 인접은 아니므로 화면에서는 "같은 시도의 다른 지역"으로 표기한다.
 */
export function getSiblingRegions(region: Region, limit = 6) {
  const sido = getSidoOfRegion(region);
  if (!sido) return [];
  const others = sido.regions.filter((candidate) => candidate.slug !== region.slug);
  if (others.length <= limit) return others;

  const index = sido.regions.findIndex((candidate) => candidate.slug === region.slug);
  const picked: Region[] = [];
  for (let offset = 1; picked.length < limit; offset += 1) {
    const after = sido.regions[(index + offset) % sido.regions.length];
    if (after.slug !== region.slug && !picked.includes(after)) picked.push(after);
    if (picked.length >= limit) break;
    const before = sido.regions[(index - offset + sido.regions.length) % sido.regions.length];
    if (before.slug !== region.slug && !picked.includes(before)) picked.push(before);
  }
  return picked;
}

/* ---------- 경로 ---------- */

export function topicHubPath(topic: Topic) {
  return `/guide/${topic.slug}/`;
}

export function sidoHubPath(topic: Topic, sido: Sido) {
  return `/guide/${topic.slug}/${sido.slug}/`;
}

export function regionHubPath(region: Region) {
  return `/regions/${region.slug}/`;
}

export function regionTopicPath(region: Region, topic: Topic) {
  return `/regions/${region.slug}/${topic.slug}/`;
}
