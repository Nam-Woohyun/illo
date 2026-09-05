import type {
  Metadata,
} from "next";

import { AISearchForm } from "@/components/ai/AISearchForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "AI로 찾기 | 일로",
  description:
    "법률 용어를 몰라도 현재 상황을 문장으로 설명해 관련 인사노무 정보를 찾아보세요.",
};

export default function AISearchPage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <div className="max-w-article">
          <PageHeader
            eyebrow="AI Search"
            title="AI로 찾기"
            description="법률 용어를 몰라도 현재 상황을 문장으로 설명해보세요. 관련된 인사노무 정보를 찾아드립니다."
          />

          <section
            aria-label="AI 인사노무 정보 찾기"
            className="mt-10"
          >
            <p className="type-body text-text-secondary">
              AI는 입력한 문장에서
              검색에 필요한 핵심
              표현과 상황을 정리하고,
              일로에 등록된 정보를
              찾는 데 사용됩니다.
            </p>

            <div className="mt-7">
              <AISearchForm />
            </div>
          </section>

          <div className="mt-10">
            <Callout
              variant="info"
              title="AI 기능 안내"
            >
              AI는 관련 정보를
              찾기 위한 보조 기능이며,
              개별 사건의 적법·위법
              여부나 권리 유무를
              판단하지 않습니다.
              필요한 내용은 연결된
              인사노무 정보와 공식
              출처에서 확인해주세요.
            </Callout>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}