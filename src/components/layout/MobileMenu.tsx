"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { NavLinks } from "./NavLinks";
import { PageContainer } from "./PageContainer";
import { navigationItems } from "./navigation";

const mobileItems = navigationItems.filter(
  (item) => item.showInMobileMenu,
);

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const rootRef =
    useRef<HTMLDivElement>(null);

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const focusFrame =
      window.requestAnimationFrame(() => {
        const firstLink =
          menuRef.current?.querySelector<HTMLAnchorElement>(
            "a[href]",
          );

        firstLink?.focus();
      });

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      setOpen(false);
      triggerRef.current?.focus();
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        rootRef.current &&
        !rootRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      window.cancelAnimationFrame(
        focusFrame,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          open
            ? "메뉴 닫기"
            : "메뉴 열기"
        }
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() =>
          setOpen(
            (current) => !current,
          )
        }
        className="inline-flex size-11 items-center justify-center rounded-control text-text-secondary transition-colors hover:bg-bg hover:text-primary"
      >
        {open ? (
          <CloseIcon />
        ) : (
          <MenuIcon />
        )}
      </button>

      {open && (
        <div
          id="mobile-site-menu"
          ref={menuRef}
          className={[
            "absolute",
            "inset-x-0",
            "top-full",
            "z-40",
            "max-h-[calc(100vh-60px)]",
            "overflow-y-auto",
            "border-y",
            "border-border",
            "bg-surface",
            "shadow-overlay",
            "desktop:hidden",
          ].join(" ")}
        >
          <PageContainer className="py-3">
            <nav aria-label="모바일 메뉴">
              <NavLinks
                items={mobileItems}
                variant="mobile"
                onNavigate={
                  closeMenu
                }
              />
            </nav>
          </PageContainer>
        </div>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}