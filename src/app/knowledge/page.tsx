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
          title="인사노무 정보"
          description="일하면서 알아두면 좋은 인사노무 정보를 주제별로 살펴보세요."
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
      aria-label="인사노무 정보 카테고리"
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