import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "프로젝트 소개 | 일로",
  description:
    "사용자 상황 중심의 인사노무 정보 탐색 서비스 일로의 기획, UX, 데이터 구조와 AI 검색 설계를 소개합니다.",
};

const projectFacts = [
  {
    label: "Role",
    value:
      "기획 · 정보 구조 · UX 설계 · 콘텐츠 구조 · 개발 · QA",
  },
  {
    label: "Target",
    value:
      "사회초년생 · 일반 근로자",
  },
  {
    label: "Platform",
    value: "Responsive Web",
  },
  {
    label: "Stack",
    value:
      "Next.js · TypeScript · Tailwind CSS · Supabase · OpenAI API",
  },
] as const;

const coreExperiences = [
  {
    number: "01",
    title: "상황별 찾기",
    steps: [
      "현재 상황",
      "실제 질문",
      "관련 정보",
    ],
    description:
      "법률 용어를 모를 때, 현재 놓인 상황부터 선택합니다.",
  },
  {
    number: "02",
    title: "일반 검색",
    steps: [
      "키워드",
      "관련 정보",
    ],
    description:
      "이미 ‘퇴직금’, ‘연차’처럼 찾고 싶은 단어를 알고 있을 때 사용합니다.",
  },
  {
    number: "03",
    title: "AI로 찾기",
    steps: [
      "자연어 상황",
      "검색 신호 구조화",
      "관련 정보",
    ],
    description:
      "검색어를 떠올리기 어렵다면 평소 말하듯 상황을 설명할 수 있습니다.",
  },
] as const;

const guideSituations = [
  "일을 시작할 때",
  "근무 조건이 궁금할 때",
  "급여·수당이 궁금할 때",
  "문제가 생겼을 때",
  "일을 그만둘 때",
] as const;

const knowledgeStructure = [
  "제목",
  "한 줄 핵심 요약",
  "쉽게 설명하면",
  "이런 경우에 확인하세요",
  "핵심 내용",
  "상황 예시",
  "꼭 확인할 점",
  "법적 근거",
  "공식 출처",
  "같이 보면 좋은 정보",
] as const;

const aiFlow = [
  "사용자 자연어",
  "OpenAI",
  "Structured Intent",
  "Deterministic Matching",
  "Supabase Published Knowledge",
  "관련 정보",
] as const;

const aiDoes = [
  "사용자 표현 이해",
  "검색 키워드 추출",
  "탐색 의도 구조화",
  "관련 상황 분류",
] as const;

const aiDoesNot = [
  "법률 판단",
  "적법·위법 판단",
  "법률 답변 생성",
  "법 조문·판례 생성",
  "Knowledge 직접 선택",
] as const;

const decisions = [
  {
    number: "01",
    title:
      "퇴직금 계산기를 MVP에서 제외",
    description:
      "계산 기능을 추가하기보다 ‘상황 → 정보 → 근거’라는 핵심 탐색 경험을 먼저 완성하는 것을 우선했습니다.",
  },
  {
    number: "02",
    title:
      "P1 8개 콘텐츠부터 구현",
    description:
      "콘텐츠 수를 빠르게 늘리기보다 정보 구조와 Detail 품질을 실제 콘텐츠로 먼저 검증했습니다.",
  },
  {
    number: "03",
    title:
      "Local TypeScript → Supabase 순차 이전",
    description:
      "데이터 모델과 UI를 먼저 검증한 뒤 Backend를 연결해 한 번에 발생할 수 있는 문제 범위를 줄였습니다.",
  },
  {
    number: "04",
    title:
      "AI는 검색 의도 추출까지만",
    description:
      "생성형 AI가 법률 판단을 직접 생성하는 범위를 줄이고, 콘텐츠 선택은 재현 가능한 코드가 담당하게 했습니다.",
  },
  {
    number: "05",
    title:
      "전문용어를 사용자 언어로 다시 번역",
    description:
      "프로젝트의 전문 분야는 인사노무지만, 사용자가 그 분야명을 먼저 이해해야 서비스를 사용할 수 있어서는 안 된다고 판단했습니다.",
    examples: [
      {
        before: "인사노무 정보",
        after:
          "일할 때 필요한 정보",
      },
      {
        before:
          "인사노무 정보 검색",
        after: "궁금한 정보 검색",
      },
      {
        before:
          "인사노무와 관련된 상황",
        after:
          "일하면서 겪은 상황이나 궁금한 점",
      },
    ],
  },
  {
    number: "06",
    title:
      "Knowledge Detail 목차 제거",
    description:
      "초기에는 7개의 Anchor Link로 구성된 목차를 제공했지만, P1 콘텐츠 길이에서는 핵심 요약 다음에 바로 본문을 읽는 흐름을 오히려 방해한다고 판단해 제거했습니다.",
  },
] as const;

const resultStats = [
  {
    value: "3",
    label: "탐색 방식",
    description:
      "상황별 찾기 · 일반 검색 · AI로 찾기",
  },
  {
    value: "5",
    label: "상황 Guide",
    description:
      "사용자의 현재 상황에서 시작하는 탐색 구조",
  },
  {
    value: "8",
    label: "P1 Knowledge",
    description:
      "핵심 인사노무 주제를 우선 구현",
  },
] as const;

const implementedResults = [
  "공식 Source와 법적 근거 연결",
  "Supabase Runtime Data 전환",
  "AI 자연어 탐색",
  "Responsive Web",
  "Accessibility 1차 QA",
] as const;

const nextSteps = [
  "P2 Knowledge 확대",
  "퇴직금 계산기",
  "연차 계산기",
  "근로계약 체크리스트",
] as const;

export default function AboutPage() {
  return (
    <main className="py-16 desktop:py-20">
      <PageContainer>
        {/* 1. Hero / Project Overview */}
        <div className="max-w-article">
          <PageHeader
            eyebrow="About Project"
            title="일로는 이렇게 만들었습니다"
            description="어려운 법률 용어부터 찾아야 했던 정보 탐색을, 사용자가 일하면서 겪은 상황에서 시작하도록 다시 설계한 프로젝트입니다."
          />

          <p className="type-body-lg mt-8 text-text-secondary">
            일로(ILLO)는 일하는 사람이
            자신의 상황에서 출발해
            필요한 인사노무 정보를 쉽게
            찾고, 쉬운 설명을 읽은 뒤
            법적 근거와 공식 출처까지
            확인할 수 있도록 만든 정보
            서비스입니다.
          </p>
        </div>

        <dl className="mt-10 grid gap-x-8 tablet:grid-cols-2">
          {projectFacts.map(
            (fact) => (
              <ProjectFact
                key={fact.label}
                label={fact.label}
                value={fact.value}
              />
            ),
          )}
        </dl>

        {/* 2. Problem */}
        <section
          aria-labelledby="about-problem-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Problem
            </p>

            <h2
              id="about-problem-title"
              className="type-h2 mt-3 text-text"
            >
              정보는 있지만, 검색어를
              떠올리기 어려웠습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              근로계약, 임금, 근로시간,
              해고와 관련된 공식 자료는
              존재하지만 법률·제도 용어에
              익숙하지 않은 사용자는 자신의
              상황을 어떤 단어로 검색해야
              하는지부터 어려움을 겪을 수
              있다고 보았습니다.
            </p>

            <p className="type-body-sm mt-3 text-muted">
              이는 정식 사용자 조사 결과가
              아니라, 서비스를 설계할 때
              세운 사용자 탐색 가설입니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 tablet:grid-cols-2 tablet:gap-6">
            <div className="rounded-card border border-border bg-surface p-6 tablet:p-7">
              <p className="type-label text-primary">
                상황에서 시작한 표현
              </p>

              <p className="type-h3 mt-4 text-text">
                “회사에서 갑자기 내일부터
                나오지 말라고 했어요.”
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-6 tablet:p-7">
              <p className="type-label text-text-secondary">
                정보를 찾기 위해 필요한 변환
              </p>

              <ol className="mt-4 space-y-2 type-body text-text">
                <li>이게 해고인가?</li>
                <li className="text-muted">
                  ↓
                </li>
                <li>
                  해고예고라는 말을 알아야
                  하나?
                </li>
                <li className="text-muted">
                  ↓
                </li>
                <li>
                  무슨 법을 확인해야 하지?
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* 3. Design Question */}
        <section
          aria-label="프로젝트 핵심 질문"
          className="mt-16 max-w-article"
        >
          <Callout
            variant="summary"
            title="Design Question"
          >
            <p className="font-semibold">
              법률 용어를 모르는 사람도
              자신의 상황에서 필요한 정보를
              찾을 수 있게 하려면 어떻게 해야
              할까?
            </p>

            <p className="mt-3 type-body text-text-secondary">
              이 질문을 기준으로 정보 구조,
              검색 방식, 콘텐츠 순서와 AI의
              역할을 결정했습니다.
            </p>
          </Callout>
        </section>

        {/* 4. Target User & Needs */}
        <section
          aria-labelledby="about-user-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              User
            </p>

            <h2
              id="about-user-title"
              className="type-h2 mt-3 text-text"
            >
              법률 용어보다 자신의 상황이
              먼저 떠오르는 사용자를
              생각했습니다
            </h2>
          </div>

          <div className="mt-8 grid gap-10 tablet:grid-cols-2 tablet:gap-12">
            <div className="border-t border-border pt-5">
              <h3 className="type-h3 text-text">
                Who
              </h3>

              <div className="mt-5">
                <p className="type-label text-primary">
                  Primary
                </p>

                <p className="type-body mt-2 text-text-secondary">
                  사회초년생 · 일반 근로자
                </p>
              </div>

              <div className="mt-6">
                <p className="type-label text-primary">
                  Secondary
                </p>

                <p className="type-body mt-2 text-text-secondary">
                  인사·노무 업무나 관련 법률
                  용어에 익숙하지 않은 사용자
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="type-h3 text-text">
                Needs
              </h3>

              <ul className="mt-5 space-y-4">
                <li className="type-body text-text-secondary">
                  법률 용어를 몰라도 찾을 수
                  있어야 합니다.
                </li>
                <li className="type-body text-text-secondary">
                  내 상황과 가까운 정보부터
                  보고 싶습니다.
                </li>
                <li className="type-body text-text-secondary">
                  쉽게 이해한 뒤 정확한 근거도
                  확인하고 싶습니다.
                </li>
                <li className="type-body text-text-secondary">
                  AI가 판단을 대신하기보다
                  믿을 수 있는 정보로
                  연결해주어야 합니다.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Core Experience */}
        <section
          aria-labelledby="about-core-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Core Experience
            </p>

            <h2
              id="about-core-title"
              className="type-h2 mt-3 text-text"
            >
              사용자의 출발점에 따라 세 가지
              탐색 방식을 만들었습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              사용자가 항상 같은 방식으로
              정보를 찾는 것은 아니라고
              보았습니다. 하나의 검색 방식에
              모든 사용자를 맞추기보다, 알고
              있는 정보의 정도에 따라 세 가지
              시작점을 만들었습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-5 desktop:grid-cols-3">
            {coreExperiences.map(
              (item) => (
                <FlowCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  steps={item.steps}
                  description={
                    item.description
                  }
                />
              ),
            )}
          </div>

          <p className="type-body mt-8 max-w-article text-text-secondary">
            세 기능은 경쟁하는 기능이 아니라,
            사용자가 얼마나 정확한 검색어를
            알고 있는지에 따라 서로 다른
            출발점을 제공합니다.
          </p>
        </section>

        {/* 6. Information & Content Design */}
        <section
          aria-labelledby="about-content-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Information & Content Design
            </p>

            <h2
              id="about-content-title"
              className="type-h2 mt-3 text-text"
            >
              법률 카테고리보다 상황에서
              시작하고, 이해한 뒤 근거까지
              확인하게 했습니다
            </h2>

            <div className="mt-10">
              <h3 className="type-h3 text-text">
                법률 카테고리보다 상황부터
                시작했습니다
              </h3>

              <p className="type-body mt-4 text-text-secondary">
                법률 카테고리를 먼저 선택하는
                대신, 사용자가 현재 놓인
                상황을 먼저 선택하도록
                구성했습니다.
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {guideSituations.map(
                  (guide) => (
                    <li
                      key={guide}
                      className="rounded-control border border-border bg-surface px-4 py-2.5 type-label text-text-secondary"
                    >
                      {guide}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="mt-12">
              <h3 className="type-h3 text-text">
                쉽게 이해한 뒤 근거까지
                확인하도록 구성했습니다
              </h3>

              <p className="type-body mt-4 text-text-secondary">
                법률 조문이나 출처를 먼저
                보여주기보다, 사용자가 핵심
                내용을 먼저 이해한 뒤 필요한
                경우 근거까지 내려가
                확인하도록 정보 순서를
                구성했습니다.
              </p>

              <ol
                aria-label="Knowledge 상세 정보 구조"
                className="mt-6 border-y border-border"
              >
                {knowledgeStructure.map(
                  (item, index) => (
                    <li
                      key={item}
                      className="flex gap-4 border-t border-border py-3.5 first:border-t-0"
                    >
                      <span className="type-caption w-6 shrink-0 pt-1 font-semibold text-primary">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="type-body text-text">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </section>

        {/* 7. Trust Model */}
        <section
          aria-labelledby="about-trust-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Trust
            </p>

            <h2
              id="about-trust-title"
              className="type-h2 mt-3 text-text"
            >
              쉬운 설명과 근거를 분리하지
              않았습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              일로의 콘텐츠는 쉬운 설명만
              제공하는 데서 끝나지 않습니다.
              사용자가 내용을 이해한 뒤 원문
              근거까지 확인할 수 있도록 법적
              근거와 공식 출처를 함께
              연결했습니다.
            </p>
          </div>

          <div
            aria-label="콘텐츠 신뢰 구조"
            className="mt-8 grid gap-x-6 tablet:grid-cols-2 desktop:grid-cols-4"
          >
            {[
              "쉬운 설명",
              "법적 근거",
              "공식 출처",
              "최종 확인일",
            ].map(
              (item) => (
                <div
                  key={item}
                  className="border-t border-border py-5"
                >
                  <p className="type-label text-text">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 max-w-article">
            <p className="type-body text-text-secondary">
              같은 근로기준법은 여러 정보에서
              반복 사용될 수 있습니다.
              Source를 본문의 단순 URL
              문자열로만 저장하지 않고 별도
              데이터로 관리해 여러
              Knowledge에서 재사용할 수
              있도록 구성했습니다.
            </p>
          </div>
        </section>

        {/* 8. AI Search Architecture */}
        <section
          aria-labelledby="about-ai-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              AI Search
            </p>

            <h2
              id="about-ai-title"
              className="type-h2 mt-3 text-text"
            >
              AI가 답을 만드는 대신, 찾는
              과정을 돕게 했습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              법률정보 서비스에서 생성형 AI가
              직접 답변을 만들도록 하면 생성
              오류가 실제 법률정보처럼
              받아들여질 가능성을
              고려했습니다.
            </p>

            <p className="type-body mt-3 text-text-secondary">
              그래서 AI는 사용자의 표현을
              검색에 필요한 구조 데이터로
              변환하는 역할까지만 담당하도록
              제한했습니다.
            </p>
          </div>

          <div className="mt-8">
            <FlowSequence
              steps={aiFlow}
              label="AI 검색 처리 흐름"
            />
          </div>

          <div className="mt-8 grid gap-5 tablet:grid-cols-2">
            <div className="rounded-card border border-border bg-surface p-6 tablet:p-7">
              <p className="type-label text-primary">
                AI가 하는 일
              </p>

              <ul className="mt-4 space-y-3">
                {aiDoes.map(
                  (item) => (
                    <li
                      key={item}
                      className="type-body text-text-secondary"
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="rounded-card border border-border bg-surface p-6 tablet:p-7">
              <p className="type-label text-text">
                AI가 하지 않는 일
              </p>

              <ul className="mt-4 space-y-3">
                {aiDoesNot.map(
                  (item) => (
                    <li
                      key={item}
                      className="type-body text-text-secondary"
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-x-6 tablet:grid-cols-3">
            <RoleBlock
              title="AI"
              description="사용자의 표현 이해"
            />

            <RoleBlock
              title="Code"
              description="관련 정보 선택과 순위"
            />

            <RoleBlock
              title="Supabase"
              description="검증된 Published 정보"
            />
          </div>

          <div className="mt-8 max-w-article">
            <Callout
              variant="info"
              title="Coverage 밖에서는"
            >
              <p>
                예를 들어 “육아휴직은 언제
                신청하나요?”처럼 현재 P1에
                해당 Knowledge가 없는
                질문에는 AI가 새로운 법률
                답변을 만들어내지 않습니다.
              </p>

              <p className="mt-3">
                현재 제공 중인 Published
                Knowledge에서 충분히 가까운
                결과가 없다고 안내합니다.
              </p>
            </Callout>
          </div>
        </section>

        {/* 9. Key Decisions */}
        <section
          aria-labelledby="about-decisions-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Key Decisions
            </p>

            <h2
              id="about-decisions-title"
              className="type-h2 mt-3 text-text"
            >
              추가한 것뿐 아니라, 뺀 것도
              기록했습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              기능의 수보다 실제 핵심 경험을
              명확하게 만드는 것을
              우선했습니다. 개발 중 확인한
              문제는 그대로 두기보다 범위를
              줄이거나 구조를 바꾸는 방식으로
              조정했습니다.
            </p>

            <ol className="mt-8 border-y border-border">
              {decisions.map(
                (decision) => (
                  <DecisionItem
                    key={
                      decision.number
                    }
                    decision={
                      decision
                    }
                  />
                ),
              )}
            </ol>
          </div>
        </section>

        {/* 10. Technical Architecture */}
        <section
          aria-labelledby="about-tech-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Technical Architecture
            </p>

            <h2
              id="about-tech-title"
              className="type-h2 mt-3 text-text"
            >
              화면보다 먼저 데이터 경계를
              나눴습니다
            </h2>
          </div>

          <div className="mt-8 grid gap-5 tablet:grid-cols-2">
            <ArchitectureCard
              label="Before"
              steps={[
                "Local TypeScript Data",
                "Data Access Layer",
                "Page / Component",
              ]}
            />

            <ArchitectureCard
              label="After"
              steps={[
                "Supabase PostgreSQL",
                "Data Access Layer",
                "Page / Component",
              ]}
            />
          </div>

          <div className="mt-8 max-w-article">
            <p className="type-body text-text-secondary">
              Page와 Component가 데이터 저장
              위치를 직접 알지 않도록 비동기
              Data Access Layer를 먼저
              설계했습니다. 덕분에 Local
              데이터에서 Supabase로 전환할
              때 사용자 화면을 거의 변경하지
              않고 Runtime Data Source를
              교체할 수 있었습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-10 desktop:grid-cols-2 desktop:gap-12">
            <div>
              <h3 className="type-h3 text-text">
                Data Model
              </h3>

              <p className="type-body mt-3 text-text-secondary">
                콘텐츠, 상황, 출처와 관계를
                별도의 데이터 단위로
                분리했습니다.
              </p>

              <ul className="mt-5 border-y border-border">
                {[
                  "GuideSituation ↔ KnowledgeGuide ↔ Knowledge",
                  "Category → Knowledge",
                  "Knowledge ↔ KnowledgeSource ↔ Source",
                  "Knowledge ↔ KnowledgeRelation ↔ Related Knowledge",
                ].map(
                  (relation) => (
                    <li
                      key={relation}
                      className="border-t border-border py-3.5 first:border-t-0 type-body-sm text-text"
                    >
                      {relation}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="type-h3 text-text">
                Security
              </h3>

              <ul className="mt-5 border-y border-border">
                {[
                  "RLS Enabled",
                  "Published Knowledge만 Public Read",
                  "Public Write 차단",
                  "App에서 Service Role 미사용",
                ].map(
                  (item) => (
                    <li
                      key={item}
                      className="border-t border-border py-3.5 first:border-t-0 type-body-sm text-text"
                    >
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="type-h3 text-text">
              Tech Stack
            </h3>

            <dl className="mt-5 grid gap-x-8 tablet:grid-cols-2">
              <ProjectFact
                label="Frontend"
                value="Next.js · React · TypeScript · Tailwind CSS"
              />

              <ProjectFact
                label="Data"
                value="Supabase PostgreSQL"
              />

              <ProjectFact
                label="AI"
                value="OpenAI Responses API · Structured Outputs"
              />

              <ProjectFact
                label="Architecture"
                value="Server Component 중심 · Data Access Layer"
              />
            </dl>
          </div>
        </section>

        {/* 11. Current Result */}
        <section
          aria-labelledby="about-result-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Current Result
            </p>

            <h2
              id="about-result-title"
              className="type-h2 mt-3 text-text"
            >
              가짜 성과 지표 대신 실제 구현
              범위를 정리했습니다
            </h2>

            <p className="type-body mt-5 text-text-secondary">
              아직 실제 사용자 지표가 없는
              프로젝트이므로 검색 성공률이나
              만족도 같은 수치를 만들지
              않았습니다. 현재 확인할 수 있는
              구현 결과만 정리했습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 tablet:grid-cols-3 tablet:gap-5">
            {resultStats.map(
              (stat) => (
                <div
                  key={stat.label}
                  className="rounded-card border border-border bg-surface p-6"
                >
                  <p className="type-h2 text-primary">
                    {stat.value}
                  </p>

                  <p className="type-label mt-2 text-text">
                    {stat.label}
                  </p>

                  <p className="type-body-sm mt-2 text-text-secondary">
                    {
                      stat.description
                    }
                  </p>
                </div>
              ),
            )}
          </div>

          <ul className="mt-8 grid gap-x-8 tablet:grid-cols-2">
            {implementedResults.map(
              (item) => (
                <li
                  key={item}
                  className="border-t border-border py-4 type-body text-text-secondary"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </section>

        {/* 12. Limitations / Next Step / CTA */}
        <section
          aria-labelledby="about-next-title"
          className="mt-24 border-t border-border pt-16 desktop:mt-28 desktop:pt-20"
        >
          <div className="max-w-article">
            <p className="type-label text-primary">
              Scope & Next Step
            </p>

            <h2
              id="about-next-title"
              className="type-h2 mt-3 text-text"
            >
              현재 범위를 명확히 남기고 다음
              확장을 구분했습니다
            </h2>

            <div className="mt-8">
              <h3 className="type-h3 text-text">
                현재 한계
              </h3>

              <ul className="mt-5 border-y border-border">
                <li className="border-t border-border py-4 first:border-t-0 type-body text-text-secondary">
                  현재 콘텐츠는 핵심 P1 8개
                  주제로 제한되어 있습니다.
                </li>

                <li className="border-t border-border py-4 type-body text-text-secondary">
                  AI Search 역시 일로에 등록된
                  Published Knowledge 범위
                  안에서만 결과를 제공합니다.
                </li>

                <li className="border-t border-border py-4 type-body text-text-secondary">
                  공개 배포 전에는 OpenAI API
                  비용과 오남용을 고려한 Rate
                  Limit / Abuse Protection
                  검토가 필요합니다.
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <p className="type-label text-primary">
                향후 확장
              </p>

              <div className="mt-4 grid gap-x-6 tablet:grid-cols-2">
                {nextSteps.map(
                  (item) => (
                    <div
                      key={item}
                      className="border-t border-border py-4 type-body text-text"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-12 border-t border-border pt-8">
              <h3 className="type-h3 text-text">
                직접 살펴보기
              </h3>

              <p className="type-body mt-3 text-text-secondary">
                Case Study에서 설명한 탐색
                방식을 실제 서비스 화면에서
                확인할 수 있습니다.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
                <Link
                  href="/guide"
                  className="inline-flex min-h-11 items-center type-label text-primary transition-colors hover:text-primary-hover"
                >
                  상황별로 찾아보기

                  <span
                    aria-hidden="true"
                    className="ml-2"
                  >
                    →
                  </span>
                </Link>

                <Link
                  href="/ai-search"
                  className="inline-flex min-h-11 items-center type-label text-text-secondary transition-colors hover:text-primary"
                >
                  AI로 찾아보기

                  <span
                    aria-hidden="true"
                    className="ml-2"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}

interface ProjectFactProps {
  label: string;
  value: string;
}

function ProjectFact({
  label,
  value,
}: ProjectFactProps) {
  return (
    <div className="border-t border-border py-5">
      <dt className="type-caption font-semibold text-primary">
        {label}
      </dt>

      <dd className="type-body-sm mt-2 break-words text-text-secondary">
        {value}
      </dd>
    </div>
  );
}

interface FlowCardProps {
  number: string;
  title: string;
  steps: readonly string[];
  description: string;
}

function FlowCard({
  number,
  title,
  steps,
  description,
}: FlowCardProps) {
  return (
    <article className="rounded-card border border-border bg-surface p-6">
      <p className="type-caption font-semibold text-primary">
        {number}
      </p>

      <h3 className="type-h3 mt-2 text-text">
        {title}
      </h3>

      <ol
        aria-label={`${title} 탐색 흐름`}
        className="mt-5"
      >
        {steps.map(
          (step, index) => (
            <li
              key={`${step}-${index}`}
            >
              <p className="type-label text-text">
                {step}
              </p>

              {index <
                steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="my-1 block text-muted"
                >
                  ↓
                </span>
              )}
            </li>
          ),
        )}
      </ol>

      <p className="type-body-sm mt-5 text-text-secondary">
        {description}
      </p>
    </article>
  );
}

interface FlowSequenceProps {
  steps: readonly string[];
  label: string;
}

function FlowSequence({
  steps,
  label,
}: FlowSequenceProps) {
  return (
    <ol
      aria-label={label}
      className="flex flex-col gap-2 desktop:flex-row"
    >
      {steps.map(
        (step, index) => (
          <li
            key={`${step}-${index}`}
            className="flex min-w-0 flex-col gap-2 desktop:flex-1 desktop:flex-row desktop:items-center"
          >
            <div className="min-w-0 flex-1 rounded-control border border-border bg-surface px-4 py-4 text-center">
              <span className="type-label break-words text-text">
                {step}
              </span>
            </div>

            {index <
              steps.length - 1 && (
              <>
                <span
                  aria-hidden="true"
                  className="self-center text-muted desktop:hidden"
                >
                  ↓
                </span>

                <span
                  aria-hidden="true"
                  className="hidden shrink-0 text-muted desktop:inline"
                >
                  →
                </span>
              </>
            )}
          </li>
        ),
      )}
    </ol>
  );
}

interface RoleBlockProps {
  title: string;
  description: string;
}

function RoleBlock({
  title,
  description,
}: RoleBlockProps) {
  return (
    <div className="border-t border-border py-5">
      <p className="type-label text-primary">
        {title}
      </p>

      <p className="type-body-sm mt-2 text-text-secondary">
        {description}
      </p>
    </div>
  );
}

interface DecisionItemProps {
  decision:
    (typeof decisions)[number];
}

function DecisionItem({
  decision,
}: DecisionItemProps) {
  return (
    <li className="border-t border-border py-7 first:border-t-0">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:gap-6">
        <p className="type-caption shrink-0 pt-1 font-semibold text-primary">
          {decision.number}
        </p>

        <div className="min-w-0">
          <h3 className="type-h3 text-text">
            {decision.title}
          </h3>

          <p className="type-body mt-3 text-text-secondary">
            {decision.description}
          </p>

          {"examples" in decision &&
            decision.examples && (
              <div className="mt-5 space-y-3">
                {decision.examples.map(
                  (example) => (
                    <div
                      key={
                        example.before
                      }
                      className="grid gap-2 rounded-control border border-border bg-surface p-4 tablet:grid-cols-[1fr_auto_1fr] tablet:items-center"
                    >
                      <p className="type-body-sm break-words text-text-secondary">
                        {
                          example.before
                        }
                      </p>

                      <span
                        aria-hidden="true"
                        className="text-muted"
                      >
                        →
                      </span>

                      <p className="type-body-sm break-words font-semibold text-primary">
                        {
                          example.after
                        }
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
        </div>
      </div>
    </li>
  );
}

interface ArchitectureCardProps {
  label: string;
  steps: readonly string[];
}

function ArchitectureCard({
  label,
  steps,
}: ArchitectureCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 tablet:p-7">
      <p className="type-label text-primary">
        {label}
      </p>

      <ol
        aria-label={`${label} 데이터 구조`}
        className="mt-5"
      >
        {steps.map(
          (step, index) => (
            <li
              key={`${step}-${index}`}
            >
              <p className="type-body font-semibold break-words text-text">
                {step}
              </p>

              {index <
                steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="my-2 block text-muted"
                >
                  ↓
                </span>
              )}
            </li>
          ),
        )}
      </ol>
    </div>
  );
}