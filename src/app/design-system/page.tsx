import type { Metadata } from "next";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Chip } from "@/components/ui/Chip";

export const metadata: Metadata = {
  title: "디자인 시스템",
  robots: {
    index: false,
    follow: false,
  },
};

const colors = [
  {
    name: "Primary",
    value: "#147D72",
    className: "bg-primary text-white",
  },
  {
    name: "Secondary",
    value: "#DDEDEA",
    className: "bg-secondary text-text",
  },
  {
    name: "Background",
    value: "#F7F8F7",
    className: "bg-bg text-text",
  },
  {
    name: "Surface",
    value: "#FFFFFF",
    className: "bg-surface text-text",
  },
  {
    name: "Success",
    value: "#2E7D4F",
    className: "bg-success text-white",
  },
  {
    name: "Warning",
    value: "#A16207",
    className: "bg-warning text-white",
  },
  {
    name: "Error",
    value: "#B42318",
    className: "bg-error text-white",
  },
  {
    name: "Info",
    value: "#326A8C",
    className: "bg-info text-white",
  },
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-bg py-16">
      <div className="mx-auto w-full max-w-page px-5 tablet:px-8 desktop:px-10">
        <header className="mb-16">
          <p className="type-label text-primary">
            ILLO Design System
          </p>

          <h1 className="type-display mt-3 text-text">
            디자인 시스템 Preview
          </h1>

          <p className="type-body-lg mt-4 max-w-article text-text-secondary">
            Phase 2에서 구현한 디자인 토큰과 기본 UI
            컴포넌트가 정상적으로 적용되는지 확인하는
            임시 개발 페이지입니다.
          </p>
        </header>

        <div className="space-y-20">
          {/* Typography */}
          <section>
            <SectionTitle
              title="Typography"
              description="390px 모바일과 1024px 이상 데스크톱에서 크기가 달라지는지 확인하세요."
            />

            <div className="rounded-card border border-border bg-surface p-6 desktop:p-8">
              <div className="space-y-6">
                <div>
                  <p className="type-caption mb-2 text-muted">
                    Display
                  </p>
                  <p className="type-display text-text">
                    일하다 궁금한 순간
                  </p>
                </div>

                <div>
                  <p className="type-caption mb-2 text-muted">
                    H1
                  </p>
                  <p className="type-h1 text-text">
                    인사노무 정보
                  </p>
                </div>

                <div>
                  <p className="type-caption mb-2 text-muted">
                    H2
                  </p>
                  <p className="type-h2 text-text">
                    쉽게 설명하면
                  </p>
                </div>

                <div>
                  <p className="type-caption mb-2 text-muted">
                    H3
                  </p>
                  <p className="type-h3 text-text">
                    어떤 내용을 확인해야 하나요?
                  </p>
                </div>

                <div>
                  <p className="type-caption mb-2 text-muted">
                    Body
                  </p>
                  <p className="type-body max-w-article text-text-secondary">
                    일로는 어려운 법률 용어부터 찾게 하지
                    않습니다. 내가 처한 상황에서 시작해
                    필요한 인사노무 정보를 쉽게 확인할 수
                    있도록 돕습니다.
                  </p>
                </div>

                <div>
                  <p className="type-caption text-muted">
                    Caption · 최종 확인 2026.09.05
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <SectionTitle
              title="Colors"
              description="ILLO의 주요 Brand / Neutral / Semantic Color입니다."
            />

            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="overflow-hidden rounded-card border border-border bg-surface"
                >
                  <div
                    className={[
                      "flex",
                      "h-24",
                      "items-end",
                      "p-4",
                      color.className,
                    ].join(" ")}
                  >
                    <span className="type-label">
                      {color.name}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="type-caption text-muted">
                      {color.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <section>
            <SectionTitle
              title="Buttons"
              description="Primary / Secondary / Disabled / Loading 상태를 확인합니다."
            />

            <div className="rounded-card border border-border bg-surface p-6 desktop:p-8">
              <div className="flex flex-wrap items-center gap-4">
                <Button>
                  관련 정보 찾기
                </Button>

                <Button variant="secondary">
                  상황별로 찾기
                </Button>

                <Button disabled>
                  사용할 수 없음
                </Button>

                <Button loading>
                  찾는 중...
                </Button>

                <Button size="large">
                  Large Button
                </Button>
              </div>
            </div>
          </section>

          {/* Badge & Chip */}
          <section>
            <SectionTitle
              title="Badge & Chip"
              description="카테고리와 검색·AI·Guide 메타데이터의 차이를 확인합니다."
            />

            <div className="rounded-card border border-border bg-surface p-6 desktop:p-8">
              <div className="space-y-8">
                <div>
                  <p className="type-label mb-3 text-text">
                    Badge
                  </p>

                  <Badge>
                    퇴직·해고
                  </Badge>
                </div>

                <div>
                  <p className="type-label mb-3 text-text">
                    Chips
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Chip>
                      퇴직금
                    </Chip>

                    <Chip variant="primary">
                      갑작스러운 해고
                    </Chip>

                    <Chip variant="situation">
                      문제가 생겼을 때
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Callouts */}
          <section>
            <SectionTitle
              title="Callouts"
              description="Knowledge Detail에서 사용할 네 가지 강조 영역입니다."
            />

            <div className="space-y-4">
              <Callout
                variant="summary"
                title="한 줄 핵심 요약"
              >
                사용자가 근로자를 해고하려면 원칙적으로
                적어도 30일 전에 예고해야 합니다.
              </Callout>

              <Callout
                variant="info"
                title="이런 경우에 확인하세요"
              >
                회사에서 갑자기 내일부터 나오지 말라는
                통보를 받았다면 관련 내용을 확인해보세요.
              </Callout>

              <Callout
                variant="example"
                title="상황 예시"
              >
                A씨는 회사에서 오늘까지만 일하고
                내일부터 출근하지 말라는 말을 들었습니다.
              </Callout>

              <Callout
                variant="caution"
                title="꼭 확인할 점"
              >
                해고예고 문제와 해고 자체의 정당성 문제는
                서로 구분해서 확인해야 합니다.
              </Callout>
            </div>
          </section>

          {/* Layout Tokens */}
          <section>
            <SectionTitle
              title="Layout"
              description="Page / Article 최대 너비가 올바르게 적용되는지 확인합니다."
            />

            <div className="space-y-4">
              <div className="max-w-page rounded-card border border-border bg-surface p-5">
                <p className="type-label text-text">
                  Page Max Width
                </p>

                <p className="type-body-sm mt-1 text-muted">
                  1200px
                </p>
              </div>

              <div className="max-w-article rounded-card border border-border bg-surface p-5">
                <p className="type-label text-text">
                  Article Max Width
                </p>

                <p className="type-body-sm mt-1 text-muted">
                  760px
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

interface SectionTitleProps {
  title: string;
  description: string;
}

function SectionTitle({
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="type-h2 text-text">
        {title}
      </h2>

      <p className="type-body-sm mt-2 text-text-secondary">
        {description}
      </p>
    </div>
  );
}