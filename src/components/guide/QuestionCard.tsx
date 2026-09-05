import Link from "next/link";

import type { Knowledge } from "@/types/content";

interface QuestionCardProps {
  question: string;
  knowledge: Knowledge;
  isPrimary: boolean;
}

export function QuestionCard({
  question,
  knowledge,
  isPrimary,
}: QuestionCardProps) {
  return (
    <article>
      <Link
        href={`/knowledge/${knowledge.slug}`}
        className={[
          "group",
          "block",
          "rounded-card",
          "border",
          "border-border",
          "bg-surface",
          "p-5",
          "transition-all",
          "duration-150",
          "hover:border-[#C9D1CE]",
          "hover:shadow-hover",
          "tablet:p-6",
        ].join(" ")}
      >
        <p className="type-caption font-semibold text-primary">
          {isPrimary
            ? "먼저 확인"
            : "함께 확인"}
        </p>

        <h3 className="type-h3 mt-2 text-text transition-colors group-hover:text-primary">
          “{question}”
        </h3>

        <div className="mt-5 border-t border-border pt-4">
          <p className="type-label text-primary">
            확인할 정보
          </p>

          <p className="mt-1 font-semibold text-text">
            {knowledge.title}
          </p>

          <p className="type-body-sm mt-2 text-text-secondary">
            {knowledge.summary}
          </p>
        </div>

        <div className="mt-5 type-label text-primary">
          정보 보기{" "}
          <span aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}