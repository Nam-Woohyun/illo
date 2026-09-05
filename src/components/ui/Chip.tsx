import type { ReactNode } from "react";

type ChipVariant =
  | "neutral"
  | "primary"
  | "situation";

interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
}

const variantClasses: Record<ChipVariant, string> = {
  neutral: [
    "bg-[#F0F2F1]",
    "px-2.5",
    "py-1",
    "text-text-secondary",
  ].join(" "),

  primary: [
    "bg-secondary",
    "px-2.5",
    "py-1",
    "text-primary",
  ].join(" "),

  situation: [
    "bg-secondary",
    "px-3",
    "py-1.5",
    "font-medium",
    "text-primary",
  ].join(" "),
};

export function Chip({
  children,
  variant = "neutral",
  className = "",
}: ChipProps) {
  const classes = [
    "inline-flex",
    "items-center",
    "rounded-sm",
    "text-sm",
    "leading-5",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {children}
    </span>
  );
}