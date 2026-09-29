import { Coffee, Flame, HandCoins, Droplets, UtensilsCrossed, Wind, Zap } from "lucide-react";
import {
  LandingBanner,
  LandingCards,
  LandingChecklist,
  LandingChips,
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
import { MARKET_PRICE_CAPTION, MARKET_PRICE_SOURCES } from "@/app/lib/market-prices";

/* 식당·카페 철거: 식당철거, 식당철거비용, 카페철거, 음식점철거비용 검색 의도. 식당 전용 금액 자료는 확인하지 못해 공통 범위만 쓴다. */

const PRICE_ROWS = [
  { name: "매장 전체 철거", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "마감재만 철거", perPyeong: "평당 5~12만원", example: "20평 약 100~240만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "계약서 기준 범위에 따라" },
];

const PRICE_UPS = ["후드·덕트가 길 때", "주방 타일·방수층 철거", "중량 주방 설비 반출", "야간·주말 작업"];

/* 식당·카페에서 먼저 보는 설비 */
const KITCHEN = [
  { icon: Wind, title: "후드·덕트", body: "길이와 외부로 이어진 구간을 먼저 봅니다" },
  { icon: Flame, title: "가스 설비", body: "철거 전에 가스 차단이 되어 있어야 합니다" },
  { icon: Zap, title: "전기·동력선", body: "증설한 전기와 동력선 정리 범위를 나눕니다" },
  { icon: Droplets, title: "주방 바닥·배수", body: "타일과 방수층, 배수 설비 철거 여부를 정합니다" },
];

const TYPES = [
  { icon: UtensilsCrossed, title: "식당·음식점", body: "주방 설비와 홀 인테리어를 함께 철거" },
  { icon: Coffee, title: "카페·베이커리", body: "바 카운터·진열장·급배수 설비 철거" },
];

const PREPARE = [
  "주방 전체 사진 (후드·덕트가 보이게)",
  "홀 바닥·벽·천장 사진",
  "가스·전기 차단 가능 여부",
  "남길 설비와 뺄 집기 목록",
  "임대차 계약서 원상복구 특약",
];

const FAQ: [string, string][] = [
  ["식당 철거비용은 얼마인가요?", "공개 자료 기준 매장 전체 철거는 평당 10~15만원 선이며, 주방 설비가 많으면 올라갈 수 있습니다."],
  ["후드와 덕트도 떼 주나요?", "전체 철거에 포함해 후드·덕트 등 주방 설비를 철거합니다."],
  ["주방 집기도 사 가시나요?", "집기 매입은 하지 않습니다. 직접 처분하시거나 철거 때 함께 반출합니다."],
  ["가스는 누가 끊나요?", "가스 차단은 도시가스사 등 공급사에 신청해 철거 전에 해 두셔야 합니다."],
  ["폐업하는 식당인데 지원금도 되나요?", "희망리턴패키지 점포철거비(최대 600만원) 대상인지 확인하고, 정산 서류는 철거온이 발급합니다."],
];

export function RestaurantGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: keyword }]}
        kicker="식당·카페 철거 무료견적"
        title={
          <>
            식당·카페 철거,
            <br />
            주방 설비부터 확인합니다
          </>
        }
        lead="후드·덕트·가스·배수까지, 주방이 있는 매장은 따로 봐야 합니다."
        checks={["견적 상담 무료", "주방 설비 철거", "지원금 정산 서류"]}
        secondary={{ label: "식당 철거비용 보기", href: "#price" }}
        image="/images/cheolgeoon/hero/office-clearance-hero.webp"
      />

      <section className="lp-section" id="price">
        <LandingTitle>
          식당 철거비용, <em>얼마쯤</em>?
        </LandingTitle>
        <LandingPrice
          rows={PRICE_ROWS}
          ups={PRICE_UPS}
          sources={MARKET_PRICE_SOURCES}
          caption={`${MARKET_PRICE_CAPTION} 주방 설비가 있는 매장은 이보다 높아질 수 있습니다.`}
          ctaLabel="우리 가게 견적 받기"
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          주방에서 <em>먼저</em> 보는 것
        </LandingTitle>
        <LandingCards items={KITCHEN} />
        <LandingNote icon={Flame}>가스 차단은 공급사에 미리 신청해 두셔야 철거를 시작할 수 있습니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          식당과 카페, <em>무엇</em>이 다를까요?
        </LandingTitle>
        <LandingCards items={TYPES} linkAll />
      </section>

      <section className="lp-section">
        <LandingTitle>식당·카페 철거 현장</LandingTitle>
        <LandingSpaces />
      </section>

      <section className="lp-section">
        <LandingTitle>
          견적 전에 <em>이것</em>만 챙기세요
        </LandingTitle>
        <LandingChecklist items={PREPARE} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          맡기기 전에 <em>꼭</em> 확인하세요
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps ctaTitle="주방 사진이 가장 중요합니다" ctaBody="후드·덕트가 보이게 찍어주세요" />
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title="폐업하는 식당이라면 점포철거비 지원을"
          body="1평당 20만원, 최대 600만원. 정산용 공사내역서·세금계산서는 철거온이 발급합니다."
          action={{ label: "지원 조건 보기", href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
      </section>

      <section className="lp-section">
        <LandingTitle>함께 보면 좋은 안내</LandingTitle>
        <LandingChips
          links={[
            { label: "폐업 철거", href: "/guide/폐업-철거/" },
            { label: "폐업 철거지원금", href: "/guide/폐업-철거지원금/" },
            { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
            { label: "상가 철거", href: "/guide/상가-철거/" },
          ]}
        />
      </section>

      <LandingFinal lead="식당·카페를 정리한다면" title="주방 사진부터 보내주세요" />
    </main>
  );
}
