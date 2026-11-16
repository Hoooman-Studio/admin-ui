import {
  Select,
  SelectContent as SelectContentPart,
  SelectGroupLabel as SelectGroupLabelPart,
  SelectGroup as SelectGroupPart,
  SelectItemIndicator,
  SelectItem as SelectItemPart,
  SelectSeparator as SelectSeparatorPart,
  SelectTrigger as SelectTriggerPart,
  SelectValue as SelectValuePart,
} from "@ui-sdk/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { boxClass, inFieldBox } from "./input";

type WithNodeChildren<T> = Omit<WithClass<T>, "children"> & {
  children?: React.ReactNode;
};

/** A bordered control box like Input's, that turns borderless inside a FormField. */
const controlBoxClass = cn(
  boxClass,
  "flex h-8 w-full min-w-0 items-center gap-2 px-3 text-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40",
  inFieldBox
);

/** The floating list of a Select or Combobox. */
const listPopupClass =
  "flex max-h-[min(20rem,var(--available-height))] min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-y-auto rounded-2xl border border-alpha/5 bg-gray-50 p-1 text-gray-950 shadow-dropdown outline-none transition-[opacity,scale] duration-150 ease-fluid data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none";

/** One option in a list popup. The check sits at the end. */
const listItemClass =
  "relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-lg py-1.5 ps-2.5 pe-8 text-sm font-medium outline-none select-none data-disabled:opacity-40 data-highlighted:bg-alpha/5 [&_svg]:size-4 [&_svg]:shrink-0";

const listCheckClass =
  "absolute end-2.5 flex items-center text-gray-950 [&_svg]:size-4";

type SelectTriggerProps = WithNodeChildren<
  React.ComponentProps<typeof SelectTriggerPart>
>;

/** The button that opens the list. Shows the selected label (a SelectValue) unless you pass children. */
function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectTriggerPart
      className={cn(
        controlBoxClass,
        "text-input justify-between text-start outline-none",
        className
      )}
      {...props}
    >
      {children ?? <SelectValue />}
      <ChevronDownIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-gray-500"
      />
    </SelectTriggerPart>
  );
}

function SelectValue({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectValuePart>>) {
  return (
    <SelectValuePart
      className={cn("truncate data-placeholder:text-gray-500", className)}
      {...props}
    />
  );
}

function SelectContent({
  className,
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: WithClass<React.ComponentProps<typeof SelectContentPart>>) {
  return (
    <SelectContentPart
      className={cn(listPopupClass, className)}
      collisionPadding={collisionPadding}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

type SelectItemProps<T> = WithNodeChildren<
  React.ComponentProps<typeof SelectItemPart<T>>
>;

function SelectItem<T = string>({
  className,
  children,
  ...props
}: SelectItemProps<T>) {
  return (
    <SelectItemPart<T> className={cn(listItemClass, className)} {...props}>
      {children}
      <SelectItemIndicator className={listCheckClass}>
        <CheckIcon aria-hidden="true" />
      </SelectItemIndicator>
    </SelectItemPart>
  );
}

function SelectGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectGroupPart>>) {
  return (
    <SelectGroupPart className={cn("flex flex-col", className)} {...props} />
  );
}

function SelectGroupLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectGroupLabelPart>>) {
  return (
    <SelectGroupLabelPart
      className={cn(
        "px-2.5 pt-2 pb-1 text-xs font-medium text-gray-500",
        className
      )}
      {...props}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectSeparatorPart>>) {
  return (
    <SelectSeparatorPart
      className={cn("bg-alpha/5 -mx-1 my-1 h-px shrink-0", className)}
      {...props}
    />
  );
}

export {
  controlBoxClass,
  listCheckClass,
  listItemClass,
  listPopupClass,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
