import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Ban,
  ClipboardCheck,
  FileSearch,
  HelpCircle,
  MessageCircle,
  Ruler,
  Wrench,
} from "lucide-react";
import {
  getRegion,
  getRegionPages,
  getRegionServicePage,
  regionServicePages,
} from "@/app/lib/region-pages";

type PageProps = {
  params: Promise<{ region: string; service: string }>;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";
const SITE_URL = "https://cheolgeoon.netlify.app";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return regionServicePages.map((page) => ({
    region: page.regionSlug,
    service: page.serviceSlug,
  }));
}

function getImageUrl(image: string) {
  return `${SITE_URL}${image}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, service } = await params;
  const page = getRegionServicePage(region, service);

  if (!page) {
    return {
      title: "지역 철거 상담 | 철거온",
    };
  }

  const canonical = `/regions/${page.slug}/`;
  const imageUrl = getImageUrl(page.service.image);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${page.keyword} 상담 안내`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [imageUrl],
    },
  };
}

export default async function RegionServiceDetailPage({ params }: PageProps) {
  const { region: regionSlug, service: serviceSlug } = await params;
  const page = getRegionServicePage(regionSlug, serviceSlug);

  if (!page) {
    notFound();
  }

  const region = getRegion(page.regionSlug);
  if (!region) {
    notFound();
  }

  const relatedPages = getRegionPages(region.slug).filter(
    (candidate) => candidate.serviceSlug !== page.serviceSlug,
  );

  return (
    <main className="seo-main">
      <section
        className="seo-hero"
        style={{ "--seo-hero-image": `url("${page.service.image}")` } as CSSProperties}
      >
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <p className="eyebrow">{region.fullName} · {page.service.intent}</p>
        <h1>{page.h1}</h1>
        <p>
          {region.name}에서 {page.service.keyword}를 알아보실 때는 작업 범위,
          원상복구 기준, 폐기물 반출 조건을 먼저 확인하는 것이 좋습니다.
          철거온은 사진과 현장 정보를 바탕으로 방문 견적 필요 여부와 진행
          순서를 안내합니다.
        </p>
        <div className="seo-actions">
          <Link href={NAVER_FORM_URL} className="primary-button">
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link href={`/regions/${region.slug}`} className="secondary-button dark">
            {region.name} 지역 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">지역 견적 기준</p>
          <h2>{page.keyword}는 현장 조건에 따라 범위가 달라집니다.</h2>
          <p>
            {region.name} 현장이라도 층수, 주차 가능 여부, 엘리베이터 사용,
            공용부 보양, 폐기물 반출 동선에 따라 비용과 일정이 달라집니다.
            처음 상담에서는 확정 금액보다 비용이 달라지는 기준부터 확인합니다.
          </p>
        </div>
        <div className="seo-check-list">
          {[
            ["현장 주소", "방문 가능 일정과 이동 조건을 확인합니다."],
            ["평수와 업종", "공간 유형에 따라 철거 범위를 나눕니다."],
            ["사진 자료", "바닥, 천장, 벽면, 집기 상태를 먼저 봅니다."],
          ].map(([title, body]) => (
            <article key={title}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-detail-grid">
        <article>
          <Ruler size={26} aria-hidden="true" />
          <h2>비용 확인</h2>
          <p>
            {page.keyword} 비용은 평수만으로 정하기 어렵습니다. 마감재, 폐기물
            양, 반출 조건, 작업 시간 제한을 함께 봐야 합니다.
          </p>
        </article>
        <article>
          <Wrench size={26} aria-hidden="true" />
          <h2>작업 범위</h2>
          <p>
            내부 마감 철거, 집기 정리, 원상복구 기준 확인처럼 필요한 작업과
            제외할 작업을 나눠 상담합니다.
          </p>
        </article>
        <article>
          <FileSearch size={26} aria-hidden="true" />
          <h2>방문 견적</h2>
          <p>
            사진만으로 판단하기 어려운 현장은 방문 견적을 통해 작업 동선과
            관리 기준을 확인합니다.
          </p>
        </article>
        <article>
          <Ban size={26} aria-hidden="true" />
          <h2>진행이 어려운 의뢰</h2>
          <p>
            부분철거만 단독 진행하거나 단순 폐기물 처리만 요청하는 경우는
            어렵습니다. 철거 공정에 포함되는 경우 현장 조건을 보고 상담합니다.
          </p>
        </article>
      </section>

      <section className="seo-section seo-example-images">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">현장 예시</p>
            <h2>{page.keyword} 상담 때 참고할 철거 이미지입니다.</h2>
            <p>
              실제 상담에서는 이미지가 아니라 현장 사진과 주소 조건을 기준으로
              철거 범위와 원상복구 기준을 확인합니다.
            </p>
          </div>
        </div>
        <div className="seo-example-image-grid">
          {[
            [page.service.image, page.service.intent, "지역 현장 조건에 맞춰 작업 범위를 확인합니다."],
            ["/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp", "방문 견적", "사진으로 보기 어려운 조건은 현장에서 확인합니다."],
            ["/images/cheolgeoon/ai-pool/ai-cleanup-01.webp", "철거 후 정리", "철거 후 정리와 반출 범위까지 함께 상담합니다."],
          ].map(([src, label, note]) => (
            <figure key={src}>
              <img src={src} alt={`${page.keyword} ${label} 예시`} loading="lazy" />
              <figcaption>
                <strong>{label}</strong>
                <span>{note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="seo-section seo-flow">
        <p className="eyebrow dark">진행 흐름</p>
        <h2>{page.keyword} 문의 후 확인 순서입니다.</h2>
        <ol>
          {["주소와 업종 확인", "사진으로 1차 범위 확인", "방문 견적 필요 여부 안내", "작업 일정 조율"].map(
            (step) => (
              <li key={step}>
                <BadgeCheck size={20} aria-hidden="true" />
                {step}
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="seo-section seo-faq">
        <div>
          <p className="eyebrow dark">자주 묻는 질문</p>
          <h2>{region.name} 지역 철거 상담 전에 많이 묻는 내용입니다.</h2>
        </div>
        <div className="seo-faq-list">
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{page.keyword}는 사진만으로 견적이 가능한가요?</h3>
            <p>사진으로 1차 범위는 볼 수 있지만 정확한 견적은 현장 조건에 따라 방문 확인이 필요할 수 있습니다.</p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{region.name}도 상담 가능한가요?</h3>
            <p>전국 상담을 기준으로 안내하지만 도서산간 지역은 방문·출동 비용이 발생할 수 있습니다.</p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>철거지원금도 같이 확인할 수 있나요?</h3>
            <p>조건에 따라 가능 여부와 준비 서류가 달라집니다. 보장 표현 없이 해당 가능성을 확인하는 방식으로 안내합니다.</p>
          </article>
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">같은 지역 조합</p>
            <h2>{region.name}에서 함께 볼 수 있는 철거 상담 주제입니다.</h2>
          </div>
        </div>
        <div className="seo-link-grid">
          {relatedPages.map((relatedPage) => (
            <Link key={relatedPage.slug} href={`/regions/${relatedPage.slug}`}>
              {relatedPage.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-bottom-cta">
        <Link href={`/regions/${region.slug}`} className="secondary-button dark">
          <ArrowLeft size={18} aria-hidden="true" />
          {region.name} 지역으로 돌아가기
        </Link>
        <Link href={NAVER_FORM_URL} className="primary-button">
          <MessageCircle size={19} aria-hidden="true" />
          견적 문의 준비하기
        </Link>
      </section>
    </main>
  );
}
