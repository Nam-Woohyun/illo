import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  const classes = [
    "mx-auto",
    "w-full",
    "max-w-page",
    "px-5",
    "tablet:px-8",
    "desktop:px-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}