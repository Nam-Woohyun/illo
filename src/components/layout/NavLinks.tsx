"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "./navigation";

type NavLinksVariant =
  | "desktop"
  | "mobile"
  | "compact";

interface NavLinksProps {
  items: readonly NavigationItem[];
  variant?: NavLinksVariant;
  onNavigate?: () => void;
}

function isActivePath(
  pathname: string,
  href: string,
) {
  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

const containerClasses: Record<
  NavLinksVariant,
  string
> = {
  desktop: "flex h-full items-stretch gap-1",
  mobile: "flex flex-col gap-1",
  compact: "flex items-center",
};

function getLinkClasses(
  variant: NavLinksVariant,
  active: boolean,
) {
  const commonClasses = [
    "transition-colors",
    "duration-150",
  ];

  if (variant === "desktop") {
    return [
      ...commonClasses,
      "flex",
      "h-[68px]",
      "items-center",
      "border-b-2",
      "px-3",
      "text-sm",
      active
        ? "border-primary font-semibold text-primary"
        : "border-transparent font-medium text-text-secondary hover:text-primary",
    ].join(" ");
  }

  if (variant === "mobile") {
    return [
      ...commonClasses,
      "flex",
      "min-h-12",
      "items-center",
      "border-l-2",
      "px-4",
      "py-3",
      "text-base",
      active
        ? "border-primary bg-secondary font-semibold text-primary"
        : "border-transparent text-text hover:bg-bg hover:text-primary",
    ].join(" ");
  }

  return [
    ...commonClasses,
    "flex",
    "min-h-11",
    "min-w-11",
    "items-center",
    "justify-center",
    "border-b-2",
    "px-2",
    "text-sm",
    active
      ? "border-primary font-semibold text-primary"
      : "border-transparent font-medium text-text-secondary hover:text-primary",
  ].join(" ");
}

export function NavLinks({
  items,
  variant = "desktop",
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className={containerClasses[variant]}>
      {items.map((item) => {
        const active = isActivePath(
          pathname,
          item.href,
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              active ? "page" : undefined
            }
            onClick={onNavigate}
            className={getLinkClasses(
              variant,
              active,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}