import Link from "next/link";

import type { GuideSituation } from "@/types/content";

interface GuideCardProps {
  guide: GuideSituation;
  description: string;
  questions: string[];
  knowledgeCount: number;
}

export function GuideCard({
  guide,
  description,
  questions,
  knowledgeCount,
}: GuideCardProps) {
  return (
    <article>
      <Link
        href={`/guide/${guide.slug}`}
        className={[
          "group",
          "flex",
          "flex-col",
          "rounded-card",
          "border",
          "border-border",
          "bg-surface",
          "p-6",
          "transition-all",
          "duration-150",
          "hover:border-[#C9D1CE]",
          "hover:shadow-hover",
        ].join(" ")}
      >
        <h3 className="type-h3 text-text transition-colors group-hover:text-primary">
          {guide.name}
        </h3>

        <p className="type-body mt-3 text-text-secondary">
          {description}
        </p>

        {questions.length > 0 && (
          <div className="mt-5 border-t border-border pt-5">
            <p className="type-label text-text">
              이런 질문이 있다면
            </p>

            <ul className="mt-3 space-y-2">
              {questions.map(
                (question) => (
                  <li
                    key={question}
                    className="type-body-sm text-text-secondary"
                  >
                    “{question}”
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="type-body-sm text-muted">
            관련 정보{" "}
            <strong className="font-semibold text-text">
              {knowledgeCount}
            </strong>
            개
          </p>

          <span className="type-label text-primary">
            살펴보기{" "}
            <span aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}