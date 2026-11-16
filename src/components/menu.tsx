import {
  MenuCheckboxItem as MenuCheckboxItemPart,
  MenuContent as MenuContentPart,
  MenuGroup,
  MenuGroupLabel as MenuGroupLabelPart,
  MenuItemIndicator,
  MenuItem as MenuItemPart,
  Menu as MenuPart,
  MenuRadioGroup,
  MenuRadioItem as MenuRadioItemPart,
  MenuSeparator as MenuSeparatorPart,
  MenuSub,
  MenuSubContent as MenuSubContentPart,
  MenuSubTrigger as MenuSubTriggerPart,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Parts that add their own indicator or chevron take plain children, not a render function. */
type WithNodeChildren<T> = Omit<WithClass<T>, "children"> & {
  children?: React.ReactNode;
};

/** The floating surface shared by menus and popovers, and the bottom sheet they become on small touch screens. */
const popupClass =
  "origin-(--transform-origin) rounded-2xl border border-alpha/10 bg-gray-50 text-gray-950 shadow-dropdown outline-none transition-[opacity,scale] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-[presentation=sheet]:w-full data-[presentation=sheet]:max-w-none data-[presentation=sheet]:scale-100 data-[presentation=sheet]:rounded-t-3xl data-[presentation=sheet]:rounded-b-none data-[presentation=sheet]:border-x-0 data-[presentation=sheet]:border-b-0 data-[presentation=sheet]:opacity-100";

const itemClass =
  "relative flex h-8 cursor-default items-center gap-2 rounded-lg px-2 text-sm font-medium outline-none select-none data-disabled:opacity-40 data-highlighted:bg-alpha/5 data-pending:cursor-progress data-pending:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gray-600 pointer-coarse:h-11";

/** Small touch screens get a bottom sheet; everything else a dropdown. */
function Menu(props: React.ComponentProps<typeof MenuPart>) {
  return <MenuPart presentation="auto" {...props} />;
}

function MenuContent({
  className,
  sideOffset = 8,
  ...props
}: WithClass<React.ComponentProps<typeof MenuContentPart>>) {
  return (
    <MenuContentPart
      className={cn(
        popupClass,
        "flex max-h-(--available-height) min-w-48 flex-col overflow-y-auto p-1.5 data-[presentation=sheet]:p-3 data-[presentation=sheet]:pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        className
      )}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

/** A command. Pass `destructive` for actions like Delete. */
function MenuItem({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuItemPart>>) {
  return (
    <MenuItemPart
      className={cn(
        itemClass,
        "data-destructive:text-red-500 data-destructive:data-highlighted:bg-red-500/10 data-destructive:[&_svg]:text-red-500",
        className
      )}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  className,
  children,
  ...props
}: WithNodeChildren<React.ComponentProps<typeof MenuCheckboxItemPart>>) {
  return (
    <MenuCheckboxItemPart className={cn(itemClass, className)} {...props}>
      {children}
      <MenuItemIndicator className="ml-auto">
        <CheckIcon />
      </MenuItemIndicator>
    </MenuCheckboxItemPart>
  );
}

function MenuRadioItem({
  className,
  children,
  ...props
}: WithNodeChildren<React.ComponentProps<typeof MenuRadioItemPart>>) {
  return (
    <MenuRadioItemPart className={cn(itemClass, className)} {...props}>
      {children}
      <MenuItemIndicator className="ml-auto">
        <CheckIcon />
      </MenuItemIndicator>
    </MenuRadioItemPart>
  );
}

function MenuGroupLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuGroupLabelPart>>) {
  return (
    <MenuGroupLabelPart
      className={cn("px-2 py-1.5 text-xs font-medium text-gray-500", className)}
      {...props}
    />
  );
}

function MenuSeparator({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuSeparatorPart>>) {
  return (
    <MenuSeparatorPart
      className={cn("bg-alpha/5 -mx-1.5 my-1.5 h-px", className)}
      {...props}
    />
  );
}

function MenuSubTrigger({
  className,
  children,
  ...props
}: WithNodeChildren<React.ComponentProps<typeof MenuSubTriggerPart>>) {
  return (
    <MenuSubTriggerPart
      className={cn(itemClass, "data-open:bg-alpha/5", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuSubTriggerPart>
  );
}

function MenuSubContent({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof MenuSubContentPart>>) {
  return (
    <MenuSubContentPart
      className={cn(
        popupClass,
        "flex max-h-(--available-height) min-w-48 flex-col overflow-y-auto p-1.5 data-[presentation=sheet]:p-3 data-[presentation=sheet]:pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  );
}

export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  popupClass,
};
