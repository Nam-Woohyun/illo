import {
  NextResponse,
} from "next/server";

import {
  matchKnowledgeForAI,
} from "@/lib/ai-search";

import {
  getAllCategories,
  getAllGuideSituations,
} from "@/lib/knowledge";

import {
  AISearchIntentError,
  extractAISearchIntent,
} from "@/lib/openai/extract-intent";

import {
  AI_SEARCH_QUERY_MAX_LENGTH,
} from "@/types/ai";

import type {
  AISearchErrorResponse,
  AISearchPublicAnalysis,
  AISearchResponse,
  AISearchResult,
  GuideSituationSlug,
} from "@/types/ai";

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

function getTextLength(
  value: string,
): number {
  return Array.from(value).length;
}

function jsonNoStore<T>(
  body: T,
  status = 200,
) {
  return NextResponse.json(
    body,
    {
      status,
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    },
  );
}

function errorResponse(
  error: string,
  status: number,
) {
  return jsonNoStore<
    AISearchErrorResponse
  >(
    {
      error,
    },
    status,
  );
}

function handleIntentError(
  error: AISearchIntentError,
) {
  switch (error.code) {
    case "invalid_query":
      return errorResponse(
        "입력한 내용을 다시 확인해주세요.",
        400,
      );

    case "refusal":
      return errorResponse(
        "입력 내용을 검색용으로 분석하지 못했습니다. 상황을 다른 표현으로 작성해보세요.",
        422,
      );

    case "incomplete":
    case "missing_output":
    case "api_error":
      return errorResponse(
        "지금은 AI로 관련 정보를 찾기 어렵습니다. 잠시 후 다시 시도해주세요.",
        502,
      );
  }
}

export async function POST(
  request: Request,
) {
  let body: unknown;

  try {
    body =
      await request.json();
  } catch {
    return errorResponse(
      "요청 형식이 올바르지 않습니다.",
      400,
    );
  }

  if (!isRecord(body)) {
    return errorResponse(
      "요청 형식이 올바르지 않습니다.",
      400,
    );
  }

  const rawQuery =
    body.query;

  if (
    typeof rawQuery !==
    "string"
  ) {
    return errorResponse(
      "현재 상황을 문장으로 입력해주세요.",
      400,
    );
  }

  const query =
    rawQuery.trim();

  if (!query) {
    return errorResponse(
      "현재 상황을 입력해주세요.",
      400,
    );
  }

  const queryLength =
    getTextLength(query);

  if (
    queryLength >
    AI_SEARCH_QUERY_MAX_LENGTH
  ) {
    return errorResponse(
      `현재 상황은 ${AI_SEARCH_QUERY_MAX_LENGTH}자 이내로 입력해주세요.`,
      400,
    );
  }

  let intent;

  try {
    intent =
      await extractAISearchIntent(
        query,
      );
  } catch (error) {
    if (
      error instanceof
      AISearchIntentError
    ) {
      return handleIntentError(
        error,
      );
    }

    console.error(
      "[AI Search API] Intent Extraction 처리 중 예상하지 못한 오류",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",
        queryLength,
      },
    );

    return errorResponse(
      "지금은 AI로 관련 정보를 찾기 어렵습니다. 잠시 후 다시 시도해주세요.",
      500,
    );
  }

  const hasAnySignal =
    intent.keywords.length > 0 ||
    intent.intents.length > 0 ||
    intent.guideSituations.length >
      0;

  /*
   * 의미 있는 분석 신호가 없다면
   * Supabase / Matcher까지 갈 필요가 없다.
   */
  if (!hasAnySignal) {
    const response:
      AISearchResponse = {
        outcome: "no-signal",

        analysis: {
          keywords: [],
          guideSituations: [],
        },

        results: [],
      };

    return jsonNoStore(
      response,
    );
  }

  try {
    const matches =
      await matchKnowledgeForAI(
        intent,
      );

    /*
     * Category와 Guide 이름은
     * Browser가 DB를 다시 조회하지 않도록
     * 서버에서 조합한다.
     */
    const [
      categories,
      guides,
    ] = await Promise.all([
      getAllCategories(),
      getAllGuideSituations(),
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

    const guideNameBySlug =
      new Map(
        guides.map(
          (guide) => [
            guide.slug,
            guide.name,
          ],
        ),
      );

    const results:
      AISearchResult[] =
      matches.map(
        (match) => {
          const categoryName =
            categoryNameById.get(
              match.knowledge
                .categoryId,
            );

          if (!categoryName) {
            throw new Error(
              `[AI Search API] Knowledge ${match.knowledge.slug}의 Category를 찾을 수 없습니다.`,
            );
          }

          return {
            id:
              match.knowledge.id,

            slug:
              match.knowledge.slug,

            title:
              match.knowledge.title,

            summary:
              match.knowledge.summary,

            categoryName,

            matchedTerms: [
              ...match.matchedTerms,
            ],
          };
        },
      );

    const publicGuides =
      intent.guideSituations.map(
        (slug) => {
          const name =
            guideNameBySlug.get(
              slug,
            );

          if (!name) {
            throw new Error(
              `[AI Search API] Guide ${slug}를 찾을 수 없습니다.`,
            );
          }

          return {
            slug:
              slug as GuideSituationSlug,
            name,
          };
        },
      );

    const analysis:
      AISearchPublicAnalysis = {
        keywords: [
          ...intent.keywords,
        ],

        guideSituations:
          publicGuides,
      };

    const response:
      AISearchResponse = {
        outcome:
          results.length > 0
            ? "matched"
            : "no-match",

        analysis,
        results,
      };

    return jsonNoStore(
      response,
    );
  } catch (error) {
    /*
     * Query 원문은 로그에 남기지 않는다.
     */
    console.error(
      "[AI Search API] Knowledge Matching 처리 실패",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",

        message:
          error instanceof Error
            ? error.message
            : "Unknown error",

        queryLength,
      },
    );

    return errorResponse(
      "지금은 AI로 관련 정보를 찾기 어렵습니다. 잠시 후 다시 시도해주세요.",
      500,
    );
  }
}