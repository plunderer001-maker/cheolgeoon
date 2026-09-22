import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardCheck, MapPinned, MessageCircle } from "lucide-react";
import {
  NOINDEX_ROBOTS,
  getRegion,
  getRegionPages,
  isIndexableRegion,
  regions,
} from "@/app/lib/region-pages";

type PageProps = {
  params: Promise<{ region: string }>;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = getRegion(regionSlug);

  if (!region) {
    return {
      title: "지역 철거 방문 견적 상담",
    };
  }

  const title = `${region.name} 철거 방문 견적과 원상복구 상담`;
  const description = `${region.name} 철거 상담이 필요하다면 상가, 사무실, 식당, 카페, 학원, 원상복구 철거 범위와 방문 견적 필요 여부를 먼저 확인하세요. ${region.name} 지역 현장 조건에 맞춰 비용 기준과 상담 흐름을 안내합니다.`;

  return {
    title,
    description,
    ...(isIndexableRegion(region.slug) ? {} : { robots: NOINDEX_ROBOTS }),
    alternates: {
      canonical: `/regions/${region.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `/regions/${region.slug}/`,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: ["/images/cheolgeoon/og/main-og.webp"],
    },
  };
}

export default async function RegionHubPage({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const region = getRegion(regionSlug);

  if (!region) {
    notFound();
  }

  const pages = getRegionPages(region.slug);

  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <p className="eyebrow">{region.fullName} 철거 상담</p>
        <h1>{region.name} 철거, 현장 조건부터 확인합니다.</h1>
        <p>
          {region.name}에서 철거를 알아보실 때는 평수보다 먼저 작업 범위,
          원상복구 기준, 폐기물 반출 조건을 확인해야 합니다. 처음 문의하실 때
          정확히 모르셔도 현장 상황을 듣고 필요한 순서대로 안내드립니다.
        </p>
        <div className="seo-actions">
          <Link href={NAVER_FORM_URL} className="primary-button">
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link href="/regions/" className="secondary-button dark">
            전체 지역 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">연결 서비스</p>
            <h2>{region.name} 지역에서 먼저 확인할 철거 조합입니다.</h2>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {pages.map((page) => (
            <Link key={page.slug} href={`/regions/${page.slug}/`}>
              {page.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">상담 전 확인</p>
          <h2>{region.name} 철거 견적은 현장 정보가 있어야 정확해집니다.</h2>
          <p>
            같은 지역이라도 건물 규정, 엘리베이터 사용 가능 여부, 차량 진입
            조건, 폐기물 양에 따라 비용과 일정이 달라집니다. 사진과 주소를
            먼저 남겨주시면 방문 견적 필요 여부부터 확인합니다.
          </p>
        </div>
        <div className="seo-check-list">
          {["현장 주소", "평수와 업종", "철거 범위", "원상복구 요청사항"].map((item) => (
            <article key={item}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{item}</h3>
              <p>{region.name} 철거 상담에서 {item} 정보가 있으면 확인이 빨라집니다.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-bottom-cta">
        <Link href="/regions/" className="secondary-button dark">
          <ArrowLeft size={18} aria-hidden="true" />
          전체 지역으로 돌아가기
        </Link>
        <Link href={NAVER_FORM_URL} className="primary-button">
          <MessageCircle size={19} aria-hidden="true" />
          견적 문의 준비하기
        </Link>
      </section>
    </main>
  );
}
