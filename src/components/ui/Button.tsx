import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "large";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseClasses = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "whitespace-nowrap",
  "rounded-control",
  "font-semibold",
  "transition-colors",
  "duration-150",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-primary",
  "focus-visible:ring-2",
  "focus-visible:ring-[#CDE9E4]",
  "disabled:cursor-not-allowed",
  "disabled:opacity-45",
].join(" ");

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary",
    "text-white",
    "hover:bg-primary-hover",
    "disabled:bg-primary",
  ].join(" "),

  secondary: [
    "border",
    "border-border",
    "bg-surface",
    "text-text",
    "hover:bg-[#F1F5F4]",
    "focus-visible:border-primary",
    "disabled:bg-surface",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-sm",
  large: "h-12 px-6 text-[15px]",
};

export function Button({
  children,
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      {children}
    </button>
  );
}