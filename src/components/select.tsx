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
  "au:flex au:h-8 au:w-full au:min-w-0 au:items-center au:gap-2 au:px-3 au:text-gray-950 au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
  inFieldBox
);

/** The floating list of a Select or Combobox. */
const listPopupClass =
  "au:flex au:max-h-[min(20rem,var(--available-height))] au:min-w-(--anchor-width) au:origin-(--transform-origin) au:flex-col au:overflow-y-auto au:rounded-2xl au:border au:border-alpha/5 au:bg-gray-50 au:p-1 au:text-gray-950 au:shadow-dropdown au:outline-none au:transition-[opacity,scale] au:duration-150 au:ease-fluid au:data-ending-style:scale-95 au:data-ending-style:opacity-0 au:data-starting-style:scale-95 au:data-starting-style:opacity-0 au:motion-reduce:transition-none";

/** One option in a list popup. The check sits at the end. */
const listItemClass =
  "au:relative au:flex au:min-h-8 au:w-full au:cursor-default au:items-center au:gap-2 au:rounded-lg au:py-1.5 au:ps-2.5 au:pe-8 au:text-sm au:font-medium au:outline-none au:select-none au:data-disabled:opacity-40 au:data-highlighted:bg-alpha/5 au:[&_svg]:size-4 au:[&_svg]:shrink-0";

const listCheckClass =
  "au:absolute au:end-2.5 au:flex au:items-center au:text-gray-950 au:[&_svg]:size-4";

type SelectTriggerProps = WithNodeChildren<
  React.ComponentProps<typeof SelectTriggerPart>
>;

/** The button that opens the list. Shows the selected label (a SelectValue) unless you pass children. */
function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectTriggerPart
      className={cn(
        controlBoxClass,
        "au:text-input au:justify-between au:text-start au:outline-none",
        className
      )}
      {...props}
    >
      {children ?? <SelectValue />}
      <ChevronDownIcon
        aria-hidden="true"
        className="au:size-4 au:shrink-0 au:text-gray-500"
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
      className={cn("au:truncate au:data-placeholder:text-gray-500", className)}
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
    <SelectGroupPart
      className={cn("au:flex au:flex-col", className)}
      {...props}
    />
  );
}

function SelectGroupLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof SelectGroupLabelPart>>) {
  return (
    <SelectGroupLabelPart
      className={cn(
        "au:px-2.5 au:pt-2 au:pb-1 au:text-xs au:font-medium au:text-gray-500",
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
      className={cn(
        "au:bg-alpha/5 au:-mx-1 au:my-1 au:h-px au:shrink-0",
        className
      )}
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
