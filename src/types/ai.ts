import type {
  Knowledge,
} from "@/types/content";

export const GUIDE_SITUATION_SLUGS = [
  "start-work",
  "work-condition",
  "pay",
  "problem",
  "leave-work",
] as const;

export type GuideSituationSlug =
  (typeof GUIDE_SITUATION_SLUGS)[number];

export const AI_SEARCH_QUERY_MAX_LENGTH =
  500;

export interface AISearchIntent {
  keywords: string[];
  intents: string[];
  guideSituations: GuideSituationSlug[];
}

export interface AISearchMatch {
  knowledge: Knowledge;

  /*
   * Matcher 내부 정렬용 점수.
   * 사용자 API Response에서는 제거한다.
   */
  score: number;

  /*
   * 실제로 Knowledge와 연결된
   * AI keyword만 기록한다.
   */
  matchedTerms: string[];
}