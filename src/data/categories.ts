import type { Category } from "@/types/content";

export const categories = [
  {
    id: "category-employment-contract",
    name: "근로계약",
    slug: "employment-contract",
  },
  {
    id: "category-wages-allowances",
    name: "임금·수당",
    slug: "wages-allowances",
  },
  {
    id: "category-working-hours-rest",
    name: "근로시간·휴식",
    slug: "working-hours-rest",
  },
  {
    id: "category-leave-holidays",
    name: "휴가·휴일",
    slug: "leave-holidays",
  },
  {
    id: "category-retirement-dismissal",
    name: "퇴직·해고",
    slug: "retirement-dismissal",
  },
  {
    id: "category-workplace-protection",
    name: "직장 내 문제·보호",
    slug: "workplace-protection",
  },
] satisfies Category[];