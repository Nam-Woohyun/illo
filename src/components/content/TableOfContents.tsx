export interface TableOfContentsItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({
  items,
}: TableOfContentsProps) {
  return (
    <>
      <details className="rounded-card border border-border bg-surface desktop:hidden">
        <summary className="cursor-pointer px-5 py-4 type-label text-text">
          이 글에서 확인할 내용
        </summary>

        <div className="border-t border-border px-5 py-4">
          <TableOfContentsLinks
            items={items}
          />
        </div>
      </details>

      <div className="hidden rounded-card border border-border bg-surface p-5 desktop:block">
        <p className="type-label text-text">
          이 글에서 확인할 내용
        </p>

        <div className="mt-3">
          <TableOfContentsLinks
            items={items}
          />
        </div>
      </div>
    </>
  );
}

function TableOfContentsLinks({
  items,
}: TableOfContentsProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="inline-flex min-h-11 items-center type-body-sm text-text-secondary transition-colors hover:text-primary"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}