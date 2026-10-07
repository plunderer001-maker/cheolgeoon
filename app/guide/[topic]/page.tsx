import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { josa } from "@/app/lib/josa";
import {
  CalendarCheck,
  Clock,
  DoorOpen,
  FileText,
  HandCoins,
  Hammer,
  HardHat,
  KeyRound,
  Layers,
  Receipt,
  Recycle,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import {
  LandingBanner,
  LandingCards,
  LandingChecklist,
  LandingChips,
  LandingFactors,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingNote,
  LandingPrice,
  LandingSpaces,
  LandingSplit,
  LandingSteps,
  LandingTiles,
  LandingTitle,
  SERVICE_SCOPE,
} from "@/app/components/Landing";
import { ClosureGuide } from "@/app/guide/_guides/closure";
import { CompanyGuide } from "@/app/guide/_guides/company";
import { ClosureSubsidyGuide } from "@/app/guide/_guides/closure-subsidy";
import { OfficeGuide } from "@/app/guide/_guides/office";
import { RestaurantGuide } from "@/app/guide/_guides/restaurant";
import { StoreGuide } from "@/app/guide/_guides/store";
import { RestorationGuide } from "@/app/guide/_guides/restoration";
import { getGuide, guides } from "@/app/lib/guides";
import {
  MARKET_PRICE_CAPTION,
  MARKET_PRICE_ROWS,
  MARKET_PRICE_SOURCES,
  MARKET_PRICE_UPS,
} from "@/app/lib/market-prices";
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

/* 검색하는 사장님의 상황. 상황을 고르면 무엇을 먼저 해결하는지 한 줄로 답한다. */
const SITUATIONS = [
  { icon: DoorOpen, title: "가게를 폐업하고 정리해야 해요", body: "철거 범위와 지원금 가능 여부를 함께 확인합니다" },
  { icon: FileText, title: "건물주가 원상복구를 요구해요", body: "계약서·기준서로 철거할 범위부터 정리합니다" },
  { icon: CalendarCheck, title: "사무실 이전 날짜가 정해졌어요", body: "퇴거일에 맞춰 거꾸로 일정을 잡습니다" },
  { icon: KeyRound, title: "새 매장 들어가기 전 철거가 필요해요", body: "남길 것과 걷어낼 것을 먼저 나눕니다" },
];

/* 견적서에 들어가는 항목. 금액을 단정하지 않고 무엇에 돈이 드는지 보여준다. */
const COST_ITEMS = [
  { icon: HardHat, name: "인건비", note: "작업 인원 × 작업일" },
  { icon: Recycle, name: "폐기물 처리비", note: "양과 종류별 처리 비용" },
  { icon: Truck, name: "운반·차량비", note: "반출 회차와 차량 크기" },
  { icon: Hammer, name: "장비비", note: "설비·콘크리트 철거 시" },
  { icon: ShieldCheck, name: "보양·양중비", note: "엘리베이터·공용부 보호" },
];

const COST_FACTORS = [
  { icon: Layers, title: "철거 범위", body: "바닥·천장·벽을 어디까지 걷어내는지" },
  { icon: Recycle, title: "폐기물 양", body: "종류와 반출 회차" },
  { icon: Truck, title: "반출 동선", body: "엘리베이터·층수·차량 정차" },
  { icon: Clock, title: "작업 시간", body: "야간·주말만 가능한 건물인지" },
  { icon: Wrench, title: "설비 철거", body: "후드·덕트·간판·배관 포함 여부" },
];

/* 다른 곳 견적과 비교할 때 추가 비용을 막는 확인 항목. */
const QUOTE_CHECKS = [
  "폐기물 처리비가 견적에 포함됐나요?",
  "야간·주말 작업 할증 조건이 적혀 있나요?",
  "엘리베이터 보양·양중 비용이 따로인가요?",
  "원상복구 범위가 항목별로 적혀 있나요?",
  "추가 비용이 생기는 조건이 명시됐나요?",
];

const FAQ: [string, string][] = [
  [
    "평당 단가로는 알 수 없나요?",
    "공개 자료 기준 상가·사무실 전체 철거는 평당 10~15만원 선입니다. 다만 같은 평수도 마감재·폐기물·반출 동선에 따라 차이가 커서, 사진을 보내주시면 금액이 달라지는 항목부터 짚어드립니다.",
  ],
  ["사진만으로 견적이 되나요?", "1차 범위는 사진으로 봅니다. 설비나 동선 확인이 필요할 때만 방문 견적을 안내합니다."],
  [
    "원상복구는 어디까지 해야 하나요?",
    "임대차 계약서와 입점 당시 상태가 기준입니다. 계약서나 기준서를 보내주시면 범위를 같이 정리합니다.",
  ],
  ["비용을 줄이는 방법이 있나요?", "직접 뺄 수 있는 집기와 물품을 먼저 정리하면 폐기물이 줄어 견적이 낮아집니다."],
];

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
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: topic.keyword }]}
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

      <section className="lp-section" id="price">
        <LandingTitle>
          {topic.keyword}, <em>평당</em> 얼마쯤 할까요?
        </LandingTitle>
        <LandingPrice
          rows={MARKET_PRICE_ROWS}
          ups={MARKET_PRICE_UPS}
          sources={MARKET_PRICE_SOURCES}
          caption={MARKET_PRICE_CAPTION}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          지금 어떤 <em>상황</em>이신가요?
        </LandingTitle>
        <LandingCards items={SITUATIONS} linkAll />
      </section>

      <section className="lp-section" id="cost">
        <LandingTitle>
          {josa(topic.keyword, "은/는")} <em>이렇게</em> 구성됩니다
        </LandingTitle>
        <LandingTiles items={COST_ITEMS} />
        <LandingNote icon={Receipt}>확정 금액은 현장 조건을 본 뒤 항목별로 나눠 안내합니다.</LandingNote>
      </section>

      <section className="lp-section" id="factors">
        <LandingTitle>
          금액을 바꾸는 <em>5가지</em>
        </LandingTitle>
        <LandingFactors items={COST_FACTORS} />
      </section>

      <section className="lp-section">
        <LandingTitle>이런 현장을 철거합니다</LandingTitle>
        <LandingSpaces />
        <LandingNote>창고·공장·주택 내부 철거도 상담할 수 있습니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          맡기기 전에 <em>꼭</em> 확인하세요
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          견적 비교할 때 <em>이것</em>만 보세요
        </LandingTitle>
        <LandingChecklist items={QUOTE_CHECKS} />
        <LandingNote>빠진 항목이 있으면 철거 당일 추가 비용이 생기기 쉽습니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps />
        <LandingNote icon={CalendarCheck}>
          퇴거일이 정해졌다면 날짜도 함께 알려주세요. 건물 작업 조건까지 맞춰 일정을 잡습니다.
        </LandingNote>
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title="폐업 예정이라면 철거지원금부터 확인하세요"
          body="희망리턴패키지 점포철거비는 전용면적 1평당 20만원, 최대 600만원까지 지원됩니다. 정산 서류(공사내역서·세금계산서)도 철거온이 발급합니다."
          action={{ label: "지원 조건 보기", href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
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
      </section>

      <LandingFinal />
    </main>
  );
}
