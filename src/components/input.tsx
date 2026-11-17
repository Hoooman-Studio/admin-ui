import {
  InputClear as InputClearPart,
  InputGroup as InputGroupPart,
  Input as InputPart,
} from "@ui-sdk/react/input";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";

/** The bordered box a standalone control sits in. Inside a FormField's card, the card is the box. */
const boxClass =
  "au:rounded-lg au:border au:border-alpha/10 au:bg-gray-50 au:transition-colors au:hover:border-alpha/20 au:focus-within:border-accent/70 au:focus-within:ring-4 au:focus-within:ring-accent/10 au:hover:focus-within:border-accent/70";

/** Drops the box when the control sits in a FormField's card, which is the box there. */
const inFieldBox =
  "au:in-data-[slot=form-field-box]:h-auto au:in-data-[slot=form-field-box]:min-h-5 au:in-data-[slot=form-field-box]:rounded-none au:in-data-[slot=form-field-box]:border-0 au:in-data-[slot=form-field-box]:bg-transparent au:in-data-[slot=form-field-box]:px-1 au:in-data-[slot=form-field-box]:ring-0 au:in-data-[slot=form-field-box]:focus-within:ring-0";

const inGroup =
  "au:in-data-[slot=input-group]:h-full au:in-data-[slot=input-group]:border-0 au:in-data-[slot=input-group]:bg-transparent au:in-data-[slot=input-group]:px-0 au:in-data-[slot=input-group]:ring-0 au:in-data-[slot=input-group]:focus-within:border-0 au:in-data-[slot=input-group]:focus-within:ring-0";

type InputProps = WithClass<React.ComponentProps<typeof InputPart>>;

function Input({ className, ...props }: InputProps) {
  return (
    <InputPart
      className={cn(
        boxClass,
        "au:text-input au:h-8 au:w-full au:min-w-0 au:px-3 au:text-gray-950 au:outline-none au:placeholder:text-gray-500 au:data-disabled:cursor-not-allowed au:data-disabled:opacity-40",
        inFieldBox,
        inGroup,
        className
      )}
      {...props}
    />
  );
}

type InputGroupProps = WithClass<React.ComponentProps<typeof InputGroupPart>>;

/** An input with icons, text or a clear button around it: `<InputGroup><SearchIcon /><Input /><InputClear /></InputGroup>`. */
function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <InputGroupPart
      className={cn(
        boxClass,
        "au:flex au:h-8 au:items-center au:gap-2 au:px-2.5 au:text-sm au:text-gray-500 au:[&_svg]:size-4 au:[&_svg]:shrink-0",
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
        "au:hover:bg-alpha/5 au:flex au:size-5 au:items-center au:justify-center au:rounded-md au:text-gray-500 au:hover:text-gray-950",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </InputClearPart>
  );
}

export { boxClass, Input, InputClear, InputGroup, inFieldBox };
