import { Textarea as TextareaPart } from "@ui-sdk/react/textarea";
import type * as React from "react";
import { cn } from "../lib/cn";
import { boxClass } from "./input";

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
        "in-data-[slot=form-field-box]:resize-none in-data-[slot=form-field-box]:rounded-none in-data-[slot=form-field-box]:border-0 in-data-[slot=form-field-box]:bg-transparent in-data-[slot=form-field-box]:px-1 in-data-[slot=form-field-box]:py-0 in-data-[slot=form-field-box]:ring-0",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
