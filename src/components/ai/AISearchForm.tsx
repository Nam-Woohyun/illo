"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Chip } from "@/components/ui/Chip";

import {
  AI_SEARCH_QUERY_MAX_LENGTH,
  GUIDE_SITUATION_SLUGS,
} from "@/types/ai";

import type {
  AISearchResponse,
  AISearchResult,
  GuideSituationSlug,
} from "@/types/ai";

const exampleQuestions = [
  "회사에서 갑자기 내일부터 나오지 말라고 했어요.",
  "퇴사했는데 월급과 퇴직금을 아직 못 받았어요.",
  "입사했는데 근로계약서를 쓰지 않았어요.",
  "상사가 다른 직원들 앞에서 계속 욕해요.",
] as const;

const GENERIC_ERROR_MESSAGE =
  "지금은 AI로 관련 정보를 찾기 어렵습니다. 잠시 후 다시 시도해주세요.";

type UnknownRecord =
  Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item ===
        "string",
    )
  );
}

function isGuideSituationSlug(
  value: unknown,
): value is GuideSituationSlug {
  return (
    typeof value ===
      "string" &&
    GUIDE_SITUATION_SLUGS.some(
      (slug) =>
        slug === value,
    )
  );
}

function isPublicGuide(
  value: unknown,
): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isGuideSituationSlug(
      value.slug,
    ) &&
    typeof value.name ===
      "string"
  );
}

function isSearchResult(
  value: unknown,
): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id ===
      "string" &&
    typeof value.slug ===
      "string" &&
    typeof value.title ===
      "string" &&
    typeof value.summary ===
      "string" &&
    typeof value.categoryName ===
      "string" &&
    isStringArray(
      value.matchedTerms,
    )
  );
}

function isAISearchResponse(
  value: unknown,
): value is AISearchResponse {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.outcome !==
      "matched" &&
    value.outcome !==
      "no-signal" &&
    value.outcome !==
      "no-match"
  ) {
    return false;
  }

  if (
    !isRecord(
      value.analysis,
    )
  ) {
    return false;
  }

  if (
    !isStringArray(
      value.analysis
        .keywords,
    )
  ) {
    return false;
  }

  if (
    !Array.isArray(
      value.analysis
        .guideSituations,
    ) ||
    !value.analysis
      .guideSituations
      .every(
        isPublicGuide,
      )
  ) {
    return false;
  }

  if (
    !Array.isArray(
      value.results,
    ) ||
    !value.results.every(
      isSearchResult,
    )
  ) {
    return false;
  }

  return true;
}

function getServerErrorMessage(
  value: unknown,
): string | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.error !==
    "string"
  ) {
    return null;
  }

  return value.error;
}

function getTextLength(
  value: string,
): number {
  return Array.from(value).length;
}

export function AISearchForm() {
  const [
    query,
    setQuery,
  ] = useState("");

  const [
    result,
    setResult,
  ] =
    useState<AISearchResponse | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const queryLength =
    getTextLength(query);

  function clearPreviousResult() {
    setResult(null);
    setError(null);
  }

  function handleExampleClick(
    example: string,
  ) {
    setQuery(example);
    clearPreviousResult();
  }

  function handleQueryChange(
    value: string,
  ) {
    setQuery(value);

    if (
      result !== null ||
      error !== null
    ) {
      clearPreviousResult();
    }
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedQuery =
      query
        .trim()
        .replace(/\s+/g, " ");

    if (!normalizedQuery) {
      setResult(null);

      setError(
        "현재 상황을 입력해주세요.",
      );

      return;
    }

    if (
      getTextLength(
        normalizedQuery,
      ) >
      AI_SEARCH_QUERY_MAX_LENGTH
    ) {
      setResult(null);

      setError(
        `현재 상황은 ${AI_SEARCH_QUERY_MAX_LENGTH}자 이내로 입력해주세요.`,
      );

      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response =
        await fetch(
          "/api/ai-search",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                query:
                  normalizedQuery,
              }),

            cache: "no-store",
          },
        );

      if (response.status === 429) {
        setError(
          "짧은 시간에 요청이 많았습니다. 잠시 후 다시 시도해주세요.",
        );

        return;
      }

      const payload:
        unknown =
        await response
          .json()
          .catch(
            () => null,
          );

      if (!response.ok) {
        setError(
          getServerErrorMessage(
            payload,
          ) ??
            GENERIC_ERROR_MESSAGE,
        );

        return;
      }

      if (
        !isAISearchResponse(
          payload,
        )
      ) {
        setError(
          GENERIC_ERROR_MESSAGE,
        );

        return;
      }

      setResult(payload);
    } catch {
      setError(
        GENERIC_ERROR_MESSAGE,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        aria-busy={
          isLoading ||
          undefined
        }
      >
        <div>
          <label
            htmlFor="ai-search-query"
            className="type-label text-text"
          >
            현재 상황을
            설명해주세요
          </label>

          <textarea
            id="ai-search-query"
            value={query}
            onChange={(event) =>
              handleQueryChange(
                event.target.value,
              )
            }
            placeholder="예: 회사에서 갑자기 내일부터 나오지 말라고 했어요."
            maxLength={
              AI_SEARCH_QUERY_MAX_LENGTH
            }
            disabled={isLoading}
            aria-describedby="ai-search-help ai-search-count"
            className={[
              "mt-3",
              "min-h-40",
              "w-full",
              "resize-y",
              "rounded-control",
              "border",
              "border-border",
              "bg-surface",
              "p-4",
              "type-body",
              "text-text",
              "outline-none",
              "transition-colors",
              "placeholder:text-muted",
              "hover:border-[#C9D1CE]",
              "focus:border-primary",
              "focus:ring-2",
              "focus:ring-[var(--focus-ring)]",
              "disabled:cursor-wait",
              "disabled:bg-bg",
            ].join(" ")}
          />

          <div className="mt-2 flex items-start justify-between gap-4">
            <p
              id="ai-search-help"
              className="type-caption text-text-secondary"
            >
              주민등록번호,
              전화번호 등 개인
              식별정보는 입력하지
              마세요.
            </p>

            <p
              id="ai-search-count"
              className="type-caption shrink-0 text-text-secondary"
            >
              {queryLength} /{" "}
              {
                AI_SEARCH_QUERY_MAX_LENGTH
              }
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="type-label text-text">
            예시로 시작해보기
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {exampleQuestions.map(
              (example) => (
                <button
                  key={example}
                  type="button"
                  disabled={
                    isLoading
                  }
                  onClick={() =>
                    handleExampleClick(
                      example,
                    )
                  }
                  className={[
                    "min-h-11",
                    "max-w-full",
                    "rounded-control",
                    "border",
                    "border-border",
                    "bg-surface",
                    "px-3",
                    "py-2",
                    "text-left",
                    "type-body-sm",
                    "text-text-secondary",
                    "transition-colors",
                    "hover:border-primary",
                    "hover:text-primary",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                  ].join(" ")}
                >
                  {example}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-7">
          <Button
            type="submit"
            size="large"
            loading={isLoading}
            className="w-full tablet:w-auto"
          >
            관련 정보 찾기
          </Button>
        </div>
      </form>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 min-h-6"
      >
        {isLoading && (
          <p className="type-body-sm text-text-secondary">
            관련 정보를 찾고
            있습니다...
          </p>
        )}

        {!isLoading &&
          result && (
            <p className="sr-only">
              {result.outcome ===
              "matched"
                ? `${result.results.length}개의 관련 정보를 찾았습니다.`
                : result.outcome ===
                    "no-signal"
                  ? "검색에 사용할 핵심 정보를 찾지 못했습니다."
                  : "현재 제공 중인 정보에서 관련 결과를 찾지 못했습니다."}
            </p>
          )}
      </div>

      {!isLoading &&
        error && (
          <div
            role="alert"
            className="mt-4"
          >
            <Callout
              variant="caution"
              title="정보를 찾지 못했습니다"
            >
              {error}
            </Callout>
          </div>
        )}

      {!isLoading &&
        result && (
          <AISearchOutput
            data={result}
          />
        )}
    </div>
  );
}

interface AISearchOutputProps {
  data: AISearchResponse;
}

function AISearchOutput({
  data,
}: AISearchOutputProps) {
  const hasAnalysis =
    data.analysis.keywords
      .length > 0 ||
    data.analysis
      .guideSituations
      .length > 0;

  return (
    <div className="mt-10">
      {hasAnalysis && (
        <section
          aria-labelledby="ai-analysis-title"
          className="border-t border-border pt-8"
        >
          <h2
            id="ai-analysis-title"
            className="type-h2 text-text"
          >
            질문에서 찾은 핵심
          </h2>

          {data.analysis
            .keywords.length >
            0 && (
            <div className="mt-5">
              <p className="type-label text-text">
                핵심 표현
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {data.analysis.keywords.map(
                  (keyword) => (
                    <Chip
                      key={
                        keyword
                      }
                      variant="primary"
                      className="max-w-full"
                    >
                      <span className="min-w-0 break-words text-primary-hover">
                        {keyword}
                      </span>
                    </Chip>
                  ),
                )}
              </div>
            </div>
          )}

          {data.analysis
            .guideSituations
            .length > 0 && (
            <div className="mt-5">
              <p className="type-label text-text">
                관련 상황
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {data.analysis.guideSituations.map(
                  (guide) => (
                    <Chip
                      key={
                        guide.slug
                      }
                      variant="situation"
                      className="max-w-full"
                    >
                      <span className="min-w-0 break-words text-primary-hover">
                        {guide.name}
                      </span>
                    </Chip>
                  ),
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {data.outcome ===
        "matched" && (
        <MatchedResults
          results={
            data.results
          }
        />
      )}

      {data.outcome ===
        "no-signal" && (
        <NoSignalState />
      )}

      {data.outcome ===
        "no-match" && (
        <NoMatchState />
      )}
    </div>
  );
}

interface MatchedResultsProps {
  results: AISearchResult[];
}

function MatchedResults({
  results,
}: MatchedResultsProps) {
  return (
    <section
      aria-labelledby="ai-results-title"
      className="mt-10 border-t border-border pt-8"
    >
      <div>
        <h2
          id="ai-results-title"
          className="type-h2 text-text"
        >
          관련 정보
        </h2>

        <p className="type-body mt-3 text-text-secondary">
          현재 일로에서
          제공하는 정보 중{" "}
          <strong className="font-semibold text-text">
            {results.length}
          </strong>
          개를 찾았습니다.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {results.map(
          (result) => (
            <AIResultItem
              key={result.id}
              result={result}
            />
          ),
        )}
      </div>
    </section>
  );
}

interface AIResultItemProps {
  result: AISearchResult;
}

function AIResultItem({
  result,
}: AIResultItemProps) {
  return (
    <article>
      <Link
        href={`/knowledge/${result.slug}`}
        className={[
          "group",
          "flex",
          "h-full",
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
        <Badge>
          <span className="text-primary-hover">
            {result.categoryName}
          </span>
        </Badge>

        <h3 className="type-h3 mt-4 text-text transition-colors group-hover:text-primary">
          {result.title}
        </h3>

        <p className="type-body-sm mt-3 text-text-secondary">
          {result.summary}
        </p>

        {result.matchedTerms
          .length > 0 && (
          <div className="mt-5">
            <p className="type-caption font-semibold text-text-secondary">
              연결된 핵심
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {result.matchedTerms.map(
                (term) => (
                  <Chip
                    key={term}
                    variant="primary"
                    className="max-w-full"
                  >
                    <span className="min-w-0 break-words text-primary-hover">
                      {term}
                    </span>
                  </Chip>
                ),
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-5 type-label text-primary">
          정보 보기

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

function NoSignalState() {
  return (
    <section
      aria-labelledby="ai-no-signal-title"
      className="mt-8 rounded-card border border-border bg-surface p-6 tablet:p-8"
    >
      <p className="type-label text-text-secondary">
        분석할 정보가 부족합니다
      </p>

      <h2
        id="ai-no-signal-title"
        className="type-h2 mt-3 text-text"
      >
        일하면서 겪은 상황이나
        궁금한 점을 조금 더
        구체적으로 설명해주세요
      </h2>

      <p className="type-body mt-4 text-text-secondary">
        예시처럼 회사에서
        어떤 일이 있었는지,
        무엇이 궁금한지를
        문장으로 적어보세요.
      </p>
    </section>
  );
}

function NoMatchState() {
  return (
    <section
      aria-labelledby="ai-no-match-title"
      className="mt-8 rounded-card border border-border bg-surface p-6 tablet:p-8"
    >
      <p className="type-label text-text-secondary">
        관련 정보 없음
      </p>

      <h2
        id="ai-no-match-title"
        className="type-h2 mt-3 text-text"
      >
        현재 일로에서 제공하는
        정보 중 이 상황과 충분히
        가까운 내용을 찾지 못했습니다
      </h2>

      <p className="type-body mt-4 text-text-secondary">
        AI가 새로운 답을
        만들어내기보다, 일로에
        등록된 정보 안에서
        관련된 내용을 찾습니다.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          href="/search"
          className="inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
        >
          일반 검색
          <span
            aria-hidden="true"
            className="ml-2"
          >
            →
          </span>
        </Link>

        <Link
          href="/guide"
          className="inline-flex min-h-11 items-center type-label text-text-secondary transition-colors hover:text-primary"
        >
          상황별 찾기
          <span
            aria-hidden="true"
            className="ml-2"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
