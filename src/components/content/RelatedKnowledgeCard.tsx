import Link from "next/link";

import { Badge } from "@/components/ui/Badge";

import type { Knowledge } from "@/types/content";

interface RelatedKnowledgeCardProps {
  knowledge: Knowledge;
  categoryName: string;
}

export function RelatedKnowledgeCard({
  knowledge,
  categoryName,
}: RelatedKnowledgeCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/knowledge/${knowledge.slug}`}
        className={[
          "group",
          "flex",
          "h-full",
          "flex-col",
          "rounded-card",
          "border",
          "border-border",
          "bg-surface",
          "p-5",
          "transition-all",
          "duration-150",
          "hover:border-[#C9D1CE]",
          "hover:shadow-hover",
        ].join(" ")}
      >
        <Badge>
          {categoryName}
        </Badge>

        <h3 className="type-h3 mt-4 text-text transition-colors group-hover:text-primary">
          {knowledge.title}
        </h3>

        <p className="type-body-sm mt-3 text-text-secondary">
          {knowledge.summary}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-5 type-label text-primary">
          <span>같이 보기</span>

          <span aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}