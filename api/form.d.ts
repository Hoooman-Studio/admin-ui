import {
  AnyFormApi,
  FormValidateOrFn,
  ReactFormExtendedApi,
  RejectPromiseValidator,
  StandardSchemaV1,
} from "@tanstack/react-form";
import { Button } from "@ui-sdk/react/button";
import { ComboboxProps } from "@ui-sdk/react/combobox";
import { DatePicker as DatePicker$1 } from "@ui-sdk/react/date-picker";
import { DialogContent as DialogContent$1 } from "@ui-sdk/react/dialog";
import { DrawerContent as DrawerContent$1 } from "@ui-sdk/react/drawer";
import { FileInput as FileInput$1 } from "@ui-sdk/react/file-input";
import { Input as Input$1 } from "@ui-sdk/react/input";
import { NumberInput as NumberInput$1 } from "@ui-sdk/react/number-input";
import { Textarea as Textarea$1 } from "@ui-sdk/react/textarea";
import { VariantProps } from "class-variance-authority";
import * as React from "react";

declare const buttonVariants: (
  props?:
    | ({
        variant?:
          | "accent"
          | "danger"
          | "danger-subtle"
          | "ghost"
          | "outline"
          | "primary"
          | "subtle"
          | null
          | undefined;
        size?:
          | "icon"
          | "icon-lg"
          | "icon-sm"
          | "icon-xs"
          | "lg"
          | "md"
          | "sm"
          | "xs"
          | null
          | undefined;
        rounded?: boolean | null | undefined;
      } & import("class-variance-authority/types").ClassProp)
    | undefined
) => string;
type ButtonVariants = VariantProps<typeof buttonVariants>;
type ButtonSize = NonNullable<ButtonVariants["size"]>;
type IconSize = Extract<ButtonSize, `icon${string}`>;
type BaseProps = Omit<React.ComponentProps<typeof Button>, "className"> &
  Omit<ButtonVariants, "size"> & {
    className?: string;
    /** Disables the button, keeps it focusable and shows this in a tooltip. */
    disabledReason?: string;
  };
/** Icon-only buttons have no text, so the type requires an `aria-label`. */
type ButtonProps =
  | (BaseProps & {
      size?: Exclude<ButtonSize, IconSize>;
    })
  | (BaseProps & {
      size: IconSize;
      "aria-label": string;
    });
type DatePickerProps = Omit<
  React.ComponentProps<typeof DatePicker$1>,
  "className" | "children"
> & {
  className?: string;
  /** Names the calendar button, which also reads out the chosen date. */
  triggerLabel?: string;
  /** Names the end input in range mode. The field's label names the start. */
  endLabel?: string;
};
/**
 * A date field: type a date in the page's language, or pick one from the
 * calendar popup. Values are ISO date strings like "2026-10-16".
 * `mode="range"` shows a start and an end input.
 */
declare function DatePicker({
  className,
  triggerLabel,
  endLabel,
  mode,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: DatePickerProps): React.JSX.Element;
/** UI SDK parts accept `className` as a function of state; ours take a plain string merged with `cn`. */
type WithClass<T> = Omit<T, "className"> & {
  className?: string;
};
type DialogContentProps = WithClass<
  React.ComponentProps<typeof DialogContent$1>
> & {
  /** Wider dialogs for forms with two columns or previews. */
  size?: "sm" | "md" | "lg";
};
/** The dialog's panel, with its backdrop. Put a DialogHeader, a DialogBody and a DialogFooter inside. */
declare function DialogContent({
  className,
  size,
  ...props
}: DialogContentProps): React.JSX.Element;
declare const sizes: {
  sm: string;
  md: string;
  lg: string;
};
type DrawerContentProps = WithClass<
  React.ComponentProps<typeof DrawerContent$1>
> & {
  /** `md` fits record details; `lg` fits a wide edit form. */
  size?: keyof typeof sizes;
};
/** The sheet, with its backdrop. Put a DrawerHeader, a DrawerBody and a DrawerFooter inside. */
declare function DrawerContent({
  className,
  size,
  ...props
}: DrawerContentProps): React.JSX.Element;
/** Holds the chosen files. Put a FileInputDropzone and a FileInputList inside. */
declare function FileInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof FileInput$1>>): React.JSX.Element;
type InputProps = WithClass<React.ComponentProps<typeof Input$1>>;
declare function Input({ className, ...props }: InputProps): React.JSX.Element;
type NumberInputProps = Omit<
  React.ComponentProps<typeof NumberInput$1>,
  "className" | "children"
> & {
  className?: string;
  placeholder?: string;
  /** Names the step buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
};
/**
 * A number field with − and + buttons. Arrow keys step it too, and `format`
 * shows it as currency or percent. The value is a number, or null when empty.
 */
declare function NumberInput({
  className,
  placeholder,
  decrementLabel,
  incrementLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: NumberInputProps): React.JSX.Element;
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
declare function TagInput({
  className,
  placeholder,
  suggestions,
  ...props
}: TagInputProps): import("react").JSX.Element;
type TextareaProps = WithClass<React.ComponentProps<typeof Textarea$1>>;
declare function Textarea({
  className,
  ...props
}: TextareaProps): React.JSX.Element;
/**
 * What a form submit returns. `ok: false` keeps the form as typed: `message`
 * shows above the submit button and `fieldErrors` under their fields. Without
 * a `message`, an error for a field the form doesn't render shows above the
 * submit button instead.
 * `ok: true` shows `message` as a toast and closes a FormDialog. Its
 * `warning`, for a side effect that failed, shows as a toast that stays until
 * dismissed.
 */
type FormResult =
  | {
      ok: true;
      message?: string;
      warning?: string;
    }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Record<string, string>;
    };
/**
 * The parts of a TanStack field (from `<form.Field>`) that our fields use.
 * `handleChange` is a property, not a method, so a field whose value type
 * doesn't match the control is a type error.
 */
interface BoundField<T> {
  form: AnyFormApi;
  handleBlur: () => void;
  handleChange: (value: T) => void;
  name: string;
  state: {
    value: T;
    meta: {
      errors: readonly unknown[];
    };
  };
}
/**
 * For your own fields: the field's first error as text, and a change handler
 * that also clears the server's error for it. `toValue` turns what the control
 * reports into the field's value.
 */
declare function bindField<T, I = T>(
  field: BoundField<T>,
  toValue?: (input: I) => T
): {
  error: string | null;
  onChange: (input: I) => void;
};
/** What every field takes. Give your own fields these props too. */
interface FieldProps<T> {
  description?: React.ReactNode;
  /** The field from `<form.Field name="…">{(field) => …}</form.Field>`. */
  field: BoundField<T>;
  label: React.ReactNode;
}
/** Props of a control, without the ones the field sets. */
type ControlProps<C extends React.ElementType> = Omit<
  React.ComponentProps<C>,
  "value" | "defaultValue" | "onValueChange" | "name" | "onBlur"
>;
declare function TextField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Input>): React.JSX.Element;
declare function TextareaField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Textarea>): React.JSX.Element;
/** A number, or null while empty. */
declare function NumberField({
  field,
  label,
  description,
  ...props
}: FieldProps<number | null> &
  ControlProps<typeof NumberInput>): React.JSX.Element;
/** An ISO date string like "2026-10-16", or null while empty. */
declare function DateField({
  field,
  label,
  description,
  ...props
}: FieldProps<string | null> &
  Omit<
    ControlProps<typeof DatePicker>,
    "mode" | "endLabel"
  >): React.JSX.Element;
interface Option<T extends string> {
  label: React.ReactNode;
  value: T;
}
/**
 * One value from a short list. The field holds a string (or a union of
 * strings), or null while nothing is chosen; the options must match it.
 */
declare function SelectField<T extends string | null>({
  field,
  label,
  description,
  options,
  placeholder,
  emptyLabel,
  disabled,
}: FieldProps<T> & {
  options: readonly Option<NoInfer<NonNullable<T>>>[];
  placeholder?: string;
  /** Adds a first choice, like "None", that sets the field to null, so `placeholder` never shows. Only for fields that can be null. */
  emptyLabel?: null extends T ? string : never;
  disabled?: boolean;
}): React.JSX.Element;
type ChoiceOption<T extends string> = Option<T> & {
  description?: React.ReactNode;
};
/** One value from a few options shown at once, each with an optional description. */
declare function RadioGroupField<T extends string>({
  field,
  label,
  description,
  options,
  disabled,
}: FieldProps<T> & {
  options: readonly ChoiceOption<NoInfer<T>>[];
  disabled?: boolean;
}): React.JSX.Element;
/** Any number of values from a few options shown at once, like the IDs of related records. */
declare function ChecklistField<T extends string>({
  field,
  label,
  description,
  options,
  disabled,
}: FieldProps<T[]> & {
  options: readonly ChoiceOption<NoInfer<T>>[];
  disabled?: boolean;
}): React.JSX.Element;
/** A checkbox for a boolean. */
declare function FormCheckboxField({
  field,
  ...props
}: FieldProps<boolean> & {
  disabled?: boolean;
}): React.JSX.Element;
/** A switch for a boolean, as a settings row. */
declare function FormSwitchField({
  field,
  ...props
}: FieldProps<boolean> & {
  disabled?: boolean;
}): React.JSX.Element;
/** A list of free-text tags. */
declare function TagsField({
  field,
  label,
  description,
  ...props
}: FieldProps<string[]> & ControlProps<typeof TagInput>): React.JSX.Element;
/**
 * One file, uploaded as soon as it's picked. The field holds the ID `upload`
 * returns, or null while empty. A picked file shows at once, with its
 * progress; `preview` shows a saved one. Inside an AdminForm, the form
 * doesn't submit while it uploads.
 */
declare function FileField<T extends string | null>({
  field,
  label,
  description,
  upload,
  preview,
  accept,
  removable,
  disabled,
}: FieldProps<T> & {
  /** Uploads the file and returns its ID. Call `onProgress` with 0 to 1 as it goes. A rejection's message shows as the field's error. */
  upload: (
    file: File,
    onProgress: (fraction: number) => void
  ) => Promise<NonNullable<NoInfer<T>>>;
  /** Shows the saved file with this ID, usually as a `<FilePreview>`. Without it, a saved file shows as "Current file". */
  preview?: (id: NonNullable<NoInfer<T>>) => React.ReactNode;
  /** MIME types and extensions, like `"image/*"` or `[".mp3", ".wav"]`. */
  accept?: React.ComponentProps<typeof FileInput>["accept"];
  /** Adds a Remove button that sets the field to null. Only for fields that can be null. */
  removable?: null extends T ? boolean : never;
  disabled?: boolean;
}): React.JSX.Element;
/** What onSubmit receives: the schema's output when `validators.onSubmit` is a Standard Schema, else the form values. */
type SubmitValue<TFormData, TOnSubmit> =
  TOnSubmit extends StandardSchemaV1<unknown, infer TOutput>
    ? TOutput
    : TFormData;
type Validator<TFormData> = undefined | FormValidateOrFn<TFormData>;
interface AdminFormOptions<
  TFormData,
  TOnChange extends Validator<TFormData>,
  TOnBlur extends Validator<TFormData>,
  TOnSubmit extends Validator<TFormData>,
> {
  defaultValues: TFormData;
  /** Runs once the form is valid. Return a FormResult to show the outcome on the form. */
  onSubmit: (
    value: SubmitValue<TFormData, TOnSubmit>
  ) => FormResult | void | Promise<FormResult | void>;
  /** Each a Standard Schema (like Zod) or a function, as in TanStack Form. */
  validators?: {
    onChange?: RejectPromiseValidator<TOnChange>;
    onBlur?: RejectPromiseValidator<TOnBlur>;
    onSubmit?: RejectPromiseValidator<TOnSubmit>;
  };
}
/**
 * TanStack Form's `useForm`, with our submit handling. `onSubmit` receives
 * the parsed output of the `validators.onSubmit` schema and may return a
 * FormResult. A thrown error is logged and shown as a generic form error, or
 * a session one (see AdminProvider).
 * Inside a FormDialog or FormDrawer, `ok: true` closes it. The onSubmit schema runs
 * twice per submit (TanStack's check, then the parse), so keep slow async
 * checks, like a uniqueness lookup, in the save itself.
 */
declare function useAdminForm<
  TFormData,
  TOnChange extends Validator<TFormData> = undefined,
  TOnBlur extends Validator<TFormData> = undefined,
  TOnSubmit extends Validator<TFormData> = undefined,
>({
  defaultValues,
  validators,
  onSubmit,
}: AdminFormOptions<
  TFormData,
  TOnChange,
  TOnBlur,
  TOnSubmit
>): ReactFormExtendedApi<
  TFormData,
  undefined,
  TOnChange,
  undefined,
  TOnBlur,
  undefined,
  TOnSubmit,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
>;
/** The `<form>` for a form from useAdminForm: submits it, and gives SubmitButton and FormError their form. */
declare function AdminForm({
  form,
  className,
  children,
}: {
  form: AnyFormApi;
  className?: string;
  children: React.ReactNode;
}): React.JSX.Element;
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
/** Pending while the submit runs or a FileField uploads, and pressable once at a time. */
declare function SubmitButton(
  props: DistributiveOmit<ButtonProps, "type" | "onClick">
): React.JSX.Element;
/** The form-wide error: a refused submit's message, or a schema issue that names no field or a field the form doesn't render. */
declare function FormError({
  className,
}: {
  className?: string;
}): React.JSX.Element | null;
/** Either a `trigger` that opens it, or `open` and `onOpenChange` from your own state, like the URL. */
type FormOverlayProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
} & (
  | {
      /** The element that opens it, like `<Button>New listing</Button>`. */
      trigger: React.ReactElement<Record<string, unknown>>;
      open?: never;
      onOpenChange?: never;
    }
  | {
      trigger?: never;
      open: boolean;
      /** Called with `false` on Escape, Cancel or a submit that returns `ok: true`. With unsaved changes, only once the person agrees to discard them. */
      onOpenChange: (open: boolean) => void;
    }
);
/**
 * A dialog holding a form. The form mounts fresh each time it opens, and a
 * submit that returns `{ ok: true }` closes it. Put a component that calls
 * useAdminForm inside, rendering DialogBody and DialogFooter in its AdminForm.
 */
declare function FormDialog({
  size,
  ...props
}: FormOverlayProps & {
  size?: React.ComponentProps<typeof DialogContent>["size"];
}): React.JSX.Element;
/**
 * FormDialog as a side sheet, for longer forms. Render DrawerBody and
 * DrawerFooter in its AdminForm, with other buttons before the SubmitButton.
 */
declare function FormDrawer({
  size,
  ...props
}: FormOverlayProps & {
  size?: React.ComponentProps<typeof DrawerContent>["size"];
}): React.JSX.Element;

export {
  AdminForm,
  bindField,
  ChecklistField,
  DateField,
  type FieldProps,
  FileField,
  FormCheckboxField,
  FormDialog,
  FormDrawer,
  FormError,
  type FormResult,
  FormSwitchField,
  NumberField,
  RadioGroupField,
  SelectField,
  SubmitButton,
  TagsField,
  TextareaField,
  TextField,
  useAdminForm,
};
