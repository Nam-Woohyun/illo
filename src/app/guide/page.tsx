import type { Metadata } from "next";

import {
  getGuidePresentation,
  getGuideRepresentativeQuestion,
} from "@/components/guide/guidePresentation";
import { GuideCard } from "@/components/guide/GuideCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/ui/Callout";

import {
  getAllGuideSituations,
  getKnowledgeByGuide,
} from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "상황별 찾기",
  description:
    "일을 시작할 때부터 근무 조건, 급여·수당, 문제 상황과 퇴사까지 현재 상황에 맞는 인사노무 정보를 찾아보세요.",
};

export default async function GuidePage() {
  const guides =
    await getAllGuideSituations();

  const guideCards = await Promise.all(
    guides.map(async (guide) => {
      const presentation =
        getGuidePresentation(guide.slug);

      const relations =
        await getKnowledgeByGuide(
          guide.slug,
        );

      const primaryRelations =
        relations.filter(
          (relation) =>
            relation.isPrimary,
        );

      const secondaryRelations =
        relations.filter(
          (relation) =>
            !relation.isPrimary,
        );

      const prioritizedRelations = [
        ...primaryRelations,
        ...secondaryRelations,
      ];

      const questions: string[] = [];

      for (
        const relation of prioritizedRelations
      ) {
        const question =
          getGuideRepresentativeQuestion(
            guide.slug,
            relation.knowledge,
          );

        if (
          question &&
          !questions.includes(question)
        ) {
          questions.push(question);
        }

        if (questions.length === 2) {
          break;
        }
      }

      return {
        guide,
        description:
          presentation?.description ??
          "현재 상황과 관련된 정보를 확인해보세요.",
        questions,
        knowledgeCount:
          relations.length,
      };
    }),
  );

  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <PageHeader
          eyebrow="Guide"
          title="상황별 찾기"
          description="법률 용어를 먼저 알 필요 없이, 지금 처한 상황과 가장 가까운 항목에서 필요한 정보를 찾아보세요."
        />

        <section
          aria-labelledby="guide-situations-title"
          className="mt-12 max-w-article"
        >
          <h2
            id="guide-situations-title"
            className="type-h2 text-text"
          >
            지금 어떤 상황인가요?
          </h2>

          <p className="type-body mt-3 text-text-secondary">
            가장 가까운 상황 하나를
            선택해 관련 질문과 정보를
            확인해보세요.
          </p>

          <div className="mt-6 space-y-4">
            {guideCards.map(
              (card) => (
                <GuideCard
                  key={card.guide.id}
                  guide={card.guide}
                  description={
                    card.description
                  }
                  questions={
                    card.questions
                  }
                  knowledgeCount={
                    card.knowledgeCount
                  }
                />
              ),
            )}
          </div>

          <div className="mt-8">
            <Callout variant="info">
              정확한 법률 용어를 몰라도
              괜찮습니다. 지금 겪고 있는
              상황과 가장 가까운 질문에서
              시작해보세요.
            </Callout>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}