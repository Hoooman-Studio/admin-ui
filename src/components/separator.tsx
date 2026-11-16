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
        "bg-alpha/10 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
