import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "일로 ILLO",
  description: "일하는 사람을 위한 인사노무 정보 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}