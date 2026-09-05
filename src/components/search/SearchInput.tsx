import { Button } from "@/components/ui/Button";

interface SearchInputProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  buttonLabel?: string;
  required?: boolean;
}

export function SearchInput({
  id = "search-query",
  name = "q",
  label = "인사노무 정보 검색",
  placeholder = "근로계약서, 연차, 퇴직금 등을 검색해보세요",
  defaultValue = "",
  buttonLabel = "검색",
  required = false,
}: SearchInputProps) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className="flex flex-col gap-3 tablet:flex-row"
    >
      <label
        htmlFor={id}
        className="sr-only"
      >
        {label}
      </label>

      <input
        id={id}
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={[
          "h-12",
          "w-full",
          "min-w-0",
          "rounded-control",
          "border",
          "border-border",
          "bg-surface",
          "px-4",
          "type-body",
          "text-text",
          "outline-none",
          "transition-colors",
          "placeholder:text-muted",
          "hover:border-[#C9D1CE]",
          "focus:border-primary",
          "focus:ring-2",
          "focus:ring-[#CDE9E4]",
        ].join(" ")}
      />

      <Button
        type="submit"
        size="large"
        className="w-full shrink-0 tablet:w-auto"
      >
        {buttonLabel}
      </Button>
    </form>
  );
}