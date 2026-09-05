export type NavigationItem = {
  label: string;
  href: string;
  area: "primary" | "utility";
  showInMobileMenu: boolean;
  showInFooter: boolean;
};

export const navigationItems = [
  {
    label: "상황별 찾기",
    href: "/guide",
    area: "primary",
    showInMobileMenu: true,
    showInFooter: true,
  },
  {
    label: "일할 때 필요한 정보",
    href: "/knowledge",
    area: "primary",
    showInMobileMenu: true,
    showInFooter: true,
  },
  {
    label: "AI로 찾기",
    href: "/ai-search",
    area: "primary",
    showInMobileMenu: true,
    showInFooter: true,
  },
  {
    label: "검색",
    href: "/search",
    area: "utility",
    showInMobileMenu: false,
    showInFooter: false,
  },
  {
    label: "프로젝트 소개",
    href: "/about",
    area: "utility",
    showInMobileMenu: true,
    showInFooter: true,
  },
] satisfies NavigationItem[];