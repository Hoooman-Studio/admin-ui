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
import type { WithClass } from "../lib/types";

/** Parts that add their own indicator or chevron take plain children, not a render function. */
type WithNodeChildren<T> = Omit<WithClass<T>, "children"> & {
  children?: React.ReactNode;
};

/** The floating surface shared by menus and popovers, and the bottom sheet they become on small touch screens. */
const popupClass =
  "au:origin-(--transform-origin) au:rounded-2xl au:border au:border-alpha/10 au:bg-gray-50 au:text-gray-950 au:shadow-dropdown au:outline-none au:transition-[opacity,scale] au:duration-100 au:ease-out au:data-ending-style:scale-95 au:data-ending-style:opacity-0 au:data-starting-style:scale-95 au:data-starting-style:opacity-0 au:motion-reduce:transition-none au:data-[presentation=sheet]:w-full au:data-[presentation=sheet]:max-w-none au:data-[presentation=sheet]:scale-100 au:data-[presentation=sheet]:rounded-t-3xl au:data-[presentation=sheet]:rounded-b-none au:data-[presentation=sheet]:border-x-0 au:data-[presentation=sheet]:border-b-0 au:data-[presentation=sheet]:opacity-100";

const itemClass =
  "au:relative au:flex au:h-8 au:cursor-default au:items-center au:gap-2 au:rounded-lg au:px-2 au:text-sm au:font-medium au:outline-none au:select-none au:data-disabled:opacity-40 au:data-highlighted:bg-alpha/5 au:data-pending:cursor-progress au:data-pending:opacity-60 au:[&_svg]:size-4 au:[&_svg]:shrink-0 au:[&_svg]:text-gray-600 au:pointer-coarse:h-11";

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
        "au:flex au:max-h-(--available-height) au:min-w-48 au:flex-col au:overflow-y-auto au:p-1.5 au:data-[presentation=sheet]:p-3 au:data-[presentation=sheet]:pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
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
        "au:data-destructive:text-red-500 au:data-destructive:data-highlighted:bg-red-500/10 au:data-destructive:[&_svg]:text-red-500",
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
      <MenuItemIndicator className="au:ml-auto">
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
      <MenuItemIndicator className="au:ml-auto">
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
      className={cn(
        "au:px-2 au:py-1.5 au:text-xs au:font-medium au:text-gray-500",
        className
      )}
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
      className={cn("au:bg-alpha/5 au:-mx-1.5 au:my-1.5 au:h-px", className)}
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
      className={cn(itemClass, "au:data-open:bg-alpha/5", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="au:ml-auto" />
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
        "au:flex au:max-h-(--available-height) au:min-w-48 au:flex-col au:overflow-y-auto au:p-1.5 au:data-[presentation=sheet]:p-3 au:data-[presentation=sheet]:pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
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
