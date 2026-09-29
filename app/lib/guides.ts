import guidesData from "@/data/guides.json";

/**
 * 지역 조합 없이 전국 가이드 1장만 만드는 주제.
 * topics.json 의 주제와 달리 시도·시군구 페이지를 생성하지 않는다.
 */
export type Guide = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  image: string;
};

export const guides: Guide[] = (guidesData as { guides: Guide[] }).guides;

export function getGuide(slug: string) {
  const decoded = decodeURIComponent(slug);
  return guides.find((guide) => guide.slug === decoded);
}

export function guidePath(guide: Guide) {
  return `/guide/${guide.slug}/`;
}
