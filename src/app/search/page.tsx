import type {
  Metadata,
} from "next";
import Link from "next/link";

import { KnowledgeCard } from "@/components/content/KnowledgeCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/search/SearchInput";

import {
  getAllCategories,
} from "@/lib/knowledge";
import {
  normalizeQuery,
  searchKnowledge,
  SEARCH_QUERY_MAX_LENGTH,
} from "@/lib/search";

export const metadata: Metadata = {
  title: "인사노무 정보 검색 | 일로",
  description:
    "궁금한 주제나 키워드를 입력해 필요한 인사노무 정보를 찾아보세요.",
  robots: {
    index: false,
    follow: true,
  },
};

const recommendedQueries = [
  "근로계약서",
  "최저임금",
  "연차",
  "퇴직금",
  "해고",
  "임금체불",
  "직장 내 괴롭힘",
] as const;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params =
    await searchParams;

  const rawQuery =
    Array.isArray(params.q)
      ? params.q[0] ?? ""
      : params.q ?? "";

  const query =
    normalizeQuery(rawQuery);

  const hasQuery =
    query.length > 0;

  const [
    results,
    categories,
  ] = await Promise.all([
    hasQuery
      ? searchKnowledge(query)
      : Promise.resolve([]),
    getAllCategories(),
  ]);

  const categoryNameById =
    new Map(
      categories.map(
        (category) => [
          category.id,
          category.name,
        ],
      ),
    );

  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <div className="max-w-article">
          <PageHeader
            eyebrow="Search"
            title="인사노무 정보 검색"
            description="궁금한 주제나 키워드를 입력해 필요한 정보를 찾아보세요."
          />

          <div className="mt-8">
            <SearchInput
              id="search-page-query"
              defaultValue={query}
              buttonLabel="검색"
              maxLength={
                SEARCH_QUERY_MAX_LENGTH
              }
            />
          </div>
        </div>

        {!hasQuery && (
          <SearchStartState />
        )}

        {hasQuery &&
          results.length > 0 && (
            <section
              aria-labelledby="search-results-title"
              className="mt-12"
            >
              <div className="max-w-article">
                <h2
                  id="search-results-title"
                  className="type-h2 break-words text-text"
                >
                  “{query}” 검색 결과
                </h2>

                <p className="type-body mt-3 text-text-secondary">
                  <strong className="font-semibold text-text">
                    {results.length}
                  </strong>
                  개의 정보를
                  찾았습니다.
                </p>
              </div>

              <div className="mt-6 grid gap-5 desktop:auto-rows-fr desktop:grid-cols-2 desktop:gap-6">
                {results.map(
                  (item) => {
                    const categoryName =
                      categoryNameById.get(
                        item.categoryId,
                      );

                    if (
                      !categoryName
                    ) {
                      return null;
                    }

                    return (
                      <KnowledgeCard
                        key={item.id}
                        knowledge={item}
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

        {hasQuery &&
          results.length === 0 && (
            <SearchEmptyState
              query={query}
            />
          )}
      </PageContainer>
    </main>
  );
}

function SearchStartState() {
  return (
    <section
      aria-labelledby="search-start-title"
      className="mt-12 max-w-article border-t border-border pt-8"
    >
      <h2
        id="search-start-title"
        className="type-h2 text-text"
      >
        찾고 싶은 정보를
        검색해보세요
      </h2>

      <p className="type-body mt-3 text-text-secondary">
        정확한 법률 용어가 아니어도
        알고 있는 주제나 핵심 단어부터
        입력해보세요.
      </p>

      <div className="mt-6">
        <p className="type-label text-text">
          검색 예시
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {recommendedQueries.map(
            (query) => (
              <Link
                key={query}
                href={`/search?q=${encodeURIComponent(
                  query,
                )}`}
                aria-label={`${query} 검색`}
                className={[
                  "inline-flex",
                  "min-h-11",
                  "items-center",
                  "rounded-pill",
                  "border",
                  "border-border",
                  "bg-surface",
                  "px-4",
                  "type-label",
                  "text-text-secondary",
                  "transition-colors",
                  "hover:border-primary",
                  "hover:text-primary",
                ].join(" ")}
              >
                {query}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

interface SearchEmptyStateProps {
  query: string;
}

function SearchEmptyState({
  query,
}: SearchEmptyStateProps) {
  return (
    <section
      aria-labelledby="search-empty-title"
      className="mt-12 max-w-article rounded-card border border-border bg-surface p-6 tablet:p-8"
    >
      <p className="type-label text-muted">
        검색 결과 없음
      </p>

      <h2
        id="search-empty-title"
        className="type-h2 mt-3 break-words text-text"
      >
        “{query}”에 대한 정보를
        찾지 못했습니다
      </h2>

      <p className="type-body mt-4 text-text-secondary">
        다른 표현이나 더 짧은
        키워드로 다시 검색해보세요.
        현재 상황에서 시작하고 싶다면
        상황별 찾기를 이용할 수
        있습니다.
      </p>

      <Link
        href="/guide"
        className={[
          "mt-6",
          "inline-flex",
          "min-h-11",
          "items-center",
          "rounded-control",
          "border",
          "border-border",
          "bg-surface",
          "px-4",
          "type-label",
          "text-text",
          "transition-colors",
          "hover:border-primary",
          "hover:text-primary",
        ].join(" ")}
      >
        상황별로 찾아보기

        <span
          aria-hidden="true"
          className="ml-2"
        >
          →
        </span>
      </Link>
    </section>
  );
}