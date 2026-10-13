import { Fragment, type ReactNode } from "react";
import {
  Building,
  CalendarCheck,
  DoorOpen,
  FileText,
  Hammer,
  HardHat,
  KeyRound,
  Layers,
  Package,
  Recycle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  ANNOUNCEMENT_DATE,
  CostReceipt,
  FactorMeters,
  MARQUEE_PHOTOS,
  PhotoMarquee,
  PriceVisual,
  QuoteChecks,
  SAMPLE_PYEONG,
  STRIP,
  SUBSIDY_CAP,
  SUBSIDY_PER_PYEONG,
  SubsidyVisual,
  TrustBand,
  type PriceCopy,
} from "@/app/components/CostVisuals";
import {
  LandingCards,
  LandingNote,
  LandingSpaces,
  LandingSplit,
  LandingSteps,
  LandingTitle,
  SERVICE_SCOPE,
  SPACE_PHOTOS,
} from "@/app/components/Landing";
import * as C from "@/app/lib/cost-copy";
import { MARKET_PRICE_CAPTION, MARKET_PRICE_RANGES, MARKET_PRICE_SOURCES, RESTORATION_RATE } from "@/app/lib/market-prices";
import {
  PRICE_CAPTION,
  SCOPE_NO_SLOTS,
  SCOPE_TIP,
  SCOPE_TITLE,
  SCOPE_YES_SLOTS,
  SITUATIONS as REGION_SITUATIONS,
  SPACE_SETS,
  SPACE_TITLE,
  STEPS_TITLE,
  STEP_CTA,
  STEP_SETS,
} from "@/app/lib/region-copy";

/*
 * 철거 비용 가이드와 시군구 철거비용 페이지가 함께 쓰는 본문(2026-10-13 시각화 개편).
 * 비용 구성·금액 요인은 market-prices 의 출처(스페이스로그인 2025.12, 소중함인사이트 2026)에 나온 항목만 쓴다.
 * 시군구 페이지는 variant 로 cost-copy·region-copy 의 표현을 지역마다 달리 고른다. 가이드는 FIXED(첫 표현)를 쓴다.
 */

export type Variant = {
  fixed: boolean;
  pick: <T>(section: string, options: readonly T[]) => T;
  order: (section: string, length: number) => number;
};

export const FIXED: Variant = { fixed: true, pick: (_section, options) => options[0], order: () => 0 };

/* 자리마다 따로 고른다. slots[i] 는 i번째 자리의 표현들. */
function each<T>(v: Variant, section: string, slots: readonly (readonly T[])[]): T[] {
  return slots.map((options, index) => v.pick(`${section}:${index}`, options));
}

function rotate<T>(v: Variant, section: string, items: T[]): T[] {
  if (items.length === 0) return items;
  const shift = v.order(section, items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function Title({ parts }: { parts: [string, string, string] }) {
  return (
    <LandingTitle>
      {parts[0]}
      <em>{parts[1]}</em>
      {parts[2]}
    </LandingTitle>
  );
}

const GUIDE_SITUATIONS = [
  { title: "가게를 폐업하고 정리해야 해요", body: "철거 범위와 지원금 가능 여부를 함께 확인합니다" },
  { title: "건물주가 원상복구를 요구해요", body: "계약서·기준서로 철거할 범위부터 정리합니다" },
  { title: "사무실 이전 날짜가 정해졌어요", body: "퇴거일에 맞춰 거꾸로 일정을 잡습니다" },
  { title: "새 매장 들어가기 전 철거가 필요해요", body: "남길 것과 걷어낼 것을 먼저 나눕니다" },
];
const SITUATION_ICONS = [DoorOpen, FileText, CalendarCheck, KeyRound];
const RECEIPT_ICONS = [HardHat, Recycle, Truck, Hammer, ShieldCheck];
const FACTOR_ICONS = [Layers, Recycle, Truck, Building, Package];
const FACTOR_PHOTOS = [33, 15, 40, 13, 8];

/* 가운데 설득 섹션 순서. 위(실적 → 지원금 → 비용 → 사진)와 아래(진행)는 고정하고, 지역마다 이 중 하나를 쓴다. 첫 번째가 가이드 순서. */
const MIDDLE_ORDERS = [
  ["situations", "cost", "factors", "spaces", "scope", "quote"],
  ["cost", "factors", "situations", "spaces", "quote", "scope"],
  ["situations", "spaces", "cost", "factors", "quote", "scope"],
  ["cost", "factors", "quote", "situations", "spaces", "scope"],
  ["situations", "cost", "quote", "factors", "scope", "spaces"],
];

export const COST_FAQ: [string, string][] = [
  [
    "평당 단가로는 알 수 없나요?",
    "공개 자료 기준 상가·사무실 전체 철거는 평당 10~15만원 선입니다. 다만 같은 평수도 구조·폐기물·층수에 따라 차이가 커서, 사진을 보내주시면 금액이 달라지는 항목부터 짚어드립니다.",
  ],
  ["사진만으로 견적이 되나요?", "1차 범위는 사진으로 봅니다. 설비나 동선 확인이 필요할 때만 방문 견적을 안내합니다."],
  [
    "원상복구는 어디까지 해야 하나요?",
    "임대차 계약서와 입점 당시 상태가 기준입니다. 계약서나 기준서를 보내주시면 범위를 같이 정리합니다.",
  ],
  ["비용을 줄이는 방법이 있나요?", "직접 뺄 수 있는 집기와 물품을 먼저 정리하면 폐기물이 줄어 견적이 낮아집니다."],
];

export function CostCore({
  priceTitle,
  v = FIXED,
  name = "",
}: {
  priceTitle: ReactNode;
  v?: Variant;
  name?: string;
}) {
  const main = MARKET_PRICE_RANGES[0];

  const situations = v.fixed
    ? GUIDE_SITUATIONS
    : rotate(v, "situations", REGION_SITUATIONS[0].map((_, index) => v.pick(`situations:${index}`, REGION_SITUATIONS.map((set) => set[index]))));

  const receiptItems = each(v, "receipt", C.RECEIPT_ITEMS).map(([itemName, note], index) => ({
    icon: RECEIPT_ICONS[index],
    name: itemName,
    note,
  }));

  const factors = rotate(
    v,
    "factors",
    each(v, "factor", C.FACTORS).map(([title, low, high], index) => ({
      icon: FACTOR_ICONS[index],
      title,
      low,
      high,
      photo: STRIP("sq", FACTOR_PHOTOS[index]),
    })),
  );

  const middle: Record<string, ReactNode> = {
    situations: (
      <section className="lp-section">
        <Title parts={v.pick("situation-title", C.SITUATION_TITLE)} />
        <LandingCards items={situations.map((item, index) => ({ icon: SITUATION_ICONS[index % 4], ...item }))} linkAll />
      </section>
    ),
    cost: (
      <section className="lp-section" id="cost">
        <Title parts={v.pick("cost-title", C.COST_TITLE)} />
        <CostReceipt
          copy={{
            head: v.pick("receipt-head", C.RECEIPT_HEAD),
            items: receiptItems,
            pending: v.pick("receipt-pending", C.RECEIPT_PENDING),
            total: v.pick("receipt-total", C.RECEIPT_TOTAL),
            side: v.pick("receipt-side", C.RECEIPT_SIDE),
            note: v.pick("receipt-note", C.RECEIPT_NOTE),
            photo: STRIP("wide", v.pick("receipt-photo", C.RECEIPT_PHOTO)),
          }}
        />
      </section>
    ),
    factors: (
      <section className="lp-section" id="factors">
        <Title parts={v.pick("factor-title", C.FACTOR_TITLE)} />
        <FactorMeters head={v.pick("factor-head", C.FACTOR_HEAD)} items={factors} />
      </section>
    ),
    spaces: (
      <section className="lp-section">
        <LandingTitle>{v.pick("space-title", SPACE_TITLE)}</LandingTitle>
        <LandingSpaces items={v.fixed ? SPACE_PHOTOS : each(v, "spaces", SPACE_SETS[0].map((_, i) => SPACE_SETS.map((set) => set[i])))} />
        <LandingNote>{v.pick("space-note", C.SPACE_NOTE)}</LandingNote>
      </section>
    ),
    scope: (
      <section className="lp-section">
        <Title parts={v.pick("scope-title", SCOPE_TITLE)} />
        {v.fixed ? (
          <LandingSplit yes={SERVICE_SCOPE.yes} no={SERVICE_SCOPE.no} tip={SERVICE_SCOPE.tip} />
        ) : (
          <LandingSplit
            yes={{ label: "진행 가능", items: rotate(v, "scope-yes", each(v, "scope-yes", SCOPE_YES_SLOTS)) }}
            no={{ label: "진행이 어려운 의뢰", items: rotate(v, "scope-no", each(v, "scope-no", SCOPE_NO_SLOTS)) }}
            tip={v.pick("scope-tip", SCOPE_TIP)}
          />
        )}
      </section>
    ),
    quote: (
      <section className="lp-section">
        <Title parts={v.pick("quote-title", C.QUOTE_TITLE)} />
        <QuoteChecks items={rotate(v, "quote", each(v, "quote", C.QUOTE_CHECKS))} warn={v.pick("quote-warn", C.QUOTE_WARN)} />
      </section>
    ),
  };

  return (
    <>
      <TrustBand
        kicker={v.pick("trust-kicker", C.TRUST_KICKER)}
        labels={each(v, "trust-label", C.TRUST_LABELS)}
        promises={each(v, "trust-promise", C.TRUST_PROMISES)}
        note={v.pick("trust-note", C.TRUST_NOTE)}
      />

      <section className="lp-section" id="subsidy">
        <LandingTitle>
          아직도 <em>내 돈 들여</em> 철거하시나요?
        </LandingTitle>
        <SubsidyVisual
          copy={{
            chartLabel: v.pick("subsidy-chart", C.SUBSIDY_CHART_LABEL),
            capLabel: v.pick("subsidy-cap", C.SUBSIDY_CAP_LABEL)(SUBSIDY_CAP),
            formula: v.pick("subsidy-formula", C.SUBSIDY_FORMULA)(SUBSIDY_PER_PYEONG),
            checkLabel: v.pick("subsidy-check", C.SUBSIDY_CHECK_LABEL),
            eligible: rotate(v, "subsidy-eligible", each(v, "subsidy-eligible", C.SUBSIDY_ELIGIBLE)),
            no: v.pick("subsidy-no", C.SUBSIDY_NO),
            flow: each(v, "subsidy-flow", C.SUBSIDY_FLOW),
            foot: v.pick("subsidy-foot", C.SUBSIDY_FOOT),
            cta: v.pick("subsidy-cta", C.SUBSIDY_CTA),
            sourceLead: v.pick("subsidy-source", C.SUBSIDY_SOURCE_LEAD)(ANNOUNCEMENT_DATE),
          }}
        />
      </section>

      <section className="lp-section" id="price">
        <LandingTitle>{priceTitle}</LandingTitle>
        <PriceVisual
          sources={MARKET_PRICE_SOURCES}
          copy={{
            rangeLabel: v.pick("price-range", C.PRICE_RANGE_LABEL),
            rangeNames: each(v, "price-name", C.PRICE_RANGE_NAMES),
            restore: v.pick("price-restore", C.PRICE_RESTORE)(RESTORATION_RATE.min, RESTORATION_RATE.max),
            restoreBase: v.pick("price-restore-base", C.PRICE_RESTORE_BASE),
            calcLabel: v.pick("price-calc", C.PRICE_CALC_LABEL)(SAMPLE_PYEONG),
            calcFormula: v.pick("price-formula", C.PRICE_CALC_FORMULA)(SAMPLE_PYEONG, main.min, main.max),
            totalPrefix: v.pick("price-total", C.PRICE_TOTAL_PREFIX),
            cta: v.pick("price-cta", C.PRICE_CTA_LABEL),
            upsLabel: v.pick("price-ups-label", C.PRICE_UPS_LABEL),
            ups: rotate(v, "price-ups", each(v, "price-up", C.PRICE_UPS)),
            caption: v.fixed ? MARKET_PRICE_CAPTION : v.pick("price-caption", PRICE_CAPTION)(name),
          }}
        />
      </section>

      <PhotoMarquee
        title={(() => {
          const [before, em, after] = v.pick("marquee-title", C.MARQUEE_TITLE);
          return (
            <>
              {before}
              <em>{em}</em>
              {after}
            </>
          );
        })()}
        lead={v.pick("marquee-lead", C.MARQUEE_LEAD)}
        photos={rotate(v, "marquee", MARQUEE_PHOTOS)}
      />

      {v.pick("middle-order", MIDDLE_ORDERS).map((key) => (
        <Fragment key={key}>{middle[key]}</Fragment>
      ))}

      <section className="lp-section">
        <LandingTitle>{v.pick("steps-title", STEPS_TITLE)}</LandingTitle>
        {v.fixed ? (
          <LandingSteps />
        ) : (
          (() => {
            const [ctaTitle, ctaBody] = v.pick("step-cta", STEP_CTA);
            return (
              <LandingSteps
                steps={each(v, "steps", STEP_SETS[0].map((_, i) => STEP_SETS.map((set) => set[i])))}
                ctaTitle={ctaTitle}
                ctaBody={ctaBody}
              />
            );
          })()
        )}
        <LandingNote icon={CalendarCheck}>{v.pick("steps-note", C.STEPS_NOTE)}</LandingNote>
      </section>
    </>
  );
}

/* ---------- 하위 가이드(폐업·상가·식당·사무실·원상복구·지원금)가 가져다 쓰는 조각. 모두 첫 표현을 쓴다. ---------- */

export function GuideTrust() {
  const v = FIXED;
  return (
    <TrustBand
      kicker={v.pick("trust-kicker", C.TRUST_KICKER)}
      labels={each(v, "trust-label", C.TRUST_LABELS)}
      promises={each(v, "trust-promise", C.TRUST_PROMISES)}
      note={v.pick("trust-note", C.TRUST_NOTE)}
    />
  );
}

export function GuideSubsidy() {
  const v = FIXED;
  return (
    <section className="lp-section" id="subsidy">
      <LandingTitle>
        아직도 <em>내 돈 들여</em> 철거하시나요?
      </LandingTitle>
      <SubsidyVisual
        copy={{
          chartLabel: v.pick("subsidy-chart", C.SUBSIDY_CHART_LABEL),
          capLabel: v.pick("subsidy-cap", C.SUBSIDY_CAP_LABEL)(SUBSIDY_CAP),
          formula: v.pick("subsidy-formula", C.SUBSIDY_FORMULA)(SUBSIDY_PER_PYEONG),
          checkLabel: v.pick("subsidy-check", C.SUBSIDY_CHECK_LABEL),
          eligible: each(v, "subsidy-eligible", C.SUBSIDY_ELIGIBLE),
          no: v.pick("subsidy-no", C.SUBSIDY_NO),
          flow: each(v, "subsidy-flow", C.SUBSIDY_FLOW),
          foot: v.pick("subsidy-foot", C.SUBSIDY_FOOT),
          cta: v.pick("subsidy-cta", C.SUBSIDY_CTA),
          sourceLead: v.pick("subsidy-source", C.SUBSIDY_SOURCE_LEAD)(ANNOUNCEMENT_DATE),
        }}
      />
    </section>
  );
}

export function GuideMarquee() {
  return (
    <PhotoMarquee
      title={
        <>
          실제로 <em>이렇게</em> 비웁니다
        </>
      }
      lead={C.MARQUEE_LEAD[0]}
    />
  );
}

export function guidePriceCopy({ ups, caption, cta, rangeNames }: { ups: string[]; caption: string; cta: string; rangeNames?: string[] }): PriceCopy {
  const main = MARKET_PRICE_RANGES[0];
  return {
    rangeLabel: C.PRICE_RANGE_LABEL[0],
    rangeNames: rangeNames ?? C.PRICE_RANGE_NAMES.map((slot) => slot[0]),
    restore: C.PRICE_RESTORE[0](RESTORATION_RATE.min, RESTORATION_RATE.max),
    restoreBase: C.PRICE_RESTORE_BASE[0],
    calcLabel: C.PRICE_CALC_LABEL[0](SAMPLE_PYEONG),
    calcFormula: C.PRICE_CALC_FORMULA[0](SAMPLE_PYEONG, main.min, main.max),
    totalPrefix: C.PRICE_TOTAL_PREFIX[0],
    cta,
    upsLabel: C.PRICE_UPS_LABEL[0],
    ups,
    caption,
  };
}
