import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/content/Breadcrumb";
import { KnowledgeCard } from "@/components/content/KnowledgeCard";
import {
  getGuidePresentation,
  getGuideRepresentativeQuestion,
} from "@/components/guide/guidePresentation";
import { QuestionCard } from "@/components/guide/QuestionCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

import {
  getAllCategories,
  getAllGuideSituations,
  getGuideSituationBySlug,
  getKnowledgeByGuide,
} from "@/lib/knowledge";

interface GuideDetailPageProps {
  params: Promise<{
    situation: string;
  }>;
}

export async function generateStaticParams() {
  const guides =
    await getAllGuideSituations();

  return guides.map((guide) => ({
    situation: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuideDetailPageProps): Promise<Metadata> {
  const { situation } = await params;

  const guide =
    await getGuideSituationBySlug(
      situation,
    );

  const presentation =
    getGuidePresentation(situation);

  if (!guide) {
    return {
      title:
        "상황을 찾을 수 없습니다",
    };
  }

  return {
    title: guide.name,
    description:
      presentation?.description ??
      "현재 상황과 관련된 정보를 확인해보세요.",
  };
}

export default async function GuideDetailPage({
  params,
}: GuideDetailPageProps) {
  const { situation } = await params;

  const guide =
    await getGuideSituationBySlug(
      situation,
    );

  if (!guide) {
    notFound();
  }

  const presentation =
    getGuidePresentation(
      guide.slug,
    );

  const [
    relations,
    categories,
  ] = await Promise.all([
    getKnowledgeByGuide(
      guide.slug,
    ),
    getAllCategories(),
  ]);

  const categoryNameById = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ]),
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

  const questionRelations = [
    ...primaryRelations,
    ...secondaryRelations,
  ];

  const questionCards =
    questionRelations.flatMap(
      (relation) => {
        const question =
          getGuideRepresentativeQuestion(
            guide.slug,
            relation.knowledge,
          );

        if (!question) {
          return [];
        }

        return [
          {
            question,
            relation,
          },
        ];
      },
    );

  return (
    <main className="py-10 tablet:py-12 desktop:py-16">
      <PageContainer>
        <div className="max-w-article">
          <Breadcrumb
            items={[
              {
                label: "홈",
                href: "/",
              },
              {
                label:
                  "상황별 찾기",
                href: "/guide",
              },
              {
                label: guide.name,
              },
            ]}
          />

          <div className="mt-8">
            <PageHeader
              eyebrow="Guide"
              title={guide.name}
              description={
                presentation
                  ?.description ??
                "현재 상황과 관련된 정보를 확인해보세요."
              }
            />
          </div>
        </div>

        {relations.length === 0 ? (
          <div className="mt-12 max-w-article rounded-card border border-border bg-surface p-8">
            <p className="type-body text-text-secondary">
              아직 이 상황에 연결된
              정보가 없습니다.
            </p>
          </div>
        ) : (
          <>
            {questionCards.length >
              0 && (
              <section
                aria-labelledby="guide-questions-title"
                className="mt-14 max-w-article"
              >
                <h2
                  id="guide-questions-title"
                  className="type-h2 text-text"
                >
                  현재 상황과 가까운 질문
                </h2>

                <p className="type-body mt-3 text-text-secondary">
                  가장 비슷한 질문에서
                  관련 정보를 바로
                  확인해보세요.
                </p>

                <div className="mt-6 space-y-4">
                  {questionCards.map(
                    ({
                      question,
                      relation,
                    }) => (
                      <QuestionCard
                        key={`${relation.knowledge.id}-${question}`}
                        question={
                          question
                        }
                        knowledge={
                          relation.knowledge
                        }
                        isPrimary={
                          relation.isPrimary
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            )}

            {primaryRelations.length >
              0 && (
              <section
                aria-labelledby="primary-knowledge-title"
                className="mt-16"
              >
                <div className="max-w-article">
                  <h2
                    id="primary-knowledge-title"
                    className="type-h2 text-text"
                  >
                    먼저 확인해보세요
                  </h2>

                  <p className="type-body mt-3 text-text-secondary">
                    이 상황에서 우선
                    확인하면 좋은 핵심
                    정보입니다.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 desktop:auto-rows-fr desktop:grid-cols-2 desktop:gap-6">
                  {primaryRelations.map(
                    (relation) => {
                      const categoryName =
                        categoryNameById.get(
                          relation
                            .knowledge
                            .categoryId,
                        );

                      if (
                        !categoryName
                      ) {
                        return null;
                      }

                      return (
                        <KnowledgeCard
                          key={
                            relation
                              .knowledge.id
                          }
                          knowledge={
                            relation.knowledge
                          }
                          categoryName={
                            categoryName
                          }
                          headingLevel={
                            3
                          }
                        />
                      );
                    },
                  )}
                </div>
              </section>
            )}

            {secondaryRelations.length >
              0 && (
              <section
                aria-labelledby="secondary-knowledge-title"
                className="mt-16"
              >
                <div className="max-w-article">
                  <h2
                    id="secondary-knowledge-title"
                    className="type-h2 text-text"
                  >
                    함께 확인하면 좋아요
                  </h2>

                  <p className="type-body mt-3 text-text-secondary">
                    현재 상황과 함께
                    살펴보면 도움이 되는
                    관련 정보입니다.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 desktop:auto-rows-fr desktop:grid-cols-2 desktop:gap-6">
                  {secondaryRelations.map(
                    (relation) => {
                      const categoryName =
                        categoryNameById.get(
                          relation
                            .knowledge
                            .categoryId,
                        );

                      if (
                        !categoryName
                      ) {
                        return null;
                      }

                      return (
                        <KnowledgeCard
                          key={
                            relation
                              .knowledge.id
                          }
                          knowledge={
                            relation.knowledge
                          }
                          categoryName={
                            categoryName
                          }
                          headingLevel={
                            3
                          }
                        />
                      );
                    },
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </PageContainer>
    </main>
  );
}