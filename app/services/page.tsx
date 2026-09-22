import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3, Search } from "lucide-react";
import { getTargetGroups, seoPages } from "@/app/lib/seo-pages";

export const metadata: Metadata = {
  title: "철거 서비스 안내 | 상가·사무실·식당 철거와 원상복구 | 철거온",
  description:
    "상가, 사무실, 식당, 카페, 학원 등 대상별 철거와 폐업 철거, 원상복구 철거의 비용 기준, 견적 준비, 업체 선택 안내 페이지를 한곳에서 확인하세요.",
  alternates: {
    canonical: "/services/",
  },
  openGraph: {
    title: "철거 서비스 안내 | 철거온",
    description:
      "대상별 철거와 원상복구 상담 페이지를 모았습니다. 비용 기준과 견적 준비물을 먼저 확인하세요.",
    url: "/services/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

const GROUP_LABELS: Record<string, string> = {
  "1차": "가장 많이 찾는 상업 공간",
  "2차": "매장·시설·창고",
  "3차": "주택·주거 공간",
  "4차": "그 밖의 건물과 시설",
};

const featuredPages = seoPages
  .filter((page) =>
    [
      "상가 철거 비용",
      "사무실 철거 비용",
      "식당 철거 비용",
      "카페 철거 비용",
      "학원 철거 비용",
      "상가 원상복구 철거",
      "식당 폐업 철거",
      "사무실 원상복구 철거",
    ].includes(page.keyword),
  )
  .slice(0, 8);

export default function ServicesIndexPage() {
  const groups = getTargetGroups();

  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <p className="eyebrow">철거 서비스 안내</p>
        <h1>어떤 공간을 철거하시나요? 대상별 상담 안내입니다.</h1>
        <p>
          상가, 사무실, 식당, 카페, 학원처럼 자주 문의되는 공간부터 창고, 주택까지
          대상별로 철거 범위, 원상복구 기준, 비용이 달라지는 조건, 견적 전에 준비할
          자료를 정리했습니다. 해당하는 공간을 고르면 상담 전에 확인할 내용을 바로
          볼 수 있습니다.
        </p>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">먼저 확인할 페이지</p>
            <h2>가장 많이 문의하는 철거 상담입니다.</h2>
          </div>
          <Search size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {featuredPages.map((page) => (
            <Link key={page.slug} href={`/services/${page.slug}/`}>
              {page.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">대상별 안내</p>
            <h2>철거 대상과 작업 유형별 안내 페이지입니다.</h2>
          </div>
          <Layers3 size={30} aria-hidden="true" />
        </div>
        <div className="seo-group-list">
          {groups.map(([group, pages]) => (
            <article className="seo-group-card" key={group}>
              <h3>{GROUP_LABELS[group] ?? group}</h3>
              <div>
                {pages.slice(0, 80).map((page) => (
                  <Link key={page.slug} href={`/services/${page.slug}/`}>
                    {page.keyword}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
