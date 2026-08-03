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

export const seoPageData = seoData as SeoData;
export const seoPages = seoPageData.pages;
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
