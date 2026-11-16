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
  "text-input tabular h-full w-full min-w-0 flex-1 in-data-[slot=form-field-box]:h-5 bg-transparent outline-none placeholder:text-gray-500 disabled:cursor-not-allowed data-invalid:text-red-500";

const rangeInputClass = "w-auto flex-none field-sizing-content";

const navClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-sm" }),
  "rtl:[&_svg]:-scale-x-100"
);

const dayClass =
  "tabular size-8 cursor-default rounded-lg text-center align-middle text-sm text-gray-950 outline-none hover:bg-alpha/5 focus-visible:ring-2 focus-visible:ring-accent data-outside:text-gray-500 data-today:bg-alpha/5 data-today:font-semibold data-disabled:pointer-events-none data-disabled:opacity-40 data-unavailable:line-through data-range-middle:rounded-none data-range-middle:bg-accent/10 data-preview:bg-accent/10 data-selected:bg-accent data-selected:text-accent-foreground data-selected:hover:bg-accent/90 data-range-middle:data-selected:bg-accent/10 data-range-middle:data-selected:text-gray-950";

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
  ...props
}: DatePickerProps) {
  return (
    <DatePickerPart
      className={cn(
        controlBoxClass,
        "focus-within:border-accent/70 gap-1 pe-1 data-invalid:border-red-500/70",
        className
      )}
      mode={mode}
      {...props}
    >
      {mode === "range" ? (
        <>
          <DatePickerInput className={cn(inputClass, rangeInputClass)} />
          <span aria-hidden="true" className="text-sm text-gray-500">
            –
          </span>
          <DatePickerInput
            aria-label={endLabel}
            className={cn(inputClass, rangeInputClass)}
            end
          />
          <span className="flex-1" />
        </>
      ) : (
        <DatePickerInput className={inputClass} />
      )}
      <DatePickerTrigger
        aria-label={triggerLabel}
        className="hover:bg-alpha/5 flex size-6 shrink-0 items-center justify-center rounded-md text-gray-500 hover:text-gray-950 disabled:pointer-events-none in-data-[slot=form-field-box]:size-5"
      >
        <CalendarIcon aria-hidden="true" className="size-4" />
      </DatePickerTrigger>
      <DatePickerContent
        className="border-alpha/5 shadow-dropdown ease-fluid flex origin-(--transform-origin) flex-col gap-2 rounded-2xl border bg-gray-50 p-3 text-gray-950 transition-[opacity,scale] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none"
        collisionPadding={8}
        sideOffset={4}
      >
        <div className="flex items-center justify-between gap-2">
          <CalendarPrevious className={navClass}>
            <ChevronLeftIcon aria-hidden="true" />
          </CalendarPrevious>
          <CalendarHeading className="text-sm font-semibold" />
          <CalendarNext className={navClass}>
            <ChevronRightIcon aria-hidden="true" />
          </CalendarNext>
        </div>
        <CalendarGrid className="border-collapse">
          <CalendarWeekdays>
            {(index) => (
              <CalendarWeekday
                className="size-8 text-xs font-normal text-gray-500"
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
