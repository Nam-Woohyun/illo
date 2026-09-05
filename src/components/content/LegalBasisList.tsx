import type {
  SourceForKnowledge,
} from "@/lib/knowledge";

interface LegalBasisListProps {
  items: SourceForKnowledge[];
}

export function LegalBasisList({
  items,
}: LegalBasisListProps) {
  return (
    <ul className="divide-y divide-border rounded-card border border-border bg-surface">
      {items.map((item) => {
        const reference =
          item.note ??
          item.source.articleReference;

        return (
          <li
            key={item.source.id}
            className="p-5 tablet:p-6"
          >
            <p className="type-label text-primary">
              {item.source.organization}
            </p>

            <h3 className="type-h3 mt-2 text-text">
              {item.source.title}
            </h3>

            {reference && (
              <p className="type-body-sm mt-2 text-text-secondary">
                {reference}
              </p>
            )}

            <a
              href={item.source.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.source.title} 원문 새 탭에서 열기`}
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