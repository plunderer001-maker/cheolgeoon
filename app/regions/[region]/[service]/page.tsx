import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, Clock, DoorOpen, FileText, HandCoins, KeyRound, MapPinned, Route, Truck } from "lucide-react";
import {
  LandingBanner,
  LandingCards,
  LandingChips,
  LandingFactors,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingPrice,
  LandingSpaces,
  LandingSplit,
  LandingSteps,
  LandingTitle,
} from "@/app/components/Landing";
import { josa } from "@/app/lib/josa";
import { MARKET_PRICE_ROWS, MARKET_PRICE_SOURCES } from "@/app/lib/market-prices";
import {
  BANNER_ACTION,
  BANNER_BODY,
  BANNER_TITLE,
  CONDITION_TITLE,
  FINAL,
  HERO_CHECKS,
  HERO_LEAD,
  HERO_TITLE,
  PRICE_CTA,
  PRICE_TITLE,
  SCOPE_NO_SLOTS,
  SCOPE_TIP,
  SCOPE_YES_SLOTS,
  SCOPE_TITLE,
  SITUATIONS,
  SITUATION_TITLE,
  SPACE_SETS,
  SPACE_TITLE,
  STEPS_TITLE,
  STEP_CTA,
  STEP_SETS,
  AREA_FAQ_ANSWER,
  AREA_FAQ_QUESTION,
  FACTS_LABELS,
  FAQ_TITLE,
  NEARBY_TITLE,
  FINAL_NOTE,
  HERO_SECONDARY,
  MORE_LINKS_LABEL,
  MORE_LINK_SLOTS,
  PRICE_FAQ_ANSWER,
  PRICE_FAQ_QUESTION,
  PRICE_UP_SLOTS,
  PRICE_HEADERS,
  PRICE_ROW_SETS,
  PRICE_SIDE_TITLE,
  SUBSIDY_FAQ,
  PRICE_CAPTION,
  TYPE_CHECKS,
  TYPE_FAQS,
  pickFrom,
  pickOffset,
  pickSlots,
  rotate,
} from "@/app/lib/region-copy";
import {
  NOINDEX_ROBOTS,
  getRegion,
  getRegionNotes,
  getRegionTopicPage,
  getSiblingRegions,
  getSidoOfRegion,
  isIndexableRegionTopic,
  regionTopicPages,
  regionTopicPath,
  regions,
  sidoHubPath,
  topicHubPath,
  type Region,
  type RegionType,
} from "@/app/lib/region-pages";
import { REGION_TYPE_COPY } from "@/app/lib/topic-copy";
import variantSalts from "@/data/region-variant-salts.json";
import { COMPANY_SLUG } from "@/app/lib/company-copy";
import { RegionCompanyPage, companyMetadata, companyPath } from "./company";

/*
 * 시군구 철거비용 페이지.
 * 설득 흐름(비용 → 상황 → 조건 → 사진 → 범위 → 진행 → 지원금 → FAQ)은 모든 지역에 둔다.
 * 지역끼리 본문이 겹치지 않도록 문구는 region-copy 의 변형 세트와 순서를 지역마다 달리 쓰고,
 * 조사한 지역 정보(생활권·사실)는 FAQ 아래 "지역 참고 정보"에 모은다.
 */

type PageProps = {
  params: Promise<{ region: string; service: string }>;
};

const SITE_URL = "https://cheolgeoon.netlify.app";

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return [
    ...regionTopicPages.map((page) => ({ region: page.regionSlug, service: page.serviceSlug })),
    ...regions.map((region) => ({ region: region.slug, service: COMPANY_SLUG })),
  ];
}

/* 조사한 생활권이 없는 지역의 도입 문장. 행정 유형에 따라 달라진다. */
const LEAD_BY_TYPE: Record<RegionType, (name: string) => string> = {
  자치구: (name) => `${name}처럼 건물이 밀집한 곳은 관리사무소 작업 시간과 엘리베이터 조건이 금액을 먼저 바꿉니다.`,
  일반구: (name) => `${josa(name, "은/는")} 단지 상가와 구도심 상가에 따라 반출 규정과 진입로 조건이 달라집니다.`,
  시: (name) => `${josa(name, "은/는")} 시내 중심 상가와 외곽 현장의 차량 접근과 반출 회차가 달라집니다.`,
  군: (name) => `${name}처럼 읍·면 현장이 많은 곳은 이동 거리와 반출 회차가 금액에서 큰 비중을 차지합니다.`,
};

/* 행정 유형별 확인 항목 아이콘. REGION_TYPE_COPY.checks 순서와 짝을 이룬다. */
const CHECK_ICONS = [Clock, Truck, Route];

/* 상황 카드 아이콘. SITUATIONS 각 세트의 순서(폐업·원상복구·이전·새 매장)와 짝을 이룬다. */
const SITUATION_ICONS = [DoorOpen, FileText, CalendarCheck, KeyRound];

/* 건설폐기물 5톤 이상 배출 시 신고 관청. 일반구·행정시는 관할이 시청일 수 있어 함께 적는다. */
function wasteOffice(region: Region, type: RegionType) {
  if (region.sidoShort === "제주") return "제주특별자치도 관할 행정시";
  if (type === "일반구") return `${region.sigungu}청 또는 관할 시청`;
  return `${region.sigungu}청`;
}

function pageText(regionName: string, typeLabel: string) {
  return {
    title: `${regionName} 철거비용 | ${regionName} 철거업체 무료견적·원상복구 | 철거온`,
    description: `${regionName} 철거비용 참고 범위와 ${typeLabel} 현장에서 금액이 달라지는 조건을 정리했습니다. 상가·사무실 철거부터 원상복구, 지원금 정산 서류까지 사진만 보내면 무료견적을 안내합니다.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug, service } = await params;
  if (decodeURIComponent(service) === COMPANY_SLUG) {
    const companyRegion = getRegion(regionSlug);
    return companyRegion ? companyMetadata(companyRegion) : { title: "지역 철거 상담 | 철거온" };
  }
  const page = getRegionTopicPage(regionSlug, service);
  const region = page ? getRegion(page.regionSlug) : undefined;
  if (!page || !region) return { title: "지역 철거 상담 | 철거온" };

  const { title, description } = pageText(region.name, REGION_TYPE_COPY[page.regionType].label);
  const canonical = `/regions/${page.slug}/`;
  const imageUrl = `${SITE_URL}${page.service.image}`;

  return {
    title,
    description,
    ...(isIndexableRegionTopic(page.regionSlug) ? {} : { robots: NOINDEX_ROBOTS }),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "철거온",
      locale: "ko_KR",
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${region.name} 철거비용 안내` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

export default async function RegionTopicPage({ params }: PageProps) {
  const { region: regionSlug, service: serviceSlug } = await params;
  if (decodeURIComponent(serviceSlug) === COMPANY_SLUG) {
    const companyRegion = getRegion(regionSlug);
    if (!companyRegion) notFound();
    return <RegionCompanyPage region={companyRegion} />;
  }
  const page = getRegionTopicPage(regionSlug, serviceSlug);
  if (!page) notFound();

  const region = getRegion(page.regionSlug);
  if (!region) notFound();

  const topic = page.service;
  const type = page.regionType;
  const sido = getSidoOfRegion(region);
  const siblings = getSiblingRegions(region, 8);
  const profile = getRegionNotes(region.slug)?.profile;
  const areaNotes = profile?.areaNotes ?? [];
  const areaNames = areaNotes.length > 0 ? areaNotes.map((area) => area.name) : (profile?.areas ?? []);
  const name = region.name;

  /* 튜닝 스크립트가 배정값을 바꿔 보며 유사도를 잴 때만 쓰는 통로. 실제 빌드에서는 비어 있다. */
  const saltOverride = (globalThis as { __REGION_SALTS__?: Record<string, number> }).__REGION_SALTS__;
  const salt = saltOverride?.[region.slug] ?? (variantSalts.salts as Record<string, number>)[region.slug];
  const variantKey = salt ? `${region.slug}#${salt}` : region.slug;
  const pick = <T,>(section: string, options: readonly T[]) => pickFrom(variantKey, section, options);
  const order = (section: string, length: number) => pickOffset(variantKey, section, length);
  const [titleLine1, titleLine2] = pick("hero", HERO_TITLE)(name);
  const [priceBefore, priceEm, priceAfter] = pick("price", PRICE_TITLE)(name);
  const [situationBefore, situationEm, situationAfter] = pick("situation-title", SITUATION_TITLE);
  const [conditionBefore, conditionEm, conditionAfter] = pick("condition", CONDITION_TITLE)(name);
  const [scopeBefore, scopeEm, scopeAfter] = pick("scope-title", SCOPE_TITLE);
  const [stepCtaTitle, stepCtaBody] = pick("step-cta", STEP_CTA);
  const [finalLead, finalTitle] = pick("final", FINAL)(name);
  const labels = pick("facts-labels", FACTS_LABELS);
  const localInfo = profile?.local ?? [];
  const sources = [...(profile?.sources ?? []), ...localInfo].filter(
    (source, index, list) => list.findIndex((other) => other.href === source.href) === index,
  );
  const slots = <T,>(section: string, sets: readonly (readonly T[])[]) => pickSlots(variantKey, section, sets);
  const scopeYes = SCOPE_YES_SLOTS.map((options, index) => pick(`scope-yes:${index}`, options));
  const scopeNo = SCOPE_NO_SLOTS.map((options, index) => pick(`scope-no:${index}`, options));

  const situations = rotate(
    slots("situations", SITUATIONS).map((item, index) => ({ icon: SITUATION_ICONS[index], ...item })),
    order("situations", 4),
  );
  const checkSet = slots("conditions-copy", TYPE_CHECKS[type]);
  const conditions = rotate(
    checkSet.map(([title, body], index) => ({ icon: CHECK_ICONS[index % CHECK_ICONS.length], title, body })),
    order("conditions", checkSet.length),
  );
  const typeFaq = pick("type-faq", TYPE_FAQS[type]);

  /* 조사한 생활권으로 만드는 지역 질문. 상권 설명을 그대로 답에 쓴다. */
  const areaFaq: [string, string][] = areaNotes.slice(0, 6).map((area) => [
    pick(`area-faq-q:${area.name}`, AREA_FAQ_QUESTION)(area.name),
    pick(`area-faq:${area.name}`, AREA_FAQ_ANSWER)(area.note),
  ]);

  const faq: [string, string][] = [
    [
      pick("price-faq-q", PRICE_FAQ_QUESTION)(name),
      pick("price-faq", PRICE_FAQ_ANSWER)(name, checkSet[0][0], checkSet[1][0]),
    ],
    ...rotate<[string, string]>(
      [
        ...areaFaq,
        [typeFaq[0], typeFaq[1]],
        pick("subsidy-faq", SUBSIDY_FAQ),
      ],
      order("faq", areaFaq.length + 2),
    ),
  ];

  return (
    <main className="lp">
      <LandingHero
        crumbs={[
          { name: "홈", href: "/" },
          { name: topic.keyword, href: topicHubPath(topic) },
          ...(sido ? [{ name: sido.name, href: sidoHubPath(topic, sido) }] : []),
          { name: region.sigungu },
        ]}
        kicker={`${region.fullName} 철거 무료견적`}
        title={
          <>
            {titleLine1}
            <br />
            {titleLine2}
          </>
        }
        lead={areaNames.length >= 2 ? pick("lead", HERO_LEAD)(name, areaNames.slice(0, 3).join(", ")) : LEAD_BY_TYPE[type](name)}
        checks={slots("checks", HERO_CHECKS)}
        secondary={{ label: pick("hero-secondary", HERO_SECONDARY), href: "#price" }}
      />

      <section className="lp-section" id="price">
        <LandingTitle>
          {priceBefore}
          <em>{priceEm}</em>
          {priceAfter}
        </LandingTitle>
        <LandingPrice
          rows={rotate(slots("price-rows-copy", PRICE_ROW_SETS), order("price-rows", MARKET_PRICE_ROWS.length))}
          ups={rotate(PRICE_UP_SLOTS.map((options, index) => pick(`price-up:${index}`, options)), order("price-ups", PRICE_UP_SLOTS.length))}
          sources={MARKET_PRICE_SOURCES}
          ctaLabel={pick("price-cta", PRICE_CTA)}
          headers={pick("price-headers", PRICE_HEADERS)}
          sideTitle={pick("price-side", PRICE_SIDE_TITLE)}
          caption={pick("price-caption", PRICE_CAPTION)(name)}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {situationBefore}
          <em>{situationEm}</em>
          {situationAfter}
        </LandingTitle>
        <LandingCards items={situations} linkAll />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {conditionBefore}
          <em>{conditionEm}</em>
          {conditionAfter}
        </LandingTitle>
        <LandingFactors items={conditions} />
      </section>

      <section className="lp-section">
        <LandingTitle>{pick("space-title", SPACE_TITLE)}</LandingTitle>
        <LandingSpaces items={slots("spaces", SPACE_SETS)} />
      </section>

      <section className="lp-section">
        <LandingTitle>
          {scopeBefore}
          <em>{scopeEm}</em>
          {scopeAfter}
        </LandingTitle>
        <LandingSplit
          yes={{ label: "진행 가능", items: rotate(scopeYes, order("scope-yes", scopeYes.length)) }}
          no={{ label: "진행이 어려운 의뢰", items: rotate(scopeNo, order("scope-no", scopeNo.length)) }}
          tip={pick("scope-tip", SCOPE_TIP)}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>{pick("steps-title", STEPS_TITLE)}</LandingTitle>
        <LandingSteps steps={slots("steps", STEP_SETS)} ctaTitle={stepCtaTitle} ctaBody={stepCtaBody} />
      </section>

      <section className="lp-section">
        <LandingBanner
          icon={HandCoins}
          title={pick("banner-title", BANNER_TITLE)}
          body={pick("banner-body", BANNER_BODY)}
          action={{ label: pick("banner-action", BANNER_ACTION), href: "/guide/폐업-철거지원금/" }}
        />
      </section>

      <section className="lp-section">
        <LandingTitle>{pick("faq-title", FAQ_TITLE)(name)}</LandingTitle>
        <LandingFaq items={faq} />
      </section>

      <section className="lp-section lp-regions">
        <LandingTitle>{pick("nearby-title", NEARBY_TITLE)(sido ? sido.short : "주변")}</LandingTitle>
        <LandingChips links={siblings.map((sibling) => ({ label: sibling.name, href: regionTopicPath(sibling, topic) }))} />
        <p className="lp-chips-label">{pick("more-label", MORE_LINKS_LABEL)}</p>
        <LandingChips
          soft
          links={rotate(
            [
              { label: pick("more-link:0", MORE_LINK_SLOTS[0]), href: topicHubPath(topic) },
              { label: pick("more-link:1", MORE_LINK_SLOTS[1]), href: "/guide/원상복구-철거/" },
              { label: pick("more-link:2", MORE_LINK_SLOTS[2]), href: "/guide/폐업-철거지원금/" },
              { label: pick("more-link:3", MORE_LINK_SLOTS[3]), href: "/#criteria" },
              { label: `${name} 철거전문업체`, href: companyPath(region) },
            ],
            order("more-links", 4),
          )}
        />
      </section>

      {/* 지역 고유 정보(유사도 보정용)는 사용자 요청대로 최하단, 마지막 상담 바로 위에 둔다. */}
      <section className="lp-section">
        <div className="lp-answer lp-region-facts">
          <MapPinned size={28} aria-hidden="true" />
          <div>
            <h2>{labels.title(name)}</h2>
            <dl>
              <div>
                <dt>{labels.admin}</dt>
                <dd>{region.fullName}</dd>
              </div>
              <div>
                <dt>{labels.waste}</dt>
                <dd>{wasteOffice(region, type)}에 배출 신고</dd>
              </div>
            </dl>
            {areaNotes.length > 0 ? (
              <>
                <p className="lp-group-label">{labels.areas(name)}</p>
                <ul className="lp-area-notes">
                  {areaNotes.map((area) => (
                    <li key={area.name}>
                      <strong>{area.name}</strong>
                      <span>{area.note}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              areaNames.length > 0 && (
                <>
                  <p className="lp-group-label">{labels.areas(name)}</p>
                  <ul className="lp-area-tags">
                    {areaNames.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </>
              )
            )}
            {profile && profile.facts.length > 0 && (
              <>
                <p className="lp-group-label">{labels.facts(name)}</p>
                <ul className="lp-fact-list">
                  {profile.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </>
            )}
            {localInfo.length > 0 && (
              <>
                <p className="lp-group-label">{labels.local(name)}</p>
                <ul className="lp-fact-list">
                  {localInfo.map((item) => (
                    <li key={item.text}>{item.text}</li>
                  ))}
                </ul>
              </>
            )}
            {sources.length > 0 && (
              <p className="lp-price-source">
                {labels.source}:{" "}
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

      <LandingFinal lead={finalLead} title={finalTitle} note={pick("final-note", FINAL_NOTE)} />
    </main>
  );
}
