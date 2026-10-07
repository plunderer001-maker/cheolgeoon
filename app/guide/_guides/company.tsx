import {
  Building2,
  ClipboardList,
  FileText,
  Dumbbell,
  Factory,
  GraduationCap,
  HandCoins,
  MicVocal,
  PaintRoller,
  Recycle,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Store,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import {
  LandingNote,
  LandingBanner,
  LandingCards,
  LandingChecklist,
  LandingChips,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingSplit,
  LandingSteps,
  LandingTiles,
  LandingTitle,
} from "@/app/components/Landing";

/* 철거전문업체: 철거전문업체, 철거업체 추천, 철거 잘하는 곳 검색 의도. 업체를 고르는 사람에게 '무엇이 다른지'를 보여준다. */

export const COMPANY_IMAGE = "/images/cheolgeoon/og-square/철거전문업체.webp";

/* 전문업체에 맡기면 달라지는 것. 금액이 아니라 일하는 방식으로 설명한다. */
const DIFFERENCE = [
  { icon: ClipboardList, title: "범위부터 나눕니다", body: "남길 시설과 걷어낼 것을 사진으로 먼저 정리합니다" },
  { icon: Recycle, title: "폐기물을 나눠 반출", body: "철거하며 나온 폐기물을 종류별로 나눠 처리합니다" },
  { icon: ShieldCheck, title: "공용부까지 챙깁니다", body: "엘리베이터 보양과 관리사무소 작업 시간을 맞춥니다" },
  { icon: PaintRoller, title: "원상복구까지 한 팀", body: "철거 뒤 도장·바닥 마감 복구까지 이어서 합니다" },
];

/* 진행 가능한 공간. 철거가 필요한 공간이면 업종을 가리지 않는다. */
const SPACES = [
  { icon: Store, name: "상가·매장", note: "인테리어 전체 철거" },
  { icon: Building2, name: "사무실", note: "파티션·OA 바닥·배선" },
  { icon: UtensilsCrossed, name: "식당·카페", note: "후드·덕트·주방 설비" },
  { icon: GraduationCap, name: "학원·독서실", note: "칸막이·방음 부스" },
  { icon: Dumbbell, name: "헬스장·필라테스", note: "운동기구·고무 바닥재" },
  { icon: Stethoscope, name: "병원·의원", note: "진료실 칸막이·설비" },
  { icon: Scissors, name: "미용실", note: "샴푸대 급배수·거울" },
  { icon: MicVocal, name: "노래방·PC방", note: "룸 칸막이·방음재" },
  { icon: Factory, name: "공장", note: "내부 설비·칸막이" },
  { icon: Warehouse, name: "창고", note: "선반·집기·바닥 정리" },
];

/* 현장답사부터 마무리까지 대신 챙기는 일. 실내 철거에 해당하는 절차만 적는다. */
const FIELD_WORK = [
  { icon: ClipboardList, title: "현장답사", body: "전기·수도·가스 위치와 층고, 반출 동선을 먼저 봅니다" },
  { icon: FileText, title: "신고·협의", body: "폐기물 배출 신고와 관리사무소·이웃 협의를 챙깁니다" },
  { icon: ShieldCheck, title: "분진·소음 대책", body: "보양과 방진막으로 공용부와 이웃 피해를 줄입니다" },
  { icon: Recycle, title: "분리 반출", body: "혼합폐기물과 건설폐기물을 나눠 적법하게 처리합니다" },
];

/* 견적 받을 때 업체에 물어볼 것. 메인 페이지의 '업체 고르는 기준'과 겹치지 않게 현장 확인 위주로. */
const ASK_LIST = [
  "사진이나 방문으로 철거 범위를 먼저 확인했나요?",
  "폐기물을 어떻게 처리하는지 설명해 주나요?",
  "공용부 보양과 작업 시간 협의를 맡아 주나요?",
  "철거 후 원상복구 마감까지 이어서 되나요?",
  "지원금 정산 서류(공사내역서·세금계산서)를 주나요?",
];

const SCOPE = {
  yes: {
    label: "진행 가능",
    items: [
      "상가·사무실·식당 내부 전체 철거",
      "헬스장·병원·학원·공장·창고 등 철거가 필요한 공간",
      "임대 종료 원상복구 철거·마감 복구",
      "철거하며 나온 폐기물 정리·반출",
      "간판·석면 자재 처리 (전체 철거에 포함 시)",
    ],
  },
  no: {
    label: "진행이 어려운 의뢰",
    items: [
      "간판만 따로 떼는 경우",
      "석면 해체만 단독으로 맡기는 경우",
      "폐기물 처리만 따로 맡기는 경우",
      "기둥·내력벽 등 건물 구조체 해체",
    ],
  },
  tip: "전체 철거에 포함되면 간판·부분철거·폐기물 정리도 함께 진행합니다.",
};

const FAQ: [string, string][] = [
  [
    "철거전문업체와 인테리어 업체 철거는 뭐가 다른가요?",
    "인테리어 업체는 새 공사가 중심이라 철거를 맡기는 경우가 많습니다. 철거전문업체는 비우는 일 자체가 일이라 범위 정리, 폐기물 반출, 원상복구까지 철거 기준으로 견적을 냅니다.",
  ],
  [
    "좋은 철거전문업체는 어떻게 고르나요?",
    "현장을 보고 범위를 나눠 주는지, 견적서에 폐기물 처리비가 들어 있는지, 철거 뒤 마감 복구와 정산 서류까지 되는지를 보세요.",
  ],
  ["공장이나 창고도 맡기나요?", "네. 철거가 필요한 공간이면 업종을 가리지 않습니다. 다만 기둥·내력벽 같은 구조체 해체는 하지 않습니다."],
  [
    "석면 자재가 있는 건물이에요.",
    "전체 철거와 함께라면 진행합니다. 석면이 의심되면 철거 전에 먼저 알려주세요. 석면 해체만 따로 맡기는 의뢰는 어렵습니다.",
  ],
  ["지방도 오나요?", "전국 현장을 상담합니다. 도서산간은 출장비가 생길 수 있어 견적 때 미리 안내합니다."],
];

export function CompanyGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: keyword }]}
        kicker="철거전문업체 무료견적"
        title={
          <>
            철거전문업체,
            <br />
            현장 확인부터 다릅니다
          </>
        }
        lead="상가·사무실·식당부터 헬스장·병원·공장까지 사진으로 1차 범위를 봅니다."
        checks={["당일 방문·당일 견적", "1년 무상 A/S", "세금계산서 발급"]}
        secondary={{ label: "업체에 물어볼 것 보기", href: "#ask" }}
        image="/images/cheolgeoon/raw-authenticated/demolition-work-034.webp"
      />

      <section className="lp-section">
        <div className="lp-feature">
          <img src={COMPANY_IMAGE} alt="철거를 마친 빈 매장 실제 작업 현장" width={1080} height={1080} loading="lazy" />
          <div>
            <LandingTitle>
              철거 끝난 현장, <em>이렇게</em> 비웁니다
            </LandingTitle>
            <p>
              집기와 설비, 칸막이와 마감재를 걷어내고 폐기물까지 반출한 실제 현장입니다. 다음 임차인이 바로 들어올 수 있게
              비우는 것이 철거전문업체의 일입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <LandingTitle>
          전문업체에 맡기면 <em>달라지는</em> 것
        </LandingTitle>
        <LandingCards items={DIFFERENCE} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          현장답사부터 <em>마무리</em>까지 챙깁니다
        </LandingTitle>
        <LandingCards items={FIELD_WORK} />
        <LandingNote>당일 방문·당일 견적, 공사가 끝난 뒤에도 1년간 무상 A/S를 해드립니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          이런 곳, <em>모두</em> 철거합니다
        </LandingTitle>
        <LandingTiles items={SPACES} />
      </section>

      <section className="lp-section" id="ask">
        <LandingTitle>
          견적 받을 때 <em>이것</em>부터 물어보세요
        </LandingTitle>
        <LandingChecklist items={ASK_LIST} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          맡을 수 있는 <em>범위</em>
        </LandingTitle>
        <LandingSplit yes={SCOPE.yes} no={SCOPE.no} tip={SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps />
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title="폐업 철거라면 점포철거비 지원부터"
          body="희망리턴패키지 점포철거비는 1평당 20만원, 최대 600만원까지 지원됩니다. 정산 서류도 발급합니다."
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
            { label: "철거 비용 가이드", href: "/guide/철거-비용/" },
            { label: "상가 철거", href: "/guide/상가-철거/" },
            { label: "사무실 철거", href: "/guide/사무실-철거/" },
            { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
          ]}
        />
      </section>

      <LandingFinal lead="믿고 맡길 철거전문업체를 찾는다면" title="현장 사진부터 보내주세요" />
    </main>
  );
}

