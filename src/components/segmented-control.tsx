import {
  SegmentedControlIndicator,
  SegmentedControlItem as SegmentedControlItemPart,
  SegmentedControl as SegmentedControlPart,
} from "@ui-sdk/react/segmented-control";
import type * as React from "react";
import { cn } from "../lib/cn";

type SegmentedControlProps<T extends string> = Omit<
  React.ComponentProps<typeof SegmentedControlPart<T>>,
  "className" | "children"
> & { className?: string; children?: React.ReactNode };

/** Pick one of a few options, like Open / Archived / All filters. Name it with `aria-label` or a Field. */
function SegmentedControl<T extends string = string>({
  className,
  children,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <SegmentedControlPart<T>
      className={cn(
        "bg-alpha/5 relative isolate inline-flex w-fit items-center gap-0.5 rounded-full p-1 data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SegmentedControlIndicator className="border-alpha/10 ease-fluid absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) -z-10 h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) rounded-full border bg-gray-50 transition-[left,width] duration-200 motion-reduce:transition-none" />
      {children}
    </SegmentedControlPart>
  );
}

function SegmentedControlItem({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SegmentedControlItemPart>, "className"> & {
  className?: string;
}) {
  return (
    <SegmentedControlItemPart
      className={cn(
        "touch-target focus-visible:outline-accent h-7 rounded-full px-2.5 text-sm font-semibold whitespace-nowrap text-gray-600 transition-colors duration-100 select-none hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-1 data-checked:text-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export type { SegmentedControlProps };
export { SegmentedControl, SegmentedControlItem };
