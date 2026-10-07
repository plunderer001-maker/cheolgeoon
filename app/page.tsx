import type { Metadata } from "next";
import "./home.css";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, X } from "lucide-react";
import { LandingChips, LandingFaq, NAVER_FORM_URL, SERVICE_SCOPE, SiteNav } from "@/app/components/Landing";
import { MARKET_PRICE_CAPTION, MARKET_PRICE_ROWS, MARKET_PRICE_SOURCES } from "@/app/lib/market-prices";
import { PRIORITY_REGION_SLUGS, regionMap, regionTopicPath, regions, sidoHubPath, sidos, topics } from "@/app/lib/region-pages";

/* 메인은 "철거업체"를 주 키워드로, "철거비용"은 요약만 두고 비용 가이드로 넘긴다.
 * 레이아웃은 랜딩 페이지형: 섹션마다 큰 제목 하나와 한눈에 읽히는 요소 하나만 둔다. */
const TITLE = "철거업체 순위보다 중요한 기준 | 철거비용 무료견적 | 철거온";
const DESCRIPTION =
  "철거업체를 고를 때 순위보다 먼저 봐야 할 기준 5가지와 상가·사무실 철거비용 참고 범위를 정리했습니다. 사진만 보내면 무료견적, 원상복구와 지원금 정산 서류까지 안내합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://cheolgeoon.netlify.app/",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/images/cheolgeoon/og/main-og.webp", width: 1200, height: 630, alt: "철거온 전국 철거 무료견적 상담" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
};

const PHOTO = (n: number) => `/images/cheolgeoon/raw-authenticated/demolition-work-${String(n).padStart(3, "0")}.webp`;

/* "철거업체 순위" 검색 의도: 순위표 대신 믿을 만한 업체를 가리는 기준을 준다. */
const CRITERIA = [
  { title: "세금계산서 발급", body: "사업자등록 업체인지, 지원금 정산이 되는지" },
  { title: "폐기물 처리 포함", body: "폐기물 처리비가 견적에 들어 있는지" },
  { title: "항목별 견적서", body: "인건비·폐기물·운반비가 나눠져 있는지" },
  { title: "추가 비용 조건", body: "어떤 경우 금액이 바뀌는지 적혀 있는지" },
  { title: "원상복구까지", body: "철거 후 마감 복구까지 한 번에 되는지" },
];

/* 실제 작업 사진(raw-authenticated). 사진에 보이는 공간 종류만 적는다. */
const CASES: [number, string, string][] = [
  [5, "매장", "집기·설비 철거 후"],
  [22, "사무실", "칸막이 철거 후"],
  [33, "상가", "내부 전체 철거 후"],
  [2, "매장", "천장·주방 철거 후"],
  [34, "상가", "원상복구 마감 후"],
  [40, "상가", "복도 정리 후"],
  [12, "상가", "출입구 정리 후"],
  [41, "상가", "통로 마감 후"],
];

/* 시공 누적 실적(2026-10 확인). 지원금 한도는 2026.1.19 희망리턴패키지 공고 기준. */
const NUMBERS = [
  { value: "7,690", unit: "건", label: "폐업·철거 누적" },
  { value: "3,685", unit: "건", label: "정부지원 철거 누적" },
  { value: "5,560", unit: "건", label: "지원금 상담 누적" },
  { value: "600", unit: "만원", label: "점포철거비 최대 지원" },
];

const RECORDS = [
  { value: "2,790건", label: "학원·카페·식당" },
  { value: "2,450건", label: "상가·병원" },
  { value: "2,450건", label: "인테리어 철거·폐기물" },
];

/* 사용자가 사실로 확인한 약속만 쓴다. */
const PROMISES = [
  { title: "당일 방문·당일 견적", body: "상담 당일 현장을 보고 그 자리에서 견적을 드립니다" },
  { title: "1년 무상 A/S", body: "한 번 시작한 공사는 끝난 뒤 1년까지 책임집니다" },
  { title: "24시간 상담", body: "폐업 일정이 급해도 언제든 먼저 남겨주세요" },
];

/* 고객 후기(상호는 고객이 남긴 이름 그대로). */
const REVIEWS: [string, string][] = [
  ["빵공장", "없는 돈에 머리도 아프고 막막했는데, 알려주신 대로 하다 보니 잘 마무리됐습니다."],
  ["커피공주", "다른 곳 견적보다 저렴하게 해주시고 기존 집기까지 매입해 주셔서 깔끔하게 끝났습니다."],
  ["헤어라인", "원상복구 문제로 상가 주인과 마찰이 있었는데 말끔히 해결해 주셨습니다."],
  ["우뚱", "내진설계 건물이라 걱정이 많았는데 문제없이 깔끔히 마무리해 주셨습니다."],
  ["닭모이", "아무도 손을 못 대는 상황이었는데 제 사정에 다 맞춰주셔서 잘 끝났습니다."],
  ["목롯주점", "안 그래도 속상한데 친절하게 상담해 주셔서 마음 편하게 마무리했습니다."],
];

const STEPS: [string, string][] = [
  ["사진·주소 보내기", "평수를 몰라도 괜찮습니다"],
  ["1차 범위 안내", "금액이 달라지는 항목부터"],
  ["방문 견적·일정", "필요한 현장만 방문합니다"],
];

const FAQ: [string, string][] = [
  [
    "철거업체 순위는 어디서 볼 수 있나요?",
    "공식적으로 매기는 철거업체 순위는 없습니다. 세금계산서 발급, 폐기물 처리비 포함, 항목별 견적서, 추가 비용 조건을 기준으로 2~3곳을 비교해 보시는 방법을 권합니다.",
  ],
  ["견적은 정말 무료인가요?", "견적 상담은 무료입니다. 도서산간 지역은 방문·출장 비용이 생길 수 있습니다."],
  ["바로 와서 볼 수 있나요?", "가능한 현장은 상담 당일 방문해 그 자리에서 견적을 드립니다. 상담은 24시간 남기실 수 있습니다."],
  ["철거 후 문제가 생기면요?", "공사가 끝난 뒤 1년간 무상 A/S를 해드립니다."],
  ["사진이나 평수를 몰라도 되나요?", "괜찮습니다. 주소와 업종만 알려주셔도 상담할 수 있고, 사진이 있으면 범위를 더 빨리 봅니다."],
  ["전국 어디든 가능한가요?", "전국 상담이 가능합니다. 지역마다 건물 규정과 반출 조건이 달라 주소를 기준으로 일정을 안내합니다."],
];

const priorityRegions = Array.from(PRIORITY_REGION_SLUGS)
  .map((slug) => regionMap.get(slug))
  .filter((region): region is NonNullable<typeof region> => Boolean(region));

function QuoteButton({ label = "무료견적 받기" }: { label?: string }) {
  return (
    <a href={NAVER_FORM_URL} className="hm-btn hm-btn-primary">
      <MessageCircle size={20} aria-hidden="true" />
      {label}
    </a>
  );
}

export default function Home() {
  const primaryTopic = topics[0];

  return (
    <main className="lp hm">
      <SiteNav />

      <section className="hm-hero">
        <img className="hm-bg" src={PHOTO(3)} alt="" width={1400} height={1050} fetchPriority="high" />
        <div className="hm-hero-inner">
          <p className="hm-eyebrow">전국 상가·사무실·식당 철거 무료견적</p>
          <h1>
            <small>철거업체 순위보다 중요한 건</small>
            <em>우리 현장</em>
            <br />
            철거비용입니다
          </h1>
          <p className="hm-lead">사진 몇 장이면 금액이 달라지는 항목부터 알려드립니다.</p>
          <div className="hm-actions">
            <QuoteButton />
            <a href="#criteria" className="hm-btn hm-btn-ghost">
              업체 고르는 기준
            </a>
          </div>
          <ul className="hm-checks">
            <li>당일 방문·당일 견적</li>
            <li>1년 무상 A/S</li>
            <li>지원금 정산 서류 발급</li>
          </ul>
        </div>
      </section>

      <section className="hm-section hm-dark hm-promise-wrap">
        <h2>
          한번 시작한 공사는
          <br />
          <em>끝까지</em> 책임집니다
        </h2>
        <ol className="hm-promises">
          {PROMISES.map((item, index) => (
            <li key={item.title}>
              <span>약속 {index + 1}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hm-section hm-dark" id="criteria">
        <h2>
          좋은 철거업체,
          <br />
          <em>5가지</em>만 보세요
        </h2>
        <p className="hm-sub">공식 철거업체 순위는 없습니다. 견적을 받을 때 이것만 비교하세요.</p>
        <ol className="hm-criteria">
          {CRITERIA.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hm-section hm-light">
        <h2>
          철거 끝난 현장,
          <br />
          <em>그대로</em> 보여드립니다
        </h2>
        <p className="hm-sub">철거온이 실제로 작업한 현장 사진입니다.</p>
        {/* 같은 목록을 두 번 이어 붙여 왼쪽으로 끊김 없이 흐르게 한다(두 번째 묶음은 보조기기에서 숨김). */}
        <div className="hm-marquee">
          <div className="hm-cases">
            {[0, 1].map((copy) =>
              CASES.map(([photo, space, note]) => (
                <figure key={`${copy}-${photo}`} aria-hidden={copy === 1 ? true : undefined}>
                  <img
                    src={PHOTO(photo)}
                    alt={copy === 0 ? `${space} ${note} 실제 작업 사진` : ""}
                    width={1400}
                    height={1050}
                    loading="lazy"
                  />
                  <figcaption>
                    <span>{space}</span>
                    {note}
                  </figcaption>
                </figure>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="hm-section hm-dark">
        <h2>
          철거온은
          <br />
          <em>숫자</em>로 말씀드립니다
        </h2>
        <dl className="hm-numbers">
          {NUMBERS.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.value}
                <small>{item.unit}</small>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="hm-records">
          {RECORDS.map((item) => (
            <li key={item.label}>
              {item.label} <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
        <p className="hm-foot">누적 건수는 시공 실적 기준(2026년 10월 확인), 지원금은 2026년 희망리턴패키지 점포철거비 공고 기준입니다.</p>
      </section>

      <section className="hm-section hm-light hm-reviews-wrap">
        <h2>
          먼저 맡겨본 사장님들의
          <br />
          <em>진짜</em> 후기
        </h2>
        <ul className="hm-reviews">
          {REVIEWS.map(([name, text]) => (
            <li key={name}>
              <p>“{text}”</p>
              <span>{name} 사장님</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="hm-section hm-light" id="price">
        <h2>
          철거비용,
          <br />
          <em>평당</em> 얼마쯤 할까요?
        </h2>
        <div className="hm-prices">
          {MARKET_PRICE_ROWS.map((row) => (
            <div key={row.name}>
              <p>{row.name}</p>
              <strong>{row.perPyeong}</strong>
              <span>{row.example}</span>
            </div>
          ))}
        </div>
        <p className="hm-foot">
          {MARKET_PRICE_CAPTION} 출처:{" "}
          {MARKET_PRICE_SOURCES.map((source, index) => (
            <span key={source.href}>
              {index > 0 && ", "}
              <a href={source.href} target="_blank" rel="noopener nofollow">
                {source.label}
              </a>
            </span>
          ))}
        </p>
        <Link className="hm-link" href="/guide/철거-비용/">
          철거비용 자세히 보기 <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="hm-section hm-dark">
        <h2>
          <em>3단계</em>면 끝납니다
        </h2>
        <ol className="hm-steps">
          {STEPS.map(([title, body], index) => (
            <li key={title}>
              <span>STEP {index + 1}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <QuoteButton label="사진 보내고 견적 받기" />
      </section>

      <section className="hm-split">
        <img src={PHOTO(9)} alt="폐업 전 매장 내부 실제 사진" width={1400} height={1050} loading="lazy" />
        <div>
          <p className="hm-eyebrow">폐업 예정이라면</p>
          <h2>
            철거 전에
            <br />
            <em>지원금</em>부터 확인하세요
          </h2>
          <p>
            희망리턴패키지 점포철거비는 전용면적 1평당 20만원, 최대 600만원까지 지원됩니다. 정산 서류(공사내역서·세금계산서)도 발급합니다.
          </p>
          <Link className="hm-btn hm-btn-primary" href="/guide/폐업-철거지원금/">
            지원 조건 보기 <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="hm-section hm-light">
        <h2>
          맡을 수 있는 <em>범위</em>
        </h2>
        <div className="hm-scope">
          <div>
            <p className="hm-scope-label">
              <Check size={18} aria-hidden="true" />
              진행 가능
            </p>
            <ul>
              {SERVICE_SCOPE.yes.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hm-scope-no">
            <p className="hm-scope-label">
              <X size={18} aria-hidden="true" />
              진행이 어려운 의뢰
            </p>
            <ul>
              {SERVICE_SCOPE.no.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hm-section hm-light hm-tight">
        <h2>자주 묻는 질문</h2>
        <div className="hm-narrow">
          <LandingFaq items={FAQ} />
        </div>
      </section>

      <section className="hm-section hm-light hm-tight" id="regions">
        <h2>지역별·상황별 안내</h2>
        <div className="hm-narrow hm-links">
          <p>상황별 가이드</p>
          <LandingChips
            links={[
              { label: "철거전문업체", href: "/guide/철거전문업체/" },
              { label: "상가·인테리어 철거", href: "/guide/상가-철거/" },
              { label: "폐업 철거", href: "/guide/폐업-철거/" },
              { label: "사무실 철거", href: "/guide/사무실-철거/" },
              { label: "식당·카페 철거", href: "/guide/식당-철거/" },
              { label: "원상복구 철거", href: "/guide/원상복구-철거/" },
            ]}
          />
          <p>주요 지역 철거비용</p>
          <LandingChips
            soft
            links={priorityRegions.map((region) => ({ label: `${region.name} 철거`, href: regionTopicPath(region, primaryTopic) }))}
          />
          {primaryTopic && (
            <>
              <p>시도별 철거비용</p>
              <LandingChips soft links={sidos.map((sido) => ({ label: sido.short, href: sidoHubPath(primaryTopic, sido) }))} />
            </>
          )}
          <LandingChips links={[{ label: "전국 시군구 전체 보기", href: "/regions/" }, { label: "철거 가이드 모아보기", href: "/guide/" }]} />
        </div>
      </section>

      <section className="hm-final">
        <img className="hm-bg" src={PHOTO(2)} alt="" width={1400} height={1050} loading="lazy" />
        <div>
          <p className="hm-eyebrow">철거, 어디서부터 할지 막막하다면</p>
          <h2>
            현장 사진부터
            <br />
            <em>보내주세요</em>
          </h2>
          <QuoteButton />
          <span>견적 상담은 무료입니다 · 도서산간은 출장비가 생길 수 있습니다</span>
        </div>
      </section>
    </main>
  );
}
