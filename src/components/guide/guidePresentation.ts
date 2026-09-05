import type { Knowledge } from "@/types/content";

interface GuidePresentation {
  description: string;
  questionIndexByKnowledgeId: Record<
    string,
    number
  >;
}

type GuidePresentationSlug =
  | "start-work"
  | "work-condition"
  | "pay"
  | "problem"
  | "leave-work";

const guidePresentation: Record<
  GuidePresentationSlug,
  GuidePresentation
> = {
  "start-work": {
    description:
      "처음 일을 시작할 때 확인할 근로계약, 임금, 휴가 관련 정보를 살펴보세요.",

    questionIndexByKnowledgeId: {
      "knowledge-employment-contract": 0,
      "knowledge-minimum-wage": 1,
      "knowledge-annual-leave-basics": 9,
    },
  },

  "work-condition": {
    description:
      "근무시간과 연차처럼 실제 일하는 조건과 관련된 정보를 확인해보세요.",

    questionIndexByKnowledgeId: {
      "knowledge-statutory-working-hours": 0,
      "knowledge-annual-leave-basics": 2,
    },
  },

  pay: {
    description:
      "최저임금부터 미지급 급여까지 임금·수당과 관련된 정보를 살펴보세요.",

    questionIndexByKnowledgeId: {
      "knowledge-minimum-wage": 0,
      "knowledge-wage-arrears-response": 0,
      "knowledge-statutory-working-hours": 1,
      "knowledge-severance-pay": 9,
    },
  },

  problem: {
    description:
      "갑작스러운 해고, 임금 미지급, 직장 내 문제처럼 어려움이 생겼을 때 확인할 정보를 살펴보세요.",

    questionIndexByKnowledgeId: {
      "knowledge-dismissal-notice": 0,
      "knowledge-wage-arrears-response": 0,
      "knowledge-workplace-harassment": 1,
      "knowledge-employment-contract": 0,
    },
  },

  "leave-work": {
    description:
      "퇴사 전후에 확인해야 할 퇴직금, 해고예고, 미지급 임금 정보를 살펴보세요.",

    questionIndexByKnowledgeId: {
      "knowledge-severance-pay": 0,
      "knowledge-dismissal-notice": 2,
      "knowledge-wage-arrears-response": 3,
    },
  },
};

export function getGuidePresentation(
  slug: string,
): GuidePresentation | null {
  if (!(slug in guidePresentation)) {
    return null;
  }

  return guidePresentation[
    slug as GuidePresentationSlug
  ];
}

export function getGuideRepresentativeQuestion(
  guideSlug: string,
  knowledge: Knowledge,
): string | null {
  const presentation =
    getGuidePresentation(guideSlug);

  const selectedIndex =
    presentation
      ?.questionIndexByKnowledgeId[
        knowledge.id
      ] ?? 0;

  return (
    knowledge.relatedQuestions[
      selectedIndex
    ] ??
    knowledge.relatedQuestions[0] ??
    null
  );
}