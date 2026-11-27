import { useAsyncOptions } from "@ui-sdk/react/async-options";
import {
  Combobox,
  ComboboxContent as ComboboxContentPart,
  ComboboxEmpty as ComboboxEmptyPart,
  ComboboxInput as ComboboxInputPart,
  ComboboxItemIndicator,
  ComboboxItem as ComboboxItemPart,
  ComboboxList,
  ComboboxStatus as ComboboxStatusPart,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { useMessages } from "./messages";
import {
  controlBoxClass,
  listCheckClass,
  listItemClass,
  listPopupClass,
} from "./select";

type ComboboxInputProps = WithClass<
  React.ComponentProps<typeof ComboboxInputPart>
> & {
  /** Names the chevron button that opens the list. */
  triggerLabel?: string;
};

/**
 * The search field, in a bordered box with a chevron that opens the list.
 * `className` goes on the box; other props go on the input.
 */
function ComboboxInput({
  className,
  triggerLabel,
  ...props
}: ComboboxInputProps) {
  const messages = useMessages();
  return (
    <div
      className={cn(
        controlBoxClass,
        "au:focus-within:border-accent/70 au:pe-1.5 au:has-data-disabled:cursor-not-allowed au:has-data-disabled:opacity-40",
        className
      )}
      data-slot="combobox-box"
    >
      <ComboboxInputPart
        className="au:text-input au:h-full au:min-w-0 au:flex-1 au:bg-transparent au:outline-none au:placeholder:text-gray-500 au:disabled:cursor-not-allowed"
        {...props}
      />
      <ComboboxTrigger
        aria-label={triggerLabel ?? messages.showOptions}
        className="au:hover:bg-alpha/5 au:flex au:size-6 au:shrink-0 au:items-center au:justify-center au:rounded-md au:text-gray-500 au:hover:text-gray-950 au:in-data-[slot=form-field-box]:size-5"
      >
        <ChevronDownIcon aria-hidden="true" className="au:size-4" />
      </ComboboxTrigger>
    </div>
  );
}

function ComboboxContent({
  className,
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: WithClass<React.ComponentProps<typeof ComboboxContentPart>>) {
  return (
    <ComboboxContentPart
      className={cn(listPopupClass, className)}
      collisionPadding={collisionPadding}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

type ComboboxItemProps<T> = Omit<
  React.ComponentProps<typeof ComboboxItemPart<T>>,
  "className" | "children"
> & { className?: string; children?: React.ReactNode };

function ComboboxItem<T = string>({
  className,
  children,
  ...props
}: ComboboxItemProps<T>) {
  return (
    <ComboboxItemPart<T> className={cn(listItemClass, className)} {...props}>
      {children}
      <ComboboxItemIndicator className={listCheckClass}>
        <CheckIcon aria-hidden="true" />
      </ComboboxItemIndicator>
    </ComboboxItemPart>
  );
}

const messageClass =
  "au:px-2.5 au:py-1.5 au:text-sm au:text-gray-500 au:empty:hidden";

/** Shows while no option matches the search. */
function ComboboxEmpty({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof ComboboxEmptyPart>>) {
  return (
    <ComboboxEmptyPart className={cn(messageClass, className)} {...props} />
  );
}

/** Loading, error and result-count messages, for async options. */
function ComboboxStatus({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof ComboboxStatusPart>>) {
  return (
    <ComboboxStatusPart className={cn(messageClass, className)} {...props} />
  );
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  useAsyncOptions,
};
