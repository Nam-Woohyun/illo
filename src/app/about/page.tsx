import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "프로젝트 소개 | 일로",
  description:
    "일로 프로젝트의 기획 배경과 개발 과정을 소개하는 페이지입니다.",
};

export default function AboutPage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <div className="max-w-article">
          <PageHeader
            eyebrow="About Project"
            title="프로젝트 소개"
            description="일로를 만든 배경과 서비스 설계·개발 과정을 정리하는 페이지입니다."
          />

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="type-h2 text-text">
              프로젝트 기록을 정리하고 있습니다
            </h2>

            <p className="type-body mt-4 text-text-secondary">
              문제 정의부터 정보 구조,
              콘텐츠 설계, 웹 개발,
              AI 활용 과정까지 하나의
              서비스 Case Study로
              정리할 예정입니다.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
            >
              홈으로 돌아가기
              <span
                aria-hidden="true"
                className="ml-2"
              >
                →
              </span>
            </Link>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}