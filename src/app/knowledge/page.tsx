import { PageContainer } from "@/components/layout/PageContainer";

export default function KnowledgePage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <p className="type-label text-primary">
          Phase 3 Placeholder
        </p>

        <h1 className="type-h1 mt-3 text-text">
          인사노무 정보
        </h1>

        <p className="type-body mt-4 text-text-secondary">
          실제 Knowledge 화면은 이후 Phase에서
          구현합니다.
        </p>
      </PageContainer>
    </main>
  );
}