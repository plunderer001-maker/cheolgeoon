import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers3, MapPinned } from "lucide-react";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { PRIORITY_REGION_SLUGS, regionMap, sidos, topicHubPath, topics } from "@/app/lib/region-pages";

export const metadata: Metadata = {
  title: "철거 상담 주제 안내 | 철거 비용부터 순서대로 | 철거온",
  description:
    "철거 비용 등 주제별 안내 페이지와 전국 시도별 상담 페이지를 모았습니다. 견적이 달라지는 기준을 먼저 확인하고 지역 페이지로 이동하세요.",
  alternates: {
    canonical: "/guide/",
  },
  openGraph: {
    title: "철거 상담 주제 안내 | 철거온",
    description: "주제별 철거 안내와 전국 시도별 상담 페이지를 한곳에서 확인하세요.",
    url: "/guide/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
  .map((slug) => regionMap.get(slug))
  .filter((region): region is NonNullable<typeof region> => Boolean(region));

export default function ServicesIndexPage() {
  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb items={[{ name: "홈", href: "/" }, { name: "철거 상담 주제" }]} />
        <p className="eyebrow">철거 상담 주제</p>
        <h1>무엇부터 확인해야 할지 주제별로 정리했습니다.</h1>
        <p>
          철거는 평수만으로 견적이 정해지지 않습니다. 주제별 안내에서 비용이 달라지는
          기준과 준비물을 먼저 확인한 뒤, 현장이 있는 지역 페이지에서 지역 조건을 함께
          보시면 상담이 빨라집니다.
        </p>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">주제별 안내</p>
            <h2>지금 확인할 수 있는 철거 상담 주제입니다.</h2>
          </div>
          <Layers3 size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {topics.map((topic) => (
            <Link key={topic.slug} href={topicHubPath(topic)}>
              {topic.keyword} 안내
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">지역별 확인</p>
            <h2>현장이 있는 지역에서 바로 확인하세요.</h2>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {priorityRegions.map((region) => (
            <Link key={region.slug} href={`/regions/${region.slug}/`}>
              {region.name} 철거
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          그 밖의 지역은{" "}
          {topics.map((topic) => (
            <span key={topic.slug}>
              {sidos.map((sido, index) => (
                <span key={sido.slug}>
                  <Link href={`/guide/${topic.slug}/${sido.slug}/`}>{sido.short}</Link>
                  {index < sidos.length - 1 ? " · " : ""}
                </span>
              ))}
            </span>
          ))}{" "}
          시도 페이지에서 시군구를 고르실 수 있습니다.
        </p>
      </section>
    </main>
  );
}
