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
  MapPinned,
  MessageCircle,
  Ruler,
  Wrench,
} from "lucide-react";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import {
  NOINDEX_ROBOTS,
  getRegion,
  getRegionNotes,
  getRegionPages,
  getRegionTopicPage,
  getSiblingRegions,
  getSidoOfRegion,
  isIndexableRegion,
  regionHubPath,
  regionTopicPages,
  regionTopicPath,
  sidoHubPath,
  topicHubPath,
} from "@/app/lib/region-pages";
import { REGION_TYPE_COPY, getSidoCopy } from "@/app/lib/topic-copy";

type PageProps = {
  params: Promise<{ region: string; service: string }>;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";
const SITE_URL = "https://cheolgeoon.netlify.app";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return regionTopicPages.map((page) => ({
    region: page.regionSlug,
    service: page.serviceSlug,
  }));
}

function getImageUrl(image: string) {
  return `${SITE_URL}${image}`;
}

/* 주제별 본문 문구. 주제가 늘어나면 여기에 항목을 추가한다. */
const topicCopy: Record<
  string,
  {
    scope: string;
    cost: string;
    prep: string;
    visit: string;
    situations: string[];
    factors: string[];
    prepList: string[];
  }
> = {
  "철거-비용": {
    scope: "평수만으로 판단하지 않고 마감재, 폐기물 양, 작업 시간 제한, 인력 투입 조건을 함께 확인합니다.",
    cost: "철거 비용은 현장 구조와 반출 조건의 영향이 커서 사진 확인 후 방문 견적 여부를 판단하는 편이 정확합니다.",
    prep: "평수, 업종, 내부 전체 사진, 철거 희망 범위",
    visit: "비용을 낮추려면 제외할 작업과 직접 정리 가능한 물품을 먼저 구분하는 것이 좋습니다.",
    situations: ["평수 기준으로만 비용을 비교하기 어려운 경우", "방문 견적 전에 대략적인 비용 변동 요인을 알고 싶은 경우"],
    factors: ["철거 범위와 마감재 종류", "폐기물 처리량", "작업 시간 제한과 인력 투입"],
    prepList: ["평수와 업종", "내부 전체 사진", "직접 정리 가능한 항목"],
  },
};

/* 행정 유형별 도입 문장. 같은 시도 안에서도 구·시·군에 따라 달라진다. */
const LEAD_BY_TYPE: Record<string, (name: string) => string> = {
  자치구: (name) =>
    `${name}처럼 건물이 밀집한 자치구에서는 관리사무소 작업 시간과 엘리베이터 양중 조건이 견적을 먼저 좌우합니다.`,
  일반구: (name) =>
    `${name}은 단지 상가와 구도심 상가가 섞여 있어 어느 쪽인지에 따라 반출 규정과 진입로 조건을 다르게 확인합니다.`,
  시: (name) =>
    `${name}은 시내 중심 상가와 외곽 현장의 차량 접근과 반출 회차가 달라 주소를 기준으로 견적 항목을 나눕니다.`,
  군: (name) =>
    `${name}처럼 읍·면 현장이 많은 지역은 이동 거리와 폐기물 반출 회차가 견적에서 큰 비중을 차지합니다.`,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, service } = await params;
  const page = getRegionTopicPage(region, service);

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
    ...(isIndexableRegion(page.regionSlug) ? {} : { robots: NOINDEX_ROBOTS }),
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

export default async function RegionTopicPage({ params }: PageProps) {
  const { region: regionSlug, service: serviceSlug } = await params;
  const page = getRegionTopicPage(regionSlug, serviceSlug);

  if (!page) {
    notFound();
  }

  const region = getRegion(page.regionSlug);
  if (!region) {
    notFound();
  }

  const topic = page.service;
  const sido = getSidoOfRegion(region);
  const typeCopy = REGION_TYPE_COPY[page.regionType];
  const sidoCopy = getSidoCopy(region.sidoShort);
  const notes = getRegionNotes(region.slug);
  const siblings = getSiblingRegions(region, 6);
  const otherTopics = getRegionPages(region.slug).filter((candidate) => candidate.serviceSlug !== page.serviceSlug);
  const copy = topicCopy[page.serviceSlug] ?? topicCopy["철거-비용"];
  const variant = page.variant ?? 0;
  const lead = LEAD_BY_TYPE[page.regionType](region.name);
  const flowSteps = [
    ["주소와 업종 확인", "사진으로 1차 범위 확인", "방문 견적 필요 여부 안내", "작업 일정 조율"],
    ["현장 사진 확인", "철거 제외 항목 정리", "비용 변동 요인 안내", "방문 또는 전화 상담"],
    ["원상복구 기준 확인", "반출 동선 점검", "작업 가능 시간 조율", "견적 범위 확정"],
  ][variant];

  return (
    <main className="seo-main">
      <section
        className="seo-hero"
        style={{ "--seo-hero-image": `url("${topic.image}")` } as CSSProperties}
      >
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb
          items={[
            { name: "홈", href: "/" },
            { name: topic.keyword, href: topicHubPath(topic) },
            ...(sido ? [{ name: sido.name, href: sidoHubPath(topic, sido) }] : []),
            { name: region.sigungu },
          ]}
        />
        <p className="eyebrow">
          {region.fullName} · {topic.intent}
        </p>
        <h1>{page.h1}</h1>
        <p>
          {lead} {copy.visit} 사진과 주소 조건을 바탕으로 상담 순서를 잡습니다.
        </p>
        <div className="seo-actions">
          <Link href={NAVER_FORM_URL} className="primary-button">
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link href={regionHubPath(region)} className="secondary-button dark">
            {region.name} 지역 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">지역 견적 기준</p>
          <h2>{page.keyword}은 현장 조건에 따라 범위가 달라집니다.</h2>
          <p>
            {typeCopy.summary} 처음 상담에서는 확정 금액보다 비용이 달라지는 기준부터 확인합니다.
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
            {copy.cost} 견적을 볼 때는 평수, 폐기물 양, 반출 조건, 작업 시간 제한을 함께
            확인합니다.
          </p>
        </article>
        <article>
          <Wrench size={26} aria-hidden="true" />
          <h2>작업 범위</h2>
          <p>
            {copy.scope} 필요한 작업과 제외할 작업을 나눠야 불필요한 비용을 줄일 수 있습니다.
          </p>
        </article>
        <article>
          <FileSearch size={26} aria-hidden="true" />
          <h2>방문 견적</h2>
          <p>
            {copy.visit} 사진만으로 판단하기 어려운 현장은 방문 견적으로 작업 동선과 관리 기준을
            확인합니다.
          </p>
        </article>
        <article>
          <Ban size={26} aria-hidden="true" />
          <h2>진행이 어려운 의뢰</h2>
          <p>
            부분철거만 단독 진행하거나 단순 폐기물 처리만 요청하는 경우는 어렵습니다. 철거
            공정에 포함되는 경우 현장 조건을 보고 상담합니다.
          </p>
        </article>
      </section>

      <section className="seo-section seo-scenario">
        <p className="eyebrow dark">상담이 필요한 상황</p>
        <h2>
          {region.name}에서 {topic.keyword} 상담을 많이 요청하는 경우입니다.
        </h2>
        <p>
          철거 문의는 단순히 철거할 면적만으로 판단하기 어렵습니다. 임대차 원상복구 기준, 남겨야
          할 시설, 반출 동선, 작업 가능 시간까지 같이 봐야 실제 견적과 일정이 현실적으로
          정리됩니다.
        </p>
        <div>
          {copy.situations.map((situation) => (
            <article key={situation}>
              <h3>{situation}</h3>
              <p>
                이런 경우에는 현장 사진만으로도 1차 상담을 시작할 수 있습니다. 다만 관리 규정이나
                설비 철거 범위가 애매하면 방문 확인이 필요할 수 있습니다.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">견적 체크포인트</p>
          <h2>{page.keyword}을 볼 때 먼저 나눠야 할 항목입니다.</h2>
          <p>
            같은 {topic.keyword} 문의라도 실제 견적은 현장 조건에 따라 달라집니다. 아래 항목을
            먼저 확인하면 상담 과정에서 빠지는 부분을 줄일 수 있습니다.
          </p>
        </div>
        <div className="seo-check-list">
          {copy.factors.map((factor) => (
            <article key={factor}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{factor}</h3>
              <p>
                사진으로 확인 가능한 부분은 먼저 보고, 현장 판단이 필요한 부분은 방문 견적 여부를
                안내합니다.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-example-images">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">현장 예시</p>
            <h2>{page.keyword} 상담 때 참고할 철거 이미지입니다.</h2>
            <p>
              실제 상담에서는 이미지가 아니라 현장 사진과 주소 조건을 기준으로 철거 범위와
              원상복구 기준을 확인합니다.
            </p>
          </div>
        </div>
        <div className="seo-example-image-grid">
          {[
            [topic.image, topic.intent, copy.scope],
            ["/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp", "방문 견적", "사진으로 보기 어려운 조건은 현장에서 확인합니다."],
            ["/images/cheolgeoon/ai-pool/ai-cleanup-01.webp", "철거 후 정리", "철거 후 정리와 반출 범위까지 함께 상담합니다."],
          ].map(([src, label, note]) => (
            <figure key={src}>
              <img src={src} alt={`${page.keyword} ${label} 예시`} loading="lazy" width="640" height="420" />
              <figcaption>
                <strong>{label}</strong>
                <span>{note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="seo-section seo-detail-grid">
        {copy.prepList.map((item) => (
          <article key={item}>
            <FileSearch size={26} aria-hidden="true" />
            <h2>{item}</h2>
            <p>
              정확하지 않아도 괜찮습니다. 현재 알고 있는 범위만 남겨주시면 상담 과정에서 필요한
              정보를 다시 정리해드립니다.
            </p>
          </article>
        ))}
        <article>
          <Ban size={26} aria-hidden="true" />
          <h2>단독 부분철거와 단순 폐기물 처리</h2>
          <p>
            부분철거만 따로 진행하거나 폐기물 처리만 단독으로 요청하는 경우는 진행이 어렵습니다.
            전체 철거 공정 안에 포함되는 경우 현장 조건을 보고 상담합니다.
          </p>
        </article>
      </section>

      <section className="seo-section seo-flow">
        <p className="eyebrow dark">진행 흐름</p>
        <h2>{page.keyword} 문의 후 확인 순서입니다.</h2>
        <ol>
          {flowSteps.map((step) => (
            <li key={step}>
              <BadgeCheck size={20} aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-section seo-faq">
        <div>
          <p className="eyebrow dark">자주 묻는 질문</p>
          <h2>{region.name} 철거 상담 전에 많이 묻는 내용입니다.</h2>
        </div>
        <div className="seo-faq-list">
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{typeCopy.faq[0]}</h3>
            <p>{typeCopy.faq[1]}</p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{page.keyword}은 사진만으로 견적이 가능한가요?</h3>
            <p>
              사진으로 1차 범위는 볼 수 있지만 정확한 견적은 현장 조건에 따라 방문 확인이
              필요할 수 있습니다. 특히 반출 동선이나 설비 철거가 포함되면 현장 확인이 더
              중요합니다.
            </p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>철거지원금도 같이 확인할 수 있나요?</h3>
            <p>
              조건에 따라 가능 여부와 준비 서류가 달라집니다. 확정이나 보장 표현이 아니라, 상담
              과정에서 신청 가능성을 확인하는 방식으로 안내합니다.
            </p>
          </article>
        </div>
      </section>

      {/* ---------- 지역 현장 메모: 지역 고유 조건과 링크 ---------- */}
      <section className="seo-section seo-region-profile">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">지역 현장 메모</p>
            <h2>
              {region.name} {topic.keyword}에서 따로 확인하는 지역 조건입니다.
            </h2>
            <p>{sidoCopy.summary}</p>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>

        <dl className="seo-region-meta">
          <div>
            <dt>행정 구역</dt>
            <dd>{region.fullName}</dd>
          </div>
          <div>
            <dt>현장 유형</dt>
            <dd>{typeCopy.label}</dd>
          </div>
          <div>
            <dt>건설폐기물 배출 신고</dt>
            <dd>{region.sigungu}청 (5톤 이상 발생 시)</dd>
          </div>
          <div>
            <dt>상담 방식</dt>
            <dd>{page.regionType === "군" ? "사진 확인 후 출장 일정 조율" : "사진 확인 후 방문 견적 여부 안내"}</dd>
          </div>
        </dl>

        <div className="seo-check-list">
          {typeCopy.checks.map(([title, body]) => (
            <article key={title}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <p>
          {sidoCopy.note} 건설공사로 5톤 이상 폐기물이 나오면 배출자가 {region.sigungu}청에 신고해야
          하며, 처리 계획과 반출 회차를 견적 단계에서 함께 정리합니다.
        </p>

        {notes && (notes.cases?.length || notes.tips?.length || notes.waste) ? (
          <div className="seo-region-notes">
            {notes.cases && notes.cases.length > 0 && (
              <>
                <h3>{region.name} 최근 상담·시공 사례</h3>
                <ul>
                  {notes.cases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {notes.tips && notes.tips.length > 0 && (
              <>
                <h3 style={{ marginTop: notes.cases?.length ? 14 : 0 }}>{region.name} 현장 특이사항</h3>
                <ul>
                  {notes.tips.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {notes.waste && <p style={{ marginTop: 12, marginBottom: 0 }}>{notes.waste}</p>}
          </div>
        ) : null}

        <div className="seo-link-grid">
          {siblings.map((sibling) => (
            <Link key={sibling.slug} href={regionTopicPath(sibling, topic)}>
              {sibling.name} {topic.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
          {sido && (
            <Link href={sidoHubPath(topic, sido)}>
              {sido.name} {topic.keyword} 전체
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <Link href={topicHubPath(topic)}>
            전국 {topic.keyword} 기준 보기
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {otherTopics.length > 0 && (
        <section className="seo-section">
          <div className="seo-section-head">
            <div>
              <p className="eyebrow dark">같은 지역 다른 주제</p>
              <h2>{region.name}에서 함께 볼 수 있는 철거 상담 주제입니다.</h2>
            </div>
          </div>
          <div className="seo-link-grid">
            {otherTopics.map((otherPage) => (
              <Link key={otherPage.slug} href={`/regions/${otherPage.slug}/`}>
                {otherPage.keyword}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="seo-bottom-cta">
        <Link href={regionHubPath(region)} className="secondary-button dark">
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
