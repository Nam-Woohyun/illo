import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className = "",
}: BadgeProps) {
  const classes = [
    "inline-flex",
    "items-center",
    "rounded-sm",
    "bg-secondary",
    "px-2",
    "py-1",
    "text-xs",
    "font-semibold",
    "leading-[18px]",
    "text-primary",
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