import type { Metadata } from "next";
import Link from "next/link";

import { KnowledgeCard } from "@/components/content/KnowledgeCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

import {
  getAllCategories,
  getCategoryBySlug,
  getKnowledgeByCategory,
  getPublishedKnowledge,
} from "@/lib/knowledge";

import type { Category } from "@/types/content";

interface KnowledgePageProps {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

const knowledgeDescription =
  "근로계약, 임금, 근로시간, 휴가, 퇴직·해고 등 일하면서 필요한 인사노무 정보를 쉬운 설명과 공식 근거로 확인해보세요.";

export async function generateMetadata({
  searchParams,
}: KnowledgePageProps): Promise<Metadata> {
  const params = await searchParams;

  const hasCategoryFilter =
    typeof params.category === "string" &&
    params.category.length > 0;

  return {
    title: "일할 때 필요한 정보",
    description: knowledgeDescription,
    robots: hasCategoryFilter
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function KnowledgePage({
  searchParams,
}: KnowledgePageProps) {
  const query = await searchParams;

  const categoryParam =
    typeof query.category === "string"
      ? query.category
      : null;

  const allCategories =
    await getAllCategories();

  const selectedCategory =
    categoryParam
      ? await getCategoryBySlug(
          categoryParam,
        )
      : null;

  const items = selectedCategory
    ? await getKnowledgeByCategory(
        selectedCategory.slug,
      )
    : await getPublishedKnowledge();

  const categoryNameById = new Map(
    allCategories.map((category) => [
      category.id,
      category.name,
    ]),
  );

  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        <PageHeader
          eyebrow="Knowledge"
          title="일할 때 필요한 정보"
          description="근로계약, 급여, 근로시간, 휴가, 퇴사처럼 일하면서 궁금할 수 있는 내용을 주제별로 살펴보세요."
        />

        <div className="mt-10">
          <CategoryFilter
            categories={allCategories}
            selectedSlug={
              selectedCategory?.slug ??
              null
            }
          />
        </div>

        <div className="mt-10 flex items-center justify-between border-b border-border pb-4">
          <p className="type-body-sm text-muted">
            <strong className="font-semibold text-text">
              {items.length}
            </strong>
            개의 정보
          </p>
        </div>

        {items.length > 0 ? (
          <div className="mt-6 grid gap-5 desktop:auto-rows-fr desktop:grid-cols-2 desktop:gap-6">
            {items.map((item) => {
              const categoryName =
                categoryNameById.get(
                  item.categoryId,
                );

              if (!categoryName) {
                return null;
              }

              return (
                <KnowledgeCard
                  key={item.id}
                  knowledge={item}
                  categoryName={
                    categoryName
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-border bg-surface p-8">
            <p className="type-body text-text-secondary">
              현재 이 카테고리에 표시할
              정보가 없습니다.
            </p>
          </div>
        )}
      </PageContainer>
    </main>
  );
}

interface CategoryFilterProps {
  categories: Category[];
  selectedSlug: string | null;
}

function CategoryFilter({
  categories,
  selectedSlug,
}: CategoryFilterProps) {
  return (
    <nav
      aria-label="정보 주제 선택"
      className="flex flex-wrap gap-2"
    >
      <CategoryFilterLink
        href="/knowledge"
        label="전체"
        active={selectedSlug === null}
      />

      {categories.map((category) => (
        <CategoryFilterLink
          key={category.id}
          href={`/knowledge?category=${category.slug}`}
          label={category.name}
          active={
            selectedSlug === category.slug
          }
        />
      ))}
    </nav>
  );
}

interface CategoryFilterLinkProps {
  href: string;
  label: string;
  active: boolean;
}

function CategoryFilterLink({
  href,
  label,
  active,
}: CategoryFilterLinkProps) {
  return (
    <Link
      href={href}
      aria-current={
        active ? "page" : undefined
      }
      className={[
        "inline-flex",
        "min-h-11",
        "items-center",
        "rounded-control",
        "border",
        "px-4",
        "py-2",
        "type-label",
        "transition-colors",
        active
          ? "border-primary bg-secondary font-semibold text-primary"
          : "border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}