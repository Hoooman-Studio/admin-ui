import {
  InputClear as InputClearPart,
  InputGroup as InputGroupPart,
  Input as InputPart,
} from "@ui-sdk/react/input";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

/** The bordered box a standalone control sits in. Inside a FormField's card, the card is the box. */
const boxClass =
  "rounded-lg border border-alpha/10 bg-gray-50 transition-colors hover:border-alpha/20 focus-within:border-accent/70 focus-within:ring-4 focus-within:ring-accent/10 hover:focus-within:border-accent/70";

/** Drops the box when the control sits in a FormField's card, which is the box there. */
const inFieldBox =
  "in-data-[slot=form-field-box]:h-auto in-data-[slot=form-field-box]:min-h-5 in-data-[slot=form-field-box]:rounded-none in-data-[slot=form-field-box]:border-0 in-data-[slot=form-field-box]:bg-transparent in-data-[slot=form-field-box]:px-1 in-data-[slot=form-field-box]:ring-0 in-data-[slot=form-field-box]:focus-within:ring-0";

const inGroup =
  "in-data-[slot=input-group]:h-full in-data-[slot=input-group]:border-0 in-data-[slot=input-group]:bg-transparent in-data-[slot=input-group]:px-0 in-data-[slot=input-group]:ring-0 in-data-[slot=input-group]:focus-within:border-0 in-data-[slot=input-group]:focus-within:ring-0";

type InputProps = Omit<React.ComponentProps<typeof InputPart>, "className"> & {
  className?: string;
};

function Input({ className, ...props }: InputProps) {
  return (
    <InputPart
      className={cn(
        boxClass,
        "text-input h-8 w-full min-w-0 px-3 text-gray-950 outline-none placeholder:text-gray-500 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        inFieldBox,
        inGroup,
        className
      )}
      {...props}
    />
  );
}

type InputGroupProps = Omit<
  React.ComponentProps<typeof InputGroupPart>,
  "className"
> & { className?: string };

/** An input with icons, text or a clear button around it: `<InputGroup><SearchIcon /><Input /><InputClear /></InputGroup>`. */
function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <InputGroupPart
      className={cn(
        boxClass,
        "flex h-8 items-center gap-2 px-2.5 text-sm text-gray-500 [&_svg]:size-4 [&_svg]:shrink-0",
        inFieldBox,
        className
      )}
      {...props}
    />
  );
}

type InputClearProps = Omit<
  React.ComponentProps<typeof InputClearPart>,
  "className"
> & { className?: string; "aria-label": string };

function InputClear({ className, children, ...props }: InputClearProps) {
  return (
    <InputClearPart
      className={cn(
        "hover:bg-alpha/5 flex size-5 items-center justify-center rounded-md text-gray-500 hover:text-gray-950",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </InputClearPart>
  );
}

export { boxClass, Input, InputClear, InputGroup, inFieldBox };
