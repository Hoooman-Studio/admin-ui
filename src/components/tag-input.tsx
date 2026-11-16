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
  return (
    <Combobox<string, true> allowCustomValue multiple {...props}>
      <ComboboxChips
        className={cn(
          controlBoxClass,
          "h-auto min-h-8 flex-wrap gap-1 px-1.5 py-1 in-data-[slot=form-field-box]:py-0",
          className
        )}
      >
        <ComboboxValue>
          {(state) =>
            state.labels.map((label) => (
              <ComboboxChip
                className="bg-alpha/5 focus-visible:outline-accent flex h-6 items-center gap-0.5 rounded-md ps-2 pe-0.5 text-sm font-medium text-gray-950 outline-none focus-visible:outline-2"
                key={label}
                value={label}
              >
                {label}
                <ComboboxChipRemove
                  aria-label={`Remove ${label}`}
                  className="hover:bg-alpha/10 flex size-5 items-center justify-center rounded text-gray-500 hover:text-gray-950 data-disabled:hidden"
                >
                  <XIcon aria-hidden="true" className="size-3.5" />
                </ComboboxChipRemove>
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxInput
          className="text-input h-6 min-w-20 flex-1 bg-transparent px-1 outline-none placeholder:text-gray-500"
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
