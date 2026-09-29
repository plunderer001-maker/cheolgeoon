import type { Metadata } from "next";
import {
  BadgeCheck,
  CalendarCheck,
  Calculator,
  FileSearch,
  FileText,
  HandCoins,
  PaintRoller,
  Receipt,
  Recycle,
  TriangleAlert,
} from "lucide-react";
import {
  LandingBanner,
  LandingCards,
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
  LandingTitle,
  SERVICE_SCOPE,
} from "@/app/components/Landing";
import {
  MARKET_PRICE_CAPTION,
  MARKET_PRICE_ROWS,
  MARKET_PRICE_SOURCES,
  MARKET_PRICE_UPS,
} from "@/app/lib/market-prices";
import { PRIORITY_REGION_SLUGS, regionMap, regionHubPath, sidoHubPath, sidos, topics } from "@/app/lib/region-pages";

/* 메인은 "철거업체"를 주 키워드로, "철거비용"은 요약만 두고 비용 가이드로 넘긴다. */
const TITLE = "철거업체 순위보다 중요한 기준 | 철거비용 무료견적 | 철거온";
const DESCRIPTION =
  "철거업체를 고를 때 순위보다 먼저 봐야 할 기준 5가지와 상가·사무실 철거비용 참고 범위를 정리했습니다. 사진만 보내면 무료견적, 원상복구와 지원금 정산 서류까지 안내합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://cheolgeoon.netlify.app/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/images/cheolgeoon/og/main-og.webp", width: 1200, height: 630, alt: "철거온 전국 철거 무료견적 상담" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

/* "철거업체 순위" 검색 의도: 순위표 대신 믿을 만한 업체를 가리는 기준을 준다. */
const CRITERIA = [
  { icon: Receipt, title: "세금계산서 발급", body: "사업자등록된 업체인지, 지원금 정산이 되는지" },
  { icon: Recycle, title: "폐기물 처리 포함", body: "폐기물 처리비가 견적에 들어 있는지" },
  { icon: FileSearch, title: "항목별 견적서", body: "인건비·폐기물·운반비가 나눠져 있는지" },
  { icon: TriangleAlert, title: "추가 비용 조건", body: "어떤 경우 금액이 바뀌는지 적혀 있는지" },
  { icon: PaintRoller, title: "원상복구까지", body: "철거 후 마감 복구까지 한 번에 되는지" },
];

const GUIDES = [
  { icon: Calculator, title: "철거비용이 궁금해요", body: "평당 참고 범위와 금액이 달라지는 이유", href: "/guide/철거-비용/" },
  { icon: FileText, title: "원상복구를 해야 해요", body: "어디까지 철거하고 복구해야 하는지", href: "/guide/원상복구-철거/" },
  { icon: HandCoins, title: "폐업 지원금을 받고 싶어요", body: "점포철거비 최대 600만원 조건과 서류", href: "/guide/폐업-철거지원금/" },
  { icon: CalendarCheck, title: "바로 견적을 받고 싶어요", body: "사진·주소만 남기면 1차 범위를 안내합니다" },
];

const FAQ: [string, string][] = [
  [
    "철거업체 순위는 어디서 볼 수 있나요?",
    "공식적으로 매기는 철거업체 순위는 없습니다. 세금계산서 발급, 폐기물 처리비 포함, 항목별 견적서, 추가 비용 조건을 기준으로 2~3곳을 비교해 보시는 방법을 권합니다.",
  ],
  ["견적은 정말 무료인가요?", "견적 상담은 무료입니다. 도서산간 지역은 방문·출장 비용이 생길 수 있습니다."],
  ["사진이나 평수를 몰라도 되나요?", "괜찮습니다. 주소와 업종만 알려주셔도 상담할 수 있고, 사진이 있으면 범위를 더 빨리 봅니다."],
  ["전국 어디든 가능한가요?", "전국 상담이 가능합니다. 지역마다 건물 규정과 반출 조건이 달라 주소를 기준으로 일정을 안내합니다."],
];

const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
  .map((slug) => regionMap.get(slug))
  .filter((region): region is NonNullable<typeof region> => Boolean(region));

export default function Home() {
  const primaryTopic = topics[0];

  return (
    <main className="lp">
      <LandingHero
        kicker="전국 상가·사무실 철거 무료견적"
        title={
          <>
            철거업체 순위보다 중요한 건,
            <br />
            우리 현장 철거비용입니다
          </>
        }
        lead="사진만 보내면 금액이 달라지는 항목부터 알려드립니다."
        checks={["견적 상담 무료", "원상복구·마감까지", "지원금 정산 서류 발급"]}
        secondary={{ label: "업체 고르는 기준 보기", href: "#criteria" }}
      />

      <section className="lp-section" id="criteria">
        <LandingTitle>
          좋은 철거업체 고르는 <em>5가지</em> 기준
        </LandingTitle>
        <LandingFactors items={CRITERIA} />
        <LandingNote icon={BadgeCheck}>
          공식 철거업체 순위는 없습니다. 견적을 받을 때 이 다섯 가지를 기준으로 비교해 보세요.
        </LandingNote>
      </section>

      <section className="lp-section" id="price">
        <LandingTitle>
          철거비용, <em>평당</em> 얼마쯤 할까요?
        </LandingTitle>
        <LandingPrice
          rows={MARKET_PRICE_ROWS}
          ups={MARKET_PRICE_UPS}
          sources={MARKET_PRICE_SOURCES}
          caption={MARKET_PRICE_CAPTION}
        />
        <LandingChips links={[{ label: "철거비용 자세히 보기", href: "/guide/철거-비용/" }]} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          어떤 <em>도움</em>이 필요하세요?
        </LandingTitle>
        <LandingCards items={GUIDES} linkAll />
      </section>

      <section className="lp-section">
        <LandingTitle>이런 현장을 철거합니다</LandingTitle>
        <LandingSpaces />
        <LandingNote>창고·공장·주택 내부 철거도 상담할 수 있습니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          철거온이 <em>맡는</em> 범위
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps />
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
        <LandingTitle>지역별 철거 상담</LandingTitle>
        <LandingChips
          links={priorityRegions.map((region) => ({ label: `${region.name} 철거`, href: regionHubPath(region) }))}
        />
        {primaryTopic && (
          <>
            <p className="lp-chips-label">시도별 철거비용</p>
            <LandingChips
              soft
              links={sidos.map((sido) => ({ label: sido.short, href: sidoHubPath(primaryTopic, sido) }))}
            />
          </>
        )}
        <p className="lp-chips-label">전체 지역</p>
        <LandingChips links={[{ label: "전국 시군구 전체 보기", href: "/regions/" }, { label: "철거 가이드 모아보기", href: "/guide/" }]} />
      </section>

      <LandingFinal />
    </main>
  );
}
