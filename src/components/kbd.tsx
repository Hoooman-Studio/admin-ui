import type * as React from "react";
import { cn } from "../lib/cn";

/** A key on the keyboard, like `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "border-alpha/5 bg-alpha/4 inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-sans text-xs font-normal text-gray-600",
        className
      )}
      {...props}
    />
  );
}

export { Kbd };
