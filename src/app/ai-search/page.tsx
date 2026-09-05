import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "AI로 찾기 | 일로",
  description:
    "자연어 상황을 분석해 관련 인사노무 정보를 찾는 기능을 준비하고 있습니다.",
};

export default function AISearchPage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <div className="max-w-article">
          <PageHeader
            eyebrow="AI Search"
            title="AI로 찾기"
            description="상황을 자연어로 설명하면 관련 Knowledge를 찾아주는 탐색 기능입니다."
          />

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="type-h2 text-text">
              현재 준비 중입니다
            </h2>

            <p className="type-body mt-4 text-text-secondary">
              질문의 핵심과 관련 키워드를
              분석해 일로 내부의 관련
              정보를 추천하는 기능을
              구현할 예정입니다.
            </p>

            <p className="type-body-sm mt-3 text-muted">
              법률적 결론을 생성하는
              상담 기능이 아니라,
              신뢰할 수 있는 내부 정보를
              찾기 위한 탐색 기능입니다.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/guide"
                className="inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
              >
                상황별로 찾기
                <span
                  aria-hidden="true"
                  className="ml-2"
                >
                  →
                </span>
              </Link>

              <Link
                href="/search"
                className="inline-flex min-h-11 items-center type-label text-text-secondary transition-colors hover:text-primary"
              >
                일반 검색 이용하기
                <span
                  aria-hidden="true"
                  className="ml-2"
                >
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}