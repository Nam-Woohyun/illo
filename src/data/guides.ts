import type { GuideSituation } from "@/types/content";

export const guideSituations = [
  {
    id: "guide-start-work",
    name: "일을 시작할 때",
    slug: "start-work",
  },
  {
    id: "guide-work-condition",
    name: "근무 조건이 궁금할 때",
    slug: "work-condition",
  },
  {
    id: "guide-pay",
    name: "급여·수당이 궁금할 때",
    slug: "pay",
  },
  {
    id: "guide-problem",
    name: "문제가 생겼을 때",
    slug: "problem",
  },
  {
    id: "guide-leave-work",
    name: "일을 그만둘 때",
    slug: "leave-work",
  },
] satisfies GuideSituation[];