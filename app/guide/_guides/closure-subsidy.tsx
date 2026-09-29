import { BadgeCheck, Banknote, Calculator, Camera, ClipboardCheck, Landmark, TriangleAlert } from "lucide-react";
import {
  LandingCards,
  LandingChecklist,
  LandingChips,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingNote,
  LandingPrice,
  LandingSplit,
  LandingSteps,
  LandingTiles,
  LandingTitle,
  SERVICE_SCOPE,
} from "@/app/components/Landing";

/*
 * 2026년 「희망리턴패키지 원스톱폐업지원」 공고(소상공인시장진흥공단, 2026.1.19) 원문 기준.
 * 한도·자격·서류는 공고 문구를 그대로 옮기고, 해석이 들어가는 내용은 쓰지 않는다.
 */
const ANNOUNCEMENT_DATE = "2026년 1월 19일";

const LIMIT_ROWS = [
  { name: "2025.7.11 이후 폐업", perPyeong: "최대 600만원", example: "전용면적 1평(3.3㎡)당 20만원 이내" },
  { name: "2023.1.1~2025.7.10 폐업", perPyeong: "최대 400만원", example: "전용면적 1평(3.3㎡)당 20만원 이내" },
];

const NOT_COVERED = ["부가세 (공급가액만 지원)", "직접(자력) 철거", "현금 결제", "사업자등록 없는 업체"];

const SOURCES = [
  { label: "소상공인24 점포철거비 신청", href: "https://www.sbiz24.kr/" },
  { label: "희망리턴패키지 누리집", href: "https://hope.sbiz.or.kr/" },
  {
    label: "기업마당 공고",
    href: "https://www.bizinfo.go.kr/sii/siia/selectSIIA200Detail.do?pblancId=PBLN_000000000117676",
  },
];

/* 2025.7.11 이후 폐업 기준 계산 예시. 실제 철거비(공급가액)를 넘지 않는다. */
const EXAMPLES = [
  { icon: Calculator, name: "10평 점포", note: "10평 × 20만원 = 최대 200만원" },
  { icon: Calculator, name: "20평 점포", note: "20평 × 20만원 = 최대 400만원" },
  { icon: Calculator, name: "30평 이상", note: "한도 적용 = 최대 600만원" },
];

const ELIGIBILITY = {
  yes: {
    label: "지원 대상 (모두 충족)",
    items: [
      "소상공인기본법상 소상공인",
      "2023.1.1 이후 폐업했거나 폐업 예정",
      "사업 운영기간 60일 이상",
      "월세 등 유상 임대차 점포",
      "사업자등록된 업체를 통해 철거",
    ],
  },
  no: {
    label: "지원 제외 (하나라도 해당)",
    items: [
      "자가 건물이거나 무상 임차",
      "점포철거비를 이미 받은 경우 (1회 한정)",
      "주택·아파트 등 주거용 건물, 가건물·무허가 건물",
      "폐업 없이 이전만 하거나, 폐업 후 같은 곳에서 재창업",
      "비영리사업자, 공고의 지원 제외 업종",
    ],
  },
  tip: "지원 제외 업종은 공고 [별첨2]에서 확인하세요.",
};

const STEPS: [string, string][] = [
  ["소상공인24 신청", "임대차계약서·건축물대장 제출"],
  ["적격 심사", "지원 대상인지 확인"],
  ["철거·폐업", "철거 전·후 사진 촬영"],
  ["정산·지급", "공사내역서·세금계산서 제출"],
];

const DOCS_APPLY = ["임대차계약서 (면적·기간·차임 명시)", "건축물대장 (정부24·세움터 발급)", "영업신고증 (계약서에 면적이 없을 때)"];

const DOCS_SETTLE = [
  "철거업체 공사내역서",
  "전자세금계산서 또는 카드전표",
  "이체확인증 또는 카드대금 완납확인증",
  "철거 전·후 사진 (같은 위치·같은 각도)",
];

const MISTAKES = [
  { icon: TriangleAlert, title: "철거비를 현금으로 냈어요", body: "현금 거래는 인정되지 않습니다. 계좌이체나 카드로 결제하세요" },
  { icon: TriangleAlert, title: "직접 뜯었어요", body: "업체를 통하지 않은 자력 철거는 지원 대상이 아닙니다" },
  { icon: TriangleAlert, title: "철거 전 사진이 없어요", body: "전·후 비교 사진이 정산 서류에 들어갑니다" },
  { icon: TriangleAlert, title: "견적을 부풀려 달래요", body: "부정수급은 환수와 최대 5배 제재부가금 대상입니다" },
];

const HELP = [
  { icon: BadgeCheck, title: "대상 여부 먼저 확인", body: "임차 형태·건물 용도·폐업일을 상담 때 함께 봅니다" },
  { icon: ClipboardCheck, title: "정산 서류 발급", body: "공사내역서·전자세금계산서를 발급해 드립니다" },
  { icon: Camera, title: "철거 전·후 사진 기록", body: "정산에 필요한 비교 사진을 함께 챙깁니다" },
  { icon: Banknote, title: "철거 견적은 무료", body: "지원 한도와 실제 철거비를 비교해 보세요" },
];

const FAQ: [string, string][] = [
  [
    "폐업하기 전에도 신청할 수 있나요?",
    "됩니다. 폐업 예정자도 신청할 수 있고, 정산 서류를 낼 때 폐업사실증명원을 제출할 수 있어야 합니다.",
  ],
  [
    "이미 철거를 끝냈는데 받을 수 있나요?",
    "2023년 1월 1일 이후 폐업했다면 신청서류와 정산서류를 한 번에 제출하는 방식으로 신청할 수 있습니다. 철거 전·후 사진이 필요합니다.",
  ],
  [
    "원상복구 비용도 지원되나요?",
    "공고에는 '점포철거 및 원상복구 시 소요되는 비용'을 지원한다고 되어 있습니다. 한도와 면적 기준은 같습니다.",
  ],
  [
    "철거비가 한도보다 적으면요?",
    "세금계산서상 공급가액까지만 지원됩니다. 예를 들어 철거비가 300만원이면 한도가 600만원이어도 300만원 이내입니다.",
  ],
  [
    "어디서 신청하나요?",
    "점포철거비는 소상공인24(sbiz24.kr)에서, 사업정리컨설팅·법률자문·채무조정은 희망리턴패키지 누리집에서 신청합니다.",
  ],
];

export function ClosureSubsidyGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: keyword }]}
        kicker="2026 점포철거비 지원 안내"
        title={
          <>
            폐업 철거지원금,
            <br />
            최대 600만원 받을 수 있는지부터 확인하세요
          </>
        }
        lead={`희망리턴패키지 점포철거비 · ${ANNOUNCEMENT_DATE} 공고 기준`}
        checks={["대상 여부 확인", "정산 서류 발급", "철거 무료견적"]}
        secondary={{ label: "지원 한도 먼저 보기", href: "#amount" }}
      />

      <section className="lp-section">
        <div className="lp-answer">
          <Landmark size={28} aria-hidden="true" />
          <div>
            <h2>폐업 철거지원금이란?</h2>
            <p>
              소상공인시장진흥공단 <strong>희망리턴패키지의 점포철거비 지원</strong>입니다. 폐업했거나 폐업 예정인
              소상공인이 점포를 철거하고 원상복구할 때 드는 비용을 전용면적 1평당 20만원, 최대 600만원까지 지원합니다.
            </p>
            <span>근거: 2026년 「희망리턴패키지 원스톱폐업지원」 공고 ({ANNOUNCEMENT_DATE})</span>
          </div>
        </div>
      </section>

      <section className="lp-section" id="amount">
        <LandingTitle>
          얼마까지 <em>받을 수</em> 있나요?
        </LandingTitle>
        <LandingPrice
          rows={LIMIT_ROWS}
          ups={NOT_COVERED}
          sources={SOURCES}
          headers={["폐업일", "최대 한도", "면적 기준"]}
          sideTitle="지원되지 않는 부분"
          ctaLabel="우리 점포 철거비 확인하기"
          caption={`${ANNOUNCEMENT_DATE} 공고 기준이며 예산이 소진되면 마감됩니다. 신청 전 소상공인24에서 접수 여부와 공고 원문을 꼭 확인하세요.`}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          우리 점포는 <em>얼마</em>일까요?
        </LandingTitle>
        <LandingTiles items={EXAMPLES} />
        <LandingNote icon={Calculator}>
          2025.7.11 이후 폐업 기준 예시입니다. 실제 지원액은 철거비 공급가액을 넘지 않습니다.
        </LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          지원 <em>대상</em>인가요?
        </LandingTitle>
        <LandingSplit yes={ELIGIBILITY.yes} no={ELIGIBILITY.no} tip={ELIGIBILITY.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>신청은 이렇게 진행됩니다</LandingTitle>
        <LandingSteps
          steps={STEPS}
          ctaTitle="철거 전 사진부터 찍어두세요"
          ctaBody="같은 위치·같은 각도로 찍어야 전·후 비교가 됩니다"
        />
        <LandingNote icon={Camera}>이미 철거를 마쳤다면 신청서류와 정산서류를 한 번에 제출합니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          준비할 <em>서류</em>
        </LandingTitle>
        <p className="lp-group-label">신청할 때</p>
        <LandingChecklist items={DOCS_APPLY} />
        <p className="lp-group-label">철거 후 정산할 때</p>
        <LandingChecklist items={DOCS_SETTLE} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          이것 때문에 <em>못 받는</em> 경우가 많습니다
        </LandingTitle>
        <LandingCards items={MISTAKES} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          정산 서류, <em>철거온</em>이 챙깁니다
        </LandingTitle>
        <LandingCards items={HELP} linkAll />
        <LandingNote icon={ClipboardCheck}>
          지원금 정산에 필요한 공사내역서와 전자세금계산서를 발급하고, 계좌이체·카드 결제로 진행합니다.
        </LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          철거온이 <em>맡는</em> 범위
        </LandingTitle>
        <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
        <LandingNote icon={Landmark}>
          지원 여부의 최종 판단은 소상공인시장진흥공단이 합니다. 세부 조건은 공고 원문을 기준으로 확인하세요.
        </LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>함께 보면 좋은 안내</LandingTitle>
        <LandingChips
          links={[
            { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
            { label: "철거 비용 가이드", href: "/guide/철거-비용/" },
            { label: "지역별 철거 상담", href: "/regions/" },
          ]}
        />
      </section>

      <LandingFinal lead="폐업 준비가 막막하다면" title="철거 견적과 지원 대상 여부를 함께 확인하세요" />
    </main>
  );
}
