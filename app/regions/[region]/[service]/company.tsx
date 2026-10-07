import type { Metadata } from "next";
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  Factory,
  FileText,
  GraduationCap,
  Headphones,
  MicVocal,
  Recycle,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Store,
  UtensilsCrossed,
  Warehouse,
  Wrench,
} from "lucide-react";
import {
  LandingCards,
  LandingChecklist,
  LandingChips,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingSteps,
  LandingTiles,
  LandingTitle,
} from "@/app/components/Landing";
import {
  C_ASK_SLOTS,
  C_ASK_TITLE,
  C_FAQ_AS,
  C_FAQ_ASBESTOS,
  C_FAQ_BUY,
  C_FAQ_NEAR,
  C_FEATURE_BODY,
  C_FEATURE_TITLE,
  C_FIELD_SLOTS,
  C_FIELD_TITLE,
  C_FINAL,
  C_FINAL_NOTE,
  C_RECORD_LABELS,
  C_RECORD_NOTE,
  C_STEP_CTA,
  C_HERO_CHECKS,
  C_HERO_LEAD,
  C_HERO_LEAD_PLAIN,
  C_HERO_SECONDARY,
  C_HERO_TITLE,
  C_AREAS_LABEL,
  C_FACTS_LABEL,
  C_LOCAL_LABEL,
  C_LOCAL_TITLE,
  C_NEARBY_TITLE,
  C_PROMISE_SETS,
  C_PROMISE_TITLE,
  C_RECORD_TITLE,
  C_SPACES,
  C_SPACE_TITLE,
  COMPANY_KEYWORD,
  COMPANY_SLUG,
  companyImagePath,
} from "@/app/lib/company-copy";
import companySalts from "@/data/company-variant-salts.json";
import { STEP_SETS, pickFrom, pickOffset, pickSlots, rotate } from "@/app/lib/region-copy";
import {
  NOINDEX_ROBOTS,
  getRegionNotes,
  getSiblingRegions,
  getSidoOfRegion,
  isIndexableRegionTopic,
  regionTopicPath,
  topics,
  type Region,
} from "@/app/lib/region-pages";

/*
 * 시군구 철거전문업체 페이지(/regions/{지역}/철거전문업체/).
 * 철거비용 페이지가 금액을 다룬다면 이 페이지는 '누구에게 맡길지'를 다룬다:
 * 약속 · 실적 · 업체에 물어볼 것 · 현장 절차 · 진행 가능한 공간, 그리고 그 지역의 폐기물·지원 창구.
 */

const SITE_URL = "https://cheolgeoon.netlify.app";

export function companyPath(region: Region) {
  return `/regions/${region.slug}/${COMPANY_SLUG}/`;
}

/* 시공 누적 실적(2026-10 확인, cheolgeoon-operator-facts). */
const RECORDS = [
  { value: "7,690건", label: "폐업·철거 누적" },
  { value: "3,685건", label: "정부지원 철거 누적" },
  { value: "5,560건", label: "지원금 상담 누적" },
  { value: "2,790건", label: "학원·카페·식당" },
];

const SPACE_ICONS = [Store, Building2, UtensilsCrossed, GraduationCap, Dumbbell, Stethoscope, Scissors, MicVocal, Factory, Warehouse];
const PROMISE_ICONS = [CalendarCheck, Wrench, Headphones];
const FIELD_ICONS = [ClipboardList, FileText, ShieldCheck, Recycle];

/* 같은 시도 지역끼리 표현이 겹치지 않게 지역마다 배정한 값(scripts/tune-company-salts.mjs 가 계산).
 * 튜닝 스크립트는 globalThis.__COMPANY_SALTS__ 로 후보 값을 넣어 본문을 비교한다. */
function variant(region: Region) {
  const override = (globalThis as { __COMPANY_SALTS__?: Record<string, number> }).__COMPANY_SALTS__;
  const salt = override?.[region.slug] ?? (companySalts.salts as Record<string, number>)[region.slug] ?? 0;
  const key = `${region.slug}#company#${salt}`;
  return {
    pick: <T,>(section: string, options: readonly T[]) => pickFrom(key, section, options),
    order: (section: string, length: number) => pickOffset(key, section, length),
    slots: <T,>(section: string, sets: readonly (readonly T[])[]) => pickSlots(key, section, sets),
  };
}

export function companyMetadata(region: Region): Metadata {
  const title = `${region.name} 철거전문업체 | 당일 방문 견적·1년 무상 A/S | 철거온`;
  const description = `${region.name} 철거전문업체를 찾는다면 견적 받을 때 물어볼 5가지부터 확인하세요. 상가·사무실·식당·헬스장·공장 철거와 원상복구, 집기 매입까지 당일 방문해 견적을 드립니다.`;
  const canonical = companyPath(region);
  const image = `${SITE_URL}${companyImagePath(region.slug)}`;
  return {
    title,
    description,
    ...(isIndexableRegionTopic(region.slug) ? {} : { robots: NOINDEX_ROBOTS }),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [{ url: image, width: 1080, height: 1080, alt: `${region.name} 철거전문업체 철거 완료 현장` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function RegionCompanyPage({ region }: { region: Region }) {
  const { pick, order, slots } = variant(region);
  const name = region.name;
  const sido = getSidoOfRegion(region);
  const siblings = getSiblingRegions(region, 8);
  const profile = getRegionNotes(region.slug)?.profile;
  const areaNames = (profile?.areaNotes?.map((area) => area.name) ?? profile?.areas ?? []).slice(0, 3);
  const local = profile?.local ?? [];
  const areaNotes = profile?.areaNotes ?? [];
  const facts = profile?.facts ?? [];
  const costTopic = topics[0];

  const [heroLine1, heroLine2] = pick("hero", C_HERO_TITLE)(name);
  const lead = areaNames.length >= 2 ? pick("lead", C_HERO_LEAD)(name, areaNames.join("·")) : pick("lead-plain", C_HERO_LEAD_PLAIN)(name);
  const [featureBefore, featureEm, featureAfter] = pick("feature-title", C_FEATURE_TITLE);
  const [promiseBefore, promiseEm, promiseAfter] = pick("promise-title", C_PROMISE_TITLE);
  const [recordBefore, recordEm, recordAfter] = pick("record-title", C_RECORD_TITLE);
  const [askBefore, askEm, askAfter] = pick("ask-title", C_ASK_TITLE)(name);
  const [fieldBefore, fieldEm, fieldAfter] = pick("field-title", C_FIELD_TITLE);
  const [spaceBefore, spaceEm, spaceAfter] = pick("space-title", C_SPACE_TITLE)(name);
  const [finalLead, finalTitle] = pick("final", C_FINAL)(name);
  const stepCta = pick("step-cta", C_STEP_CTA);

  const promises = pick("promises", C_PROMISE_SETS).map(([title, body], index) => ({ icon: PROMISE_ICONS[index], title, body }));
  const asks = rotate(
    C_ASK_SLOTS.map((options, index) => pick(`ask:${index}`, options)),
    order("ask", C_ASK_SLOTS.length),
  );
  const field = slots("field", C_FIELD_SLOTS).map(([title, body], index) => ({ icon: FIELD_ICONS[index], title, body }));
  const spaces = rotate(
    C_SPACES.map(([spaceName, notes], index) => ({ icon: SPACE_ICONS[index], name: spaceName, note: pick(`space-note:${index}`, notes) })),
    order("spaces", C_SPACES.length),
  );
  const faq: [string, string][] = rotate(
    [pick("faq-near", C_FAQ_NEAR)(name), pick("faq-as", C_FAQ_AS), pick("faq-buy", C_FAQ_BUY), pick("faq-asbestos", C_FAQ_ASBESTOS)],
    order("faq", 4),
  );
  const sources = [...(profile?.sources ?? []), ...local].filter(
    (item, index, list) => list.findIndex((other) => other.href === item.href) === index,
  );

  return (
    <main className="lp">
      <LandingHero
        crumbs={[
          { name: "홈", href: "/" },
          { name: COMPANY_KEYWORD, href: `/guide/${COMPANY_SLUG}/` },
          { name: region.sigungu },
        ]}
        kicker={`${region.fullName} 철거전문업체`}
        title={
          <>
            {heroLine1}
            <br />
            {heroLine2}
          </>
        }
        lead={lead}
        checks={pick("checks", C_HERO_CHECKS)}
        secondary={{ label: pick("hero-secondary", C_HERO_SECONDARY), href: "#ask" }}
        image={`/images/cheolgeoon/raw-authenticated/demolition-work-034.webp`}
      />

      <section className="lp-section">
        <div className="lp-feature">
          <img src={companyImagePath(region.slug)} alt={`${name} 철거전문업체 철거 완료 현장 사진`} width={1080} height={1080} loading="lazy" />
          <div>
            <LandingTitle>
              {featureBefore}
              <em>{featureEm}</em>
              {featureAfter}
            </LandingTitle>
            <p>{pick("feature-body", C_FEATURE_BODY)(name)}</p>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <LandingTitle>
          {promiseBefore}
          <em>{promiseEm}</em>
          {promiseAfter}
        </LandingTitle>
        <LandingCards items={promises} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {recordBefore}
          <em>{recordEm}</em>
          {recordAfter}
        </LandingTitle>
        <dl className="lp-records">
          {RECORDS.map((item, index) => (
            <div key={item.label}>
              <dt>{pick(`record-label:${index}`, C_RECORD_LABELS[index])}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="lp-note">{pick("record-note", C_RECORD_NOTE)}</p>
      </section>

      <section className="lp-section" id="ask">
        <LandingTitle>
          {askBefore}
          <em>{askEm}</em>
          {askAfter}
        </LandingTitle>
        <LandingChecklist items={asks} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {fieldBefore}
          <em>{fieldEm}</em>
          {fieldAfter}
        </LandingTitle>
        <LandingCards items={field} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {spaceBefore}
          <em>{spaceEm}</em>
          {spaceAfter}
        </LandingTitle>
        <LandingTiles items={spaces} />
      </section>

      <section className="lp-section">
        <LandingTitle>3단계면 끝납니다</LandingTitle>
        <LandingSteps steps={slots("steps", STEP_SETS)} ctaTitle={stepCta[0]} ctaBody={stepCta[1]} />
      </section>

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={faq} />
      </section>


      <section className="lp-section lp-regions">
        <LandingTitle>{pick("nearby-title", C_NEARBY_TITLE)(sido ? sido.short : "주변")}</LandingTitle>
        <LandingChips links={siblings.map((sibling) => ({ label: sibling.name, href: companyPath(sibling) }))} />
        <p className="lp-chips-label">함께 보면 좋은 안내</p>
        <LandingChips
          soft
          links={[
            ...(costTopic ? [{ label: `${name} 철거비용`, href: regionTopicPath(region, costTopic) }] : []),
            { label: "철거전문업체 고르는 기준", href: `/guide/${COMPANY_SLUG}/` },
            { label: "폐업 철거지원금", href: "/guide/폐업-철거지원금/" },
            { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
          ]}
        />
      </section>

      {/* 지역 고유 정보(유사도 보정용)는 사용자 요청대로 페이지 최하단, 마지막 상담 바로 위에 모은다. */}
      {(areaNotes.length > 0 || facts.length > 0 || local.length > 0) && (
        <section className="lp-section">
          <div className="lp-answer lp-region-facts">
            <div>
              <h2>{pick("local-title", C_LOCAL_TITLE)(name)}</h2>
              {areaNotes.length > 0 && (
                <>
                  <p className="lp-group-label">{pick("areas-label", C_AREAS_LABEL)(name)}</p>
                  <ul className="lp-area-notes">
                    {areaNotes.map((area) => (
                      <li key={area.name}>
                        <strong>{area.name}</strong>
                        <span>{area.note}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {local.length > 0 && (
                <>
                  <p className="lp-group-label">{pick("local-label", C_LOCAL_LABEL)(name)}</p>
                  <ul className="lp-fact-list">
                    {local.map((item) => (
                      <li key={item.text}>{item.text}</li>
                    ))}
                  </ul>
                </>
              )}
              {facts.length > 0 && (
                <>
                  <p className="lp-group-label">{pick("facts-label", C_FACTS_LABEL)(name)}</p>
                  <ul className="lp-fact-list">
                    {facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </>
              )}
              {sources.length > 0 && (
                <p className="lp-price-source">
                  출처:{" "}
                  {sources.map(({ label, href }, index) => (
                    <span key={href}>
                      {index > 0 && ", "}
                      <a href={href} target="_blank" rel="noopener nofollow">
                        {label}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <LandingFinal lead={finalLead} title={finalTitle} note={pick("final-note", C_FINAL_NOTE)} />
    </main>
  );
}
