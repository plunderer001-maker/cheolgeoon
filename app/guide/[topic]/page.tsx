import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
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
  PRIORITY_REGION_SLUGS,
  getTopic,
  regionMap,
  regionTopicPath,
  sidoHubPath,
  sidos,
  topics,
} from "@/app/lib/region-pages";

type PageProps = {
  params: Promise<{ topic: string }>;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";
const SITE_URL = "https://cheolgeoon.netlify.app";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) return { title: "철거 안내 | 철거온" };

  const canonical = `/guide/${topic.slug}/`;
  return {
    title: topic.hubTitle,
    description: topic.hubDescription,
    alternates: { canonical },
    openGraph: {
      title: topic.hubTitle,
      description: topic.hubDescription,
      url: canonical,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [{ url: `${SITE_URL}${topic.image}`, width: 1200, height: 630, alt: `${topic.keyword} 안내` }],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.hubTitle,
      description: topic.hubDescription,
      images: [`${SITE_URL}${topic.image}`],
    },
  };
}

/* 견적을 바꾸는 다섯 가지 기준. 숫자 대신 "왜 달라지는지"를 적는다. */
const COST_FACTORS: [string, string][] = [
  [
    "철거 범위와 마감재",
    "바닥재·천장·벽체 마감을 어디까지 걷어내는지, 마감층이 몇 겹인지에 따라 작업 시간과 폐기물 양이 함께 달라집니다. 원상복구 기준서가 있으면 범위가 빨리 정해집니다.",
  ],
  [
    "폐기물 양과 종류",
    "혼합 폐기물, 목재, 유리, 금속은 처리 방식이 다릅니다. 반출 회차가 몇 번인지, 분리 배출이 가능한지가 비용에 직접 반영됩니다.",
  ],
  [
    "반출 동선",
    "화물 엘리베이터 유무, 층수, 차량 정차 가능 여부에 따라 인력 투입이 달라집니다. 계단 반출은 같은 양이라도 시간이 더 걸립니다.",
  ],
  [
    "작업 시간 제한",
    "관리사무소 규정으로 야간이나 주말에만 작업할 수 있으면 인건비 할증이 붙습니다. 허용 시간을 먼저 확인해야 견적이 정확해집니다.",
  ],
  [
    "설비 철거 여부",
    "주방 후드·덕트, 간판, 붙박이 집기, 전기·급배수 설비가 포함되면 전문 인력이 따로 필요합니다. 사진에서 설비 상태를 먼저 봅니다.",
  ],
];

/* 대상 유형별 포인트. 예전 대상별 페이지의 핵심 문장을 한곳에 모았다. */
const TARGET_POINTS: [string, string][] = [
  ["상가", "바닥재 종류, 천장 구조, 집기 철거 여부, 폐기물 처리량에 따라 달라집니다. 임대차 원상복구 기준서를 먼저 확인합니다."],
  ["사무실", "파티션 수, OA 바닥, 전기 배선 정리, 엘리베이터 사용 조건이 비용에 영향을 줍니다. 퇴실일과 건물 작업 시간을 함께 봅니다."],
  ["식당·카페", "후드·덕트 길이, 주방 타일과 방수층 상태, 중량 설비 반출이 난이도를 정합니다. 가스·전기 차단 가능 여부를 먼저 확인합니다."],
  ["학원·병원", "강의실·진료실 칸막이 수와 재질, 방음재, 폐기물 반출 시간 제한에 따라 견적이 달라집니다."],
  ["창고·공장", "설비 종류와 폐기물 성상이 비용을 바꿉니다. 사진에서 설비 상태와 바닥 구조를 먼저 봅니다."],
  ["주택·빌라", "내부 인테리어 철거인지 구조체를 포함하는지에 따라 진행 방식이 달라집니다. 구조 변경이 있는 의뢰는 별도 확인이 필요합니다."],
];

const FLOW_STEPS = ["주소·평수·업종 확인", "사진으로 1차 범위 확인", "비용 변동 요인 안내", "방문 견적 필요 여부 판단", "일정 조율과 견적 확정"];

const FAQ: [string, string][] = [
  [
    "평당 단가로 견적을 알 수 없나요?",
    "같은 평수라도 마감재 두께, 폐기물 양, 반출 동선이 달라 단가만으로는 실제 금액과 차이가 큽니다. 사진과 주소를 보내주시면 비용이 달라지는 항목을 먼저 짚어드립니다.",
  ],
  [
    "사진만으로 견적이 가능한가요?",
    "사진으로 1차 범위와 대략적인 항목은 정리할 수 있습니다. 설비 철거나 반출 동선 판단이 필요하면 방문 견적을 안내합니다.",
  ],
  [
    "철거 지원금은 어떻게 확인하나요?",
    "소상공인 폐업 지원 사업(희망리턴패키지 등)은 공고마다 대상과 한도가 달라집니다. 보장이 아니라 신청 가능성을 상담 과정에서 함께 확인하는 방식으로 안내합니다.",
  ],
  [
    "비용을 줄이려면 무엇을 준비하면 되나요?",
    "직접 정리할 수 있는 집기와 물품을 먼저 빼고, 철거 제외 항목을 정해두면 작업량과 폐기물 양이 줄어 견적이 낮아집니다.",
  ],
];

export default async function TopicHubPage({ params }: PageProps) {
  const { topic: topicSlug } = await params;
  const topic = getTopic(topicSlug);
  if (!topic) notFound();

  const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
    .map((slug) => regionMap.get(slug))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));

  return (
    <main className="seo-main">
      <section className="seo-hero" style={{ "--seo-hero-image": `url("${topic.image}")` } as CSSProperties}>
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb
          items={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: topic.keyword }]}
        />
        <p className="eyebrow">{topic.eyebrow} · 전국</p>
        <h1>{topic.hubH1}</h1>
        <p>
          {topic.keyword}은 평수만으로 정해지지 않습니다. 철거 범위, 폐기물 양, 반출 동선, 작업
          시간 제한, 설비 철거 여부 다섯 가지가 금액을 바꿉니다. 이 기준을 먼저 알고 상담하시면
          견적 비교가 쉬워지고 빠지는 항목이 줄어듭니다.
        </p>
        <div className="seo-actions">
          <Link href={NAVER_FORM_URL} className="primary-button">
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link href="#regions" className="secondary-button dark">
            지역별로 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">견적이 갈리는 기준</p>
          <h2>{topic.keyword}을 바꾸는 다섯 가지입니다.</h2>
          <p>
            처음 상담에서는 확정 금액보다 어떤 항목이 비용을 움직이는지부터 확인합니다. 아래
            다섯 가지를 기준으로 사진과 주소를 보내주시면 방문 견적이 필요한지 바로 판단할 수
            있습니다.
          </p>
        </div>
        <div className="seo-check-list">
          {COST_FACTORS.map(([title, body]) => (
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
          <h2>비용 확인 방식</h2>
          <p>
            사진으로 범위와 마감 상태를 보고, 주소로 반출 조건을 확인한 뒤 비용이 달라지는 항목을
            먼저 정리합니다. 확정 견적은 현장 조건이 정리된 다음에 나옵니다.
          </p>
        </article>
        <article>
          <Wrench size={26} aria-hidden="true" />
          <h2>작업 범위 나누기</h2>
          <p>
            철거할 부분과 남길 부분, 직접 정리할 물품을 먼저 나누면 폐기물 양이 줄어 견적이
            낮아집니다. 원상복구 기준서가 있으면 함께 보내주세요.
          </p>
        </article>
        <article>
          <FileSearch size={26} aria-hidden="true" />
          <h2>방문 견적이 필요한 경우</h2>
          <p>
            설비 철거가 포함되거나 반출 동선이 복잡한 현장, 관리 규정이 까다로운 건물은 방문
            견적으로 작업 동선과 시간을 확인합니다.
          </p>
        </article>
        <article>
          <Ban size={26} aria-hidden="true" />
          <h2>진행이 어려운 의뢰</h2>
          <p>
            부분철거만 단독 진행하거나 단순 폐기물 처리만 요청하는 경우, 구조체 해체가 필요한
            경우는 어렵습니다. 전체 철거 공정에 포함되면 현장 조건을 보고 상담합니다.
          </p>
        </article>
      </section>

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">대상별 포인트</p>
          <h2>공간 종류에 따라 먼저 보는 항목이 다릅니다.</h2>
          <p>
            같은 {topic.keyword} 문의라도 상가, 사무실, 식당, 학원은 견적을 좌우하는 항목이
            다릅니다. 해당하는 공간의 포인트를 확인하고 사진을 준비하시면 상담이 빨라집니다.
          </p>
        </div>
        <div className="seo-check-list">
          {TARGET_POINTS.map(([title, body]) => (
            <article key={title}>
              <ClipboardCheck size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-flow">
        <p className="eyebrow dark">진행 흐름</p>
        <h2>{topic.keyword} 문의 후 확인 순서입니다.</h2>
        <ol>
          {FLOW_STEPS.map((step) => (
            <li key={step}>
              <BadgeCheck size={20} aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-section" id="regions">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">지역별 확인</p>
            <h2>현장이 있는 시도를 고르면 시군구 페이지로 이어집니다.</h2>
            <p>
              지역마다 건물 규정, 차량 진입, 폐기물 반출 거리가 달라 같은 작업도 견적 항목이
              바뀝니다. 시도 페이지에서 지역 조건을 먼저 확인하세요.
            </p>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {sidos.map((sido) => (
            <Link key={sido.slug} href={sidoHubPath(topic, sido)}>
              {sido.name} {topic.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">문의가 많은 지역</p>
            <h2>상담 요청이 많은 지역은 바로 확인할 수 있습니다.</h2>
          </div>
        </div>
        <div className="seo-link-grid">
          {priorityRegions.map((region) => (
            <Link key={region.slug} href={regionTopicPath(region, topic)}>
              {region.name} {topic.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section seo-faq">
        <div>
          <p className="eyebrow dark">자주 묻는 질문</p>
          <h2>{topic.keyword} 상담 전에 많이 묻는 내용입니다.</h2>
        </div>
        <div className="seo-faq-list">
          {FAQ.map(([question, answer]) => (
            <article key={question}>
              <HelpCircle size={22} aria-hidden="true" />
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-bottom-cta">
        <Link href="/guide/" className="secondary-button dark">
          다른 주제 보기
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link href={NAVER_FORM_URL} className="primary-button">
          <MessageCircle size={19} aria-hidden="true" />
          견적 문의 준비하기
        </Link>
      </section>
    </main>
  );
}
