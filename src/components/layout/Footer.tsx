import Link from "next/link";

import { PageContainer } from "./PageContainer";
import { navigationItems } from "./navigation";

const footerItems = navigationItems.filter(
  (item) => item.showInFooter,
);

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#F1F3F2]">
      <PageContainer className="py-16">
        <div className="grid gap-10 desktop:grid-cols-[1fr_auto] desktop:items-start">
          <div>
            <Link
              href="/"
              aria-label="일로 ILLO 홈"
              className="inline-flex items-center rounded-sm"
            >
              <span className="text-lg font-bold text-text">
                일로
              </span>

              <span className="ml-2 text-xs font-semibold tracking-[0.08em] text-muted">
                ILLO
              </span>
            </Link>

            <p className="type-body-sm mt-3 max-w-md text-text-secondary">
              일하는 사람을 위한 인사노무
              정보 가이드
            </p>
          </div>

          <nav aria-label="푸터 메뉴">
            <div className="flex flex-col items-start gap-3 tablet:flex-row tablet:flex-wrap tablet:gap-x-6 tablet:gap-y-3">
              {footerItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-11 rounded-sm py-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="type-caption max-w-3xl text-muted">
            일로의 콘텐츠는 일반적인 정보
            제공을 목적으로 하며, 개별 사건에
            대한 법률 판단이나 전문 상담을
            대신하지 않습니다.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}