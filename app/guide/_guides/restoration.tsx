import { CalendarCheck, FileText, Hammer, KeyRound, PaintRoller, Receipt, Scale, Wallet } from "lucide-react";
import {
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

/* 공개 시장 자료 기준 참고 범위. 철거온 확정 견적이 아니므로 출처·기준 시점을 함께 표기한다. */
const PRICE_ROWS = [
  { name: "상가·사무실 철거만", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "20평 약 240~450만원 (계산 예시)" },
];

const PRICE_UPS = ["도장·바닥 등 마감 복구", "전 임차인 시설까지 철거", "주방 설비·후드·덕트", "야간·주말 작업"];

const PRICE_SOURCES = [
  { label: "소중함인사이트 (2026)", href: "https://ssjum.com/demolition.html" },
  {
    label: "스페이스로그인 (2025.12)",
    href: "https://spacelogin.co.kr/%EC%82%AC%EB%AC%B4%EC%8B%A4-%EC%83%81%EA%B0%80-%EC%B2%A0%EA%B1%B0%EB%B9%84%EC%9A%A9-%EA%B3%84%EC%82%B0%EB%B2%95-%EC%99%84%EB%B2%BD-%EC%A0%95%EB%A6%AC/",
  },
];

const SITUATIONS = [
  { icon: FileText, title: "건물주가 입점 전 상태로 돌려놓으래요", body: "계약서 특약부터 함께 확인합니다" },
  { icon: KeyRound, title: "전 임차인 인테리어도 철거해야 하나요?", body: "입점 당시 사진과 계약서로 범위를 나눕니다" },
  { icon: Wallet, title: "보증금에서 원상복구비를 빼겠대요", body: "항목별 견적으로 금액 근거를 남깁니다" },
  { icon: CalendarCheck, title: "퇴거일이 얼마 안 남았어요", body: "퇴거일에 맞춰 일정부터 확인합니다" },
];

/* 원상복구의 두 단계. 철거를 함께 맡기면 마감 복구까지 한 번에 진행한다. */
const TWO_STAGES = [
  { icon: Hammer, title: "1단계 · 철거와 반출", body: "내가 설치한 인테리어·설비를 걷어내고 폐기물을 치웁니다" },
  { icon: PaintRoller, title: "2단계 · 마감 복구", body: "벽 도장, 바닥, 천장 마감을 입점 당시 상태로 맞춥니다" },
];

const SCOPE = {
  yes: {
    label: "보통 원상복구 대상",
    items: [
      "내가 설치한 가벽·칸막이",
      "바닥재·천장 마감",
      "간판·어닝",
      "주방 후드·덕트 등 설비",
      "추가로 설치한 전기·조명",
    ],
  },
  no: {
    label: "건물주와 협의가 필요한 부분",
    items: [
      "전 임차인이 설치한 시설",
      "통상적인 사용으로 생긴 마모",
      "건물주가 남기길 원하는 시설",
      "계약서에 없는 추가 요구",
    ],
  },
  tip: "특약이 우선합니다. 합의한 범위는 문자나 메일로 남겨두세요.",
};

const PREPARE = [
  "임대차 계약서 (특약 부분 포함)",
  "입점 당시 사진이나 도면",
  "건물주가 요구한 복구 항목",
  "지금 현장 사진 (바닥·천장·벽)",
  "퇴거일과 보증금 반환일",
];

const STEPS: [string, string][] = [
  ["계약서·사진 보내기", "특약 부분이 보이게 찍어주세요"],
  ["원상복구 범위 정리", "철거할 것과 협의할 것을 나눕니다"],
  ["철거·마감 복구", "퇴거일에 맞춰 한 번에 진행합니다"],
];

const FAQ: [string, string][] = [
  [
    "도장·바닥 복구까지 한 번에 되나요?",
    "됩니다. 철거와 함께 맡기시면 벽 도장, 바닥, 천장 마감 복구까지 한 번에 진행해 업체를 따로 찾지 않으셔도 됩니다.",
  ],
  [
    "원상복구와 원상복귀는 다른 말인가요?",
    "같은 뜻으로 쓰입니다. 법률에서는 '원상회복'이라고 하며, 임대차가 끝나면 빌린 공간을 입점 당시 상태로 돌려놓는 것을 말합니다.",
  ],
  [
    "전 임차인이 설치한 시설도 제가 철거해야 하나요?",
    "계약서와 특약에 따라 달라 분쟁이 가장 많은 부분입니다. 입점 당시 상태를 기준으로 범위를 먼저 나눠보세요.",
  ],
  [
    "원상복구를 안 하고 나가면 어떻게 되나요?",
    "건물주가 복구 비용을 보증금에서 빼겠다고 할 수 있습니다. 항목별 견적을 받아두면 금액을 비교하기 쉽습니다.",
  ],
  [
    "오래 써서 낡은 부분도 새로 해야 하나요?",
    "통상적인 사용으로 생긴 마모까지 새것으로 돌려놓을 의무는 없다고 보는 것이 일반적입니다. 특약이 있으면 달라질 수 있습니다.",
  ],
];

export function RestorationGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제", href: "/guide/" }, { name: keyword }]}
        kicker={`${keyword} 무료견적`}
        title={
          <>
            원상복구,
            <br />
            어디까지 뜯어야 하는지부터 정리해드립니다
          </>
        }
        lead="계약서와 입점 당시 상태가 기준입니다."
        checks={["계약서 기준 범위 정리", "철거부터 마감 복구까지", "견적 상담 무료"]}
        secondary={{ label: "원상복구 비용 먼저 보기", href: "#price" }}
      />

      <section className="lp-section">
        <div className="lp-answer">
          <Scale size={28} aria-hidden="true" />
          <div>
            <h2>원상복구란?</h2>
            <p>
              임대차가 끝날 때 임차인이 빌린 공간을 <strong>입점 당시 상태로 돌려놓고</strong> 반환하는 것입니다.
              내가 설치한 인테리어와 설비를 철거하는 것이 기본이고, 구체적인 범위는 계약서 특약이 정합니다.
            </p>
            <span>근거: 민법 제654조(임대차에 제615조 원상회복 규정 준용)</span>
          </div>
        </div>
      </section>

      <section className="lp-section" id="price">
        <LandingTitle>
          원상복구 비용, <em>얼마쯤</em> 할까요?
        </LandingTitle>
        <LandingPrice
          rows={PRICE_ROWS}
          ups={PRICE_UPS}
          sources={PRICE_SOURCES}
          caption="2025~2026년 공개 자료의 수도권 참고 범위이며 철거온 확정 견적이 아닙니다. 20평 예시는 두 자료를 곱해 계산한 값입니다."
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          이런 <em>상황</em>이신가요?
        </LandingTitle>
        <LandingCards items={SITUATIONS} linkAll />
      </section>

      <section className="lp-section">
        <LandingTitle>
          원상복구는 <em>두 단계</em>입니다
        </LandingTitle>
        <LandingCards items={TWO_STAGES} />
        <LandingNote icon={Receipt}>철거를 함께 맡기시면 마감 복구까지 한 업체가 한 번에 진행합니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>
          어디까지 <em>해야</em> 할까요?
        </LandingTitle>
        <LandingSplit yes={SCOPE.yes} no={SCOPE.no} tip={SCOPE.tip} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          견적 전에 <em>이것</em>만 챙기세요
        </LandingTitle>
        <LandingChecklist items={PREPARE} />
        <LandingNote icon={Receipt}>계약서가 있으면 범위가 빨리 정해지고 불필요한 철거가 줄어듭니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps steps={STEPS} ctaTitle="계약서 사진도 함께 보내주세요" ctaBody="특약 부분이 있으면 범위를 더 정확히 봅니다" />
      </section>

      <section className="lp-section">
        <LandingTitle>원상복구 철거 현장</LandingTitle>
        <LandingSpaces />
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
        <LandingNote icon={Scale}>법률 판단이 필요한 분쟁은 변호사나 대한법률구조공단 상담을 권합니다.</LandingNote>
      </section>

      <section className="lp-section">
        <LandingTitle>함께 보면 좋은 안내</LandingTitle>
        <LandingChips
          links={[
            { label: "철거 비용 가이드", href: "/guide/철거-비용/" },
            { label: "폐업 철거지원금", href: "/guide/폐업-철거지원금/" },
            { label: "지역별 철거 상담", href: "/regions/" },
          ]}
        />
      </section>

      <LandingFinal lead="퇴거일이 다가오는데 막막하다면" title="계약서와 현장 사진만 먼저 보내주세요" />
    </main>
  );
}
