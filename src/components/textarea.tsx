import { Textarea as TextareaPart } from "@ui-sdk/react/textarea";
import type * as React from "react";
import { cn } from "../lib/cn";
import { boxClass, inFieldBox } from "./input";

type TextareaProps = Omit<
  React.ComponentProps<typeof TextareaPart>,
  "className"
> & { className?: string };

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <TextareaPart
      className={cn(
        boxClass,
        "text-input min-h-20 w-full resize-y px-3 py-1.5 text-gray-950 outline-none placeholder:text-gray-500 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        inFieldBox,
        "in-data-[slot=form-field-box]:min-h-16 in-data-[slot=form-field-box]:resize-none in-data-[slot=form-field-box]:py-0",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
