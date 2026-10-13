import {
  LandingChips,
  LandingFaq,
  LandingFinal,
  LandingHero,
  LandingTitle,
  RelatedGuides,
} from "@/app/components/Landing";
import { CompanyCore } from "@/app/components/CompanyCore";
import { PRIORITY_REGION_SLUGS, regionMap, sidos } from "@/app/lib/region-pages";

/* 철거전문업체: 철거전문업체, 철거업체 추천, 철거 잘하는 곳 검색 의도. 업체를 고르는 사람에게 '무엇이 다른지'를 보여준다. */

const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
  .map((slug) => regionMap.get(slug))
  .filter((region): region is NonNullable<typeof region> => Boolean(region));

export const COMPANY_IMAGE = "/images/cheolgeoon/og-square/철거전문업체.webp";

const FAQ: [string, string][] = [
  [
    "철거전문업체와 인테리어 업체 철거는 뭐가 다른가요?",
    "인테리어 업체는 새 공사가 중심이라 철거를 맡기는 경우가 많습니다. 철거전문업체는 비우는 일 자체가 일이라 범위 정리, 폐기물 반출, 원상복구까지 철거 기준으로 견적을 냅니다.",
  ],
  [
    "좋은 철거전문업체는 어떻게 고르나요?",
    "현장을 보고 범위를 나눠 주는지, 견적서에 폐기물 처리비가 들어 있는지, 철거 뒤 마감 복구와 정산 서류까지 되는지를 보세요.",
  ],
  ["공장이나 창고도 맡기나요?", "네. 철거가 필요한 공간이면 업종을 가리지 않습니다. 다만 기둥·내력벽 같은 구조체 해체는 하지 않습니다."],
  [
    "석면 자재가 있는 건물이에요.",
    "전체 철거와 함께라면 진행합니다. 석면이 의심되면 철거 전에 먼저 알려주세요. 석면 해체만 따로 맡기는 의뢰는 어렵습니다.",
  ],
  ["지방도 오나요?", "전국 현장을 상담합니다. 도서산간은 출장비가 생길 수 있어 견적 때 미리 안내합니다."],
];

export function CompanyGuide({ keyword }: { keyword: string }) {
  return (
    <main className="lp">
      <LandingHero
        crumbs={[{ name: "홈", href: "/" }, { name: "철거 가이드", href: "/guide/" }, { name: keyword }]}
        kicker="철거전문업체 무료견적"
        title={
          <>
            철거전문업체,
            <br />
            현장 확인부터 다릅니다
          </>
        }
        lead="상가·사무실·식당부터 헬스장·병원·공장까지 사진으로 1차 범위를 봅니다."
        checks={["당일 방문·당일 견적", "1년 무상 A/S", "세금계산서 발급"]}
        secondary={{ label: "업체에 물어볼 것 보기", href: "#ask" }}
        image="/images/cheolgeoon/raw-authenticated/demolition-work-034.webp"
      />

      <CompanyCore
        askTitle={["견적 받을 때 ", "이것", "부터 물어보세요"]}
        image={COMPANY_IMAGE}
        imageAlt="철거를 마친 빈 매장 실제 작업 현장"
      />

      <section className="lp-section">
        <LandingTitle>자주 묻는 질문</LandingTitle>
        <LandingFaq items={FAQ} />
      </section>

      {/* 전국 시군구 철거전문업체 전체 목록. 모든 지역 페이지가 부모(이 허브)에서 한 번에 닿도록 둔다. */}
      <section className="lp-section" id="regions">
        <LandingTitle>
          지역별 <em>철거전문업체</em>
        </LandingTitle>
        <LandingChips links={priorityRegions.map((region) => ({ label: `${region.name} 철거전문업체`, href: `/regions/${region.slug}/철거전문업체/` }))} />
        <div className="lp-sido-list">
          {sidos.map((sido) => (
            <div key={sido.slug} className="lp-sido-block">
              <p className="lp-sido-head">
                <span>{sido.name} 철거전문업체</span>
                <span>{sido.regions.length}곳</span>
              </p>
              <LandingChips
                soft
                links={sido.regions.map((region) => ({ label: region.sigungu, href: `/regions/${region.slug}/철거전문업체/` }))}
              />
            </div>
          ))}
        </div>
      </section>

      <RelatedGuides current="철거전문업체" />

      <LandingFinal lead="믿고 맡길 철거전문업체를 찾는다면" title="현장 사진부터 보내주세요" />
    </main>
  );
}

