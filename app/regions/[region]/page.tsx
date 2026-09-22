import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardCheck, MapPinned, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import {
  NOINDEX_ROBOTS,
  getRegion,
  getRegionPages,
  getRegionType,
  getSiblingRegions,
  getSidoOfRegion,
  isIndexableRegion,
  regionHubPath,
  regions,
  sidoHubPath,
  topics,
} from "@/app/lib/region-pages";
import { REGION_TYPE_COPY, getSidoCopy } from "@/app/lib/topic-copy";

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

  const type = REGION_TYPE_COPY[getRegionType(region)];
  const title = `${region.name} 철거 상담 안내 | 현장 조건과 견적 준비`;
  const description = `${region.fullName} 철거 상담 안내입니다. ${type.label} 현장에서 먼저 확인하는 ${type.checks
    .map(([item]) => item)
    .join(", ")}과 주제별 견적 기준을 정리했습니다.`;

  return {
    title,
    description,
    ...(isIndexableRegion(region.slug) ? {} : { robots: NOINDEX_ROBOTS }),
    alternates: {
      canonical: regionHubPath(region),
    },
    openGraph: {
      title,
      description,
      url: regionHubPath(region),
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
  const sido = getSidoOfRegion(region);
  const siblings = getSiblingRegions(region, 6);
  const typeCopy = REGION_TYPE_COPY[getRegionType(region)];
  const sidoCopy = getSidoCopy(region.sidoShort);
  const primaryTopic = topics[0];

  return (
    <main className="seo-main">
      <section className="seo-hero compact">
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb
          items={[
            { name: "홈", href: "/" },
            { name: "지역별 안내", href: "/regions/" },
            ...(sido && primaryTopic ? [{ name: sido.name, href: sidoHubPath(primaryTopic, sido) }] : []),
            { name: region.sigungu },
          ]}
        />
        <p className="eyebrow">{region.fullName} 철거 상담</p>
        <h1>{region.name} 철거, 현장 조건부터 확인합니다.</h1>
        <p>
          {region.name}에서 철거를 알아보실 때는 평수보다 먼저 작업 범위, 원상복구 기준, 폐기물
          반출 조건을 확인해야 합니다. {typeCopy.label} 현장은 {typeCopy.checks[0][0]}이 견적을
          크게 바꾸므로 이 부분부터 봅니다.
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
            <p className="eyebrow dark">주제별 안내</p>
            <h2>{region.name}에서 확인할 수 있는 철거 상담 주제입니다.</h2>
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
          <p className="eyebrow dark">{typeCopy.label} 현장 조건</p>
          <h2>{region.name} 철거 견적은 이 조건부터 확인합니다.</h2>
          <p>{typeCopy.summary}</p>
          <p>{sidoCopy.note}</p>
        </div>
        <div className="seo-check-list">
          {typeCopy.checks.map(([title, body]) => (
            <article key={title}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">상담 전 준비</p>
          <h2>{region.name} 철거 견적은 현장 정보가 있어야 정확해집니다.</h2>
          <p>
            사진과 주소를 먼저 남겨주시면 방문 견적 필요 여부부터 확인합니다. 정확하지 않아도
            괜찮으니 아는 범위만 보내주세요.
          </p>
        </div>
        <div className="seo-check-list">
          {[
            ["현장 주소", "차량 진입과 반출 동선, 방문 가능 일정을 확인하는 기준이 됩니다."],
            ["평수와 업종", "대략적인 작업량과 설비 철거 포함 여부를 가늠합니다."],
            ["철거 범위", "철거할 부분과 남길 부분을 나누면 폐기물 양이 줄어듭니다."],
            ["원상복구 요청사항", "임대인이나 관리실 기준서가 있으면 범위가 빨리 정해집니다."],
          ].map(([item, body]) => (
            <article key={item}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{item}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {siblings.length > 0 && sido && (
        <section className="seo-section">
          <div className="seo-section-head">
            <div>
              <p className="eyebrow dark">{sido.name} 다른 지역</p>
              <h2>{sido.name}의 다른 지역 철거 상담도 확인할 수 있습니다.</h2>
            </div>
          </div>
          <div className="seo-link-grid">
            {siblings.map((sibling) => (
              <Link key={sibling.slug} href={regionHubPath(sibling)}>
                {sibling.name} 철거
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
            {primaryTopic && (
              <Link href={sidoHubPath(primaryTopic, sido)}>
                {sido.name} 전체 보기
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>
      )}

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
