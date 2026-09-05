import type { ReactNode } from "react";

type CalloutVariant =
  | "summary"
  | "info"
  | "example"
  | "caution";

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
  className?: string;
}

const variantClasses: Record<CalloutVariant, string> = {
  summary: [
    "border-[var(--callout-summary-border)]",
    "bg-[var(--callout-summary-bg)]",
  ].join(" "),

  info: [
    "border-[var(--callout-info-border)]",
    "bg-[var(--callout-info-bg)]",
  ].join(" "),

  example: [
    "border-[var(--callout-example-border)]",
    "bg-[var(--callout-example-bg)]",
  ].join(" "),

  caution: [
    "border-[var(--callout-caution-border)]",
    "bg-[var(--callout-caution-bg)]",
  ].join(" "),
};

const titleClasses: Record<CalloutVariant, string> = {
  summary: "text-primary",
  info: "text-info",
  example: "text-text-secondary",
  caution: "text-warning",
};

export function Callout({
  children,
  variant = "info",
  title,
  className = "",
}: CalloutProps) {
  const classes = [
    "rounded-callout",
    "border",
    "p-5",
    "tablet:p-6",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const contentClass =
    variant === "summary"
      ? "type-body-lg text-text"
      : "type-body text-text";

  return (
    <div className={classes}>
      {title && (
        <p
          className={[
            "type-label",
            "mb-2",
            titleClasses[variant],
          ].join(" ")}
        >
          {title}
        </p>
      )}

      <div className={contentClass}>
        {children}
      </div>
    </div>
  );
}