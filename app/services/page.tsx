import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3, Search } from "lucide-react";
import { getTargetGroups, seoPageData, seoPages } from "@/app/lib/seo-pages";

export const metadata: Metadata = {
  title: "철거온 SEO 페이지 목록 | 철거 조합 페이지",
  description:
    "철거온의 대상별 철거, 폐업철거, 원상복구 철거, 비용, 견적, 업체 조합 페이지 목록입니다.",
  alternates: {
    canonical: "/services/",
  },
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
        <p className="eyebrow">철거 조합 페이지</p>
        <h1>지역 연결 전, 먼저 실험할 철거 SEO 페이지 목록입니다.</h1>
        <p>
          현재 조합은 대상 {seoPageData.targetCount}개, 작업유형{" "}
          {seoPageData.serviceCount}개, 문의의도 {seoPageData.intentCount}개를
          기준으로 구성했습니다. 기본 페이지와 상세 조합을 합쳐 총{" "}
          {seoPageData.pageCount.toLocaleString("ko-KR")}개 URL이 열립니다.
        </p>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">우선 확인할 페이지</p>
            <h2>전환 의도가 높은 조합부터 먼저 보세요.</h2>
          </div>
          <Search size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {featuredPages.map((page) => (
            <Link key={page.slug} href={`/services/${page.slug}`}>
              {page.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">대상별 허브</p>
            <h2>대상 + 작업유형 기본 페이지입니다.</h2>
          </div>
          <Layers3 size={30} aria-hidden="true" />
        </div>
        <div className="seo-group-list">
          {groups.map(([group, pages]) => (
            <article className="seo-group-card" key={group}>
              <h3>{group === "검토필요" ? "검토 필요" : group}</h3>
              <div>
                {pages.slice(0, 80).map((page) => (
                  <Link key={page.slug} href={`/services/${page.slug}`}>
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
