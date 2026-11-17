import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePickerContent,
  DatePickerInput,
  DatePicker as DatePickerPart,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button";
import { controlBoxClass } from "./select";

type DatePickerProps = Omit<
  React.ComponentProps<typeof DatePickerPart>,
  "className" | "children"
> & {
  className?: string;
  /** Names the calendar button, which also reads out the chosen date. */
  triggerLabel?: string;
  /** Names the end input in range mode. The field's label names the start. */
  endLabel?: string;
};

const inputClass =
  "au:text-input au:tabular au:h-full au:w-full au:min-w-0 au:flex-1 au:in-data-[slot=form-field-box]:h-5 au:bg-transparent au:outline-none au:placeholder:text-gray-500 au:disabled:cursor-not-allowed au:data-invalid:text-red-500";

const rangeInputClass = "au:w-auto au:flex-none au:field-sizing-content";

const navClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-sm" }),
  "au:rtl:[&_svg]:-scale-x-100"
);

const dayClass =
  "au:tabular au:size-8 au:cursor-default au:rounded-lg au:text-center au:align-middle au:text-sm au:text-gray-950 au:outline-none au:hover:bg-alpha/5 au:focus-visible:ring-2 au:focus-visible:ring-accent au:data-outside:text-gray-500 au:data-today:bg-alpha/5 au:data-today:font-semibold au:data-disabled:pointer-events-none au:data-disabled:opacity-40 au:data-unavailable:line-through au:data-range-middle:rounded-none au:data-range-middle:bg-accent/10 au:data-preview:bg-accent/10 au:data-selected:bg-accent au:data-selected:text-accent-foreground au:data-selected:hover:bg-accent/90 au:data-range-middle:data-selected:bg-accent/10 au:data-range-middle:data-selected:text-gray-950";

/**
 * A date field: type a date in the page's language, or pick one from the
 * calendar popup. Values are ISO date strings like "2026-10-16".
 * `mode="range"` shows a start and an end input.
 */
function DatePicker({
  className,
  triggerLabel = "Choose date",
  endLabel = "End date",
  mode,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: DatePickerProps) {
  // The name belongs on the text input, not the wrapper. Inside a Field, its label names it.
  const name = { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby };
  return (
    <DatePickerPart
      className={cn(
        controlBoxClass,
        "au:focus-within:border-accent/70 au:gap-1 au:pe-1 au:data-invalid:border-red-500/70",
        className
      )}
      mode={mode}
      {...props}
    >
      {mode === "range" ? (
        <>
          <DatePickerInput
            {...name}
            className={cn(inputClass, rangeInputClass)}
          />
          <span aria-hidden="true" className="au:text-sm au:text-gray-500">
            –
          </span>
          <DatePickerInput
            aria-label={endLabel}
            className={cn(inputClass, rangeInputClass)}
            end
          />
          <span className="au:flex-1" />
        </>
      ) : (
        <DatePickerInput {...name} className={inputClass} />
      )}
      <DatePickerTrigger
        aria-label={triggerLabel}
        className="au:hover:bg-alpha/5 au:flex au:size-6 au:shrink-0 au:items-center au:justify-center au:rounded-md au:text-gray-500 au:hover:text-gray-950 au:disabled:pointer-events-none au:in-data-[slot=form-field-box]:size-5"
      >
        <CalendarIcon aria-hidden="true" className="au:size-4" />
      </DatePickerTrigger>
      <DatePickerContent
        className="au:border-alpha/5 au:shadow-dropdown au:ease-fluid au:flex au:origin-(--transform-origin) au:flex-col au:gap-2 au:rounded-2xl au:border au:bg-gray-50 au:p-3 au:text-gray-950 au:transition-[opacity,scale] au:duration-150 au:outline-none au:data-ending-style:scale-95 au:data-ending-style:opacity-0 au:data-starting-style:scale-95 au:data-starting-style:opacity-0 au:motion-reduce:transition-none"
        collisionPadding={8}
        sideOffset={4}
      >
        <div className="au:flex au:items-center au:justify-between au:gap-2">
          <CalendarPrevious className={navClass}>
            <ChevronLeftIcon aria-hidden="true" />
          </CalendarPrevious>
          <CalendarHeading className="au:text-sm au:font-semibold" />
          <CalendarNext className={navClass}>
            <ChevronRightIcon aria-hidden="true" />
          </CalendarNext>
        </div>
        <CalendarGrid className="au:border-collapse">
          <CalendarWeekdays>
            {(index) => (
              <CalendarWeekday
                className="au:size-8 au:text-xs au:font-normal au:text-gray-500"
                index={index}
              />
            )}
          </CalendarWeekdays>
          <CalendarWeeks>
            {(cell) => <CalendarDay className={dayClass} value={cell.date} />}
          </CalendarWeeks>
        </CalendarGrid>
      </DatePickerContent>
    </DatePickerPart>
  );
}

export type { DatePickerProps };
export { DatePicker };
