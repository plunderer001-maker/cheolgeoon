import Link from "next/link";
import type React from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Headphones,
  Store,
  Coins,
  HandCoins,
  UtensilsCrossed,
  Wrench,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { ANNOUNCEMENT_DATE, SOURCES as SUBSIDY_SOURCES } from "@/app/lib/subsidy";
import { NAVER_FORM_URL, type Source } from "@/app/components/Landing";
import { MARKET_PRICE_RANGES, RESTORATION_RATE } from "@/app/lib/market-prices";

/*
 * 철거 비용 본문 시각화(2026-10-13). 글 대신 그래프·영수증·게이지로 한눈에 보이게 한다.
 * 문구는 모두 props 로 받는다(app/lib/cost-copy.ts 의 변형 중 하나를 CostCore 가 골라 넘긴다).
 */

type Parts = [string, string, string];

/* ---------- 히어로 바로 아래: 시공 실적·약속 ---------- */

/* 시공 누적 실적(2026-10 확인, 드림철거연합 직접 시공). */
const TRUST_VALUES = [7690, 5560, 3685, 2790];
const TRUST_ICONS: LucideIcon[] = [Store, HandCoins, Coins, UtensilsCrossed];
const PROMISE_ICONS: LucideIcon[] = [CalendarCheck, Wrench, Headphones];

export function TrustBand({
  kicker,
  labels,
  promises,
  note,
}: {
  kicker: string;
  labels: string[];
  promises: string[];
  note: string;
}) {
  const top = Math.max(...TRUST_VALUES);
  return (
    <section className="cv-trust" aria-label="시공 실적">
      <div className="cv-trust-card">
        <p className="cv-trust-kicker">{kicker}</p>
        <dl className="cv-trust-stats">
          {TRUST_VALUES.map((value, index) => {
            const IconComponent = TRUST_ICONS[index];
            return (
              <div key={index}>
                <dt>
                  <IconComponent size={18} aria-hidden="true" />
                  {labels[index]}
                </dt>
                <dd>
                  {value.toLocaleString("ko-KR")}
                  <small>건</small>
                </dd>
                <span className="cv-trust-bar" aria-hidden="true">
                  <span style={{ width: `${(value / top) * 100}%` }} />
                </span>
              </div>
            );
          })}
        </dl>
        <ul className="cv-trust-promises">
          {promises.map((label, index) => {
            const IconComponent = PROMISE_ICONS[index];
            return (
              <li key={label}>
                <IconComponent size={18} aria-hidden="true" />
                {label}
              </li>
            );
          })}
        </ul>
        <p className="cv-trust-note">{note}</p>
      </div>
    </section>
  );
}

/* ---------- 평당 비용: 범위 막대 + 20평 계산 ---------- */

const AXIS_MAX = 20;
const AXIS_TICKS = [0, 5, 10, 15, 20];
export const SAMPLE_PYEONG = 20;

export type PriceCopy = {
  rangeLabel: string;
  rangeNames: string[];
  restore: [string, string];
  restoreBase: string;
  calcLabel: string;
  calcFormula: string;
  totalPrefix: string;
  cta: string;
  upsLabel: string;
  ups: string[];
  caption: string;
};

export function PriceVisual({ copy, sources }: { copy: PriceCopy; sources: Source[] }) {
  const main = MARKET_PRICE_RANGES[0];
  const low = main.min * SAMPLE_PYEONG;
  const high = main.max * SAMPLE_PYEONG;
  return (
    <>
      <div className="cv-price">
        <div className="cv-card cv-range">
          <p className="cv-card-label">{copy.rangeLabel}</p>
          <div className="cv-range-rows">
            {MARKET_PRICE_RANGES.map(({ name, min, max }, index) => (
              <div className="cv-range-row" key={name}>
                <span className="cv-range-name">{copy.rangeNames[index] ?? name}</span>
                <div className="cv-range-track">
                  <span
                    className="cv-range-bar"
                    style={{ left: `${(min / AXIS_MAX) * 100}%`, width: `${((max - min) / AXIS_MAX) * 100}%` }}
                  >
                    {min}~{max}만원
                  </span>
                </div>
              </div>
            ))}
            <div className="cv-range-row cv-range-axis" aria-hidden="true">
              <span />
              <div className="cv-range-track">
                {AXIS_TICKS.map((tick) => (
                  <i key={tick} style={{ left: `${(tick / AXIS_MAX) * 100}%` }}>
                    {tick}
                  </i>
                ))}
              </div>
            </div>
          </div>
          <div className="cv-restore">
            <p>
              {copy.restore[0]}
              <strong>{copy.restore[1]}</strong>
            </p>
            <div className="cv-restore-bars" aria-hidden="true">
              <span className="cv-restore-base" style={{ flexBasis: `${100 / RESTORATION_RATE.max}%` }}>
                {copy.restoreBase}
              </span>
              <span className="cv-restore-plus">
                +{Math.round((RESTORATION_RATE.min - 1) * 100)}~{Math.round((RESTORATION_RATE.max - 1) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="cv-card cv-calc">
          <p className="cv-card-label">{copy.calcLabel}</p>
          <div className="cv-calc-grid" aria-hidden="true">
            {Array.from({ length: SAMPLE_PYEONG }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <p className="cv-calc-formula">{copy.calcFormula}</p>
          <p className="cv-calc-total">
            {copy.totalPrefix} <strong>{low}~{high}</strong>만원
          </p>
          <a href={NAVER_FORM_URL} className="lp-btn lp-btn-primary cv-calc-cta">
            {copy.cta}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="cv-ups">
        <span className="cv-ups-label">
          <TrendingUp size={18} aria-hidden="true" />
          {copy.upsLabel}
        </span>
        {copy.ups.map((up) => (
          <span key={up} className="cv-ups-chip">
            {up}
          </span>
        ))}
      </div>

      <p className="lp-price-source">
        {copy.caption} 출처:{" "}
        {sources.map((source, index) => (
          <span key={source.href}>
            {index > 0 && ", "}
            <a href={source.href} target="_blank" rel="noopener nofollow">
              {source.label}
            </a>
          </span>
        ))}
      </p>
    </>
  );
}

/* ---------- 비용 구성: 견적서 모양 ---------- */

export type ReceiptCopy = {
  head: string;
  items: { icon: LucideIcon; name: string; note: string }[];
  pending: string;
  total: string;
  side: Parts;
  note: string;
  photo: string;
};

export function CostReceipt({ copy }: { copy: ReceiptCopy }) {
  return (
    <div className="cv-receipt-wrap">
      <div className="cv-receipt">
        <p className="cv-receipt-head">
          {copy.head} <span>예시</span>
        </p>
        <ol>
          {copy.items.map(({ icon: IconComponent, name, note }) => (
            <li key={name}>
              <IconComponent size={20} aria-hidden="true" />
              <span>
                <strong>{name}</strong>
                <small>{note}</small>
              </span>
              <em>{copy.pending}</em>
            </li>
          ))}
        </ol>
        <p className="cv-receipt-total">
          <span>합계</span>
          <strong>{copy.total}</strong>
        </p>
      </div>
      <div className="cv-receipt-side">
        <p className="cv-big">
          {copy.side[0]}
          <br />
          <em>{copy.side[1]}</em>
          {copy.side[2]}
        </p>
        <p className="cv-muted">{copy.note}</p>
        <img className="cv-side-photo" src={copy.photo} alt="철거를 마친 상가 내부" width={720} height={540} loading="lazy" />
      </div>
    </div>
  );
}

/* ---------- 금액을 바꾸는 5가지: 덜 드는 쪽 ↔ 더 드는 쪽 ---------- */

export function FactorMeters({
  head,
  items,
}: {
  head: [string, string];
  items: { icon: LucideIcon; title: string; low: string; high: string; photo?: string }[];
}) {
  return (
    <div className="cv-meters">
      <div className="cv-meter-head" aria-hidden="true">
        <span />
        <span>{head[0]}</span>
        <span>{head[1]}</span>
      </div>
      {items.map(({ icon: IconComponent, title, low, high, photo }) => (
        <div className="cv-meter" key={title}>
          <p className="cv-meter-title">
            {photo ? (
              <img src={photo} alt={`${title} 관련 실제 철거 현장`} width={240} height={240} loading="lazy" />
            ) : (
              <IconComponent size={22} aria-hidden="true" />
            )}
            {title}
          </p>
          <div className="cv-meter-body">
            <div className="cv-meter-track" aria-hidden="true">
              <span />
            </div>
            <div className="cv-meter-labels">
              <span>{low}</span>
              <span>{high}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 견적 비교 체크: 체크박스 문서 ---------- */

export function QuoteChecks({ items, warn }: { items: string[]; warn: [string, string] }) {
  return (
    <div className="cv-checks">
      <ul>
        {items.map((item) => (
          <li key={item}>
            <span className="cv-check-box" aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="cv-checks-warn">
        <strong>{warn[0]}</strong>
        <span>{warn[1]}</span>
      </div>
    </div>
  );
}

/* ---------- 폐업 철거지원금: 평수별 한도 그래프 + 대상 체크 + 신청 흐름 ---------- */

/* 2026.1.19 희망리턴패키지 공고: 2025.7.11 이후 폐업 시 전용면적 1평당 20만원, 최대 600만원. */
export const SUBSIDY_PER_PYEONG = 20;
export const SUBSIDY_CAP = 600;
const SUBSIDY_SAMPLES = [5, 10, 20, 30, 40];

/* 평수별 지원 한도 막대그래프 카드. 지원금 가이드는 이것만 따로 쓴다. */
export function SubsidyBars({ label, capLabel, formula }: { label: string; capLabel: string; formula: Parts }) {
  return (
    <div className="cv-card cv-subsidy-chart">
      <p className="cv-card-label">{label}</p>
      <div className="cv-bars" role="img" aria-label="5평 100만원, 10평 200만원, 20평 400만원, 30평 이상 600만원">
        <span className="cv-bars-cap">
          <i>{capLabel}</i>
        </span>
        {SUBSIDY_SAMPLES.map((pyeong) => {
          const amount = Math.min(pyeong * SUBSIDY_PER_PYEONG, SUBSIDY_CAP);
          return (
            <div key={pyeong} className={amount === SUBSIDY_CAP ? "is-cap" : undefined}>
              <span style={{ height: `${(amount / SUBSIDY_CAP) * 100}%` }}>
                <strong>{amount}</strong>
              </span>
              <em>{pyeong}평</em>
            </div>
          );
        })}
      </div>
      <p className="cv-subsidy-formula">
        {formula[0]}
        <b>{formula[1]}</b>
        {formula[2]}
      </p>
    </div>
  );
}

export type SubsidyCopy = {
  chartLabel: string;
  capLabel: string;
  formula: Parts;
  checkLabel: string;
  eligible: string[];
  no: string;
  flow: [string, string][];
  foot: Parts;
  cta: string;
  sourceLead: string;
};

export function SubsidyVisual({ copy }: { copy: SubsidyCopy }) {
  return (
    <div className="cv-subsidy">
      <div className="cv-subsidy-top">
        <SubsidyBars label={copy.chartLabel} capLabel={copy.capLabel} formula={copy.formula} />

        <div className="cv-card cv-subsidy-check">
          <p className="cv-card-label">{copy.checkLabel}</p>
          <ul>
            {copy.eligible.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={3} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="cv-subsidy-no">
            <X size={15} strokeWidth={3} aria-hidden="true" />
            {copy.no}
          </p>
        </div>
      </div>

      <ol className="cv-flow">
        {copy.flow.map(([title, body], index) => (
          <li key={title}>
            <span>{index + 1}</span>
            <strong>{title}</strong>
            <small>{body}</small>
          </li>
        ))}
      </ol>

      <div className="cv-subsidy-foot">
        <p>
          <HandCoins size={20} aria-hidden="true" />
          <span>
            {copy.foot[0]}
            <b>{copy.foot[1]}</b>
            {copy.foot[2]}
          </span>
        </p>
        <Link href="/guide/폐업-철거지원금/" className="lp-btn lp-btn-primary">
          {copy.cta}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <p className="lp-price-source">
        {copy.sourceLead} 출처:{" "}
        {SUBSIDY_SOURCES.map((source, index) => (
          <span key={source.href}>
            {index > 0 && ", "}
            <a href={source.href} target="_blank" rel="noopener nofollow">
              {source.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

export { ANNOUNCEMENT_DATE };

/* ---------- 실제 현장 사진 띠: 왼쪽으로 흐른다 ---------- */

/* public/images/cheolgeoon/strip/ 은 raw-authenticated 실제 사진을 줄인 것. 간판·상호·사람이 보이는 사진은 뺐다. */
export const STRIP = (kind: "work" | "sq" | "wide", n: number) =>
  `/images/cheolgeoon/strip/${kind}-${String(n).padStart(3, "0")}.webp`;

/* 사진에 보이는 공간 종류만 적는다(메인 페이지 CASES 와 같은 기준). */
export const MARQUEE_PHOTOS: [number, string][] = [
  [33, "상가"],
  [5, "매장"],
  [22, "사무실"],
  [40, "상가"],
  [2, "매장"],
  [12, "상가"],
  [32, "상가"],
  [9, "매장"],
  [20, "사무실"],
  [41, "상가"],
  [10, "매장"],
  [37, "상가"],
  [13, "상가"],
  [34, "상가"],
  [11, "상가"],
  [42, "상가"],
  [36, "상가"],
  [4, "매장"],
];

export function PhotoMarquee({
  title,
  lead,
  photos = MARQUEE_PHOTOS,
}: {
  title: React.ReactNode;
  lead?: string;
  photos?: [number, string][];
}) {
  const loop = [...photos, ...photos];
  return (
    <section className="cv-marquee-section" aria-label="실제 철거 현장 사진">
      <div className="cv-marquee-head">
        <h2 className="lp-title">{title}</h2>
        {lead && <p className="cv-muted">{lead}</p>}
      </div>
      <div className="cv-marquee">
        <ul className="cv-marquee-track">
          {loop.map(([n, label], index) => (
            <li key={index} aria-hidden={index >= photos.length ? true : undefined}>
              <img
                src={STRIP("work", n)}
                alt={index >= photos.length ? "" : `${label} 철거 현장 사진`}
                width={560}
                height={420}
                loading="lazy"
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 철거전문업체 본문용 ---------- */

/* 업체에 물어볼 것: 체크 목록 + 대표 이미지 */
export function AskVisual({
  items,
  warn,
  image,
  imageAlt,
}: {
  items: string[];
  warn: [string, string];
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="cv-ask">
      <div className="cv-ask-list">
        <ol>
          {items.map((item, index) => (
            <li key={item}>
              <span className="cv-ask-num" aria-hidden="true">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
        <p className="cv-ask-warn">
          <strong>{warn[0]}</strong> {warn[1]}
        </p>
      </div>
      <img className="cv-ask-photo" src={image} alt={imageAlt} width={1080} height={1080} loading="lazy" />
    </div>
  );
}

/* 사진이 붙은 카드 */
export function PhotoCards({ items }: { items: { icon: LucideIcon; title: string; body: string; photo: string }[] }) {
  return (
    <div className="cv-photo-cards">
      {items.map(({ icon: IconComponent, title, body, photo }) => (
        <article key={title}>
          <img src={photo} alt={`${title} 관련 실제 철거 현장`} width={560} height={420} loading="lazy" />
          <div>
            <p className="cv-photo-card-title">
              <IconComponent size={20} aria-hidden="true" />
              {title}
            </p>
            <p className="cv-photo-card-body">{body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/* 현장답사부터 마무리까지: 번호가 이어지는 가로 흐름 */
export function ProcessTimeline({ items }: { items: { icon: LucideIcon; title: string; body: string; photo: string }[] }) {
  return (
    <ol className="cv-timeline">
      {items.map(({ icon: IconComponent, title, body, photo }, index) => (
        <li key={title}>
          <div className="cv-timeline-head">
            <span className="cv-timeline-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="cv-timeline-line" aria-hidden="true" />
          </div>
          <img src={photo} alt={`${title} 단계 실제 현장`} width={240} height={240} loading="lazy" />
          <p className="cv-timeline-title">
            <IconComponent size={18} aria-hidden="true" />
            {title}
          </p>
          <p className="cv-timeline-body">{body}</p>
        </li>
      ))}
    </ol>
  );
}

/* 진행 가능한 공간: 아이콘 격자 */
export function SpaceGrid({ items }: { items: { icon: LucideIcon; name: string; note: string }[] }) {
  return (
    <ul className="cv-space-grid">
      {items.map(({ icon: IconComponent, name, note }) => (
        <li key={name}>
          <span className="cv-space-icon" aria-hidden="true">
            <IconComponent size={26} />
          </span>
          <strong>{name}</strong>
          <small>{note}</small>
        </li>
      ))}
    </ul>
  );
}
