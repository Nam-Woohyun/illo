import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/content/Breadcrumb";
import { LegalBasisList } from "@/components/content/LegalBasisList";
import { RelatedKnowledgeCard } from "@/components/content/RelatedKnowledgeCard";
import { SourceList } from "@/components/content/SourceList";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";

import { formatDate } from "@/lib/format";
import {
  getCategoryById,
  getKnowledgeBySlug,
  getPublishedKnowledge,
  getRelatedKnowledge,
  getSourcesForKnowledge,
} from "@/lib/knowledge";
import {
  createPageMetadata,
} from "@/lib/metadata";

import type { Knowledge } from "@/types/content";

interface KnowledgeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const items =
    await getPublishedKnowledge();

  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: KnowledgeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const item =
    await getKnowledgeBySlug(slug);

  if (!item) {
    return {
      title:
        "정보를 찾을 수 없습니다",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createPageMetadata({
    title:
      item.title,

    description:
      item.summary,

    path:
      `/knowledge/${item.slug}`,
  });
}

export default async function KnowledgeDetailPage({
  params,
}: KnowledgeDetailPageProps) {
  const { slug } = await params;

  const item =
    await getKnowledgeBySlug(slug);

  if (
    !item ||
    item.status !== "published"
  ) {
    notFound();
  }

  const [
    category,
    sourceItems,
    relatedItems,
  ] = await Promise.all([
    getCategoryById(item.categoryId),
    getSourcesForKnowledge(item.id),
    getRelatedKnowledge(item.id),
  ]);

  if (!category) {
    notFound();
  }

  const legalBasisItems =
    sourceItems.filter(
      (sourceItem) =>
        sourceItem.role ===
        "legal_basis",
    );

  const officialSourceItems =
    sourceItems.filter(
      (sourceItem) =>
        sourceItem.role !==
        "legal_basis",
    );

  const relatedCards: {
    knowledge: Knowledge;
    categoryName: string;
  }[] = [];

  for (const relatedItem of relatedItems) {
    const relatedCategory =
      await getCategoryById(
        relatedItem.categoryId,
      );

    if (!relatedCategory) {
      continue;
    }

    relatedCards.push({
      knowledge: relatedItem,
      categoryName:
        relatedCategory.name,
    });
  }

  return (
    <main className="py-10 tablet:py-12 desktop:py-16">
      <PageContainer>
        <article className="mx-auto max-w-article">
          <Breadcrumb
            items={[
              {
                label: "홈",
                href: "/",
              },
              {
                label:
                  "일할 때 필요한 정보",
                href: "/knowledge",
              },
              {
                label: item.title,
              },
            ]}
          />

          <header className="mt-8">
            <Badge>
              {category.name}
            </Badge>

            <h1 className="type-h1 mt-4 text-text">
              {item.title}
            </h1>

            <p className="type-caption mt-3 text-muted">
              최종 확인{" "}
              {formatDate(
                item.lastReviewedAt,
              )}
            </p>

            <div className="mt-8">
              <Callout
                variant="summary"
                title="한 줄 핵심 요약"
              >
                {item.summary}
              </Callout>
            </div>
          </header>

          <section
            id="easy-explanation"
            className="mt-14 scroll-mt-6"
          >
            <h2 className="type-h2 text-text">
              쉽게 설명하면
            </h2>

            <p className="type-body mt-4 text-text-secondary">
              {item.easyExplanation}
            </p>
          </section>

          <section
            id="applies-to"
            className="mt-14 scroll-mt-6"
          >
            <h2 className="type-h2 text-text">
              이런 경우에 확인하세요
            </h2>

            <div className="mt-4">
              <Callout variant="info">
                <ul className="space-y-3">
                  {item.appliesTo.map(
                    (text) => (
                      <li
                        key={text}
                        className="flex gap-3"
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-semibold text-info"
                        >
                          ✓
                        </span>

                        <span>
                          {text}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </Callout>
            </div>
          </section>

          <section
            id="key-points"
            className="mt-14 scroll-mt-6"
          >
            <h2 className="type-h2 text-text">
              핵심 내용
            </h2>

            <div className="mt-4 divide-y divide-border">
              {item.keyPoints.map(
                (point) => (
                  <div
                    key={point.title}
                    className="py-8 first:pt-0 last:pb-0"
                  >
                    <h3 className="type-h3 text-text">
                      {point.title}
                    </h3>

                    <p className="type-body mt-3 text-text-secondary">
                      {point.body}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>

          <section
            id="examples"
            className="mt-14 scroll-mt-6"
          >
            <h2 className="type-h2 text-text">
              상황 예시
            </h2>

            <div className="mt-4 space-y-4">
              {item.examples.map(
                (example, index) => (
                  <Callout
                    key={`${example.title ?? "example"}-${index}`}
                    variant="example"
                    title={
                      example.title ??
                      `상황 예시 ${index + 1}`
                    }
                  >
                    {example.body}
                  </Callout>
                ),
              )}
            </div>
          </section>

          <section
            id="check-points"
            className="mt-14 scroll-mt-6"
          >
            <h2 className="type-h2 text-text">
              꼭 확인할 점
            </h2>

            <div className="mt-4">
              <Callout variant="caution">
                <div className="space-y-5">
                  {item.checkPoints.map(
                    (point, index) => (
                      <div
                        key={`${point.title ?? "check"}-${index}`}
                      >
                        {point.title && (
                          <p className="font-semibold text-text">
                            {point.title}
                          </p>
                        )}

                        <p
                          className={
                            point.title
                              ? "mt-1 text-text-secondary"
                              : "text-text-secondary"
                          }
                        >
                          {point.body}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </Callout>
            </div>
          </section>

          {legalBasisItems.length >
            0 && (
            <section
              id="legal-basis"
              className="mt-14 scroll-mt-6"
            >
              <h2 className="type-h2 text-text">
                법적 근거
              </h2>

              <div className="mt-4">
                <LegalBasisList
                  items={
                    legalBasisItems
                  }
                />
              </div>
            </section>
          )}

          {officialSourceItems.length >
            0 && (
            <section
              id="official-sources"
              className="mt-14 scroll-mt-6"
            >
              <h2 className="type-h2 text-text">
                공식 출처
              </h2>

              <p className="type-body-sm mt-3 text-text-secondary">
                국가법령정보센터와
                고용노동부 등 공식 자료를
                기준으로 내용을
                확인했습니다.
              </p>

              <div className="mt-4">
                <SourceList
                  items={
                    officialSourceItems
                  }
                />
              </div>
            </section>
          )}

          <section className="mt-14">
            <Callout
              variant="info"
              title="안내"
            >
              이 콘텐츠는 일반적인 정보
              제공을 목적으로 하며, 개별
              사건에 대한 법률 판단이나
              전문 상담을 대신하지
              않습니다.
            </Callout>
          </section>
        </article>

        {relatedCards.length > 0 && (
          <section
            aria-labelledby="related-knowledge-title"
            className="mt-20"
          >
            <div className="max-w-article">
              <h2
                id="related-knowledge-title"
                className="type-h2 text-text"
              >
                같이 보면 좋은 정보
              </h2>

              <p className="type-body-sm mt-2 text-text-secondary">
                현재 내용과 함께 확인하면
                좋은 정보를 이어서
                살펴보세요.
              </p>
            </div>

            <div className="mt-6 grid gap-4 tablet:auto-rows-fr tablet:grid-cols-2 desktop:grid-cols-3">
              {relatedCards.map(
                (related) => (
                  <RelatedKnowledgeCard
                    key={
                      related.knowledge.id
                    }
                    knowledge={
                      related.knowledge
                    }
                    categoryName={
                      related.categoryName
                    }
                  />
                ),
              )}
            </div>
          </section>
        )}
      </PageContainer>
    </main>
  );
}