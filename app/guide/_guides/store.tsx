import { Dumbbell, FileText, GraduationCap, Layers, MicVocal, Monitor, Scissors, Stethoscope, Store, Truck, Wrench } from "lucide-react";
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

/* 상가·인테리어 철거: 상가철거, 인테리어철거, 상가철거비용, 가게·점포·매장 철거 검색 의도. */

const PRICE_ROWS = [
  { name: "상가 전체 철거", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "인테리어·마감재만", perPyeong: "평당 5~12만원", example: "20평 약 100~240만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "계약서 기준 범위에 따라" },
];

const PRICE_UPS = ["바닥·벽 마감이 여러 겹", "천장 속 설비·배관", "간판·어닝 철거", "야간·주말 작업"];

/* 업종별로 먼저 보는 항목. 검색량이 적은 업종 키워드를 한 페이지에서 받는다. */
const TRADES = [
  { icon: Scissors, title: "미용실", body: "샴푸대 급배수와 거울·전기 배선을 먼저 봅니다" },
  { icon: MicVocal, title: "노래방", body: "방음재와 룸 칸막이가 많아 폐기물이 늘어요" },
  { icon: Dumbbell, title: "헬스장·필라테스", body: "운동기구 반출과 고무 바닥재 철거가 핵심입니다" },
  { icon: Monitor, title: "PC방", body: "좌석 칸막이와 전기·통신 배선 정리가 많습니다" },
  { icon: GraduationCap, title: "학원·스터디카페·독서실", body: "칸막이와 책상, 방음 부스 철거 범위를 나눕니다" },
  { icon: Stethoscope, title: "병원·의원", body: "진료실 칸막이와 설비, 반출 시간 제한을 확인합니다" },
];

const DIFFERENCE = [
  { icon: Store, title: "상가 철거", body: "매장 안을 비우는 전체 철거. 칸막이·천장·바닥·설비까지" },
  { icon: Layers, title: "인테리어 철거", body: "마감재 위주 철거. 새 인테리어 전에 기존 마감만 걷어냄" },
  { icon: FileText, title: "원상복구", body: "입점 당시 상태로 되돌리는 철거와 마감 복구" },
  { icon: Wrench, title: "설비 철거", body: "후드·덕트·배관 같은 설비를 떼어내는 작업" },
];

const QUOTE_CHECKS = [
  "폐기물 처리비가 견적에 들어 있나요?",
  "철거할 곳과 남길 곳이 항목별로 적혀 있나요?",
  "간판·어닝 철거가 포함됐나요?",
  "야간·주말 작업 할증 조건이 있나요?",
  "세금계산서를 발급할 수 있나요?",
];

const FAQ: [string, string][] = [
  [
    "상가 철거비용은 평당 얼마인가요?",
    "공개 자료 기준 상가 전체 철거는 평당 10~15만원, 마감재만 걷어내면 평당 5~12만원 선입니다. 현장 조건에 따라 달라집니다.",
  ],
  ["인테리어 철거와 상가 철거는 다른가요?", "인테리어 철거는 마감재 위주, 상가 철거는 설비와 칸막이까지 비우는 전체 철거를 말할 때가 많습니다."],
  ["간판도 같이 떼 주나요?", "전체 철거에 포함되면 간판·어닝도 함께 철거합니다. 간판만 따로는 어렵습니다."],
  ["남기고 갈 시설이 있어요.", "다음 임차인이나 건물주와 합의한 시설은 남기고, 나머지만 철거하도록 범위를 나눕니다."],
  ["영업 중인 상가 옆인데 괜찮을까요?", "소음·먼지가 큰 작업은 이웃 영업시간을 피해 잡고, 공용부는 보양합니다."],
];

export function StoreGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 가이드", href: "/guide/" }, { name: keyword }]}
        kicker="상가·인테리어 철거 무료견적"
        title={
          <>
            상가 철거,
            <br />
            업종에 맞춰 범위부터 나눕니다
          </>
        }
        lead="매장 전체 철거부터 마감재만 걷어내는 인테리어 철거까지."
        checks={["견적 상담 무료", "원상복구·마감까지", "세금계산서 발급"]}
        secondary={{ label: "상가 철거비용 보기", href: "#price" }}
        image="/images/cheolgeoon/hero/interior-removal-hero.webp"
      />

      <section className="lp-section" id="price">
        <LandingTitle>
          상가 철거비용, <em>평당</em> 얼마쯤?
        </LandingTitle>
        <LandingPrice rows={PRICE_ROWS} ups={PRICE_UPS} sources={MARKET_PRICE_SOURCES} caption={MARKET_PRICE_CAPTION} ctaLabel="우리 매장 견적 받기" />
      </section>

      <section className="lp-section">
        <LandingTitle>
          어떤 <em>철거</em>가 필요하세요?
        </LandingTitle>
        <LandingCards items={DIFFERENCE} />
        <LandingNote>잘 모르셔도 괜찮습니다. 사진을 보고 필요한 범위를 함께 정합니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          업종별로 <em>먼저</em> 보는 것
        </LandingTitle>
        <LandingCards items={TRADES} linkAll />
      </section>

      <section className="lp-section">
        <LandingTitle>상가 철거 현장</LandingTitle>
        <LandingSpaces />
      </section>

      <section className="lp-section">
        <LandingTitle>
          상가 철거 업체, <em>이것</em>만 비교하세요
        </LandingTitle>
        <LandingChecklist items={QUOTE_CHECKS} />
        <LandingNote icon={Truck}>
          <span>
            매장을 옮기면서 집기 운반까지 맡겨야 한다면 <a href="https://isabaro.com/quote-compare/">포장이사 견적 비교하는 법</a>도 함께 확인해 보세요.
          </span>
        </LandingNote>
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
          icon={FileText}
          title="폐업하는 상가라면 점포철거비 지원부터"
          body="희망리턴패키지 점포철거비는 1평당 20만원, 최대 600만원까지 지원됩니다. 정산 서류는 철거온이 발급합니다."
          action={{ label: "지원 조건 보기", href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
      </section>

      <RelatedGuides current="상가-철거" />

      <LandingFinal lead="상가를 비워야 한다면" title="매장 사진부터 보내주세요" />
    </main>
  );
}
