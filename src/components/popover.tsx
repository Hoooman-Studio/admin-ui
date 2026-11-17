import {
  PopoverClose,
  PopoverContent as PopoverContentPart,
  PopoverDescription as PopoverDescriptionPart,
  Popover as PopoverPart,
  PopoverTitle as PopoverTitlePart,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { popupClass } from "./menu";

/** Small touch screens get a bottom sheet; everything else a panel beside the trigger. */
function Popover(props: React.ComponentProps<typeof PopoverPart>) {
  return <PopoverPart presentation="auto" {...props} />;
}

function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: WithClass<React.ComponentProps<typeof PopoverContentPart>>) {
  return (
    <PopoverContentPart
      className={cn(
        popupClass,
        "au:flex au:w-80 au:max-w-[calc(100vw-1rem)] au:flex-col au:gap-3 au:p-4 au:data-[presentation=sheet]:pb-[calc(1rem+env(safe-area-inset-bottom))]",
        className
      )}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function PopoverTitle({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof PopoverTitlePart>>) {
  return (
    <PopoverTitlePart
      className={cn(
        "au:text-base au:font-semibold au:text-gray-950",
        className
      )}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof PopoverDescriptionPart>>) {
  return (
    <PopoverDescriptionPart
      className={cn("au:-mt-2 au:text-sm au:text-gray-600", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
};
