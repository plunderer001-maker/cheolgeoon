import {
  ArrowRight,
  BadgeCheck,
  Ban,
  Building2,
  ClipboardCheck,
  FileSearch,
  MapPin,
  MessageCircle,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";

const serviceCards = [
  {
    icon: Building2,
    title: "상가·사무실 철거",
    text: "가게를 비우거나 사무실을 옮기실 때, 어디까지 철거해야 하는지부터 같이 확인합니다.",
  },
  {
    icon: ShieldCheck,
    title: "식당·카페·학원 철거",
    text: "바닥, 천장, 벽면, 집기, 설비처럼 놓치기 쉬운 부분까지 현장 기준으로 살펴봅니다.",
  },
  {
    icon: Truck,
    title: "철거 포함 정리·반출",
    text: "단순 폐기물 처리만은 어렵지만, 철거하면서 나오는 정리와 반출은 함께 상담할 수 있습니다.",
  },
];

const process = [
  ["상담 접수", "주소, 업종, 평수, 현재 상태를 편하게 알려주세요."],
  ["사진 확인", "사진이 있으면 대략적인 철거 범위와 방문 필요 여부를 먼저 봅니다."],
  ["방문 견적", "현장에서 원상복구 기준, 작업 동선, 반출 조건을 함께 확인합니다."],
  ["일정 조율", "건물 규정, 소음 가능 시간, 엘리베이터 사용 조건까지 맞춰봅니다."],
  ["철거 진행", "작업 후 정리와 확인까지 마무리 흐름에 맞춰 진행합니다."],
];

const proofItems = [
  "전국 상담 가능",
  "무료견적 상담",
  "방문 견적 진행",
  "지원금 가능 여부 안내",
];

const excludedItems = [
  "부분철거만 단독 진행",
  "단순 폐기물 처리만 의뢰",
  "집기 매입만 별도 의뢰",
];

const regionLinks = [
  ["서울 강남구 철거", "/regions/서울-강남구/"],
  ["인천 남동구 철거", "/regions/인천-남동구/"],
  ["수원 철거", "/regions/수원/"],
  ["성남 철거", "/regions/성남/"],
  ["고양 철거", "/regions/고양/"],
  ["용인 철거", "/regions/용인/"],
  ["대전 서구 철거", "/regions/대전-서구/"],
  ["대구 수성구 철거", "/regions/대구-수성구/"],
  ["부산 해운대구 철거", "/regions/부산-해운대구/"],
  ["광주 북구 철거", "/regions/광주-북구/"],
  ["청주 철거", "/regions/청주/"],
  ["강릉 철거", "/regions/강릉/"],
];

const galleryImages = [
  ["/images/cheolgeoon/sections/commercial-unit-demolition.webp", "상가 내부 철거 현장"],
  ["/images/cheolgeoon/sections/fixture-removal.webp", "집기와 설비 철거"],
  ["/images/cheolgeoon/sections/floor-removal.webp", "바닥 철거 작업"],
  ["/images/cheolgeoon/sections/final-inspection.webp", "철거 후 현장 확인"],
];

const supportImages = [
  ["/images/cheolgeoon/ai-pool/ai-consultation-01.webp", "상담 준비 이미지"],
  ["/images/cheolgeoon/ai-pool/ai-site-estimate-01.webp", "방문 견적 이미지"],
  ["/images/cheolgeoon/ai-pool/ai-document-guide-01.webp", "서류 안내 이미지"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="철거온 상단 메뉴">
        <a className="brand" href="#top" aria-label="철거온 홈">
          <span className="brand-mark">철</span>
          <span>철거온</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#services">가능 작업</a>
          <a href="#process">진행 순서</a>
          <a href="#regions">지역 안내</a>
          <a href="#consultation">견적 준비</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <img
          className="hero-bg"
          src="/images/cheolgeoon/hero/main-hero.webp"
          alt="철거 현장 내부 정리 모습"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">전국 철거 무료견적 상담</p>
          <h1>철거, 어디서부터 알아봐야 할지 막막하셨죠?</h1>
          <p className="hero-copy">
            가게를 정리해야 하거나 원상복구가 필요할 때, 제일 헷갈리는 건
            “어디까지 철거해야 하는지”입니다. 철거온이 현장 상황을 먼저 듣고
            견적과 진행 순서를 차근차근 안내해드립니다.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href={NAVER_FORM_URL}>
              <MessageCircle size={19} aria-hidden="true" />
              네이버 폼으로 문의
            </a>
            <a className="secondary-button" href="#services">
              가능한 작업 보기
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-note">
            <BadgeCheck size={18} aria-hidden="true" />
            견적 상담은 무료입니다. 도서산간 지역은 방문·출동 비용이 생길 수 있습니다.
          </div>
        </div>
      </section>

      <section className="proof-band" aria-label="철거온 상담 특징">
        {proofItems.map((item) => (
          <div key={item}>
            <Sparkles size={18} aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow dark">견적 전에 먼저 확인할 것</p>
          <h2>철거 비용은 평수만 보고 딱 정해지지 않습니다.</h2>
        </div>
        <p>
          같은 20평 매장이라도 바닥재, 천장 마감, 벽체 상태, 집기 양,
          폐기물 반출 동선에 따라 견적이 달라집니다. 그래서 철거온은 무작정
          금액부터 말하기보다, 현장 조건을 먼저 듣고 필요한 철거 범위를 함께
          정리해드립니다.
        </p>
      </section>

      <section id="services" className="section service-section">
        <div className="section-head">
          <p className="eyebrow dark">가능 작업</p>
          <h2>상가, 사무실, 식당처럼 철거가 필요한 현장을 봅니다.</h2>
          <p>
            원상복구가 필요한지, 폐업 정리인지, 일부 설비만 남겨야 하는지에 따라
            작업 방식이 달라집니다. 처음 문의하실 때 정확히 모르셔도 괜찮습니다.
          </p>
        </div>
        <div className="service-grid">
          {serviceCards.map(({ icon: Icon, title, text }) => (
            <article className="service-card" key={title}>
              <Icon size={28} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="limits-panel">
          <div>
            <Ban size={24} aria-hidden="true" />
            <h3>이런 의뢰는 단독 진행이 어렵습니다</h3>
          </div>
          <ul>
            {excludedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>다만 철거 작업에 포함되는 경우라면 현장 상황을 보고 함께 안내드립니다.</p>
        </div>
      </section>

      <section className="image-strip" aria-label="철거 시공 이미지">
        {galleryImages.map(([src, alt]) => (
          <figure key={src}>
            <img src={src} alt={alt} />
          </figure>
        ))}
      </section>

      <section id="process" className="section process-section">
        <div className="section-head">
          <p className="eyebrow dark">진행 순서</p>
          <h2>문의 후에는 이렇게 진행됩니다.</h2>
          <p>
            처음부터 모든 내용을 알고 계실 필요는 없습니다. 가능한 정보부터 받고,
            부족한 부분은 방문 견적에서 같이 확인합니다.
          </p>
        </div>
        <ol className="process-list">
          {process.map(([title, text], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section support-section">
        <div className="support-copy">
          <p className="eyebrow dark">철거지원금 안내</p>
          <h2>지원금은 받을 수 있는 조건인지부터 확인합니다.</h2>
          <p>
            철거지원금은 업종, 폐업 여부, 신청 조건, 준비 서류에 따라 가능 여부가
            달라질 수 있습니다. 그래서 확정처럼 말씀드리기보다, 해당되는 조건이
            있는지 먼저 확인하고 준비할 내용을 안내해드립니다.
          </p>
          <a className="text-link" href="#consultation">
            견적 문의 전에 준비할 것 보기
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="support-gallery">
          {supportImages.map(([src, alt]) => (
            <img key={src} src={src} alt={alt} />
          ))}
        </div>
      </section>

      <section id="consultation" className="section consult-section">
        <div>
          <p className="eyebrow dark">견적 문의 준비</p>
          <h2>정확하지 않아도 괜찮습니다. 아는 만큼만 보내주세요.</h2>
          <p>
            사진이나 평수를 모르셔도 상담은 가능합니다. 그래도 아래 정보가 있으면
            견적 확인이 훨씬 빨라집니다.
          </p>
        </div>
        <div className="consult-grid">
          <article>
            <ClipboardCheck size={24} aria-hidden="true" />
            <h3>현장 주소</h3>
            <p>어느 지역인지 알아야 방문 가능 일정과 도서산간 비용 여부를 확인할 수 있습니다.</p>
          </article>
          <article>
            <Ruler size={24} aria-hidden="true" />
            <h3>평수와 업종</h3>
            <p>식당, 카페, 사무실, 학원처럼 업종에 따라 봐야 할 철거 범위가 달라집니다.</p>
          </article>
          <article>
            <FileSearch size={24} aria-hidden="true" />
            <h3>현장 사진</h3>
            <p>바닥, 천장, 벽면, 집기 사진이 있으면 대략적인 범위를 먼저 볼 수 있습니다.</p>
          </article>
        </div>
        <div className="final-cta">
          <h2>철거가 필요하다면, 우선 상황만 남겨주세요.</h2>
          <p>네이버 폼으로 접수되면 현장 조건을 확인한 뒤 상담 순서대로 안내드립니다.</p>
          <a className="primary-button" href={NAVER_FORM_URL}>
            <MessageCircle size={19} aria-hidden="true" />
            네이버 폼 작성
          </a>
        </div>
      </section>

      <section id="regions" className="section region-section">
        <div className="section-head">
          <p className="eyebrow dark">전국 지역 안내</p>
          <h2>전국 어디든 철거 상담을 받아볼 수 있습니다.</h2>
          <p>
            시군구 지역 페이지를 기준으로 상가 철거, 사무실 철거, 식당 철거,
            원상복구 철거, 철거 비용 상담 정보를 확인할 수 있습니다.
          </p>
        </div>
        <div className="region-grid">
          {regionLinks.map(([region, href]) => (
            <a key={region} href={href}>
              <MapPin size={16} aria-hidden="true" />
              {region}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
