import Link from "next/link";

import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { PageContainer } from "./PageContainer";
import { navigationItems } from "./navigation";

const primaryItems = navigationItems.filter(
  (item) => item.area === "primary",
);

const utilityItems = navigationItems.filter(
  (item) => item.area === "utility",
);

const searchItems = navigationItems.filter(
  (item) => item.href === "/search",
);

export function Header() {
  return (
    <header className="relative z-30 border-b border-border bg-surface">
      {/* Desktop Header */}
      <div className="hidden desktop:block">
        <PageContainer className="flex h-[68px] items-stretch">
          <Link
            href="/"
            aria-label="일로 ILLO 홈"
            className="inline-flex min-h-11 shrink-0 items-center rounded-sm"
          >
            <span className="text-[20px] font-bold tracking-[-0.02em] text-text">
              일로
            </span>

            <span className="ml-2 text-xs font-semibold tracking-[0.08em] text-muted">
              ILLO
            </span>
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="ml-8"
          >
            <NavLinks
              items={primaryItems}
              variant="desktop"
            />
          </nav>

          <nav
            aria-label="보조 메뉴"
            className="ml-auto"
          >
            <NavLinks
              items={utilityItems}
              variant="desktop"
            />
          </nav>
        </PageContainer>
      </div>

      {/* Mobile / Tablet Header */}
      <div className="desktop:hidden">
        <PageContainer className="flex h-[60px] items-center">
          <Link
            href="/"
            aria-label="일로 ILLO 홈"
            className="inline-flex min-h-11 items-center rounded-sm text-[19px] font-bold tracking-[-0.02em] text-text"
          >
            일로
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <nav aria-label="빠른 메뉴">
              <NavLinks
                items={searchItems}
                variant="compact"
              />
            </nav>

            <MobileMenu />
          </div>
        </PageContainer>
      </div>
    </header>
  );
}