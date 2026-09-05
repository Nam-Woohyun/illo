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

/*
 * OpenAI Structured Intent
 *
 * 서버 내부에서만 Matching에 사용한다.
 */
export interface AISearchIntent {
  keywords: string[];
  intents: string[];
  guideSituations: GuideSituationSlug[];
}

/*
 * Deterministic Matcher 내부 결과
 *
 * score는 Browser로 보내지 않는다.
 */
export interface AISearchMatch {
  knowledge: Knowledge;
  score: number;
  matchedTerms: string[];
}

/*
 * ----------------------------------
 * Public API DTO
 * ----------------------------------
 */

export type AISearchOutcome =
  | "matched"
  | "no-signal"
  | "no-match";

export interface AISearchPublicGuide {
  slug: GuideSituationSlug;
  name: string;
}

export interface AISearchPublicAnalysis {
  keywords: string[];
  guideSituations: AISearchPublicGuide[];
}

export interface AISearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  categoryName: string;
  matchedTerms: string[];
}

export interface AISearchResponse {
  outcome: AISearchOutcome;
  analysis: AISearchPublicAnalysis;
  results: AISearchResult[];
}

export interface AISearchErrorResponse {
  error: string;
}