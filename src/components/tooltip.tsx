import {
  Tooltip,
  TooltipContent as TooltipContentPart,
  TooltipShortcut as TooltipShortcutPart,
  TooltipTrigger,
} from "@ui-sdk/react/tooltip";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";

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
        "au:flex au:max-w-xs au:origin-(--transform-origin) au:items-center au:gap-2 au:rounded-lg au:bg-gray-950 au:px-2.5 au:py-1.5 au:text-xs au:font-medium au:text-gray-50 au:transition-[opacity,scale] au:duration-150 au:ease-out au:data-ending-style:scale-95 au:data-ending-style:opacity-0 au:data-instant:transition-none au:data-starting-style:scale-95 au:data-starting-style:opacity-0 au:motion-reduce:transition-none",
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
      className={cn("au:text-gray-500", className)}
      {...props}
    />
  );
}

export { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger };
