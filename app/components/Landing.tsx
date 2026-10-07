import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, CircleAlert, MessageCircle, TrendingUp, X } from "lucide-react";
import { Breadcrumb, type Crumb } from "@/app/components/Breadcrumb";

/*
 * 랜딩형 가이드 페이지(lp-) 공통 섹션.
 * 문장은 짧게, 섹션마다 h2 하나만 두고 h3 는 쓰지 않는다. 스타일은 globals.css 의 lp- 규칙.
 */

export const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";

const NAV_LINKS = [
  { label: "철거비용", href: "/guide/철거-비용/" },
  { label: "철거전문업체", href: "/guide/철거전문업체/" },
  { label: "원상복구", href: "/guide/원상복구-철거/" },
  { label: "폐업 지원금", href: "/guide/폐업-철거지원금/" },
];

/* 모든 랜딩 페이지 상단 고정 메뉴. 히어로 위에 겹쳐 놓는다(theme.css 의 site-nav). */
export function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="site-brand" href="/">
        <span aria-hidden="true">철</span>철거온
      </Link>
      <nav aria-label="주요 안내">
        {NAV_LINKS.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="site-nav-cta" href={NAVER_FORM_URL}>
        무료견적
      </a>
    </header>
  );
}

type Icon = ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export function LandingTitle({ children }: { children: ReactNode }) {
  return <h2 className="lp-title">{children}</h2>;
}

export function LandingNote({ icon: IconComponent, children }: { icon?: Icon; children: ReactNode }) {
  return (
    <p className="lp-note">
      {IconComponent && <IconComponent size={16} aria-hidden="true" />}
      {children}
    </p>
  );
}

export function LandingHero({
  crumbs,
  kicker,
  title,
  lead,
  checks,
  secondary,
  image = "/images/cheolgeoon/hero/main-hero.webp",
}: {
  crumbs?: Crumb[];
  kicker: string;
  title: ReactNode;
  lead: string;
  checks: string[];
  secondary: { label: string; href: string };
  image?: string;
}) {
  return (
    <>
    <SiteNav />
    <section className="lp-hero">
      <img className="lp-hero-bg" src={image} alt="" width={1920} height={1080} fetchPriority="high" />
      <div className="lp-hero-inner">
        {crumbs && (
          <div className="lp-topbar">
            <Breadcrumb items={crumbs} />
          </div>
        )}
        <p className="lp-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p className="lp-lead">{lead}</p>
        <ul className="lp-checks">
          {checks.map((check) => (
            <li key={check}>
              <Check size={16} aria-hidden="true" />
              {check}
            </li>
          ))}
        </ul>
        <div className="lp-actions">
          <a href={NAVER_FORM_URL} className="lp-btn lp-btn-primary">
            <MessageCircle size={20} aria-hidden="true" />
            무료견적 받기
          </a>
          <a href={secondary.href} className="lp-btn lp-btn-ghost">
            {secondary.label}
          </a>
        </div>
      </div>
    </section>
    </>
  );
}

export type PriceRow = { name: string; perPyeong: string; example: string };
export type Source = { label: string; href: string };

export function LandingPrice({
  rows,
  ups,
  sources,
  caption,
  headers = ["작업", "참고 범위", "예시"],
  sideTitle = "이런 경우 금액이 올라갑니다",
  ctaLabel = "우리 현장은 얼마일까?",
}: {
  rows: PriceRow[];
  ups: string[];
  sources: Source[];
  caption: string;
  headers?: [string, string, string];
  sideTitle?: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <div className="lp-price">
        <table className="lp-price-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ name, perPyeong, example }) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>
                  <strong>{perPyeong}</strong>
                </td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lp-price-side">
          <p className="lp-price-up-label">
            <TrendingUp size={18} aria-hidden="true" />
            {sideTitle}
          </p>
          <ul>
            {ups.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a href={NAVER_FORM_URL} className="lp-btn lp-btn-primary">
            {ctaLabel}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="lp-price-source">
        {caption} 출처:{" "}
        {sources.map(({ label, href }, index) => (
          <span key={href}>
            {index > 0 && ", "}
            <a href={href} target="_blank" rel="noopener nofollow">
              {label}
            </a>
          </span>
        ))}
      </p>
    </>
  );
}

export function LandingCards({
  items,
  linkAll = false,
}: {
  items: { icon: Icon; title: string; body: string; href?: string }[];
  linkAll?: boolean;
}) {
  return (
    <div className="lp-situations">
      {items.map(({ icon: IconComponent, title, body, href }) => {
        const target = href ?? (linkAll ? NAVER_FORM_URL : undefined);
        const content = (
          <>
            <IconComponent size={24} aria-hidden="true" />
            <strong>{title}</strong>
            <span>{body}</span>
            {target && <ArrowRight className="lp-situation-arrow" size={18} aria-hidden="true" />}
          </>
        );
        if (href) {
          return (
            <Link key={title} href={href}>
              {content}
            </Link>
          );
        }
        return target ? (
          <a key={title} href={target}>
            {content}
          </a>
        ) : (
          <div key={title}>{content}</div>
        );
      })}
    </div>
  );
}

export function LandingTiles({ items }: { items: { icon: Icon; name: string; note: string }[] }) {
  return (
    <div className="lp-cost-items">
      {items.map(({ icon: IconComponent, name, note }) => (
        <div key={name}>
          <IconComponent size={22} aria-hidden="true" />
          <strong>{name}</strong>
          <span>{note}</span>
        </div>
      ))}
    </div>
  );
}

export function LandingFactors({ items }: { items: { icon: Icon; title: string; body: string }[] }) {
  return (
    <ol className="lp-factors">
      {items.map(({ icon: IconComponent, title, body }, index) => (
        <li key={title}>
          <span className="lp-factor-num">{String(index + 1).padStart(2, "0")}</span>
          <IconComponent size={26} aria-hidden="true" />
          <strong>{title}</strong>
          <span>{body}</span>
        </li>
      ))}
    </ol>
  );
}

/* 공간별 대표 사진. 실제 현장 사진(raw-authenticated)에서 만든 이미지만 쓴다. */
export const SPACE_PHOTOS: [string, string, string][] = [
  ["상가", "/images/cheolgeoon/sections/before-after.webp", "원상복구 기준서부터 확인"],
  ["사무실", "/images/cheolgeoon/sections/office-demolition.webp", "파티션·OA 바닥·배선 정리"],
  ["식당·카페", "/images/cheolgeoon/sections/final-inspection.webp", "주방 설비·후드·덕트 철거"],
  ["학원", "/images/cheolgeoon/sections/academy-demolition.webp", "칸막이·방음재·집기 반출"],
];

export function LandingSpaces({ items = SPACE_PHOTOS }: { items?: [string, string, string][] }) {
  return (
    <div className="lp-spaces">
      {items.map(([name, src, note]) => (
        <figure key={name}>
          <img src={src} alt={`${name} 철거 현장 사진`} width={1200} height={800} loading="lazy" />
          <figcaption>
            <strong>{name}</strong>
            <span>{note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function LandingSplit({
  yes,
  no,
  tip,
}: {
  yes: { label: string; items: string[] };
  no: { label: string; items: string[] };
  tip?: string;
}) {
  return (
    <div className="lp-scope">
      <div className="lp-scope-yes">
        <p className="lp-scope-label">
          <Check size={18} aria-hidden="true" />
          {yes.label}
        </p>
        <ul>
          {yes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="lp-scope-no">
        <p className="lp-scope-label">
          <X size={18} aria-hidden="true" />
          {no.label}
        </p>
        <ul>
          {no.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {tip && (
          <p className="lp-scope-tip">
            <CircleAlert size={16} aria-hidden="true" />
            {tip}
          </p>
        )}
      </div>
    </div>
  );
}

/* 철거온이 맡는 범위. 여러 가이드에서 같은 기준을 쓴다. */
export const SERVICE_SCOPE = {
  yes: {
    label: "진행 가능",
    items: [
      "상가·사무실 내부 전체 철거",
      "식당·카페 주방 설비 철거",
      "임대 종료 원상복구 철거·마감 복구",
      "철거하며 나온 폐기물 정리·반출",
      "간판·집기 철거 (전체 철거에 포함 시)",
      "주방 집기 등 집기 매입 (철거와 함께)",
    ],
  },
  no: {
    label: "진행이 어려운 의뢰",
    items: [
      "부분철거만 단독으로 맡기는 경우",
      "폐기물 처리만 따로 맡기는 경우",
      "집기 매입만 따로 원하는 경우",
      "기둥·내력벽 등 건물 구조체 해체",
    ],
  },
  tip: "전체 철거에 포함되면 부분철거·폐기물 정리도 함께 진행합니다.",
};

export function LandingChecklist({ items }: { items: string[] }) {
  return (
    <ul className="lp-checklist">
      {items.map((item, index) => (
        <li key={item}>
          <span>{index + 1}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const DEFAULT_STEPS: [string, string][] = [
  ["사진·주소 보내기", "평수를 몰라도 괜찮습니다"],
  ["1차 범위 안내", "금액이 달라지는 항목부터"],
  ["방문 견적·일정", "필요한 현장만 방문합니다"],
];

export function LandingSteps({
  steps = DEFAULT_STEPS,
  ctaTitle = "사진 2~3장이면 충분합니다",
  ctaBody = "바닥·천장·벽이 보이게 찍어주세요",
}: {
  steps?: [string, string][];
  ctaTitle?: string;
  ctaBody?: string;
}) {
  return (
    <>
      <ol className="lp-steps">
        {steps.map(([title, body], index) => (
          <li key={title}>
            <span className="lp-step-num">{index + 1}</span>
            <strong>{title}</strong>
            <span>{body}</span>
          </li>
        ))}
      </ol>
      <div className="lp-cta-band">
        <div>
          <Camera size={28} aria-hidden="true" />
          <p>
            <strong>{ctaTitle}</strong>
            <span>{ctaBody}</span>
          </p>
        </div>
        <a href={NAVER_FORM_URL} className="lp-btn lp-btn-primary">
          무료견적 받기
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

export function LandingBanner({
  icon: IconComponent,
  title,
  body,
  action,
}: {
  icon: Icon;
  title: string;
  body: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="lp-support">
      <IconComponent size={34} aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <a href={action.href} className="lp-btn lp-btn-dark">
        {action.label}
      </a>
    </div>
  );
}

export function LandingFaq({ items }: { items: [string, string][] }) {
  return (
    <div className="lp-faq">
      {items.map(([question, answer], index) => (
        <details key={question} open={index === 0}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function LandingChips({ links, soft = false }: { links: { label: string; href: string }[]; soft?: boolean }) {
  return (
    <div className={soft ? "lp-chips lp-chips-soft" : "lp-chips"}>
      {links.map(({ label, href }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export function LandingFinal({
  lead = "철거, 어디서부터 할지 막막하다면",
  title = "현장 상황만 먼저 남겨주세요",
  showNote = true,
  note = "견적 상담은 무료입니다 · 도서산간은 출장비가 생길 수 있습니다",
}) {
  return (
    <section className="lp-final">
      <p>
        {lead}
        <strong>{title}</strong>
      </p>
      <a href={NAVER_FORM_URL} className="lp-btn lp-btn-primary">
        <MessageCircle size={20} aria-hidden="true" />
        무료견적 받기
      </a>
      {showNote && <span>{note}</span>}
    </section>
  );
}

