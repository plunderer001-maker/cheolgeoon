import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import { LandingChips, LandingFinal, LandingHero, LandingNote, LandingTitle } from "@/app/components/Landing";
import { PRIORITY_REGION_SLUGS, regionMap, regions, regionTopicPath, sidoHubPath, sidos, topics } from "@/app/lib/region-pages";

/* 전국 지역 목록. 링크는 검색 노출 중인 시군구 철거비용 페이지로 바로 보낸다. */

const TITLE = "전국 지역별 철거비용 | 시도·시군구 선택 | 철거온";
const DESCRIPTION =
  "전국 16개 시도, 271개 시군구의 철거비용 안내를 모았습니다. 현장이 있는 지역을 고르면 지역 상권과 조건에 맞는 철거비용 기준과 상담 순서를 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/regions/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/regions/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

const priorityRegions = [...PRIORITY_REGION_SLUGS].flatMap((slug) => {
  const region = regionMap.get(slug);
  return region ? [region] : [];
});

export default function RegionsIndexPage() {
  const topic = topics[0];

  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "지역별 안내" }]}
        kicker="전국 지역별 철거 무료견적"
        title={
          <>
            현장이 있는 지역을
            <br />
            먼저 골라주세요
          </>
        }
        lead={`전국 ${sidos.length}개 시도, ${regions.length}개 시군구의 철거비용을 지역 조건과 함께 안내합니다.`}
        checks={["견적 상담 무료", "전국 방문 견적", "지역 상권별 안내"]}
        secondary={{ label: "시도 바로 고르기", href: "#sido" }}
      />

      {topic && (
        <section className="lp-section">
          <LandingTitle>
            상담이 <em>많은</em> 지역
          </LandingTitle>
          <LandingChips links={priorityRegions.map((region) => ({ label: region.name, href: regionTopicPath(region, topic) }))} />
        </section>
      )}

      {topic && (
        <section className="lp-section" id="sido">
          <LandingTitle>
            시도별 <em>시군구</em> 목록
          </LandingTitle>
          <div className="lp-sido-list">
            {sidos.map((sido) => (
              <div key={sido.slug} className="lp-sido-block">
                <p className="lp-sido-head">
                  <a href={sidoHubPath(topic, sido)}>
                    <MapPinned size={18} aria-hidden="true" />
                    {sido.name}
                  </a>
                  <span>{sido.regions.length}곳</span>
                </p>
                <LandingChips
                  soft
                  links={sido.regions.map((region) => ({ label: region.sigungu, href: regionTopicPath(region, topic) }))}
                />
              </div>
            ))}
          </div>
          <LandingNote>지역마다 건물 규정, 차량 진입, 폐기물 반출 거리가 달라 같은 작업도 견적 항목이 바뀝니다.</LandingNote>
        </section>
      )}

      <LandingFinal lead="지역 목록에 없는 곳도 괜찮습니다" title="주소와 사진만 먼저 보내주세요" />
    </main>
  );
}
