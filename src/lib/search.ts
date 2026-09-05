import {
  getPublishedKnowledge,
} from "@/lib/knowledge";

import type {
  Knowledge,
} from "@/types/content";

export const SEARCH_QUERY_MAX_LENGTH =
  100;

interface ScoredSearchResult {
  knowledge: Knowledge;
  score: number;
  sourceOrder: number;
}

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function normalizeQuery(
  query: string,
): string {
  const normalized =
    normalizeText(query);

  return Array.from(normalized)
    .slice(
      0,
      SEARCH_QUERY_MAX_LENGTH,
    )
    .join("");
}

function getQueryTokens(
  query: string,
): string[] {
  return [
    ...new Set(
      query
        .split(" ")
        .filter(Boolean),
    ),
  ];
}

function scoreKnowledge(
  knowledge: Knowledge,
  query: string,
): number {
  const title = normalizeText(
    knowledge.title,
  );

  const summary = normalizeText(
    knowledge.summary,
  );

  const keywords =
    knowledge.keywords.map(
      (keyword) =>
        normalizeText(keyword),
    );

  let score = 0;

  /*
   * 전체 Query 점수
   */
  if (title === query) {
    score += 120;
  } else if (
    title.includes(query)
  ) {
    score += 80;
  }

  if (
    keywords.some(
      (keyword) =>
        keyword === query,
    )
  ) {
    score += 70;
  } else if (
    keywords.some((keyword) =>
      keyword.includes(query),
    )
  ) {
    score += 50;
  }

  if (summary.includes(query)) {
    score += 30;
  }

  /*
   * 여러 단어 검색
   *
   * "퇴직금 지급"처럼 전체 문장이
   * 그대로 존재하지 않더라도
   * "퇴직금", "지급" 각각을 확인한다.
   */
  const tokens =
    getQueryTokens(query);

  if (tokens.length > 1) {
    let matchedTokenCount = 0;

    for (const token of tokens) {
      let tokenMatched = false;

      if (title === token) {
        score += 40;
        tokenMatched = true;
      } else if (
        title.includes(token)
      ) {
        score += 30;
        tokenMatched = true;
      }

      if (
        keywords.some(
          (keyword) =>
            keyword === token,
        )
      ) {
        score += 25;
        tokenMatched = true;
      } else if (
        keywords.some((keyword) =>
          keyword.includes(token),
        )
      ) {
        score += 18;
        tokenMatched = true;
      }

      if (
        summary.includes(token)
      ) {
        score += 8;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokenCount += 1;
      }
    }

    if (
      matchedTokenCount ===
      tokens.length
    ) {
      score += 15;
    }
  }

  return score;
}

export async function searchKnowledge(
  query: string,
): Promise<Knowledge[]> {
  const normalizedQuery =
    normalizeQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  const publishedKnowledge =
    await getPublishedKnowledge();

  const results: ScoredSearchResult[] =
    publishedKnowledge
      .map(
        (knowledge, index) => ({
          knowledge,
          score: scoreKnowledge(
            knowledge,
            normalizedQuery,
          ),
          sourceOrder: index,
        }),
      )
      .filter(
        (result) =>
          result.score > 0,
      );

  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return (
      a.sourceOrder -
      b.sourceOrder
    );
  });

  return results.map(
    (result) =>
      result.knowledge,
  );
}