import type {
  AISearchIntent,
  AISearchMatch,
} from "@/types/ai";

import type {
  Knowledge,
} from "@/types/content";

export const AI_SEARCH_PRIMARY_GUIDE_BONUS =
  4;

export const AI_SEARCH_SECONDARY_GUIDE_BONUS =
  2;

const MIN_AI_SEARCH_TEXT_SCORE =
  10;

const MAX_AI_SEARCH_RESULTS =
  5;

const STOP_TOKENS =
  new Set([
    "확인",
    "관련",
    "상황",
    "여부",
    "기준",
    "정보",
    "문제",
    "대응",
    "방법",
    "이해",
  ]);

type MatchStrength =
  | 0
  | 1
  | 2;

interface InternalMatch {
  knowledge: Knowledge;
  textualScore: number;
  score: number;
  matchedTerms: string[];
  sourceOrder: number;
}

function normalizeText(
  value: string,
): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}]+/gu,
      " ",
    )
    .trim()
    .replace(/\s+/g, " ");
}

function compactText(
  value: string,
): string {
  return normalizeText(
    value,
  ).replace(/\s+/g, "");
}

function textLength(
  value: string,
): number {
  return Array.from(
    value,
  ).length;
}

function getSignificantTokens(
  value: string,
): string[] {
  return normalizeText(
    value,
  )
    .split(" ")
    .filter(Boolean)
    .filter(
      (token) =>
        textLength(token) >= 2,
    )
    .filter(
      (token) =>
        !STOP_TOKENS.has(
          token,
        ),
    );
}

function getMatchStrength(
  searchValue: string,
  targetValue: string,
): MatchStrength {
  const search =
    normalizeText(
      searchValue,
    );

  const target =
    normalizeText(
      targetValue,
    );

  if (!search || !target) {
    return 0;
  }

  if (search === target) {
    return 2;
  }

  const compactSearch =
    compactText(search);

  const compactTarget =
    compactText(target);

  const shorterLength =
    Math.min(
      textLength(
        compactSearch,
      ),
      textLength(
        compactTarget,
      ),
    );

  /*
   * "퇴직" ↔ "퇴직금"
   * "근로계약" ↔ "근로계약서"
   *
   * 한 글자 우연 일치는
   * 부분일치로 보지 않는다.
   */
  if (
    shorterLength >= 2 &&
    (
      compactTarget.includes(
        compactSearch,
      ) ||
      compactSearch.includes(
        compactTarget,
      )
    )
  ) {
    return 1;
  }

  /*
   * 긴 intent 문장이
   * 완전히 동일하지 않을 때
   * 핵심 token이 모두 포함되는지
   * 한 번 더 확인한다.
   */
  const tokens =
    getSignificantTokens(
      search,
    );

  if (tokens.length === 0) {
    return 0;
  }

  const allTokensIncluded =
    tokens.every(
      (token) =>
        compactTarget.includes(
          compactText(token),
        ),
    );

  return allTokensIncluded
    ? 1
    : 0;
}

function scoreText(
  searchValue: string,
  targetValue: string,
  exactScore: number,
  partialScore: number,
): number {
  const strength =
    getMatchStrength(
      searchValue,
      targetValue,
    );

  if (strength === 2) {
    return exactScore;
  }

  if (strength === 1) {
    return partialScore;
  }

  return 0;
}

function scoreTextArray(
  searchValue: string,
  targetValues: string[],
  exactScore: number,
  partialScore: number,
): number {
  let bestScore = 0;

  for (
    const targetValue
    of targetValues
  ) {
    bestScore =
      Math.max(
        bestScore,
        scoreText(
          searchValue,
          targetValue,
          exactScore,
          partialScore,
        ),
      );
  }

  /*
   * 같은 검색어가 metadata 배열에서
   * 여러 번 일치해도 필드별 점수를
   * 무한 누적하지 않는다.
   */
  return bestScore;
}

function scoreKeyword(
  keyword: string,
  knowledge: Knowledge,
): number {
  return (
    scoreText(
      keyword,
      knowledge.title,
      12,
      9,
    ) +
    scoreTextArray(
      keyword,
      knowledge.keywords,
      10,
      7,
    ) +
    scoreTextArray(
      keyword,
      knowledge.intents,
      8,
      6,
    ) +
    scoreTextArray(
      keyword,
      knowledge.relatedQuestions,
      6,
      4,
    ) +
    scoreText(
      keyword,
      knowledge.summary,
      3,
      2,
    )
  );
}

function scoreIntent(
  intent: string,
  knowledge: Knowledge,
): number {
  return (
    scoreTextArray(
      intent,
      knowledge.intents,
      10,
      7,
    ) +
    scoreTextArray(
      intent,
      knowledge.keywords,
      6,
      4,
    ) +
    scoreTextArray(
      intent,
      knowledge.relatedQuestions,
      6,
      4,
    ) +
    scoreText(
      intent,
      knowledge.title,
      5,
      3,
    ) +
    scoreText(
      intent,
      knowledge.summary,
      3,
      2,
    )
  );
}

function addMatchedTerm(
  matchedTerms: string[],
  seenTerms: Set<string>,
  term: string,
): void {
  const normalized =
    normalizeText(term);

  if (
    !normalized ||
    seenTerms.has(
      normalized,
    )
  ) {
    return;
  }

  seenTerms.add(
    normalized,
  );

  matchedTerms.push(
    term.trim(),
  );
}

/*
 * Pure deterministic matcher.
 *
 * Step 8 검증에서는 Local Seed Source를
 * 직접 넣어서 OpenAI/Supabase 없이
 * 테스트할 수 있다.
 */
export function rankKnowledgeForAI(
  intent: AISearchIntent,
  knowledgeItems: Knowledge[],
  guideBonusByKnowledgeId:
    ReadonlyMap<string, number> =
      new Map(),
): AISearchMatch[] {
  const internalMatches:
    InternalMatch[] = [];

  knowledgeItems.forEach(
    (
      knowledge,
      sourceOrder,
    ) => {
      /*
       * Caller가 실수로 Draft까지
       * 넘겨도 결과에 포함시키지 않는다.
       */
      if (
        knowledge.status !==
        "published"
      ) {
        return;
      }

      let textualScore = 0;

      const matchedTerms:
        string[] = [];

      const seenTerms =
        new Set<string>();

      for (
        const keyword
        of intent.keywords
      ) {
        const keywordScore =
          scoreKeyword(
            keyword,
            knowledge,
          );

        textualScore +=
          keywordScore;

        /*
         * UI에 표시할 matchedTerms는
         * 긴 intent 문장이 아니라
         * 짧은 AI keyword만 사용한다.
         */
        if (
          keywordScore >= 4
        ) {
          addMatchedTerm(
            matchedTerms,
            seenTerms,
            keyword,
          );
        }
      }

      for (
        const searchIntent
        of intent.intents
      ) {
        textualScore +=
          scoreIntent(
            searchIntent,
            knowledge,
          );
      }

      /*
       * Guide만 맞는 결과는
       * 여기에서 제거된다.
       */
      if (
        textualScore <
        MIN_AI_SEARCH_TEXT_SCORE
      ) {
        return;
      }

      const guideBonus =
        guideBonusByKnowledgeId
          .get(
            knowledge.id,
          ) ?? 0;

      internalMatches.push({
        knowledge,
        textualScore,
        score:
          textualScore +
          guideBonus,
        matchedTerms,
        sourceOrder,
      });
    },
  );

  internalMatches.sort(
    (a, b) => {
      if (
        b.score !==
        a.score
      ) {
        return (
          b.score -
          a.score
        );
      }

      /*
       * getPublishedKnowledge()의
       * 안정적인 기존 순서를
       * 동점 처리 기준으로 사용한다.
       */
      return (
        a.sourceOrder -
        b.sourceOrder
      );
    },
  );

  return internalMatches
    .slice(
      0,
      MAX_AI_SEARCH_RESULTS,
    )
    .map(
      ({
        knowledge,
        score,
        matchedTerms,
      }) => ({
        knowledge,
        score,
        matchedTerms,
      }),
    );
}

/*
 * 실제 Runtime용 함수.
 *
 * OpenAI가 아니라 기존 DAL만 사용한다.
 */
export async function matchKnowledgeForAI(
  intent: AISearchIntent,
): Promise<AISearchMatch[]> {
  /*
   * 이 파일의 pure ranking 부분을
   * OpenAI/Supabase 없이 테스트할 수 있게
   * DAL은 실제 Runtime 호출 시점에만
   * 가져온다.
   */
  const {
    getKnowledgeByGuide,
    getPublishedKnowledge,
  } = await import(
    "@/lib/knowledge"
  );

  const uniqueGuideSlugs = [
    ...new Set(
      intent.guideSituations,
    ),
  ];

  const [
    knowledgeItems,
    guideGroups,
  ] = await Promise.all([
    getPublishedKnowledge(),

    Promise.all(
      uniqueGuideSlugs.map(
        (guideSlug) =>
          getKnowledgeByGuide(
            guideSlug,
          ),
      ),
    ),
  ]);

  const guideBonusByKnowledgeId =
    new Map<
      string,
      number
    >();

  for (
    const guideGroup
    of guideGroups
  ) {
    for (
      const relation
      of guideGroup
    ) {
      const bonus =
        relation.isPrimary
          ? AI_SEARCH_PRIMARY_GUIDE_BONUS
          : AI_SEARCH_SECONDARY_GUIDE_BONUS;

      const currentBonus =
        guideBonusByKnowledgeId
          .get(
            relation
              .knowledge
              .id,
          ) ?? 0;

      guideBonusByKnowledgeId.set(
        relation.knowledge.id,
        currentBonus +
          bonus,
      );
    }
  }

  return rankKnowledgeForAI(
    intent,
    knowledgeItems,
    guideBonusByKnowledgeId,
  );
}