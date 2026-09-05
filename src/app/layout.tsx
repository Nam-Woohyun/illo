import type { Metadata } from "next";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase:
    getSiteUrl(),

  title: {
    default:
      SITE_TITLE,
    template:
      `%s | ${SITE_NAME}`,
  },

  description:
    SITE_DESCRIPTION,

  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName:
      SITE_NAME,
    title:
      SITE_TITLE,
    description:
      SITE_DESCRIPTION,
    url: "/",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      SITE_TITLE,
    description:
      SITE_DESCRIPTION,
  },
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