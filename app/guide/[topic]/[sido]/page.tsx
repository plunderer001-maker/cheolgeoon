import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardCheck, HelpCircle, MapPinned, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import {
  PRIORITY_REGION_SLUGS,
  getRegionType,
  getSido,
  getTopic,
  regionTopicPath,
  sidos,
  topicHubPath,
  topics,
} from "@/app/lib/region-pages";
import { REGION_TYPE_COPY, getSidoCopy } from "@/app/lib/topic-copy";

type PageProps = {
  params: Promise<{ topic: string; sido: string }>;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";
const SITE_URL = "https://cheolgeoon.netlify.app";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return topics.flatMap((topic) => sidos.map((sido) => ({ topic: topic.slug, sido: sido.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: topicSlug, sido: sidoSlug } = await params;
  const topic = getTopic(topicSlug);
  const sido = getSido(sidoSlug);
  if (!topic || !sido) return { title: "지역 철거 안내 | 철거온" };

  const canonical = `/guide/${topic.slug}/${sido.slug}/`;
  const title = `${sido.name} ${topic.keyword} | 시군구별 견적 기준과 상담 안내`;
  const description = `${sido.name} ${sido.regions.length}개 시군구의 ${topic.keyword} 안내입니다. ${getSidoCopy(sido.short).note} 현장이 있는 시군구를 고르면 지역 조건별 확인 항목을 볼 수 있습니다.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [{ url: `${SITE_URL}${topic.image}`, width: 1200, height: 630, alt: `${sido.name} ${topic.keyword}` }],
    },
  };
}

export default async function SidoHubPage({ params }: PageProps) {
  const { topic: topicSlug, sido: sidoSlug } = await params;
  const topic = getTopic(topicSlug);
  const sido = getSido(sidoSlug);
  if (!topic || !sido) notFound();

  const copy = getSidoCopy(sido.short);
  const typeCounts = new Map<string, number>();
  for (const region of sido.regions) {
    const type = getRegionType(region);
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
  }
  const dominantType = [...typeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] as
    | keyof typeof REGION_TYPE_COPY
    | undefined;
  const typeCopy = dominantType ? REGION_TYPE_COPY[dominantType] : undefined;
  const priorityRegions = sido.regions.filter((region) => PRIORITY_REGION_SLUGS.has(region.slug));

  return (
    <main className="seo-main">
      <section className="seo-hero compact" style={{ "--seo-hero-image": `url("${topic.image}")` } as CSSProperties}>
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <Breadcrumb
          items={[
            { name: "홈", href: "/" },
            { name: topic.keyword, href: topicHubPath(topic) },
            { name: sido.name },
          ]}
        />
        <p className="eyebrow">
          {sido.name} · {topic.eyebrow}
        </p>
        <h1>
          {sido.name} {topic.keyword}, 시군구별로 확인하세요.
        </h1>
        <p>
          {copy.summary} 아래에서 현장이 있는 시군구를 고르면 그 지역에서 먼저 확인하는 조건과
          상담 순서를 볼 수 있습니다.
        </p>
        <div className="seo-actions">
          <Link href={NAVER_FORM_URL} className="primary-button">
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link href={topicHubPath(topic)} className="secondary-button dark">
            {topic.keyword} 기준 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {priorityRegions.length > 0 && (
        <section className="seo-section">
          <div className="seo-section-head">
            <div>
              <p className="eyebrow dark">문의가 많은 지역</p>
              <h2>{sido.name}에서 상담 요청이 많은 지역입니다.</h2>
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
      )}

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">시군구 목록</p>
            <h2>
              {sido.name} {sido.regions.length}개 시군구 {topic.keyword} 안내입니다.
            </h2>
          </div>
          <MapPinned size={30} aria-hidden="true" />
        </div>
        <div className="seo-link-grid">
          {sido.regions.map((region) => (
            <Link key={region.slug} href={regionTopicPath(region, topic)}>
              {region.sigungu} {topic.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {typeCopy && (
        <section className="seo-section seo-two-column">
          <div>
            <p className="eyebrow dark">{sido.name} 현장 조건</p>
            <h2>{sido.name}에서 견적 전에 먼저 보는 조건입니다.</h2>
            <p>
              {copy.note} {sido.name}은 {typeCopy.label} 현장 비중이 커서 {typeCopy.summary}
            </p>
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
      )}

      <section className="seo-section seo-faq">
        <div>
          <p className="eyebrow dark">자주 묻는 질문</p>
          <h2>{sido.name} 철거 상담 전에 많이 묻는 내용입니다.</h2>
        </div>
        <div className="seo-faq-list">
          {typeCopy && (
            <article>
              <HelpCircle size={22} aria-hidden="true" />
              <h3>{typeCopy.faq[0]}</h3>
              <p>{typeCopy.faq[1]}</p>
            </article>
          )}
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{sido.name} 전 지역이 상담 가능한가요?</h3>
            <p>
              전국 상담을 기준으로 안내합니다. 이동 거리가 먼 지역은 방문 비용이 생길 수 있어
              주소와 사진을 먼저 확인한 뒤 방문 견적 여부를 안내합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="seo-bottom-cta">
        <Link href={topicHubPath(topic)} className="secondary-button dark">
          <ArrowLeft size={18} aria-hidden="true" />
          {topic.keyword} 전체 안내로
        </Link>
        <Link href={NAVER_FORM_URL} className="primary-button">
          <MessageCircle size={19} aria-hidden="true" />
          견적 문의 준비하기
        </Link>
      </section>
    </main>
  );
}
