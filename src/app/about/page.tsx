import { PageContainer } from "@/components/layout/PageContainer";

export default function AboutPage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <p className="type-label text-primary">
          Phase 3 Placeholder
        </p>

        <h1 className="type-h1 mt-3 text-text">
          프로젝트 소개
        </h1>

        <p className="type-body mt-4 text-text-secondary">
          실제 프로젝트 Case Study는 이후
          Phase에서 구현합니다.
        </p>
      </PageContainer>
    </main>
  );
}