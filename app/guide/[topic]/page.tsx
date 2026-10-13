import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import {
  LandingChips,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingTitle,
} from "@/app/components/Landing";
import { COST_FAQ, CostCore } from "@/app/components/CostCore";
import { ClosureGuide } from "@/app/guide/_guides/closure";
import { CompanyGuide } from "@/app/guide/_guides/company";
import { ClosureSubsidyGuide } from "@/app/guide/_guides/closure-subsidy";
import { OfficeGuide } from "@/app/guide/_guides/office";
import { RestaurantGuide } from "@/app/guide/_guides/restaurant";
import { StoreGuide } from "@/app/guide/_guides/store";
import { RestorationGuide } from "@/app/guide/_guides/restoration";
import { getGuide, guides } from "@/app/lib/guides";
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

const SITE_URL = "https://cheolgeoon.netlify.app";

/* 지역 조합이 없는 전국 가이드의 본문. data/guides.json 의 slug 와 짝을 이룬다. */
const GUIDE_PAGES: Record<string, ComponentType<{ keyword: string }>> = {
  "원상복구-철거": RestorationGuide,
  "폐업-철거지원금": ClosureSubsidyGuide,
  "상가-철거": StoreGuide,
  "폐업-철거": ClosureGuide,
  "사무실-철거": OfficeGuide,
  "식당-철거": RestaurantGuide,
  "철거전문업체": CompanyGuide,
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return [...topics.map((topic) => ({ topic: topic.slug })), ...guides.map((guide) => ({ topic: guide.slug }))];
}

function pageMetadata({
  slug,
  title,
  description,
  image,
  keyword,
  imageSize = [1200, 630],
}: {
  slug: string;
  title: string;
  description: string;
  image: string;
  keyword: string;
  imageSize?: number[];
}): Metadata {
  const canonical = `/guide/${slug}/`;
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
      images: [{ url: `${SITE_URL}${image}`, width: imageSize[0], height: imageSize[1], alt: `${keyword} 안내` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${image}`],
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const guide = getGuide(topicSlug);
  if (guide) return pageMetadata(guide);

  const topic = getTopic(topicSlug);
  if (!topic) return { title: "철거 안내 | 철거온" };
  return pageMetadata({
    slug: topic.slug,
    title: topic.hubTitle,
    description: topic.hubDescription,
    image: topic.hubImage ?? topic.image,
    keyword: topic.keyword,
    imageSize: topic.hubImage ? [1080, 1080] : undefined,
  });
}

export default async function TopicHubPage({ params }: PageProps) {
  const { topic: topicSlug } = await params;

  const guide = getGuide(topicSlug);
  if (guide) {
    const GuidePage = GUIDE_PAGES[guide.slug];
    if (!GuidePage) notFound();
    return <GuidePage keyword={guide.keyword} />;
  }

  const topic = getTopic(topicSlug);
  if (!topic) notFound();

  const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
    .map((slug) => regionMap.get(slug))
    .filter((region): region is NonNullable<typeof region> => Boolean(region));

  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 가이드", href: "/guide/" }, { name: topic.keyword }]}
        kicker={`전국 ${topic.keyword} 무료견적`}
        title={
          <>
            {topic.keyword},
            <br />
            사진만 보내도 먼저 알려드립니다
          </>
        }
        lead="평수보다 현장 조건이 금액을 바꿉니다."
        checks={["견적 상담 무료", "사진으로 1차 확인", "전국 방문 견적"]}
        secondary={{ label: "평당 비용 먼저 보기", href: "#price" }}
      />

      <CostCore
        priceTitle={
          <>
            {topic.keyword}, <em>평당</em> 얼마쯤 할까요?
          </>
        }
      />

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={COST_FAQ} />
      </section>

      <section className="lp-section lp-regions" id="regions">
        <LandingTitle>지역별 {topic.keyword}</LandingTitle>
        <LandingChips links={sidos.map((sido) => ({ label: sido.short, href: sidoHubPath(topic, sido) }))} />
        <p className="lp-chips-label">상담이 많은 지역</p>
        <LandingChips
          soft
          links={priorityRegions.map((region) => ({ label: region.name, href: regionTopicPath(region, topic) }))}
        />
        <p className="lp-chips-label">함께 보면 좋은 안내</p>
        <LandingChips links={guides.map((item) => ({ label: item.keyword, href: `/guide/${item.slug}/` }))} />
        <LandingChips soft links={[{ label: "철거 가이드 모음", href: "/guide/" }]} />
      </section>

      <LandingFinal />
    </main>
  );
}
