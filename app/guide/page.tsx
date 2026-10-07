import type { Metadata } from "next";
import { Building2, Calculator, DoorOpen, FileText, HandCoins, Store, UtensilsCrossed } from "lucide-react";
import { LandingCards, LandingChips, LandingFinal, LandingHero, LandingTitle } from "@/app/components/Landing";
import { guidePath, guides } from "@/app/lib/guides";
import { PRIORITY_REGION_SLUGS, regionMap, regionTopicPath, sidoHubPath, sidos, topicHubPath, topics } from "@/app/lib/region-pages";

/* 철거 가이드 목록. 주제 허브와 전국 가이드를 한곳에 모은다. */

const TITLE = "철거 가이드 모음 | 비용·원상복구·지원금·현장별 안내 | 철거온";
const DESCRIPTION =
  "철거 비용, 원상복구, 폐업 철거지원금부터 상가·사무실·식당 철거까지 상황별 안내를 모았습니다. 필요한 가이드를 고르고 지역별 철거비용도 확인하세요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guide/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/guide/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "https://cheolgeoon.netlify.app/images/cheolgeoon/og-square/guide.webp", width: 1080, height: 1080, alt: "철거 가이드 모음" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://cheolgeoon.netlify.app/images/cheolgeoon/og-square/guide.webp"],
  },
};

/* 가이드별 아이콘과 한 줄 설명. 새 가이드를 추가하면 여기에도 넣는다(없으면 기본값). */
const GUIDE_META: Record<string, { icon: typeof Store; body: string; group: "money" | "site" }> = {
  "철거-비용": { icon: Calculator, body: "평당 참고 범위와 금액이 달라지는 이유", group: "money" },
  "원상복구-철거": { icon: FileText, body: "어디까지 철거하고 복구해야 하는지", group: "money" },
  "폐업-철거지원금": { icon: HandCoins, body: "점포철거비 최대 600만원 조건과 서류", group: "money" },
  "상가-철거": { icon: Store, body: "업종별 확인 항목과 업체 비교 기준", group: "site" },
  "폐업-철거": { icon: DoorOpen, body: "지원금부터 정산 서류까지 폐업 순서", group: "site" },
  "사무실-철거": { icon: Building2, body: "파티션·배선 철거와 퇴거일 맞춤 일정", group: "site" },
  "식당-철거": { icon: UtensilsCrossed, body: "후드·덕트 등 주방 설비 철거", group: "site" },
};

const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
  .map((slug) => regionMap.get(slug))
  .filter((region): region is NonNullable<typeof region> => Boolean(region));

export default function GuideIndexPage() {
  const all = [
    ...topics.map((topic) => ({ slug: topic.slug, keyword: topic.keyword, href: topicHubPath(topic) })),
    ...guides.map((guide) => ({ slug: guide.slug, keyword: guide.keyword, href: guidePath(guide) })),
  ];
  const cards = (group: "money" | "site") =>
    all
      .filter((item) => (GUIDE_META[item.slug]?.group ?? "site") === group)
      .map((item) => ({
        icon: GUIDE_META[item.slug]?.icon ?? FileText,
        title: item.keyword,
        body: GUIDE_META[item.slug]?.body ?? `${item.keyword} 안내`,
        href: item.href,
      }));
  const topic = topics[0];

  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 상담 주제" }]}
        kicker="철거 가이드 모음"
        title={
          <>
            무엇부터 알아볼지,
            <br />
            상황에 맞는 안내를 고르세요
          </>
        }
        lead="비용·원상복구·지원금부터 상가·사무실·식당 철거까지."
        checks={["견적 상담 무료", "출처 있는 참고 금액", "지원금 정산 서류 발급"]}
        secondary={{ label: "현장별 안내 보기", href: "#site" }}
      />

      <section className="lp-section">
        <LandingTitle>
          비용·<em>원상복구</em>·지원금
        </LandingTitle>
        <LandingCards items={cards("money")} />
      </section>

      <section className="lp-section" id="site">
        <LandingTitle>
          <em>현장별</em> 철거 안내
        </LandingTitle>
        <LandingCards items={cards("site")} />
      </section>

      {topic && (
        <section className="lp-section lp-regions">
          <LandingTitle>지역별 철거비용</LandingTitle>
          <LandingChips links={sidos.map((sido) => ({ label: sido.short, href: sidoHubPath(topic, sido) }))} />
          <p className="lp-chips-label">상담이 많은 지역</p>
          <LandingChips soft links={priorityRegions.map((region) => ({ label: region.name, href: regionTopicPath(region, topic) }))} />
          <p className="lp-chips-label">전체 지역</p>
          <LandingChips links={[{ label: "전국 시군구 전체 보기", href: "/regions/" }]} />
        </section>
      )}

      <LandingFinal />
    </main>
  );
}
