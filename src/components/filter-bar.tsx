import { SearchIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Input, InputClear, InputGroup } from "./input";

type SearchFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "className"
> & {
  className?: string;
  /** The field's name for screen readers. Defaults to the placeholder. */
  "aria-label"?: string;
};

/**
 * A search box for a PageToolbar, with a clear button. Control it with `value`
 * and `onValueChange`; for server search, debounce on your side (like `useDeferredValue`).
 */
function SearchField({
  className,
  placeholder = "Search",
  "aria-label": label,
  ...props
}: SearchFieldProps) {
  return (
    <InputGroup className={cn("w-full max-w-xs", className)}>
      <SearchIcon aria-hidden="true" />
      <Input
        aria-label={label ?? placeholder}
        className="[&::-webkit-search-cancel-button]:appearance-none"
        placeholder={placeholder}
        type="search"
        {...props}
      />
      <InputClear aria-label="Clear search" />
    </InputGroup>
  );
}

interface FilterChipProps {
  className?: string;
  /** What the filter is, like "Status". */
  label: React.ReactNode;
  onRemove: () => void;
  /** Names the remove button, like "Remove Status filter". */
  removeLabel: string;
  /** The chosen value, like "Live". */
  value: React.ReactNode;
}

/** One active filter, with a button to remove it. */
function FilterChip({
  label,
  value,
  removeLabel,
  onRemove,
  className,
}: FilterChipProps) {
  return (
    <span
      className={cn(
        "bg-alpha/5 inline-flex h-7 shrink-0 items-center gap-1 rounded-lg ps-2.5 pe-0.5 text-sm font-medium whitespace-nowrap text-gray-950",
        className
      )}
    >
      <span className="text-gray-600">{label}:</span>
      {value}
      <Button
        aria-label={removeLabel}
        className="text-gray-600 hover:text-gray-950"
        onClick={onRemove}
        size="icon-xs"
        variant="ghost"
      >
        <XIcon />
      </Button>
    </span>
  );
}

type FilterChipsProps = React.ComponentProps<"div"> & {
  /** Removes every filter. Shows a "Clear all" button. */
  onClear?: () => void;
};

/** The row of active FilterChips under a PageToolbar. Render it only while a filter is on. */
function FilterChips({
  onClear,
  children,
  className,
  ...props
}: FilterChipsProps) {
  return (
    <div
      className={cn(
        "border-alpha/10 flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
      {onClear ? (
        <Button
          className="text-gray-600"
          onClick={onClear}
          size="sm"
          variant="ghost"
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}

export type { FilterChipProps, FilterChipsProps, SearchFieldProps };
export { FilterChip, FilterChips, SearchField };
