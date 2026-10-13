import { Fragment, type ReactNode } from "react";
import {
  Building2,
  ClipboardList,
  Dumbbell,
  Factory,
  FileText,
  GraduationCap,
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
import { FIXED, type Variant } from "@/app/components/CostCore";
import {
  ANNOUNCEMENT_DATE,
  AskVisual,
  MARQUEE_PHOTOS,
  PhotoCards,
  PhotoMarquee,
  ProcessTimeline,
  STRIP,
  SUBSIDY_CAP,
  SUBSIDY_PER_PYEONG,
  SpaceGrid,
  SubsidyVisual,
  TrustBand,
} from "@/app/components/CostVisuals";
import { LandingNote, LandingSpaces, LandingSplit, LandingSteps, LandingTitle, SPACE_PHOTOS } from "@/app/components/Landing";
import {
  C_ASK_SLOTS,
  C_ASK_WARN,
  C_DIFF_PHOTOS,
  C_DIFF_SLOTS,
  C_DIFF_TITLE,
  C_FIELD_SLOTS,
  C_FIELD_TITLE,
  C_SCOPE_NO,
  C_SCOPE_TIP,
  C_SCOPE_TITLE,
  C_SCOPE_YES,
  C_SPACES,
  C_SPACE_GRID_NOTE,
  C_SPACE_TITLE,
  C_STEP_CTA,
} from "@/app/lib/company-copy";
import * as C from "@/app/lib/cost-copy";
import { SPACE_SETS, SPACE_TITLE, STEPS_TITLE, STEP_SETS } from "@/app/lib/region-copy";

/*
 * 전국 철거전문업체 허브와 시군구 철거전문업체 페이지가 함께 쓰는 본문(2026-10-13).
 * 흐름은 철거 비용 본문(CostCore)과 같다: 실적 → 지원금 → 핵심(업체에 물어볼 것) → 사진 띠 → 설득 섹션 → 진행.
 * 시군구 페이지는 variant 로 표현과 가운데 섹션 순서를 지역마다 달리 고른다. 허브는 FIXED(첫 표현·첫 순서).
 */

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

const DIFF_ICONS = [ClipboardList, Recycle, ShieldCheck, PaintRoller];
const FIELD_ICONS = [ClipboardList, FileText, ShieldCheck, Recycle];
const FIELD_PHOTOS = [40, 34, 13, 15];
const SPACE_ICONS = [Store, Building2, UtensilsCrossed, GraduationCap, Dumbbell, Stethoscope, Scissors, MicVocal, Factory, Warehouse];

/* 가운데 설득 섹션 순서. 첫 번째가 허브 순서. */
const MIDDLE_ORDERS = [
  ["diff", "field", "grid", "photos", "scope"],
  ["field", "diff", "photos", "grid", "scope"],
  ["diff", "grid", "field", "scope", "photos"],
  ["grid", "diff", "field", "photos", "scope"],
  ["field", "photos", "diff", "scope", "grid"],
];

export function CompanyCore({
  askTitle,
  image,
  imageAlt,
  name = "",
  v = FIXED,
}: {
  askTitle: [string, string, string];
  image: string;
  imageAlt: string;
  name?: string;
  v?: Variant;
}) {
  const asks = rotate(v, "ask", each(v, "ask", C_ASK_SLOTS));
  const diff = each(v, "diff", C_DIFF_SLOTS).map(([title, body], index) => ({
    icon: DIFF_ICONS[index],
    title,
    body,
    photo: STRIP("work", C_DIFF_PHOTOS[index]),
  }));
  const field = each(v, "field", C_FIELD_SLOTS).map(([title, body], index) => ({
    icon: FIELD_ICONS[index],
    title,
    body,
    photo: STRIP("sq", FIELD_PHOTOS[index]),
  }));
  const spaces = rotate(
    v,
    "spaces",
    C_SPACES.map(([spaceName, notes], index) => ({ icon: SPACE_ICONS[index], name: spaceName, note: v.pick(`space-note:${index}`, notes) })),
  );
  const [stepCtaTitle, stepCtaBody] = v.pick("step-cta", C_STEP_CTA);

  const middle: Record<string, ReactNode> = {
    diff: (
      <section className="lp-section">
        <Title parts={v.pick("diff-title", C_DIFF_TITLE)} />
        <PhotoCards items={rotate(v, "diff", diff)} />
      </section>
    ),
    field: (
      <section className="lp-section">
        <Title parts={v.pick("field-title", C_FIELD_TITLE)} />
        <ProcessTimeline items={field} />
      </section>
    ),
    grid: (
      <section className="lp-section">
        <Title parts={v.pick("space-grid-title", C_SPACE_TITLE)(name || "전국")} />
        <SpaceGrid items={spaces} />
        <LandingNote>{v.pick("space-grid-note", C_SPACE_GRID_NOTE)}</LandingNote>
      </section>
    ),
    photos: (
      <section className="lp-section">
        <LandingTitle>{v.pick("space-title", SPACE_TITLE)}</LandingTitle>
        <LandingSpaces
          items={v.fixed ? SPACE_PHOTOS : each(v, "space-photos", SPACE_SETS[0].map((_, i) => SPACE_SETS.map((set) => set[i])))}
        />
      </section>
    ),
    scope: (
      <section className="lp-section">
        <Title parts={v.pick("scope-title", C_SCOPE_TITLE)} />
        <LandingSplit
          yes={{ label: "진행 가능", items: rotate(v, "scope-yes", each(v, "scope-yes", C_SCOPE_YES)) }}
          no={{ label: "진행이 어려운 의뢰", items: rotate(v, "scope-no", each(v, "scope-no", C_SCOPE_NO)) }}
          tip={v.pick("scope-tip", C_SCOPE_TIP)}
        />
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

      <section className="lp-section" id="ask">
        <Title parts={askTitle} />
        <AskVisual items={asks} warn={v.pick("ask-warn", C_ASK_WARN)} image={image} imageAlt={imageAlt} />
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
          <LandingSteps
            steps={each(v, "steps", STEP_SETS[0].map((_, i) => STEP_SETS.map((set) => set[i])))}
            ctaTitle={stepCtaTitle}
            ctaBody={stepCtaBody}
          />
        )}
        <LandingNote>{v.pick("steps-note", C.STEPS_NOTE)}</LandingNote>
      </section>
    </>
  );
}
