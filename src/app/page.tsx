import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <div className="max-w-article">
          <p className="type-label text-primary">
            ILLO
          </p>

          <h1 className="type-h1 mt-3 text-text">
            Phase 3 Layout Preview
          </h1>

          <p className="type-body-lg mt-4 text-text-secondary">
            Header와 Footer가 정상적으로
            적용되었습니다.
          </p>
        </div>
      </PageContainer>
    </main>
  );
}