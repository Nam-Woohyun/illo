import {
  AI_SEARCH_PRIMARY_GUIDE_BONUS,
  AI_SEARCH_SECONDARY_GUIDE_BONUS,
  rankKnowledgeForAI,
} from "../src/lib/ai-search.ts";

import {
  guideSituations,
} from "../src/data/guides.ts";

import {
  knowledge,
} from "../src/data/knowledge.ts";

import {
  knowledgeGuides,
} from "../src/data/relations.ts";

import type {
  AISearchIntent,
} from "../src/types/ai.ts";

function createGuideBonusMap(
  intent: AISearchIntent,
): Map<string, number> {
  const result =
    new Map<
      string,
      number
    >();

  for (
    const guideSlug
    of intent.guideSituations
  ) {
    const guide =
      guideSituations.find(
        (item) =>
          item.slug ===
          guideSlug,
      );

    if (!guide) {
      throw new Error(
        `Guide를 찾을 수 없습니다: ${guideSlug}`,
      );
    }

    const relations =
      knowledgeGuides.filter(
        (relation) =>
          relation.guideId ===
          guide.id,
      );

    for (
      const relation
      of relations
    ) {
      const bonus =
        relation.isPrimary
          ? AI_SEARCH_PRIMARY_GUIDE_BONUS
          : AI_SEARCH_SECONDARY_GUIDE_BONUS;

      const current =
        result.get(
          relation.knowledgeId,
        ) ?? 0;

      result.set(
        relation.knowledgeId,
        current + bonus,
      );
    }
  }

  return result;
}

function runMatcher(
  intent: AISearchIntent,
) {
  const published =
    knowledge.filter(
      (item) =>
        item.status ===
        "published",
    );

  return rankKnowledgeForAI(
    intent,
    published,
    createGuideBonusMap(
      intent,
    ),
  );
}

function assert(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `✗ ${message}`,
    );
  }
}

function printResults(
  name: string,
  intent: AISearchIntent,
) {
  const results =
    runMatcher(intent);

  console.log("");
  console.log(name);

  console.table(
    results.map(
      (
        result,
        index,
      ) => ({
        rank:
          index + 1,
        title:
          result
            .knowledge
            .title,
        slug:
          result
            .knowledge
            .slug,
        score:
          result.score,
        matchedTerms:
          result
            .matchedTerms
            .join(", "),
      }),
    ),
  );

  return results;
}

/*
 * A — 갑작스러운 해고
 */
const testA =
  printResults(
    "A — 해고",
    {
      keywords: [
        "해고",
        "갑작스러운 통보",
      ],

      intents: [
        "갑작스러운 해고 통보",
        "해고예고 기준 확인",
      ],

      guideSituations: [
        "problem",
      ],
    },
  );

assert(
  testA[0]?.knowledge.slug ===
    "dismissal-notice",
  "A: 해고예고가 1순위여야 합니다.",
);


/*
 * B — 퇴사 후 월급 + 퇴직금 미지급
 */
const testB =
  printResults(
    "B — 임금 + 퇴직",
    {
      keywords: [
        "월급",
        "퇴직금",
        "미지급",
      ],

      intents: [
        "퇴사 후 임금 미지급",
        "퇴직금 미지급",
      ],

      guideSituations: [
        "pay",
        "leave-work",
      ],
    },
  );

assert(
  testB[0]?.knowledge.slug ===
    "wage-arrears-response",
  "B: 임금체불 대응이 1순위여야 합니다.",
);

const testBTopTwo =
  testB
    .slice(0, 2)
    .map(
      (result) =>
        result
          .knowledge
          .slug,
    );

assert(
  testBTopTwo.includes(
    "severance-pay",
  ),
  "B: 퇴직금이 상위 2개 안에 있어야 합니다.",
);


/*
 * C — 근로계약서 미작성
 */
const testC =
  printResults(
    "C — 근로계약서",
    {
      keywords: [
        "계약서",
        "근로계약",
      ],

      intents: [
        "근로계약서 미작성",
      ],

      guideSituations: [
        "start-work",
      ],
    },
  );

assert(
  testC[0]?.knowledge.slug ===
    "employment-contract",
  "C: 근로계약서가 1순위여야 합니다.",
);


/*
 * D — 직장 내 괴롭힘
 */
const testD =
  printResults(
    "D — 괴롭힘",
    {
      keywords: [
        "괴롭힘",
        "욕",
        "모욕",
      ],

      intents: [
        "직장 내 괴롭힘 확인",
      ],

      guideSituations: [
        "problem",
      ],
    },
  );

assert(
  testD[0]?.knowledge.slug ===
    "workplace-harassment",
  "D: 직장 내 괴롭힘이 1순위여야 합니다.",
);


/*
 * E — 현재 Coverage 밖
 */
const testE =
  printResults(
    "E — 육아휴직",
    {
      keywords: [
        "육아휴직",
      ],

      intents: [
        "육아휴직 신청",
      ],

      guideSituations: [
        "work-condition",
      ],
    },
  );

assert(
  testE.length === 0,
  "E: 육아휴직은 현재 P1에서 결과가 없어야 합니다.",
);


/*
 * F — 의미 있는 텍스트 신호 없음
 *
 * Guide만 들어와도 결과가
 * 만들어지지 않아야 한다.
 */
const testF =
  printResults(
    "F — 텍스트 신호 없음",
    {
      keywords: [],
      intents: [],
      guideSituations: [
        "problem",
      ],
    },
  );

assert(
  testF.length === 0,
  "F: Guide만으로 결과를 만들면 안 됩니다.",
);

console.log("");
console.log(
  "✓ AI Search Matcher 검증 성공",
);