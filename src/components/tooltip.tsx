import {
  Tooltip,
  TooltipContent as TooltipContentPart,
  TooltipShortcut as TooltipShortcutPart,
  TooltipTrigger,
} from "@ui-sdk/react/tooltip";
import type * as React from "react";
import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/**
 * The hint. To explain why a button is disabled, keep the Button hoverable and
 * focusable: `<TooltipTrigger render={<Button disabled focusableWhenDisabled>Publish</Button>} />`.
 */
function TooltipContent({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TooltipContentPart>>) {
  return (
    <TooltipContentPart
      className={cn(
        "flex max-w-xs origin-(--transform-origin) items-center gap-2 rounded-lg bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-gray-50 transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}

/** Shows the tooltip's `shortcut` for this platform, like ⌘S or Ctrl+S. */
function TooltipShortcut({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof TooltipShortcutPart>>) {
  return (
    <TooltipShortcutPart
      className={cn("text-gray-500", className)}
      {...props}
    />
  );
}

export { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger };
