import { Separator as SeparatorPart } from "@ui-sdk/react/separator";
import type * as React from "react";
import { cn } from "../lib/cn";

/** A hairline between groups of content. Pass `decorative` when it's only visual. */
function Separator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SeparatorPart>, "className"> & {
  className?: string;
}) {
  return (
    <SeparatorPart
      className={cn(
        "au:bg-alpha/10 au:shrink-0 au:data-[orientation=horizontal]:h-px au:data-[orientation=horizontal]:w-full au:data-[orientation=vertical]:w-px au:data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
