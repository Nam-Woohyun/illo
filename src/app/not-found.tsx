import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <main className="py-20">
      <PageContainer>
        <div className="mx-auto max-w-article text-center">
          <p className="type-label text-primary">
            404
          </p>

          <h1 className="type-h1 mt-3 text-text">
            정보를 찾을 수 없습니다
          </h1>

          <p className="type-body mt-4 text-text-secondary">
            주소가 잘못되었거나 현재
            제공하지 않는 정보입니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/knowledge"
              className="inline-flex min-h-11 items-center rounded-control bg-primary px-5 type-label text-white transition-colors hover:bg-primary-hover"
            >
              인사노무 정보 보기
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-control border border-border bg-surface px-5 type-label text-text transition-colors hover:bg-bg"
            >
              홈으로
            </Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}