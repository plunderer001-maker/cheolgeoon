import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { regionServiceSource, regions } from "@/app/lib/region-pages";

export const metadata: Metadata = {
  title: "전국 철거 지역 페이지 | 철거온",
  description:
    "철거온의 전국 시군구 철거 상담 지역 페이지입니다. 지역별 상가 철거, 사무실 철거, 식당 철거, 원상복구 철거, 철거 비용 상담 페이지를 확인하세요.",
  alternates: {
    canonical: "/regions/",
  },
  openGraph: {
    title: "전국 철거 지역 페이지 | 철거온",
    description: "전국 시군구별 철거 상담 페이지와 핵심 서비스 조합을 확인하세요.",
    url: "/regions/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

export default function RegionsIndexPage() {
  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <p className="eyebrow">전국 지역 철거 상담</p>
        <h1>전국 시군구별 철거 상담 페이지입니다.</h1>
        <p>
          지역 데이터 {regionServiceSource.regionCount.toLocaleString("ko-KR")}개와
          핵심 서비스 {regionServiceSource.serviceCount}개를 연결해 지역별 철거 상담
          페이지를 구성했습니다.
        </p>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">지역 목록</p>
            <h2>상담이 필요한 지역을 먼저 선택하세요.</h2>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {regions.map((region) => (
            <Link key={region.slug} href={`/regions/${region.slug}`}>
              {region.name} 철거
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
