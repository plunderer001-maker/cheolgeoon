import seoData from "@/data/generated/seo-pages.json";

export type SeoPage = {
  slug: string;
  keyword: string;
  target: string;
  service: string;
  serviceLabel: string;
  intent: string;
  intentLabel: string;
  pageKind: "base" | "intent";
  group: string;
  restricted: boolean;
};

type SeoData = {
  source: string;
  targetCount: number;
  serviceCount: number;
  intentCount: number;
  pageCount: number;
  pages: SeoPage[];
};

/**
 * 검색 의도 열에 섞여 있던 잘림·중복 키워드. 이 의도로 만들어진 페이지는
 * 더 이상 생성하지 않고, 기존 URL은 _redirects 로 canonical 페이지에 301 처리한다.
 * (scripts/generate-seo-pages.py, scripts/export-static-html.mjs 와 동일하게 유지)
 */
export const EXCLUDED_INTENTS: Record<string, string> = {
  비: "비용",
  단가: "비용",
  견적서: "견적",
};

export function isPublishedSeoPage(page: SeoPage) {
  return !page.restricted && !(page.intent in EXCLUDED_INTENTS);
}

export const seoPageData = seoData as SeoData;
export const allSeoPages = seoPageData.pages;
export const seoPages = allSeoPages.filter(isPublishedSeoPage);
export const seoPageMap = new Map(seoPages.map((page) => [page.slug, page]));

export function getSeoPage(slug: string) {
  return seoPageMap.get(decodeURIComponent(slug));
}

export function getRelatedPages(page: SeoPage, limit = 8) {
  return seoPages
    .filter(
      (candidate) =>
        candidate.slug !== page.slug &&
        (candidate.target === page.target ||
          candidate.serviceLabel === page.serviceLabel),
    )
    .slice(0, limit);
}

export function getTargetGroups() {
  const groups = new Map<string, SeoPage[]>();

  for (const page of seoPages) {
    if (page.pageKind !== "base") continue;
    const pages = groups.get(page.group) ?? [];
    pages.push(page);
    groups.set(page.group, pages);
  }

  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}
