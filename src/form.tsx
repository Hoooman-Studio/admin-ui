import {
  type AnyFormApi,
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import * as React from "react";
import { Banner } from "./components/banner";
import { Button, type ButtonProps } from "./components/button";
import { CheckboxField as Checkbox } from "./components/checkbox";
import { DatePicker } from "./components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
import { FormField } from "./components/field";
import { Input } from "./components/input";
import { NumberInput } from "./components/number-input";
import { RadioField, RadioGroup } from "./components/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./components/select";
import { SwitchField as Switch } from "./components/switch";
import { TagInput } from "./components/tag-input";
import { Textarea } from "./components/textarea";
import { toast } from "./components/toast";
import { required } from "./lib/required";

/**
 * What a submit returns. `ok: false` keeps the form as typed: `message` shows
 * above the submit button and `fieldErrors` under their fields. `ok: true`
 * shows `message` as a toast and closes a FormDialog.
 */
type FormResult =
  | { ok: true; message?: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> };

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

/** An error from a validator or the server as text. Standard Schema validators report issues, not strings. */
function errorText(error: unknown) {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return null;
}

/**
 * The field in context, its first error, and a change handler that clears the
 * server's error. `toValue` turns what the control reports into the field's value.
 */
function useBoundField<T, Input = T>(toValue?: (input: Input) => T) {
  const field = useFieldContext<T>();
  const error = errorText(field.state.meta.errors[0]);
  const onChange = (input: Input) => {
    field.setMeta((meta) => ({
      ...meta,
      errorMap: { ...meta.errorMap, onServer: undefined },
    }));
    field.handleChange(toValue ? toValue(input) : (input as unknown as T));
  };
  return { field, error, onChange };
}

interface LabelProps {
  description?: React.ReactNode;
  label: React.ReactNode;
}

type InputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onValueChange" | "name"
>;

function TextField({ label, description, ...props }: LabelProps & InputProps) {
  const { field, error, onChange } = useBoundField<string>();
  return (
    <FormField description={description} error={error} label={label}>
      <Input
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value ?? ""}
      />
    </FormField>
  );
}

type TextareaProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onValueChange" | "name"
>;

function TextareaField({
  label,
  description,
  ...props
}: LabelProps & TextareaProps) {
  const { field, error, onChange } = useBoundField<string>();
  return (
    <FormField description={description} error={error} label={label}>
      <Textarea
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value ?? ""}
      />
    </FormField>
  );
}

type NumberProps = Omit<
  React.ComponentProps<typeof NumberInput>,
  "value" | "defaultValue" | "onValueChange" | "name"
>;

/** A number, or null while empty. */
function NumberField({
  label,
  description,
  ...props
}: LabelProps & NumberProps) {
  const { field, error, onChange } = useBoundField<number | null>();
  return (
    <FormField description={description} error={error} label={label}>
      <NumberInput
        {...props}
        name={field.name}
        onValueChange={onChange}
        value={field.state.value ?? null}
      />
    </FormField>
  );
}

type DateProps = Omit<
  React.ComponentProps<typeof DatePicker>,
  "value" | "defaultValue" | "onValueChange" | "name" | "mode"
>;
type DateValue = NonNullable<React.ComponentProps<typeof DatePicker>["value"]>;

/** An ISO date string like "2026-10-16", or null while empty. */
function DateField({ label, description, ...props }: LabelProps & DateProps) {
  const { field, error, onChange } = useBoundField(
    (value: DateValue | null): string | null =>
      typeof value === "string" ? value : null
  );
  return (
    <FormField description={description} error={error} label={label}>
      <DatePicker
        {...props}
        name={field.name}
        onValueChange={onChange}
        value={(field.state.value ?? null) as DateValue | null}
      />
    </FormField>
  );
}

interface Option {
  label: React.ReactNode;
  value: string;
}

/** One value from a short list. */
function SelectField({
  label,
  description,
  options,
  placeholder,
  disabled,
}: LabelProps & {
  options: readonly Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const { field, error, onChange } = useBoundField(
    (value: string | null | undefined) => value ?? null
  );
  return (
    <FormField description={description} error={error} label={label}>
      <Select
        disabled={disabled}
        name={field.name}
        onValueChange={onChange}
        placeholder={placeholder}
        value={field.state.value ?? null}
      >
        <SelectTrigger />
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

/** One value from a few options shown at once, each with an optional description. */
function RadioGroupField({
  label,
  options,
  disabled,
}: {
  label: React.ReactNode;
  options: readonly (Option & { description?: React.ReactNode })[];
  disabled?: boolean;
}) {
  const { field, error, onChange } = useBoundField(
    (value: string | null) => value ?? ""
  );
  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled}>
      <legend className="mb-3 px-1 text-sm font-medium text-gray-950">
        {label}
      </legend>
      <RadioGroup
        aria-invalid={error ? true : undefined}
        name={field.name}
        onValueChange={onChange}
        value={field.state.value}
      >
        {options.map((option) => (
          <RadioField
            description={option.description}
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </RadioGroup>
      {error ? (
        <p className="px-1 text-sm font-medium text-red-500">{error}</p>
      ) : null}
    </fieldset>
  );
}

function CheckboxField(props: LabelProps & { disabled?: boolean }) {
  const { field, error, onChange } = useBoundField(
    (checked: boolean | "indeterminate") => checked === true
  );
  return (
    <Checkbox
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onCheckedChange={onChange}
    />
  );
}

function SwitchField(props: LabelProps & { disabled?: boolean }) {
  const { field, error, onChange } = useBoundField<boolean>();
  return (
    <Switch
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onCheckedChange={onChange}
    />
  );
}

type TagsProps = Omit<
  React.ComponentProps<typeof TagInput>,
  "value" | "defaultValue" | "onValueChange" | "name"
>;

/** A list of free-text tags. */
function TagsField({ label, description, ...props }: LabelProps & TagsProps) {
  const { field, error, onChange } = useBoundField<string[]>();
  return (
    <FormField description={description} error={error} label={label}>
      <TagInput
        {...props}
        name={field.name}
        onValueChange={onChange}
        value={field.state.value ?? []}
      />
    </FormField>
  );
}

/** Pending while the submit runs, and pressable once at a time. */
function SubmitButton(props: Omit<ButtonProps, "type" | "onClick">) {
  const form = useFormContext();
  const submitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <Button
      {...(props as ButtonProps)}
      aria-busy={submitting || undefined}
      disabled={props.disabled || submitting}
      type="submit"
    />
  );
}

/** The form-wide error: a refused submit's message, or a schema issue that names no field. */
function FormError({ className }: { className?: string }) {
  const form = useFormContext();
  const error = useStore(form.store, (state) =>
    errorText(state.errorMap.onServer ?? state.errors[0])
  );
  if (!error) {
    return null;
  }
  return <Banner className={className} title={error} tone="danger" />;
}

const { useAppForm, withForm, extendForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxField,
    DateField,
    NumberField,
    RadioGroupField,
    SelectField,
    SwitchField,
    TagsField,
    TextareaField,
    TextField,
  },
  formComponents: { FormError, SubmitButton },
});

function isFormResult(value: unknown): value is FormResult {
  return typeof value === "object" && value !== null && "ok" in value;
}

/** Shows a returned FormResult on the form. */
function applyResult(formApi: AnyFormApi, result: unknown, onOk?: () => void) {
  if (!isFormResult(result)) {
    return;
  }
  if (result.ok) {
    if (result.message) {
      toast.success(result.message);
    }
    onOk?.();
    return;
  }
  formApi.setErrorMap({
    onServer: { form: result.message, fields: result.fieldErrors ?? {} },
  });
}

/**
 * TanStack Form's `useAppForm` with our fields (`f.TextField`, `f.SelectField`…),
 * `SubmitButton` and `FormError`. Pass a Standard Schema (like Zod) as a
 * validator and `value` in `onSubmit` is typed from it. `onSubmit` may return
 * a FormResult. Inside a FormDialog, `ok: true` closes the dialog.
 */
const useAdminForm: typeof useAppForm = (options) => {
  const dialog = React.use(FormDialogContext);
  const { onSubmit } = options;
  return useAppForm({
    ...options,
    onSubmit: onSubmit
      ? async (props) => {
          applyResult(props.formApi, await onSubmit(props), dialog?.close);
        }
      : undefined,
  });
};

/** The `<form>` for a form from useAdminForm: submits it, and gives SubmitButton and FormError their form. */
function AdminForm({
  form,
  className,
  children,
}: {
  form: {
    AppForm: React.ComponentType<{ children?: React.ReactNode }>;
    handleSubmit: () => unknown;
  };
  className?: string;
  children: React.ReactNode;
}) {
  const submit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      form.handleSubmit();
    },
    [form]
  );
  return (
    <form.AppForm>
      <form
        className={className ?? "flex flex-col gap-4"}
        noValidate
        onSubmit={submit}
      >
        {children}
      </form>
    </form.AppForm>
  );
}

const FormDialogContext = React.createContext<{ close: () => void } | null>(
  null
);

/**
 * A dialog holding a form. The form mounts fresh each time it opens, and a
 * submit that returns `{ ok: true }` closes it. Put a component that calls
 * useAdminForm inside, rendering DialogBody and DialogFooter in its AdminForm.
 */
function FormDialog({
  title,
  description,
  trigger,
  children,
  size,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The element that opens it, like `<Button>New listing</Button>`. */
  trigger: React.ReactElement<Record<string, unknown>>;
  children: React.ReactNode;
  size?: React.ComponentProps<typeof DialogContent>["size"];
}) {
  const [open, setOpen] = React.useState(false);
  // A new key per opening starts the form fresh, and the old one stays visible while the dialog animates out.
  const [opening, setOpening] = React.useState(0);
  const context = React.useMemo(() => ({ close: () => setOpen(false) }), []);
  const change = React.useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setOpening((count) => count + 1);
    }
  }, []);
  return (
    <Dialog onOpenChange={change} open={open}>
      <DialogTrigger render={trigger} />
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <FormDialogContext key={opening} value={context}>
          {children}
        </FormDialogContext>
      </DialogContent>
    </Dialog>
  );
}

export type { FormResult };
export {
  AdminForm,
  extendForm,
  FormDialog,
  required,
  useAdminForm,
  useFieldContext,
  useFormContext,
  withForm,
};
