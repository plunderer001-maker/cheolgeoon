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

function hasFinalConsonant(text: string) {
  const lastChar = [...text.trim()].at(-1);
  if (!lastChar) {
    return false;
  }

  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) {
    return false;
  }

  return (code - 0xac00) % 28 !== 0;
}

function withObjectParticle(text: string) {
  return `${text}${hasFinalConsonant(text) ? "을" : "를"}`;
}

const serviceCopy = {
  "상가-철거": {
    scope: "매장 집기, 바닥재, 천장 마감, 벽체 마감처럼 임대차 원상복구와 연결되는 범위를 나눠 봅니다.",
    cost: "상가 철거는 같은 평수라도 기존 인테리어 두께, 붙박이 집기, 공용부 반출 동선에 따라 비용 차이가 큽니다.",
    prep: "매장 전경, 천장, 바닥, 벽면, 남아 있는 집기 사진",
    visit: "영업 종료 일정과 관리사무소 작업 가능 시간을 함께 확인합니다.",
  },
  "상가-철거-비용": {
    scope: "비용을 먼저 보실 때는 평수보다 철거 범위, 폐기물 양, 반출 조건, 원상복구 기준을 같이 확인해야 합니다.",
    cost: "상가 철거 비용은 바닥재 종류, 천장 구조, 집기 철거 여부, 폐기물 처리량에 따라 달라집니다.",
    prep: "임대차 원상복구 기준, 평수, 내부 사진, 철거 희망 일정",
    visit: "대략 비용은 사진으로 볼 수 있지만 확정 견적은 현장 확인이 필요할 수 있습니다.",
  },
  "사무실-철거": {
    scope: "파티션, OA 바닥, 회의실 유리, 전기 배선처럼 업무 공간 특성에 맞춰 작업 범위를 정리합니다.",
    cost: "사무실 철거는 칸막이 수, 바닥 구조, 전기 설비 정리, 엘리베이터 사용 조건이 비용에 영향을 줍니다.",
    prep: "사무실 평면, 파티션 사진, 바닥 상태, 퇴실 예정일",
    visit: "건물 출입 규정과 야간 작업 가능 여부도 같이 확인합니다.",
  },
  "식당-철거": {
    scope: "주방 설비, 후드, 덕트, 배수 설비, 홀 인테리어를 분리해서 봐야 견적 기준이 명확해집니다.",
    cost: "식당 철거는 주방 설비 무게, 덕트 철거 범위, 타일·방수층 상태에 따라 작업 난이도가 달라집니다.",
    prep: "주방, 홀, 덕트, 후드, 냉장 설비 위치 사진",
    visit: "가스·전기 차단 상태와 설비 철거 가능 범위를 먼저 확인합니다.",
  },
  "카페-철거": {
    scope: "카운터, 붙박이 가구, 조명, 바닥 마감, 급배수 위치처럼 카페 인테리어 요소를 나눠 봅니다.",
    cost: "카페 철거는 카운터 구조, 바닥 마감재, 배관 위치, 잔여 집기 처리 여부에 따라 비용이 달라집니다.",
    prep: "카운터, 바닥, 벽면, 천장 조명, 설비 주변 사진",
    visit: "다음 임차인 인수 범위가 있다면 철거 제외 항목도 함께 정리합니다.",
  },
  "학원-철거": {
    scope: "강의실 칸막이, 게시판, 조명, 바닥재, 상담실 구조처럼 교습 공간 기준으로 확인합니다.",
    cost: "학원 철거는 강의실 수, 칸막이 재질, 방음 마감, 폐기물 반출 시간 제한에 따라 견적이 달라집니다.",
    prep: "강의실, 복도, 상담실, 바닥과 천장 사진",
    visit: "수업 종료일과 건물 작업 가능 시간을 맞춰 일정부터 확인합니다.",
  },
  "원상복구-철거": {
    scope: "임대차 계약서의 원상복구 기준과 실제 훼손 부위를 대조해 필요한 철거 범위를 정합니다.",
    cost: "원상복구 철거는 철거 자체보다 복구 기준, 마감 상태, 임대인 요구 범위에 따라 비용이 달라집니다.",
    prep: "계약서 원상복구 조항, 현재 내부 사진, 임대인 요청사항",
    visit: "철거해야 할 부분과 남겨도 되는 부분을 먼저 구분합니다.",
  },
  "폐업-철거": {
    scope: "폐업 일정, 집기 반출, 폐기물 정리, 원상복구 범위를 한 번에 묶어 작업 순서를 잡습니다.",
    cost: "폐업 철거는 남은 집기 양, 철거 일정의 급함, 반출 차량 접근성에 따라 비용과 시간이 달라집니다.",
    prep: "폐업 예정일, 남은 집기 사진, 반출 가능 시간, 주소",
    visit: "철거 전 정리할 물품과 공정에 포함할 물품을 나눠 안내합니다.",
  },
  "철거-비용": {
    scope: "평수만으로 판단하지 않고 마감재, 폐기물 양, 작업 시간 제한, 인력 투입 조건을 함께 확인합니다.",
    cost: "철거 비용은 현장 구조와 반출 조건의 영향이 커서 사진 확인 후 방문 견적 여부를 판단하는 편이 정확합니다.",
    prep: "평수, 업종, 내부 전체 사진, 철거 희망 범위",
    visit: "비용을 낮추려면 제외할 작업과 직접 정리 가능한 물품을 먼저 구분하는 것이 좋습니다.",
  },
  "철거-업체": {
    scope: "업체를 찾을 때는 가능한 작업 범위, 제외되는 의뢰, 방문 견적 방식, 일정 대응을 함께 봐야 합니다.",
    cost: "철거 업체 상담에서는 단가보다 실제로 맡길 수 있는 범위와 책임 구간을 확인하는 것이 중요합니다.",
    prep: "현장 주소, 내부 사진, 원하는 작업 범위, 희망 일정",
    visit: "부분철거만 단독으로 가능한지보다 전체 공정에 포함되는지 먼저 확인합니다.",
  },
} as const;

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
  const copy = serviceCopy[page.serviceSlug as keyof typeof serviceCopy];
  const variant = page.variant ?? 0;
  const regionCostNotes = [
    `${region.name} 현장은 층수, 주차 가능 여부, 엘리베이터 사용, 공용부 보양 조건에 따라 비용과 일정이 달라집니다.`,
    `${region.fullName} 기준으로는 반출 차량 접근성, 관리사무소 작업 시간, 폐기물 적치 가능 여부를 먼저 확인하는 편이 좋습니다.`,
    `${region.name}에서 상담을 시작할 때는 주소 조건과 내부 사진을 함께 보면 방문 견적 필요 여부를 더 빠르게 판단할 수 있습니다.`,
  ];
  const flowSteps = [
    ["주소와 업종 확인", "사진으로 1차 범위 확인", "방문 견적 필요 여부 안내", "작업 일정 조율"],
    ["현장 사진 확인", "철거 제외 항목 정리", "비용 변동 요인 안내", "방문 또는 전화 상담"],
    ["원상복구 기준 확인", "반출 동선 점검", "작업 가능 시간 조율", "견적 범위 확정"],
  ][variant];

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
          {region.name}에서 {withObjectParticle(page.service.keyword)} 알아보실 때는
          작업 범위와 원상복구 기준을 먼저 나눠 보는 것이 좋습니다.
          {copy.visit} 사진과 주소 조건을 바탕으로 상담 순서를 잡습니다.
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
            {regionCostNotes[variant]} 처음 상담에서는 확정 금액보다 비용이
            달라지는 기준부터 확인합니다.
          </p>
        </div>
        <div className="seo-check-list">
          {[
            ["현장 주소", "방문 가능 일정과 이동 조건을 확인합니다."],
            ["핵심 범위", copy.scope],
            ["사진 자료", `${copy.prep}를 보내주시면 1차 확인이 수월합니다.`],
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
            {copy.cost} 견적을 볼 때는 평수, 폐기물 양, 반출 조건, 작업 시간
            제한을 함께 확인합니다.
          </p>
        </article>
        <article>
          <Wrench size={26} aria-hidden="true" />
          <h2>작업 범위</h2>
          <p>
            {copy.scope} 필요한 작업과 제외할 작업을 나눠야 불필요한 비용을
            줄일 수 있습니다.
          </p>
        </article>
        <article>
          <FileSearch size={26} aria-hidden="true" />
          <h2>방문 견적</h2>
          <p>
            {copy.visit} 사진만으로 판단하기 어려운 현장은 방문 견적으로 작업
            동선과 관리 기준을 확인합니다.
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
            [page.service.image, page.service.intent, copy.scope],
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
          {flowSteps.map(
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
