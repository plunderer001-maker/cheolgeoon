import type { PriceRow, Source } from "@/app/components/Landing";

/*
 * 공개 시장 자료 기준 철거비 참고 범위. 철거온 확정 견적이 아니므로
 * 화면에는 항상 출처와 기준 시점을 함께 표기한다. 메인과 철거 비용 가이드가 같은 값을 쓴다.
 */
export const MARKET_PRICE_ROWS: PriceRow[] = [
  { name: "상가·사무실 전체 철거", perPyeong: "평당 10~15만원", example: "20평 약 200~300만원" },
  { name: "인테리어·마감재 철거", perPyeong: "평당 5~12만원", example: "20평 약 100~240만원" },
  { name: "원상복구 포함", perPyeong: "철거비의 1.2~1.5배", example: "계약서 기준 범위에 따라" },
];

export const MARKET_PRICE_UPS = ["주방 설비·후드·덕트", "야간·주말 작업", "엘리베이터 없는 고층", "석면 자재 (일반의 2~5배)"];

export const MARKET_PRICE_SOURCES: Source[] = [
  {
    label: "스페이스로그인 (2025.12)",
    href: "https://spacelogin.co.kr/%EC%82%AC%EB%AC%B4%EC%8B%A4-%EC%83%81%EA%B0%80-%EC%B2%A0%EA%B1%B0%EB%B9%84%EC%9A%A9-%EA%B3%84%EC%82%B0%EB%B2%95-%EC%99%84%EB%B2%BD-%EC%A0%95%EB%A6%AC/",
  },
  { label: "소중함인사이트 (2026)", href: "https://ssjum.com/demolition.html" },
];

export const MARKET_PRICE_CAPTION =
  "2025~2026년 공개 자료의 수도권 참고 범위이며 철거온 확정 견적이 아닙니다. 현장 조건에 따라 달라집니다.";
