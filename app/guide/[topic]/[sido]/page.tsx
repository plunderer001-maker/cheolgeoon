import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, HandCoins, MapPinned, Route, Truck } from "lucide-react";
import {
  LandingBanner,
  LandingChips,
  LandingFactors,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingNote,
  LandingPrice,
  LandingTitle,
} from "@/app/components/Landing";
import {
  MARKET_PRICE_CAPTION,
  MARKET_PRICE_ROWS,
  MARKET_PRICE_SOURCES,
  MARKET_PRICE_UPS,
} from "@/app/lib/market-prices";
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
  const title = `${sido.name} ${topic.keyword} | 시군구별 참고 금액과 지역 조건 | 철거온`;
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
  const otherSidos = sidos.filter((candidate) => candidate.slug !== sido.slug);

  const faq: [string, string][] = [
    [
      `${sido.name} 철거비용은 평당 얼마인가요?`,
      `공개 자료 기준 상가·사무실 전체 철거는 평당 10~15만원 선입니다. ${copy.note}`,
    ],
    ...(typeCopy ? [[typeCopy.faq[0], typeCopy.faq[1]] as [string, string]] : []),
    [
      `${sido.name} 전 지역이 상담 가능한가요?`,
      "전국 상담을 기준으로 안내합니다. 먼 지역은 방문 비용이 생길 수 있어 주소와 사진을 먼저 확인합니다.",
    ],
  ];

  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: topic.keyword, href: topicHubPath(topic) }, { name: sido.name }]}
        kicker={`${sido.name} 철거 무료견적`}
        title={
          <>
            {sido.name} 철거비용,
            <br />
            시군구를 고르면 지역 조건까지
          </>
        }
        lead={copy.summary}
        checks={["견적 상담 무료", "원상복구·마감까지", "지원금 정산 서류 발급"]}
        secondary={{ label: "시군구 고르기", href: "#list" }}
      />

      <section className="lp-section" id="list">
        <LandingTitle>
          {sido.name} <em>시군구</em>별 철거비용
        </LandingTitle>
        {priorityRegions.length > 0 && (
          <>
            <p className="lp-chips-label">상담이 많은 지역</p>
            <LandingChips links={priorityRegions.map((region) => ({ label: region.sigungu, href: regionTopicPath(region, topic) }))} />
            <p className="lp-chips-label">전체 {sido.regions.length}곳</p>
          </>
        )}
        <LandingChips soft links={sido.regions.map((region) => ({ label: region.sigungu, href: regionTopicPath(region, topic) }))} />
      </section>

      <section className="lp-section" id="price">
        <LandingTitle>
          {sido.name} 철거비용, <em>평당</em> 얼마쯤?
        </LandingTitle>
        <LandingPrice
          rows={MARKET_PRICE_ROWS}
          ups={MARKET_PRICE_UPS}
          sources={MARKET_PRICE_SOURCES}
          caption={MARKET_PRICE_CAPTION}
          ctaLabel={`${sido.short} 현장 견적 받기`}
        />
      </section>

      {typeCopy && (
        <section className="lp-section">
          <LandingTitle>
            {sido.name}에서 <em>먼저</em> 보는 조건
          </LandingTitle>
          <LandingFactors
            items={typeCopy.checks.map(([title, body], index) => ({ icon: [Clock, Truck, Route][index % 3], title, body }))}
          />
          <LandingNote icon={MapPinned}>{copy.note}</LandingNote>
        </section>
      )}

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title="폐업 예정이라면 철거지원금부터 확인하세요"
          body="희망리턴패키지 점포철거비는 1평당 20만원, 최대 600만원까지 지원됩니다. 정산 서류는 철거온이 발급합니다."
          action={{ label: "지원 조건 보기", href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>{sido.name} 철거 자주 묻는 질문</LandingTitle>
        <LandingFaq items={faq} />
      </section>

      <section className="lp-section lp-regions">
        <LandingTitle>다른 시도 철거비용</LandingTitle>
        <LandingChips links={otherSidos.map((other) => ({ label: other.short, href: `/guide/${topic.slug}/${other.slug}/` }))} />
        <p className="lp-chips-label">함께 보면 좋은 안내</p>
        <LandingChips
          soft
          links={[
            { label: `전국 ${topic.keyword} 가이드`, href: topicHubPath(topic) },
            { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
            { label: "폐업 철거", href: "/guide/폐업-철거/" },
            { label: "전국 지역 목록", href: "/regions/" },
          ]}
        />
      </section>

      <LandingFinal lead={`${sido.name}에서 철거를 알아보신다면`} title="주소와 사진만 먼저 보내주세요" />
    </main>
  );
}
