import type { Metadata } from "next";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: {
    default:
      "일로 | 일하다 궁금한 순간, 필요한 정보로",
    template: "%s | 일로",
  },
  description:
    "사회초년생과 근로자가 자신의 상황에서 출발해 필요한 인사노무 정보와 공식 근거를 확인할 수 있도록 돕는 정보 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header />

        <div className="flex-1">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}