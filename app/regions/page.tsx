import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { regionHubPath, regions, sidoHubPath, sidos, topics } from "@/app/lib/region-pages";

export const metadata: Metadata = {
  title: "전국 지역별 철거 상담 안내 | 시도·시군구 선택 | 철거온",
  description:
    "전국 시도별로 철거 상담 지역을 모았습니다. 현장이 있는 시군구를 고르면 지역 조건에 맞는 철거 비용 기준과 상담 순서를 확인할 수 있습니다.",
  alternates: {
    canonical: "/regions/",
  },
  openGraph: {
    title: "전국 지역별 철거 상담 안내 | 철거온",
    description: "시도별로 정리한 전국 철거 상담 지역 목록입니다.",
    url: "/regions/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

export default function RegionsIndexPage() {
  const primaryTopic = topics[0];

  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb items={[{ name: "홈", href: "/" }, { name: "지역별 안내" }]} />
        <p className="eyebrow">전국 지역 철거 상담</p>
        <h1>현장이 있는 지역을 먼저 골라주세요.</h1>
        <p>
          전국 {sidos.length}개 시도, {regions.length}개 시군구를 기준으로 안내합니다. 지역마다
          건물 규정, 차량 진입, 폐기물 반출 거리가 달라 같은 작업이라도 견적 항목이 바뀝니다.
          시도를 고른 뒤 시군구 페이지에서 지역 조건을 확인하세요.
        </p>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">시도별 목록</p>
            <h2>시도를 고르면 시군구 목록으로 이어집니다.</h2>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-sido-groups">
          {sidos.map((sido) => (
            <div key={sido.slug}>
              <h3>
                {primaryTopic ? (
                  <Link href={sidoHubPath(primaryTopic, sido)}>
                    {sido.name} ({sido.regions.length})
                  </Link>
                ) : (
                  `${sido.name} (${sido.regions.length})`
                )}
              </h3>
              <div className="seo-link-grid">
                {sido.regions.map((region) => (
                  <Link key={region.slug} href={regionHubPath(region)}>
                    {region.sigungu}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
