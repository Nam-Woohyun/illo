interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="max-w-article">
      {eyebrow && (
        <p className="type-label text-primary">
          {eyebrow}
        </p>
      )}

      <h1 className="type-h1 mt-3 text-text">
        {title}
      </h1>

      {description && (
        <p className="type-body-lg mt-4 text-text-secondary">
          {description}
        </p>
      )}
    </header>
  );
}