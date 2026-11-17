import type * as React from "react";
import { cn } from "../lib/cn";

/** A key on the keyboard, like `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "au:border-alpha/5 au:bg-alpha/4 au:inline-flex au:h-5 au:min-w-5 au:items-center au:justify-center au:rounded au:border au:px-1 au:font-sans au:text-xs au:font-normal au:text-gray-600",
        className
      )}
      {...props}
    />
  );
}

export { Kbd };
