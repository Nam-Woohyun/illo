import { formatDate } from "@/lib/format";

import type {
  SourceForKnowledge,
} from "@/lib/knowledge";

interface SourceListProps {
  items: SourceForKnowledge[];
}

export function SourceList({
  items,
}: SourceListProps) {
  return (
    <ul className="divide-y divide-border rounded-card border border-border bg-surface">
      {items.map((item) => {
        const {
          source,
          note,
        } = item;

        return (
          <li
            key={source.id}
            className="p-5 tablet:p-6"
          >
            <p className="type-label text-primary">
              {source.organization}
            </p>

            <h3 className="type-h3 mt-2 text-text">
              {source.title}
            </h3>

            {note && (
              <p className="type-body-sm mt-2 text-text-secondary">
                {note}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 type-caption text-muted">
              {source.effectiveDate && (
                <span>
                  시행{" "}
                  {formatDate(
                    source.effectiveDate,
                  )}
                </span>
              )}

              <span>
                최종 확인{" "}
                {formatDate(
                  source.lastVerifiedAt,
                )}
              </span>
            </div>

            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${source.title} 원문 새 탭에서 열기`}
              className="mt-4 inline-flex min-h-11 items-center type-label text-primary hover:underline"
            >
              원문 보기
              <span
                aria-hidden="true"
                className="ml-1"
              >
                ↗
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}