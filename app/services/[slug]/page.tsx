import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Ban,
  ClipboardCheck,
  FileSearch,
  HelpCircle,
  ListChecks,
  MessageCircle,
  Ruler,
  ShieldAlert,
  WalletCards,
  Wrench,
} from "lucide-react";
import { getRelatedPages, getSeoPage, seoPages, type SeoPage } from "@/app/lib/seo-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type TargetProfile = {
  group: string;
  context: string;
  scope: string[];
  cost: string[];
  caution: string;
  prep: string[];
};

type ServiceProfile = {
  label: string;
  focus: string;
  process: string[];
  caution: string;
};

type IntentProfile = {
  label: string;
  headline: string;
  body: string;
  checklist: string[];
};

type ExampleImage = {
  src: string;
  label: string;
  note: string;
};

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";
const SITE_URL = "https://cheolgeoon.com";
const OG_IMAGE_PATHS = [
  "/images/cheolgeoon/og/cheolgeoon-og-01.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-02.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-03.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-04.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-05.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-06.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-07.webp",
  "/images/cheolgeoon/og/cheolgeoon-og-08.webp",
  "/images/cheolgeoon/hero/store-clearance-hero.webp",
  "/images/cheolgeoon/hero/office-clearance-hero.webp",
  "/images/cheolgeoon/hero/restaurant-demolition-hero.webp",
  "/images/cheolgeoon/hero/interior-removal-hero.webp",
  "/images/cheolgeoon/hero/academy-demolition.webp",
  "/images/cheolgeoon/sections/commercial-unit-demolition.webp",
  "/images/cheolgeoon/sections/office-demolition.webp",
  "/images/cheolgeoon/sections/restaurant-demolition.webp",
  "/images/cheolgeoon/sections/interior-removal.webp",
  "/images/cheolgeoon/sections/final-inspection.webp",
];

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

function hashSlug(slug: string) {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pick<T>(items: T[], seed: string, offset = 0) {
  return items[(hashSlug(seed) + offset) % items.length];
}

function getOgImagePath(page: SeoPage) {
  const pageIndex = Math.max(
    0,
    seoPages.findIndex((candidate) => candidate.slug === page.slug),
  );
  const imageIndex =
    (pageIndex * 7 + hashSlug(page.service) + hashSlug(page.intent)) %
    OG_IMAGE_PATHS.length;

  return OG_IMAGE_PATHS[imageIndex];
}

function getOgImageUrl(page: SeoPage) {
  return `${SITE_URL}${getOgImagePath(page)}`;
}

function hasFinalConsonant(text: string) {
  const lastChar = Array.from(text.trim()).pop();
  if (!lastChar) return false;

  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;

  return (code - 0xac00) % 28 !== 0;
}

function withObjectParticle(text: string) {
  return `${text}${hasFinalConsonant(text) ? "을" : "를"}`;
}

function withTopicParticle(text: string) {
  return `${text}${hasFinalConsonant(text) ? "은" : "는"}`;
}

const EXAMPLE_IMAGE_GROUPS: Record<string, ExampleImage[]> = {
  food: [
    {
      src: "/images/cheolgeoon/hero/restaurant-demolition-hero.webp",
      label: "주방 설비 철거",
      note: "덕트, 배수, 주방 설비가 있는 매장은 철거 범위를 먼저 나눠 봅니다.",
    },
    {
      src: "/images/cheolgeoon/sections/restaurant-demolition.webp",
      label: "식당 내부 철거",
      note: "홀과 주방, 바닥 마감 상태에 따라 작업 순서가 달라집니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-waste-sorting-01.webp",
      label: "폐기물 분류",
      note: "철거 중 나온 자재는 반출 동선과 분류 기준을 함께 확인합니다.",
    },
  ],
  office: [
    {
      src: "/images/cheolgeoon/hero/office-clearance-hero.webp",
      label: "사무실 원상복구",
      note: "칸막이, OA 바닥, 천장 마감처럼 사무 공간 특성을 함께 봅니다.",
    },
    {
      src: "/images/cheolgeoon/sections/office-demolition.webp",
      label: "업무 공간 철거",
      note: "입주 전 상태와 관리사무소 기준을 맞춰 철거 범위를 정리합니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-common-area-protection-01.webp",
      label: "공용부 보양",
      note: "엘리베이터와 복도 보양이 필요한 현장은 일정 조율이 중요합니다.",
    },
  ],
  education: [
    {
      src: "/images/cheolgeoon/hero/academy-demolition.webp",
      label: "학원 내부 철거",
      note: "강의실 칸막이, 칠판, 방음 마감 여부를 함께 확인합니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp",
      label: "방문 견적",
      note: "사진으로 보기 어려운 고정물과 마감 상태는 현장에서 확인합니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-cleanup-01.webp",
      label: "철거 후 정리",
      note: "퇴거 일정에 맞춰 작업 후 정리 범위까지 같이 상담합니다.",
    },
  ],
  residential: [
    {
      src: "/images/cheolgeoon/hero/interior-removal-hero.webp",
      label: "주거 공간 철거",
      note: "주택과 빌라는 내부 마감, 생활 집기, 차량 진입 조건을 함께 봅니다.",
    },
    {
      src: "/images/cheolgeoon/sections/floor-removal.webp",
      label: "바닥 마감 철거",
      note: "장판, 마루, 타일 등 마감재에 따라 작업 방식이 달라집니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-loading-prep-01.webp",
      label: "반출 준비",
      note: "골목, 계단, 주차 조건은 비용과 일정에 영향을 줍니다.",
    },
  ],
  large: [
    {
      src: "/images/cheolgeoon/hero/safe-demolition-hero.webp",
      label: "대형 현장 확인",
      note: "건물, 공장, 창고는 구조와 장비 진입 조건을 먼저 살펴봅니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-safety-prep-01.webp",
      label: "안전 작업 준비",
      note: "규모가 큰 현장은 안전 기준과 작업 동선을 사전에 맞춥니다.",
    },
    {
      src: "/images/cheolgeoon/ai-pool/ai-workflow-01.webp",
      label: "작업 순서 조율",
      note: "철거, 분류, 반출 순서를 나눠 현장 흐름을 잡습니다.",
    },
  ],
  commercial: [
    {
      src: "/images/cheolgeoon/hero/store-clearance-hero.webp",
      label: "상가 내부 철거",
      note: "매장 구조와 원상복구 기준에 맞춰 철거 범위를 확인합니다.",
    },
    {
      src: "/images/cheolgeoon/sections/commercial-unit-demolition.webp",
      label: "상업 공간 정리",
      note: "바닥, 벽면, 천장, 집기 상태를 함께 보고 견적을 안내합니다.",
    },
    {
      src: "/images/cheolgeoon/sections/fixture-removal.webp",
      label: "집기와 설비 철거",
      note: "고정 집기와 설비가 있으면 철거 난이도와 반출 조건이 달라집니다.",
    },
  ],
};

function getExampleImages(page: SeoPage) {
  let group = EXAMPLE_IMAGE_GROUPS.commercial;

  if (/(식당|음식점|카페|스터디카페|호프|술집|주점|분식|횟집|고깃집|레스토랑)/.test(page.target)) {
    group = EXAMPLE_IMAGE_GROUPS.food;
  } else if (/(사무실|오피스|업무시설|법률사무소|부동산사무소)/.test(page.target)) {
    group = EXAMPLE_IMAGE_GROUPS.office;
  } else if (/(학원|독서실|교육시설|교습소|연구실|어린이집)/.test(page.target)) {
    group = EXAMPLE_IMAGE_GROUPS.education;
  } else if (/(주택|단독주택|빈집|촌집|폐가|아파트|빌라|원룸|오피스텔|가정집)/.test(page.target)) {
    group = EXAMPLE_IMAGE_GROUPS.residential;
  } else if (/(건물|공장|창고|빌딩|마트|백화점|시설물|상업용건물)/.test(page.target)) {
    group = EXAMPLE_IMAGE_GROUPS.large;
  }

  if (page.service.includes("폐업")) {
    return [
      group[(hashSlug(page.slug) + 0) % group.length],
      {
        src: "/images/cheolgeoon/ai-pool/ai-empty-store-01.webp",
        label: "폐업 정리",
        note: "영업 종료 후 남은 집기와 철거 범위를 나눠 확인합니다.",
      },
      {
        src: "/images/cheolgeoon/ai-pool/ai-final-check-01.webp",
        label: "마감 확인",
        note: "작업 후 임대인 확인 기준에 맞춰 마무리 상태를 점검합니다.",
      },
    ];
  }

  if (page.service.includes("원상복구") || page.service.includes("원상복귀") || page.service.includes("원상회복")) {
    return [
      group[(hashSlug(page.slug) + 1) % group.length],
      {
        src: "/images/cheolgeoon/sections/final-inspection.webp",
        label: "원상복구 확인",
        note: "임대차 계약 기준과 현장 마감 상태를 함께 확인합니다.",
      },
      {
        src: "/images/cheolgeoon/ai-sections/ai-site-estimate-measuring.webp",
        label: "현장 실측",
        note: "마감 범위가 애매한 부분은 방문 견적으로 정리합니다.",
      },
    ];
  }

  return [
    group[(hashSlug(page.slug) + 0) % group.length],
    group[(hashSlug(page.slug) + 1) % group.length],
    group[(hashSlug(page.slug) + 2) % group.length],
  ];
}

function getTargetProfile(target: string): TargetProfile {
  if (/(식당|음식점)/.test(target)) {
    return {
      group: "외식업 매장",
      context: "주방 설비, 배수, 타일, 덕트, 홀 집기처럼 확인할 요소가 많아 사진만으로 범위를 단정하기 어렵습니다.",
      scope: ["주방 설비와 홀 집기 철거", "바닥·벽면·천장 마감 확인", "폐기물 반출 동선과 냄새·소음 관리"],
      cost: ["주방 설비 고정 방식", "타일·방수층 철거 범위", "대형 집기와 폐기물 양"],
      caution: "가스, 전기, 수도 설비는 임의로 철거하기보다 차단 상태와 관리 기준을 먼저 확인해야 합니다.",
      prep: ["주방과 홀 사진", "가스·수도 설비 위치", "임대인 원상복구 요청사항"],
    };
  }

  if (/(카페|스터디카페)/.test(target)) {
    return {
      group: "카페형 매장",
      context: "바 테이블, 급배수, 전기 증설, 붙박이 가구가 많아 남길 부분과 철거할 부분을 나눠 보는 것이 중요합니다.",
      scope: ["바 카운터와 붙박이 가구", "급배수·전기 주변 마감", "간판과 인테리어 마감 철거"],
      cost: ["카운터 제작 방식", "바닥 마감재 상태", "반출 가능한 시간대"],
      caution: "커피 장비 매입이나 단순 집기 처리만 별도로 진행하는 의뢰는 어렵고, 철거 범위 안에서 함께 봅니다.",
      prep: ["카운터 사진", "기기 철거 여부", "건물 작업 가능 시간"],
    };
  }

  if (/(사무실|오피스|업무시설|법률사무소|부동산사무소|은행)/.test(target)) {
    return {
      group: "업무 공간",
      context: "칸막이, OA 바닥, 천장, 전기 배선, 회의실 유리 파티션처럼 사무공간 특유의 철거 범위를 확인합니다.",
      scope: ["칸막이와 유리 파티션", "바닥재와 천장재", "전기·통신 배선 주변 정리"],
      cost: ["칸막이 면적", "OA 바닥 여부", "야간·주말 작업 제한"],
      caution: "공용부 엘리베이터와 복도 보양이 필요한 경우 일정과 반출 방식을 미리 맞춰야 합니다.",
      prep: ["평면도 또는 배치도", "칸막이 사진", "관리사무소 작업 규정"],
    };
  }

  if (/(학원|독서실|교육시설|도서관|연구소)/.test(target)) {
    return {
      group: "교육 공간",
      context: "강의실 칸막이, 게시판, 바닥재, 방음 마감, 조명 배치가 남아 있어 원상복구 기준을 먼저 봐야 합니다.",
      scope: ["강의실 칸막이와 방음재", "게시판·붙박이 가구", "바닥·천장·조명 주변 마감"],
      cost: ["강의실 개수", "칸막이 고정 방식", "방음재와 폐기물 양"],
      caution: "학원은 퇴거 일정이 촉박한 경우가 많아 견적 전 작업 가능 날짜를 함께 확인하는 편이 좋습니다.",
      prep: ["강의실별 사진", "칠판·게시판 철거 여부", "퇴거 예정일"],
    };
  }

  if (/(미용실|병원|의원|요양병원|의료시설|헬스장|필라테스|체육관|수영장|목욕탕|사우나)/.test(target)) {
    return {
      group: "설비형 시설",
      context: "급배수, 전기, 거울, 타일, 샤워실, 운동기구처럼 시설별 설비 조건이 견적에 크게 영향을 줍니다.",
      scope: ["설비 주변 마감 철거", "고정 집기와 대형 장비 반출", "바닥·벽체 원상복구 확인"],
      cost: ["설비 철거 난이도", "대형 장비 반출 조건", "타일·방수 마감 범위"],
      caution: "전문 설비가 연결된 공간은 철거 전 차단 상태와 안전 조건을 먼저 확인합니다.",
      prep: ["설비 연결부 사진", "대형 장비 목록", "수도·전기 차단 여부"],
    };
  }

  if (/(단독주택|주택|집|빈집|촌집|폐가|농가주택|빌라|원룸|오피스텔|가정집|아파트)/.test(target)) {
    return {
      group: "주거 공간",
      context: "주거 공간은 내부 철거인지, 전체 철거인지, 폐기물 정리가 포함되는지에 따라 상담 방향이 크게 달라집니다.",
      scope: ["내부 마감과 붙박이장", "생활 폐기물 포함 여부", "주차·골목 반출 조건"],
      cost: ["건물 노후도", "폐기물 양", "차량 진입 가능 여부"],
      caution: "단순 폐기물 처리만은 어렵고, 철거 공정에 포함되는 정리와 반출 중심으로 상담합니다.",
      prep: ["외부와 내부 사진", "차량 진입 가능 여부", "남겨둘 물건 목록"],
    };
  }

  if (/(창고|공장|건물|상가건물|빌딩|복합건물|상업용건물|시설물|모델하우스|쇼핑몰|마트|백화점)/.test(target)) {
    return {
      group: "대형·상업 건물",
      context: "면적, 층수, 구조, 장비 투입 가능 여부, 폐기물 반출 계획을 넓게 봐야 하는 유형입니다.",
      scope: ["내부 마감과 구조물 범위", "대량 폐기물 반출 계획", "장비·차량 진입 조건"],
      cost: ["면적과 층수", "장비 투입 여부", "폐기물 종류와 양"],
      caution: "건물 규모가 크거나 구조 변경이 포함되면 사전 현장 확인과 별도 검토가 필요합니다.",
      prep: ["현장 주소와 면적", "도면 또는 평면 사진", "장비 진입 가능 여부"],
    };
  }

  if (/(불법|무허가|위반|주유소|가스충전소|위험물|관공서|경찰서|소방서|재개발|학교)/.test(target)) {
    return {
      group: "검토 필요 시설",
      context: "허가, 안전, 관리 주체 확인이 먼저 필요한 유형이라 일반 매장 철거처럼 바로 진행 여부를 말하기 어렵습니다.",
      scope: ["허가·관리 주체 확인", "안전 기준과 접근 조건", "전문 장비 필요 여부"],
      cost: ["허가 절차", "위험물·구조 검토", "전문 인력과 장비 조건"],
      caution: "가능 여부를 확정해서 안내하지 않고, 현장 정보와 관련 기준을 먼저 확인합니다.",
      prep: ["건축물 정보", "관리 주체 연락처", "허가·위반 관련 자료"],
    };
  }

  return {
    group: "상업 공간",
    context: "매장 구조, 인테리어 마감, 집기 양, 임대인 원상복구 요청에 따라 철거 범위가 달라집니다.",
    scope: ["내부 인테리어 철거", "집기와 설비 정리", "원상복구 기준 확인"],
    cost: ["평수와 마감재", "폐기물 반출 동선", "작업 시간 제한"],
    caution: "부분철거만 단독 진행하는 의뢰는 어렵고, 전체 철거 범위 안에서 가능 여부를 확인합니다.",
    prep: ["매장 전체 사진", "평수와 업종", "원상복구 요청사항"],
  };
}

function getServiceProfile(page: SeoPage): ServiceProfile {
  if (page.service.includes("폐업") && page.service.includes("원상")) {
    return {
      label: "폐업과 원상복구를 함께 보는 작업",
      focus: "폐업 일정, 집기 정리, 임대차 원상복구 기준이 함께 걸려 있어 순서를 잘못 잡으면 비용이 늘어날 수 있습니다.",
      process: ["폐업 일정 확인", "남길 집기와 철거 집기 구분", "원상복구 기준 협의", "철거와 반출 일정 조율"],
      caution: "지원금은 조건에 따라 가능 여부가 달라지므로 보장처럼 안내하지 않습니다.",
    };
  }

  if (page.service.includes("폐업")) {
    return {
      label: "폐업 정리 중심 철거",
      focus: "영업 종료 후 빠르게 정리해야 하는 상황이 많아 작업 가능일, 폐기물 반출, 원상복구 요청을 같이 확인합니다.",
      process: ["폐업 예정일 확인", "집기·설비 목록 정리", "철거 범위 산정", "방문 견적 안내"],
      caution: "집기 매입만 별도 진행하는 의뢰는 어렵고, 철거 공정에 포함되는 경우 함께 봅니다.",
    };
  }

  if (page.service.includes("원상")) {
    return {
      label: "원상복구 기준 확인형 철거",
      focus: "임대차 계약과 건물 관리 기준에 맞춰 어디까지 되돌려야 하는지 확인하는 것이 핵심입니다.",
      process: ["임대인 요청사항 확인", "현재 마감 상태 확인", "철거 범위 분리", "복구 기준 조율"],
      caution: "원상복구 범위는 현장마다 달라 사진만으로 단정하기 어렵습니다.",
    };
  }

  if (page.service.includes("인테리어")) {
    return {
      label: "인테리어 마감 철거",
      focus: "기존 인테리어를 걷어내는 작업은 바닥, 벽면, 천장, 붙박이 가구의 고정 방식을 확인해야 합니다.",
      process: ["마감재 종류 확인", "남길 구조물 구분", "폐기물 반출 계획", "작업 시간 조율"],
      caution: "단순 부분철거만 따로 요청하는 경우는 진행이 어려울 수 있습니다.",
    };
  }

  if (page.service.includes("완파")) {
    return {
      label: "사전 검토가 필요한 철거",
      focus: "구조, 허가, 안전, 장비 조건을 먼저 봐야 하는 유형으로 현장 확인 전 확답하기 어렵습니다.",
      process: ["건물 정보 확인", "접근·장비 조건 확인", "허가 필요 여부 검토", "가능 범위 안내"],
      caution: "위험하거나 허가가 필요한 작업은 관련 기준 확인 후 상담합니다.",
    };
  }

  return {
    label: "기본 철거 상담",
    focus: "현장 상태를 확인한 뒤 필요한 철거 범위와 정리 범위를 나눠 견적 상담으로 이어갑니다.",
    process: ["주소와 업종 확인", "사진으로 1차 범위 확인", "방문 견적 필요 여부 안내", "작업 일정 조율"],
    caution: "무료견적 상담이 가능하지만 도서산간 지역은 방문·출동 비용이 발생할 수 있습니다.",
  };
}

function getIntentProfile(page: SeoPage): IntentProfile {
  const intent = page.intentLabel;

  if (["비용", "비", "단가"].includes(intent)) {
    return {
      label: "비용 확인",
      headline: `${page.keyword}은 단가보다 현장 조건이 먼저입니다.`,
      body: "평수만 같아도 철거 깊이, 마감재, 폐기물 양, 차량 진입 조건에 따라 견적이 달라집니다. 그래서 처음 상담에서는 금액이 달라지는 기준부터 차근차근 짚어드립니다.",
      checklist: ["평수와 층수", "폐기물 예상량", "엘리베이터와 주차 조건"],
    };
  }

  if (["견적", "견적서"].includes(intent)) {
    return {
      label: "견적 준비",
      headline: `${page.keyword}은 항목을 나눠 확인해야 합니다.`,
      body: "견적에는 철거 범위, 폐기물 처리, 보양, 반출, 방문 비용 여부가 함께 들어갑니다. 견적서가 필요한 경우 작업 범위를 글로 남길 수 있게 준비하는 편이 좋습니다.",
      checklist: ["철거 범위", "견적서 필요 여부", "방문 가능 일정"],
    };
  }

  if (["업체", "전문업체", "회사", "추천"].includes(intent)) {
    return {
      label: "업체 선택",
      headline: `${page.keyword}을 찾을 때는 가능 작업과 제외 작업을 같이 봐야 합니다.`,
      body: "좋은 업체를 찾는 검색 의도에는 신뢰와 범위 확인이 중요합니다. 무조건 가능하다고 하기보다 안 되는 작업을 먼저 안내하는지도 확인해야 합니다.",
      checklist: ["작업 가능 범위", "제외 작업 안내", "방문 견적 방식"],
    };
  }

  if (["문의", "작업", "공사", "전문"].includes(intent)) {
    return {
      label: "작업 문의",
      headline: `${page.keyword}은 작업 순서와 현장 제약을 함께 확인합니다.`,
      body: "공사나 작업 문의는 일정, 소음, 분진, 반출 시간이 중요합니다. 건물 관리 규정이 있으면 상담 단계에서 함께 알려주는 것이 좋습니다.",
      checklist: ["희망 작업일", "소음 가능 시간", "건물 관리 규정"],
    };
  }

  return {
    label: "기본 상담",
    headline: `${page.keyword} 상담은 현재 상태 확인부터 시작합니다.`,
    body: "정확한 내용을 몰라도 문의는 가능합니다. 주소와 사진을 기준으로 먼저 보고, 부족한 정보는 상담하면서 하나씩 정리합니다.",
    checklist: ["현장 주소", "현재 사진", "대략적인 평수"],
  };
}

function metaDescription(page: SeoPage) {
  const target = getTargetProfile(page.target);
  const intent = getIntentProfile(page);
  return `${page.keyword} 상담을 준비 중이라면 ${target.group} 특성에 맞는 철거 범위, 원상복구 기준, 비용 변동 요인, 방문 견적 필요 여부를 먼저 확인하세요. 철거온은 ${page.target} ${page.serviceLabel} ${intent.label}에 필요한 준비 정보와 제외되는 의뢰 조건까지 쉽게 안내합니다.`;
}

function ogDescription(page: SeoPage) {
  const intent = getIntentProfile(page);
  return `${page.target} ${page.serviceLabel} ${intent.label} 전 확인할 범위, 비용 기준, 상담 준비 정보를 철거온에서 안내합니다.`;
}

function getScenarioNotes(page: SeoPage, target: TargetProfile, service: ServiceProfile, intent: IntentProfile) {
  return [
    `${withObjectParticle(page.keyword)} 알아보실 때는 ${page.target} 현장의 구조와 ${page.serviceLabel} 작업 범위를 함께 봐야 합니다. ${target.group}은 같은 평수라도 내부 구조와 반출 조건이 달라 견적 기준을 따로 잡아야 합니다.`,
    `${intent.label}이 궁금하신 경우에는 ${intent.checklist.join(", ")} 정보를 먼저 알려주시면 좋습니다. 이 정보가 있으면 사진 상담 단계에서 불필요한 확인을 줄일 수 있습니다.`,
    `${service.label}에서는 ${service.process.join(" → ")} 순서로 상담을 잡습니다. 특히 ${page.target} 현장은 ${target.caution}`,
    `${page.keyword} 상담을 남기실 때는 ${target.prep.join(", ")} 정보를 함께 보내주세요. 정확하지 않아도 괜찮고, 철거온이 확인해야 할 내용을 다시 정리해서 안내드립니다.`,
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    return {
      title: "철거온",
    };
  }

  const description = metaDescription(page);
  const ogDesc = ogDescription(page);
  const ogImageUrl = getOgImageUrl(page);

  return {
    title: `${page.keyword} | 철거온`,
    description,
    alternates: {
      canonical: `/services/${page.slug}`,
    },
    openGraph: {
      title: `${page.keyword} | 철거온`,
      description: ogDesc,
      url: `/services/${page.slug}`,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${page.keyword} 철거온 상담 안내`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.keyword} | 철거온`,
      description: ogDesc,
      images: [ogImageUrl],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  const target = getTargetProfile(page.target);
  const service = getServiceProfile(page);
  const intent = getIntentProfile(page);
  const scenarioNotes = getScenarioNotes(page, target, service, intent);
  const exampleImages = getExampleImages(page);
  const relatedPages = getRelatedPages(page, 12);
  const sameTargetPages = seoPages
    .filter((candidate) => candidate.target === page.target && candidate.slug !== page.slug)
    .slice(0, 8);
  const heroStyle = {
    "--seo-hero-image": `url("${getOgImagePath(page)}")`,
  } as CSSProperties;
  const heroLead = pick(
    [
      `${withObjectParticle(page.keyword)} 알아보실 때는 먼저 ${page.target} 현장의 현재 상태와 원하는 마감 기준을 나눠 보는 것이 좋습니다.`,
      `${page.target}에서 ${page.serviceLabel}가 필요하다면 비용보다 먼저 작업 범위와 반출 조건을 확인해야 합니다.`,
      `${page.keyword} 문의는 사진 몇 장만 있어도 시작할 수 있습니다. 다만 정확한 견적은 현장 조건에 따라 달라질 수 있습니다.`,
    ],
    page.slug,
  );

  return (
    <main className="seo-main">
      <section className="seo-hero" style={heroStyle}>
        <Link className="seo-brand" href="/">
          철거온
        </Link>
        <p className="eyebrow">
          {target.group} · {service.label}
        </p>
        <h1>{page.keyword}</h1>
        <p>
          {heroLead} {target.context} {service.focus}
        </p>
        <div className="seo-actions">
          <Link className="primary-button" href={NAVER_FORM_URL}>
            <MessageCircle size={19} aria-hidden="true" />
            견적 문의 준비하기
          </Link>
          <Link className="secondary-button dark" href="/services">
            전체 조합 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {page.restricted && (
        <section className="seo-alert">
          <ShieldAlert size={24} aria-hidden="true" />
          <div>
            <h2>작업 가능 여부 확인이 먼저 필요합니다.</h2>
            <p>{target.caution}</p>
          </div>
        </section>
      )}

      <section className="seo-section seo-two-column">
        <div>
          <p className="eyebrow dark">{intent.label}</p>
          <h2>{intent.headline}</h2>
          <p>
            {intent.body} {service.caution}
          </p>
        </div>
        <div className="seo-check-list">
          {intent.checklist.map((item, index) => (
            <article key={item}>
              {index === 0 && <ClipboardCheck size={24} aria-hidden="true" />}
              {index === 1 && <Ruler size={24} aria-hidden="true" />}
              {index === 2 && <FileSearch size={24} aria-hidden="true" />}
              <h3>{item}</h3>
              <p>
                {page.keyword} 상담에서 {item} 정보가 있으면 현장 확인과 견적
                안내가 더 빨라집니다.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-detail-grid">
        <article>
          <WalletCards size={26} aria-hidden="true" />
          <h2>비용이 달라지는 기준</h2>
          <p>
            {target.cost.join(", ")} 등이 {page.keyword} 비용에 영향을 줍니다.
            도서산간 지역은 방문·출동 비용이 발생할 수 있습니다.
          </p>
        </article>
        <article>
          <Wrench size={26} aria-hidden="true" />
          <h2>작업 범위 정리</h2>
          <p>
            {target.scope.join(", ")}를 기준으로 필요한 작업과 제외할 작업을 나눠
            봅니다. {service.focus}
          </p>
        </article>
        <article>
          <Ban size={26} aria-hidden="true" />
          <h2>진행이 어려운 의뢰</h2>
          <p>
            부분철거만 단독 진행하거나, 단순 폐기물 처리만 의뢰하거나, 집기 매입만
            별도로 요청하는 경우는 어렵습니다. 철거 공정에 포함되는 경우 현장
            조건을 보고 상담합니다.
          </p>
        </article>
        <article>
          <ListChecks size={26} aria-hidden="true" />
          <h2>문의 전에 준비하면 좋은 것</h2>
          <p>
            {target.prep.join(", ")} 정보를 알려주시면 좋습니다. 정확하지 않아도
            괜찮고, 모르는 부분은 상담하면서 같이 정리합니다.
          </p>
        </article>
      </section>

      <section className="seo-section seo-example-images">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">현장 예시</p>
            <h2>{page.keyword} 상담 때 함께 보는 시공 이미지입니다.</h2>
            <p>
              실제 상담에서는 사진과 현장 조건을 같이 보고, 철거 범위와 원상복구 기준을
              무리 없이 정리해드립니다.
            </p>
          </div>
        </div>
        <div className="seo-example-image-grid">
          {exampleImages.map((image) => (
            <figure key={`${page.slug}-${image.src}`}>
              <img src={image.src} alt={`${page.keyword} ${image.label} 예시`} loading="lazy" />
              <figcaption>
                <strong>{image.label}</strong>
                <span>{image.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="seo-section seo-scenario">
        <p className="eyebrow dark">맞춤 확인 포인트</p>
        <h2>{page.keyword}에 맞춰 따로 보는 내용입니다.</h2>
        <div>
          {scenarioNotes.map((note) => (
            <article key={note}>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seo-section seo-flow">
        <p className="eyebrow dark">진행 흐름</p>
        <h2>{page.keyword} 문의 후 확인 순서입니다.</h2>
        <ol>
          {service.process.map((step) => (
            <li key={step}>
              <BadgeCheck size={20} aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="seo-section seo-faq">
        <div>
          <p className="eyebrow dark">자주 묻는 질문</p>
          <h2>{page.target} {page.serviceLabel} 문의 전에 많이 묻는 내용입니다.</h2>
        </div>
        <div className="seo-faq-list">
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{withTopicParticle(page.keyword)} 사진만으로 견적이 가능한가요?</h3>
            <p>
              사진으로 1차 범위는 볼 수 있지만, 정확한 견적은 {target.group}
              조건과 반출 동선에 따라 방문 확인이 필요할 수 있습니다.
            </p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>철거지원금도 같이 확인할 수 있나요?</h3>
            <p>
              조건에 따라 신청 가능 여부와 준비 서류가 달라집니다. 보장 표현은
              하지 않고, 해당 가능성을 확인하는 방식으로 안내합니다.
            </p>
          </article>
          <article>
            <HelpCircle size={22} aria-hidden="true" />
            <h3>{page.target} 현장에서 특히 조심할 점은 무엇인가요?</h3>
            <p>{target.caution}</p>
          </article>
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">같은 대상 조합</p>
            <h2>{page.target} 관련 다른 철거 조합입니다.</h2>
          </div>
          <Link className="text-link" href="/services">
            전체 보기
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="seo-link-grid">
          {sameTargetPages.map((targetPage) => (
            <Link key={targetPage.slug} href={`/services/${targetPage.slug}`}>
              {targetPage.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-section">
        <div className="seo-section-head">
          <div>
            <p className="eyebrow dark">관련 조합</p>
            <h2>비슷한 철거 상담 주제도 함께 볼 수 있습니다.</h2>
          </div>
        </div>
        <div className="seo-link-grid">
          {relatedPages.map((relatedPage) => (
            <Link key={relatedPage.slug} href={`/services/${relatedPage.slug}`}>
              {relatedPage.keyword}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-bottom-cta">
        <Link href="/services" className="secondary-button dark">
          <ArrowLeft size={18} aria-hidden="true" />
          전체 조합으로 돌아가기
        </Link>
        <Link href={NAVER_FORM_URL} className="primary-button">
          <MessageCircle size={19} aria-hidden="true" />
          견적 문의 준비하기
        </Link>
      </section>
    </main>
  );
}
