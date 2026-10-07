import { Building2, CalendarCheck, Cable, Grid2x2, LayoutPanelLeft, Lightbulb, Truck } from "lucide-react";
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

/* 사무실 철거: 사무실철거, 사무실철거비용, 사무실 원상복구, 사무실 이전 검색 의도. */

const PRICE_ROWS = [
  { name: "사무실 전체 철거", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "파티션·마감만", perPyeong: "평당 5~12만원", example: "20평 약 100~240만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "임대차 계약 범위에 따라" },
];

const PRICE_UPS = ["야간·주말만 작업될 때", "화물 엘리베이터가 없을 때", "OA 바닥·배선이 많을 때", "대형 빌딩 보양 기준"];

/* 사무실에서 주로 철거하는 것 */
const ITEMS = [
  { icon: LayoutPanelLeft, title: "파티션·칸막이", body: "회의실·대표실 칸막이와 유리 파티션" },
  { icon: Grid2x2, title: "바닥재", body: "OA 바닥, 카펫 타일, 데코타일" },
  { icon: Lightbulb, title: "천장·조명", body: "추가로 단 천장재와 조명" },
  { icon: Cable, title: "전기·통신 배선", body: "증설한 콘센트와 랜선 정리" },
];

const MOVE_CHECKS = [
  "퇴거일과 새 사무실 입주일",
  "빌딩 관리사무소 작업 가능 시간",
  "화물 엘리베이터 사용 예약",
  "임대차 계약서의 원상복구 특약",
  "가져갈 가구와 폐기할 가구 구분",
];

const FAQ: [string, string][] = [
  ["사무실 철거비용은 얼마인가요?", "공개 자료 기준 20평 사무실 철거는 약 200~300만원 선입니다. 빌딩 규정과 반출 조건에 따라 달라집니다."],
  ["주말에만 작업할 수 있는 빌딩이에요.", "가능합니다. 야간·주말 작업은 할증이 붙어 견적에 미리 넣어 안내합니다."],
  ["원상복구는 어디까지 해야 하나요?", "임대차 계약서 특약과 입주 당시 상태가 기준입니다. 계약서를 보내주시면 범위를 정리합니다."],
  ["사무 가구도 가져가시나요?", "철거하면서 나오는 폐기물로 함께 반출합니다. 가구 매입은 하지 않습니다."],
  ["이전 날짜가 촉박해요.", "빌딩 작업 가능 시간부터 확인해 퇴거일 전에 끝나도록 순서를 짭니다."],
];

export function OfficeGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 가이드", href: "/guide/" }, { name: keyword }]}
        kicker="사무실 철거·원상복구 무료견적"
        title={
          <>
            사무실 이전 철거,
            <br />
            퇴거일에 맞춰 끝냅니다
          </>
        }
        lead="파티션·바닥·배선 철거부터 원상복구 마감까지."
        checks={["견적 상담 무료", "빌딩 규정 맞춤", "세금계산서 발급"]}
        secondary={{ label: "사무실 철거비용 보기", href: "#price" }}
        image="/images/cheolgeoon/hero/final-check-hero.webp"
      />

      <section className="lp-section" id="price">
        <LandingTitle>
          사무실 철거비용, <em>얼마쯤</em>?
        </LandingTitle>
        <LandingPrice rows={PRICE_ROWS} ups={PRICE_UPS} sources={MARKET_PRICE_SOURCES} caption={MARKET_PRICE_CAPTION} ctaLabel="우리 사무실 견적 받기" />
      </section>

      <section className="lp-section">
        <LandingTitle>
          사무실에서 <em>주로</em> 걷어내는 것
        </LandingTitle>
        <LandingCards items={ITEMS} />
        <LandingNote icon={Building2}>남길 설비는 빌딩·건물주와 합의한 범위대로 남깁니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          이전 전에 <em>확인</em>할 것
        </LandingTitle>
        <LandingChecklist items={MOVE_CHECKS} />
        <LandingNote icon={CalendarCheck}>퇴거일이 정해졌다면 날짜부터 알려주세요. 빌딩 작업 시간에 맞춰 순서를 짭니다.</LandingNote>
        <LandingNote icon={Truck}>
          <span>
            철거 후 새 사무실로 짐을 옮길 업체는 <a href="https://isabaro.com/movers/">이사업체 고르는 기준</a>부터 보고 비교해 보세요.
          </span>
        </LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>사무실 철거 현장</LandingTitle>
        <LandingSpaces />
      </section>

      <section className="lp-section">
        <LandingTitle>
          철거온이 <em>맡는</em> 범위
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps ctaTitle="사무실 사진과 도면이 있으면 더 빨라요" ctaBody="없으면 사진만 보내주셔도 됩니다" />
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={Building2}
          title="원상복구 범위가 헷갈린다면"
          body="어디까지 철거하고 복구해야 하는지, 계약서 기준으로 정리한 안내를 확인해 보세요."
          action={{ label: "원상복구 가이드", href: "/guide/원상복구-철거/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
      </section>

      <RelatedGuides current="사무실-철거" />

      <LandingFinal lead="사무실 이전을 앞두고 있다면" title="퇴거일과 사진부터 알려주세요" />
    </main>
  );
}
