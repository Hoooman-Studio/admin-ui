import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxInput,
  ComboboxList,
  type ComboboxProps,
  ComboboxValue,
} from "@ui-sdk/react/combobox";
import { XIcon } from "lucide-react";
import { cn } from "../lib/cn";
import { ComboboxContent, ComboboxItem } from "./combobox";
import { useMessages } from "./messages";
import { controlBoxClass } from "./select";

type TagInputProps = Pick<
  ComboboxProps<string, true>,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "name"
  | "form"
  | "disabled"
  | "readOnly"
  | "required"
> & {
  className?: string;
  placeholder?: string;
  /** Tags to suggest while typing. Any other text becomes a tag on Enter. */
  suggestions?: readonly string[];
};

/**
 * Free-form tags: type and press Enter to add one, Backspace in the empty
 * input or a chip's × to remove one. Values are the tag strings.
 */
function TagInput({
  className,
  placeholder,
  suggestions = [],
  ...props
}: TagInputProps) {
  const messages = useMessages();
  return (
    <Combobox<string, true> allowCustomValue multiple {...props}>
      <ComboboxChips
        className={cn(
          controlBoxClass,
          "au:h-auto au:min-h-8 au:flex-wrap au:gap-1 au:px-1.5 au:py-1 au:in-data-[slot=form-field-box]:py-0",
          className
        )}
      >
        <ComboboxValue>
          {(state) =>
            state.labels.map((label) => (
              <ComboboxChip
                className="au:bg-alpha/5 au:focus-visible:outline-accent au:flex au:h-6 au:items-center au:gap-0.5 au:rounded-md au:ps-2 au:pe-0.5 au:text-sm au:font-medium au:text-gray-950 au:outline-none au:focus-visible:outline-2"
                key={label}
                value={label}
              >
                {label}
                <ComboboxChipRemove
                  aria-label={messages.removeTag({ tag: label })}
                  className="au:hover:bg-alpha/10 au:flex au:size-5 au:items-center au:justify-center au:rounded au:text-gray-500 au:hover:text-gray-950 au:data-disabled:hidden"
                >
                  <XIcon aria-hidden="true" className="au:size-3.5" />
                </ComboboxChipRemove>
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxInput
          className="au:text-input au:h-6 au:min-w-20 au:flex-1 au:bg-transparent au:px-1 au:outline-none au:placeholder:text-gray-500"
          placeholder={placeholder}
        />
      </ComboboxChips>
      {suggestions.length > 0 ? (
        <ComboboxContent>
          <ComboboxList>
            {suggestions.map((tag) => (
              <ComboboxItem key={tag} value={tag}>
                {tag}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      ) : null}
    </Combobox>
  );
}

export type { TagInputProps };
export { TagInput };
