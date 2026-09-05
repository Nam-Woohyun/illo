import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";

import type { Knowledge } from "@/types/content";

interface KnowledgeCardProps {
  knowledge: Knowledge;
  categoryName: string;
}

export function KnowledgeCard({
  knowledge,
  categoryName,
}: KnowledgeCardProps) {
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
          "p-6",
          "transition-all",
          "duration-150",
          "hover:border-[#C9D1CE]",
          "hover:shadow-hover",
        ].join(" ")}
      >
        <Badge>
          {categoryName}
        </Badge>

        <h2 className="type-h3 mt-4 text-text transition-colors group-hover:text-primary">
          {knowledge.title}
        </h2>

        <p className="type-body-sm mt-3 text-text-secondary">
          {knowledge.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {knowledge.keywords
            .slice(0, 3)
            .map((keyword) => (
              <Chip key={keyword}>
                {keyword}
              </Chip>
            ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-6 type-label text-primary">
          <span>정보 보기</span>

          <span aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}