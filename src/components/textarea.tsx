import { Textarea as TextareaPart } from "@ui-sdk/react/textarea";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { boxClass, inFieldBox } from "./input";

type TextareaProps = WithClass<React.ComponentProps<typeof TextareaPart>>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <TextareaPart
      className={cn(
        boxClass,
        "au:text-input au:min-h-20 au:w-full au:resize-y au:px-3 au:py-1.5 au:text-gray-950 au:outline-none au:placeholder:text-gray-500 au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
        inFieldBox,
        "au:in-data-[slot=form-field-box]:min-h-16 au:in-data-[slot=form-field-box]:resize-none au:in-data-[slot=form-field-box]:py-0",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
