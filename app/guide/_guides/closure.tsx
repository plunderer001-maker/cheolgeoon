import { Camera, ClipboardCheck, FileText, HandCoins, Package, Receipt } from "lucide-react";
import {
  LandingBanner,
  LandingCards,
  LandingChecklist,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingNote,
  LandingPrice,
  LandingSpaces,
  LandingSplit,
  LandingSteps,
  LandingTitle,
  RelatedGuides,
  SERVICE_SCOPE,
} from "@/app/components/Landing";
import { MARKET_PRICE_CAPTION, MARKET_PRICE_SOURCES } from "@/app/lib/market-prices";

/* 폐업 철거: 폐업철거, 폐업철거비용, 점포정리, 식당폐업정리 검색 의도. 지원금 사실은 2026.1.19 공고 기준. */

const PRICE_ROWS = [
  { name: "점포 전체 철거", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "계약서 기준 범위에 따라" },
  { name: "점포철거비 지원", perPyeong: "1평당 20만원 이내", example: "최대 600만원 (2025.7.11 이후 폐업)" },
];

const PRICE_UPS = ["주방 설비·후드·덕트", "원상복구까지 할 때", "남은 집기가 많을 때", "야간·주말 작업"];

/* 폐업 전에 순서대로 챙길 것. 지원금 관련은 공고 원문에 있는 내용만 쓴다. */
const ORDER = [
  { icon: HandCoins, title: "1. 지원금 대상 확인", body: "폐업 예정이어도 점포철거비를 신청할 수 있습니다" },
  { icon: FileText, title: "2. 원상복구 범위 확인", body: "임대차 계약서 특약으로 철거 범위를 정합니다" },
  { icon: Package, title: "3. 집기·물품 정리", body: "직접 처분할 물건을 먼저 빼면 견적이 낮아져요" },
  { icon: Camera, title: "4. 철거 전 사진", body: "지원금 정산에 전·후 사진이 필요합니다" },
  { icon: ClipboardCheck, title: "5. 철거·정산 서류", body: "공사내역서와 세금계산서를 받아 둡니다" },
];

const PREPARE = [
  "임대차 계약서 (특약 포함)",
  "건축물대장 (지원금 신청용)",
  "철거 전 매장 사진 (같은 위치·같은 각도)",
  "남길 시설과 뺄 집기 목록",
  "퇴거일과 보증금 반환일",
];

const FAQ: [string, string][] = [
  [
    "폐업 전에 철거지원금을 신청할 수 있나요?",
    "됩니다. 2026년 공고에는 폐업 예정자도 신청할 수 있고, 정산 때 폐업사실증명원을 내면 된다고 되어 있습니다.",
  ],
  ["집기도 사 가시나요?", "집기 매입은 하지 않습니다. 직접 처분하시거나 철거 때 함께 반출합니다."],
  ["폐업 철거비용은 얼마쯤인가요?", "공개 자료 기준 점포 전체 철거는 평당 10~15만원, 원상복구를 포함하면 철거비의 1.2~1.5배 수준입니다."],
  ["직접 철거하면 지원금을 받을 수 있나요?", "공고상 업체를 통하지 않은 자력 철거는 지원 대상이 아닙니다."],
  ["철거 서류는 발급되나요?", "점포철거비 정산에 필요한 공사내역서와 전자세금계산서를 철거온이 발급합니다."],
];

export function ClosureGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 가이드", href: "/guide/" }, { name: keyword }]}
        kicker="폐업 철거 무료견적"
        title={
          <>
            가게 폐업,
            <br />
            철거는 지원금부터 확인하고 시작하세요
          </>
        }
        lead="점포철거비 최대 600만원 · 정산 서류 발급까지 한 번에."
        checks={["지원 대상 확인", "원상복구까지", "정산 서류 발급"]}
        secondary={{ label: "폐업 철거 순서 보기", href: "#order" }}
        image="/images/cheolgeoon/hero/restaurant-demolition-hero.webp"
      />

      <section className="lp-section" id="order">
        <LandingTitle>
          폐업 철거, <em>이 순서</em>로 하세요
        </LandingTitle>
        <LandingCards items={ORDER} />
        <LandingNote icon={HandCoins}>
          철거부터 하면 지원금 정산에 필요한 철거 전 사진을 놓치기 쉽습니다.
        </LandingNote>
      </section>

      <section className="lp-section" id="price">
        <LandingTitle>
          폐업 철거비용과 <em>지원금</em>
        </LandingTitle>
        <LandingPrice
          rows={PRICE_ROWS}
          ups={PRICE_UPS}
          sources={[
            ...MARKET_PRICE_SOURCES,
            { label: "2026 희망리턴패키지 공고", href: "https://www.bizinfo.go.kr/sii/siia/selectSIIA200Detail.do?pblancId=PBLN_000000000117676" },
          ]}
          caption={`${MARKET_PRICE_CAPTION} 지원금은 2026.1.19 공고 기준이며 예산 소진 시 마감됩니다.`}
          ctaLabel="우리 점포 견적 받기"
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          폐업 전에 <em>챙길</em> 것
        </LandingTitle>
        <LandingChecklist items={PREPARE} />
        <LandingNote icon={Receipt}>철거 쪽 정산 서류(공사내역서·세금계산서)는 철거온이 발급합니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>폐업 철거 현장</LandingTitle>
        <LandingSpaces />
      </section>

      <section className="lp-section">
        <LandingTitle>
          맡기기 전에 <em>꼭</em> 확인하세요
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps ctaTitle="철거 전 매장 사진부터 보내주세요" ctaBody="지원금 정산에도 쓰입니다" />
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title="점포철거비 지원 조건 자세히 보기"
          body="지원 대상·제외 조건, 신청 절차, 정산 서류를 공고 원문 기준으로 정리했습니다."
          action={{ label: "지원금 가이드", href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
      </section>

      <RelatedGuides current="폐업-철거" />

      <LandingFinal lead="폐업 정리가 막막하다면" title="철거 견적과 지원금을 함께 확인하세요" />
    </main>
  );
}
