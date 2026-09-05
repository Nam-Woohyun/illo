import type { Metadata } from "next";
import Link from "next/link";

import { KnowledgeCard } from "@/components/content/KnowledgeCard";
import {
  getGuidePresentation,
} from "@/components/guide/guidePresentation";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/search/SearchInput";
import { Chip } from "@/components/ui/Chip";

import {
  getAllCategories,
  getAllGuideSituations,
  getKnowledgeBySlug,
} from "@/lib/knowledge";

import type {
  GuideSituation,
  Knowledge,
} from "@/types/content";

export const metadata: Metadata = {
  title: {
    absolute:
      "일로 | 일하다 궁금한 순간, 필요한 정보로",
  },
  description:
    "법률 용어를 몰라도 자신의 상황에서 출발해 필요한 인사노무 정보와 공식 근거를 찾아볼 수 있습니다.",
};

/*
 * 실제 조회수 순위가 아니라
 * Home에서 P1 핵심 범위를 보여주기 위한
 * curated Knowledge 목록입니다.
 */
const featuredKnowledgeSlugs = [
  "employment-contract",
  "minimum-wage",
  "annual-leave-basics",
  "severance-pay",
  "wage-arrears-response",
  "workplace-harassment",
] as const;

const trustSteps = [
  {
    number: "01",
    title: "쉽게 설명",
    description:
      "어려운 법률 표현을 일상적인 언어로 먼저 풀어 설명합니다.",
  },
  {
    number: "02",
    title: "핵심 내용",
    description:
      "실제로 확인해야 할 조건과 기준을 중심으로 정리합니다.",
  },
  {
    number: "03",
    title: "상황 예시",
    description:
      "실제 일하면서 겪을 수 있는 상황과 정보를 연결합니다.",
  },
  {
    number: "04",
    title: "법적 근거",
    description:
      "관련 법령과 조문을 함께 확인할 수 있도록 구성합니다.",
  },
  {
    number: "05",
    title: "공식 출처",
    description:
      "정부기관과 공공기관의 원문 자료로 다시 확인할 수 있습니다.",
  },
] as const;

export default async function HomePage() {
  const [
    guides,
    categories,
    aiExampleKnowledge,
  ] = await Promise.all([
    getAllGuideSituations(),
    getAllCategories(),
    getKnowledgeBySlug(
      "dismissal-notice",
    ),
  ]);

  const categoryNameById = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ]),
  );

  const featuredResults =
    await Promise.all(
      featuredKnowledgeSlugs.map(
        (slug) =>
          getKnowledgeBySlug(slug),
      ),
    );

  const featuredItems: {
    knowledge: Knowledge;
    categoryName: string;
  }[] = [];

  for (
    const item of featuredResults
  ) {
    if (
      !item ||
      item.status !== "published"
    ) {
      continue;
    }

    const categoryName =
      categoryNameById.get(
        item.categoryId,
      );

    if (!categoryName) {
      continue;
    }

    featuredItems.push({
      knowledge: item,
      categoryName,
    });
  }

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <PageContainer className="py-16 tablet:py-20 desktop:py-24">
          <div className="max-w-article">
            <p className="type-label text-primary">
              일로 ILLO
            </p>

            <h1 className="type-display mt-4 text-text">
              일하다 궁금한 순간,
              필요한 정보로.
            </h1>

            <p className="type-body-lg mt-5 text-text-secondary">
              사회초년생과 근로자가
              자신의 상황에서 출발해
              필요한 정보를 쉽게 찾고
              확인할 수 있도록
              돕는 서비스입니다.
            </p>

            <div className="mt-8">
              <SearchInput
                id="home-search"
                label="궁금한 정보 검색"
                placeholder="근로계약서, 연차, 퇴직금 등을 검색해보세요"
                buttonLabel="검색"
                required
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/guide"
                className={[
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
                상황별로 찾기
                <span
                  aria-hidden="true"
                  className="ml-2"
                >
                  →
                </span>
              </Link>

              <Link
                href="/ai-search"
                className="inline-flex min-h-11 items-center type-label text-text-secondary transition-colors hover:text-primary"
              >
                문장으로 질문하고 싶다면
                AI로 찾기
                <span
                  aria-hidden="true"
                  className="ml-2"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Guide */}
      <section
        aria-labelledby="home-guide-title"
      >
        <PageContainer className="py-16 desktop:py-20">
          <SectionHeading
            id="home-guide-title"
            title="지금 어떤 상황인가요?"
            description="법률 용어 대신 지금 처한 상황과 가장 가까운 항목에서 시작해보세요."
            href="/guide"
            linkLabel="모든 상황 보기"
          />

          <div className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-6">
            {guides.map(
              (guide, index) => {
                const presentation =
                  getGuidePresentation(
                    guide.slug,
                  );

                const gridClassName =
                  index < 3
                    ? "desktop:col-span-2"
                    : "desktop:col-span-3";

                return (
                  <HomeGuideCard
                    key={guide.id}
                    guide={guide}
                    description={
                      presentation
                        ?.description ??
                      "현재 상황과 관련된 정보를 확인해보세요."
                    }
                    className={
                      gridClassName
                    }
                  />
                );
              },
            )}
          </div>
        </PageContainer>
      </section>

      {/* Featured Knowledge */}
      <section
        aria-labelledby="home-knowledge-title"
        className="border-y border-border bg-surface"
      >
        <PageContainer className="py-16 desktop:py-20">
          <SectionHeading
            id="home-knowledge-title"
            title="많이 찾는 정보"
            description="현재 제공 중인 핵심 정보 가운데 먼저 살펴보기 좋은 주제를 모았습니다."
            href="/knowledge"
            linkLabel="전체 정보 보기"
          />

          <div className="mt-8 grid gap-5 tablet:auto-rows-fr tablet:grid-cols-2 desktop:grid-cols-3">
            {featuredItems.map(
              (item) => (
                <KnowledgeCard
                  key={
                    item.knowledge.id
                  }
                  knowledge={
                    item.knowledge
                  }
                  categoryName={
                    item.categoryName
                  }
                  headingLevel={3}
                  variant="compact"
                />
              ),
            )}
          </div>
        </PageContainer>
      </section>

      {/* AI */}
      <section
        aria-labelledby="home-ai-title"
      >
        <PageContainer className="py-16 desktop:py-20">
          <div className="overflow-hidden rounded-card border border-border bg-surface desktop:grid desktop:grid-cols-2">
            <div className="p-6 tablet:p-8 desktop:p-10">
              <p className="type-label text-primary">
                AI로 찾기
              </p>

              <h2
                id="home-ai-title"
                className="type-h2 mt-3 text-text"
              >
                상황을 말로 설명해도
                괜찮아요
              </h2>

              <p className="type-body mt-4 text-text-secondary">
                정확한 법률 용어를
                모르더라도 지금 겪고 있는
                상황을 자연어로 입력하면,
                질문의 핵심을 분석해 관련
                정보를 찾을 수 있도록
                돕습니다.
              </p>

              <p className="type-body-sm mt-5 text-muted">
                법률 판단이 아닌 관련 정보
                탐색을 돕는 기능입니다.
              </p>

              <Link
                href="/ai-search"
                className="mt-7 inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
              >
                AI로 관련 정보 찾기
                <span
                  aria-hidden="true"
                  className="ml-2"
                >
                  →
                </span>
              </Link>
            </div>

            <div className="border-t border-border bg-[var(--callout-summary-bg)] p-6 tablet:p-8 desktop:border-l desktop:border-t-0 desktop:p-10">
              <p className="type-caption font-semibold text-muted">
                탐색 예시
              </p>

              <p className="type-h3 mt-3 text-text">
                “회사에서 갑자기
                내일부터 나오지 말래요.”
              </p>

              <div className="mt-6">
                <p className="type-label text-text">
                  질문에서 찾은 핵심
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip variant="primary">
                    해고
                  </Chip>

                  <Chip>
                    갑작스러운 통보
                  </Chip>
                </div>
              </div>

              {aiExampleKnowledge && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="type-label text-text">
                    관련 정보
                  </p>

                  <p className="type-h3 mt-2 text-primary">
                    {
                      aiExampleKnowledge.title
                    }
                  </p>

                  <p className="type-body-sm mt-2 text-text-secondary">
                    {
                      aiExampleKnowledge.summary
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Trust */}
      <section
        aria-labelledby="home-trust-title"
        className="border-y border-border bg-surface"
      >
        <PageContainer className="py-16 desktop:py-20">
          <SectionHeading
            id="home-trust-title"
            title="정보는 이렇게 정리합니다"
            description="쉬운 이해를 먼저 제공하고, 필요한 경우 법적 근거와 공식 출처까지 이어서 확인할 수 있게 구성합니다."
          />

          <ol className="mt-8 desktop:grid desktop:grid-cols-5">
            {trustSteps.map(
              (step, index) => (
                <li
                  key={
                    step.number
                  }
                  className={[
                    "border-t",
                    "border-border",
                    "py-5",
                    "desktop:border-l",
                    "desktop:border-t-0",
                    "desktop:px-5",
                    "desktop:py-0",
                    index === 0
                      ? "desktop:border-l-0 desktop:pl-0"
                      : "",
                    index ===
                    trustSteps.length -
                      1
                      ? "desktop:pr-0"
                      : "",
                  ].join(" ")}
                >
                  <p className="type-caption font-semibold text-primary">
                    {step.number}
                  </p>

                  <h3 className="type-h3 mt-2 text-text">
                    {step.title}
                  </h3>

                  <p className="type-body-sm mt-2 text-text-secondary">
                    {
                      step.description
                    }
                  </p>
                </li>
              ),
            )}
          </ol>

          <p className="type-body-sm mt-8 text-text-secondary">
            국가법령정보센터,
            고용노동부, 공공기관 공식
            자료를 기준으로 내용을
            확인합니다.
          </p>
        </PageContainer>
      </section>

      {/* About */}
      <section
        aria-labelledby="home-about-title"
      >
        <PageContainer className="py-16 desktop:py-20">
          <div className="max-w-article">
            <p className="type-label text-primary">
              About Project
            </p>

            <h2
              id="home-about-title"
              className="type-h2 mt-3 text-text"
            >
              왜 이런 서비스를
              만들었나요?
            </h2>

            <p className="type-body-lg mt-4 text-text-secondary">
              법률 용어부터 찾아야 하는
              기존 탐색 방식 대신,
              사용자의 실제 상황에서
              필요한 정보를 찾을 수 있는
              인사노무 정보 서비스를 직접
              기획하고 개발했습니다.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
            >
              프로젝트 소개
              <span
                aria-hidden="true"
                className="ml-2"
              >
                →
              </span>
            </Link>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}

interface SectionHeadingProps {
  id: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}

function SectionHeading({
  id,
  title,
  description,
  href,
  linkLabel,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 tablet:flex-row tablet:items-end tablet:justify-between">
      <div className="max-w-article">
        <h2
          id={id}
          className="type-h2 text-text"
        >
          {title}
        </h2>

        {description && (
          <p className="type-body mt-3 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center self-start type-label text-primary transition-colors hover:text-primary-hover tablet:self-auto"
        >
          {linkLabel}
          <span
            aria-hidden="true"
            className="ml-2"
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}

interface HomeGuideCardProps {
  guide: GuideSituation;
  description: string;
  className?: string;
}

function HomeGuideCard({
  guide,
  description,
  className = "",
}: HomeGuideCardProps) {
  return (
    <article
      className={[
        "h-full",
        className,
      ].join(" ")}
    >
      <Link
        href={`/guide/${guide.slug}`}
        className={[
          "group",
          "flex",
          "h-full",
          "min-h-40",
          "flex-col",
          "rounded-card",
          "border",
          "border-border",
          "bg-surface",
          "p-5",
          "transition-all",
          "duration-150",
          "hover:border-[#C9D1CE]",
          "hover:shadow-hover",
          "tablet:p-6",
        ].join(" ")}
      >
        <h3 className="type-h3 text-text transition-colors group-hover:text-primary">
          {guide.name}
        </h3>

        <p className="type-body-sm mt-3 text-text-secondary">
          {description}
        </p>

        <div className="mt-auto pt-5 type-label text-primary">
          살펴보기
          <span
            aria-hidden="true"
            className="ml-2"
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}