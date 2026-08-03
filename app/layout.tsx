import type { Metadata, Viewport } from "next";
import { FloatingFormButton } from "./components/FloatingFormButton";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cheolgeoon.netlify.app"),
  title: "철거온 | 전국 철거 무료견적·방문견적 상담",
  description:
    "철거온은 상가, 사무실, 식당, 카페, 학원 철거와 원상복구 범위를 확인하고 무료견적 상담과 방문 견적을 안내합니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "철거온 | 전국 철거 무료견적 상담",
    description:
      "철거가 필요한 현장의 범위, 일정, 방문 견적, 지원금 신청 가능 여부를 함께 확인합니다.",
    url: "https://cheolgeoon.netlify.app",
    siteName: "철거온",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/cheolgeoon/og/main-og.webp",
        width: 1200,
        height: 630,
        alt: "철거온 전국 철거 무료견적 상담",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "철거온 | 전국 철거 무료견적 상담",
    description:
      "현장 확인부터 방문 견적, 철거 진행, 지원금 신청 가능 여부 안내까지 상담합니다.",
    images: ["/images/cheolgeoon/og/main-og.webp"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  verification: {
    google: "pIY3u_Xq-v1EjG37G6Gq2azRJRvmhnhDQH_chnGGdAE",
    other: {
      "naver-site-verification": "f549a9b2423021a0dd095af023a8e516b6730a5e",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101713",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <FloatingFormButton />
      </body>
    </html>
  );
}
