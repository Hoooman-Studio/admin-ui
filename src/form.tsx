import {
  type AnyFormApi,
  type FormValidateOrFn,
  isStandardSchemaValidator,
  type ReactFormExtendedApi,
  type RejectPromiseValidator,
  type StandardSchemaV1,
  useForm,
  useStore,
} from "@tanstack/react-form";
import * as React from "react";
import { Banner } from "./components/banner";
import { Button, type ButtonProps } from "./components/button";
import { CheckboxField } from "./components/checkbox";
import { DatePicker } from "./components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
  FormField,
} from "./components/field";
import { Input } from "./components/input";
import { NumberInput } from "./components/number-input";
import { RadioField, RadioGroup } from "./components/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./components/select";
import { SwitchField } from "./components/switch";
import { TagInput } from "./components/tag-input";
import { Textarea } from "./components/textarea";
import { toast } from "./components/toast";
import { cn } from "./lib/cn";
import type { FormResult } from "./lib/form-result";

const failedMessage = "Something went wrong. Try again.";

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
  state: { value: T; meta: { errors: readonly unknown[] } };
}

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
 * A form-wide error as text. A Standard Schema on the form reports a map of
 * paths to issues; issues without a path (like a `refine` across fields)
 * belong to the form, the others show under their fields.
 */
function formErrorText(error: unknown): string | null {
  if (error && typeof error === "object" && !("message" in error)) {
    const pathless = (error as Record<string, unknown>)[""];
    return Array.isArray(pathless) ? errorText(pathless[0]) : null;
  }
  return errorText(error);
}

/**
 * The field's first error, and a change handler that also clears the server's
 * error for it. `toValue` turns what the control reports into the field's value.
 */
function bind<T, I = T>(field: BoundField<T>, toValue?: (input: I) => T) {
  const onChange = (input: I) => {
    field.form.setFieldMeta(field.name, (meta) => ({
      ...meta,
      errorMap: { ...meta.errorMap, onServer: undefined },
    }));
    field.handleChange(toValue ? toValue(input) : (input as unknown as T));
  };
  return { error: errorText(field.state.meta.errors[0]), onChange };
}

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

function TextField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Input>) {
  const { error, onChange } = bind(field);
  return (
    <FormField description={description} error={error} label={label}>
      <Input
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

function TextareaField({
  field,
  label,
  description,
  ...props
}: FieldProps<string> & ControlProps<typeof Textarea>) {
  const { error, onChange } = bind(field);
  return (
    <FormField description={description} error={error} label={label}>
      <Textarea
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

/** A number, or null while empty. */
function NumberField({
  field,
  label,
  description,
  ...props
}: FieldProps<number | null> & ControlProps<typeof NumberInput>) {
  const { error, onChange } = bind(field);
  return (
    <FormField description={description} error={error} label={label}>
      <NumberInput
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value}
      />
    </FormField>
  );
}

type DateValue = NonNullable<React.ComponentProps<typeof DatePicker>["value"]>;

/** An ISO date string like "2026-10-16", or null while empty. */
function DateField({
  field,
  label,
  description,
  ...props
}: FieldProps<string | null> &
  Omit<ControlProps<typeof DatePicker>, "mode" | "endLabel">) {
  const { error, onChange } = bind(field, (value: DateValue | null) =>
    typeof value === "string" ? value : null
  );
  return (
    <FormField description={description} error={error} label={label}>
      <DatePicker
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        onValueChange={onChange}
        value={field.state.value as DateValue | null}
      />
    </FormField>
  );
}

interface Option<T extends string> {
  label: React.ReactNode;
  value: T;
}

/**
 * One value from a short list. The field holds a string (or a union of
 * strings), or null while nothing is chosen; the options must match it.
 */
function SelectField<T extends string | null>({
  field,
  label,
  description,
  options,
  placeholder,
  disabled,
}: FieldProps<T> & {
  options: readonly Option<NoInfer<NonNullable<T>>>[];
  placeholder?: string;
  disabled?: boolean;
}) {
  // Null only comes from a clear button or a native form reset, and we render neither: keep the value.
  const { error, onChange } = bind(
    field,
    (value: NonNullable<T> | null) => value ?? field.state.value
  );
  return (
    <FormField description={description} error={error} label={label}>
      <Select<NonNullable<T>>
        disabled={disabled}
        name={field.name}
        onValueChange={onChange}
        placeholder={placeholder}
        value={field.state.value as NonNullable<T> | null}
      >
        <SelectTrigger onBlur={field.handleBlur} />
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
function RadioGroupField<T extends string>({
  field,
  label,
  description,
  options,
  disabled,
}: FieldProps<T> & {
  options: readonly (Option<NoInfer<T>> & {
    description?: React.ReactNode;
  })[];
  disabled?: boolean;
}) {
  const { error, onChange } = bind(
    field,
    (value: T | null) => value ?? field.state.value
  );
  const errorId = React.useId();
  return (
    <FieldSet
      className="au:gap-3"
      disabled={disabled}
      onBlur={field.handleBlur}
    >
      <FieldLegend className="au:mb-0 au:px-1 au:text-sm au:font-medium">
        {label}
      </FieldLegend>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <RadioGroup<T>
        aria-describedby={error ? errorId : undefined}
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
        <FieldError id={errorId} match>
          {error}
        </FieldError>
      ) : null}
    </FieldSet>
  );
}

/** A checkbox for a boolean. */
function FormCheckboxField({
  field,
  ...props
}: FieldProps<boolean> & { disabled?: boolean }) {
  const { error, onChange } = bind(
    field,
    (checked: boolean | "indeterminate") => checked === true
  );
  return (
    <CheckboxField
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onBlur={field.handleBlur}
      onCheckedChange={onChange}
    />
  );
}

/** A switch for a boolean, as a settings row. */
function FormSwitchField({
  field,
  ...props
}: FieldProps<boolean> & { disabled?: boolean }) {
  const { error, onChange } = bind(field);
  return (
    <SwitchField
      {...props}
      checked={field.state.value}
      error={error}
      name={field.name}
      onBlur={field.handleBlur}
      onCheckedChange={onChange}
    />
  );
}

/** A list of free-text tags. */
function TagsField({
  field,
  label,
  description,
  ...props
}: FieldProps<string[]> & ControlProps<typeof TagInput>) {
  const { error, onChange } = bind(field);
  return (
    <FormField description={description} error={error} label={label}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: TagInput takes no onBlur, so a focus-out anywhere in it counts. */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: as above. */}
      <div onBlur={field.handleBlur}>
        <TagInput
          {...props}
          name={field.name}
          onValueChange={onChange}
          value={field.state.value}
        />
      </div>
    </FormField>
  );
}

/** Shows a refused submit on the form: its message above the submit button, its field errors under the fields. */
function refuse(form: AnyFormApi, result: Extract<FormResult, { ok: false }>) {
  const fieldErrors = result.fieldErrors ?? {};
  // Errors for fields this form doesn't render would otherwise show nowhere.
  const unshown = Object.entries(fieldErrors)
    .filter(([name]) => !form.fieldInfo[name]?.instance)
    .map(([, text]) => text);
  const message =
    [result.message, ...unshown].filter(Boolean).join(" ") ||
    (Object.keys(fieldErrors).length > 0 ? undefined : failedMessage);
  form.setErrorMap({ onServer: { form: message, fields: fieldErrors } });
}

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
    // biome-ignore lint/suspicious/noConfusingVoidType: a submit may return nothing.
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
 * FormResult. A thrown error is logged and shown as a generic form error.
 * Inside a FormDialog, `ok: true` closes the dialog. The onSubmit schema runs
 * twice per submit (TanStack's check, then the parse), so keep slow async
 * checks, like a uniqueness lookup, in the save itself.
 */
function useAdminForm<
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
> {
  const dialog = React.use(FormDialogContext);
  return useForm<
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
  >({
    defaultValues,
    validators,
    onSubmit: async ({ value, formApi }) => {
      try {
        const schema = validators?.onSubmit;
        let input: unknown = value;
        if (isStandardSchemaValidator(schema)) {
          const parsed = await schema["~standard"].validate(value);
          // TanStack already validated; issues here mean there is nothing to submit.
          if (parsed.issues) {
            return;
          }
          input = parsed.value;
        }
        const result = await onSubmit(
          input as SubmitValue<TFormData, TOnSubmit>
        );
        if (!result) {
          return;
        }
        if (!result.ok) {
          refuse(formApi, result);
          return;
        }
        if (result.message) {
          toast.success(result.message);
        }
        dialog?.close();
      } catch (error) {
        console.error(error);
        refuse(formApi, { ok: false, message: failedMessage });
      }
    },
  });
}

const FormContext = React.createContext<AnyFormApi | null>(null);

function useFormContext() {
  const form = React.use(FormContext);
  if (!form) {
    throw new Error("SubmitButton and FormError go inside an AdminForm.");
  }
  return form;
}

/** The `<form>` for a form from useAdminForm: submits it, and gives SubmitButton and FormError their form. */
function AdminForm({
  form,
  className,
  children,
}: {
  form: AnyFormApi;
  className?: string;
  children: React.ReactNode;
}) {
  const submit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      // The last submit's refusal shouldn't block this one.
      form.setErrorMap({ onServer: { form: undefined, fields: {} } });
      form.handleSubmit().catch((error: unknown) => {
        console.error(error);
        refuse(form, { ok: false, message: failedMessage });
      });
    },
    [form]
  );
  // In a FormDialog the form holds a scrolling DialogBody and a DialogFooter, which bring their own spacing.
  const inDialog = React.use(FormDialogContext) !== null;
  return (
    <FormContext value={form}>
      <form
        className={cn(
          "au:flex au:min-h-0 au:flex-col",
          !inDialog && "au:gap-4",
          className
        )}
        noValidate
        onSubmit={submit}
      >
        {children}
      </form>
    </FormContext>
  );
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/** Pending while the submit runs, and pressable once at a time. */
function SubmitButton(
  props: DistributiveOmit<ButtonProps, "type" | "onClick">
) {
  const form = useFormContext();
  const submitting = useStore(
    form.store,
    (state: AnyFormApi["state"]) => state.isSubmitting
  );
  return (
    <Button
      {...props}
      aria-busy={submitting || undefined}
      disabled={props.disabled || submitting}
      // Keeps keyboard focus on the button while it submits.
      focusableWhenDisabled
      type="submit"
    />
  );
}

/** The form-wide error: a refused submit's message, or a schema issue that names no field. */
function FormError({ className }: { className?: string }) {
  const form = useFormContext();
  const error = useStore(form.store, (state: AnyFormApi["state"]) =>
    formErrorText(state.errorMap.onServer ?? state.errors.find(formErrorText))
  );
  if (!error) {
    return null;
  }
  return <Banner className={className} title={error} tone="danger" />;
}

/** Closes the FormDialog, but only for the opening its form belongs to. */
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
  // A new opening number starts the form fresh, and the old form stays visible while the dialog animates out.
  const [state, setState] = React.useState({ opening: 0, open: false });
  const change = React.useCallback((open: boolean) => {
    setState((prev) =>
      open ? { opening: prev.opening + 1, open } : { ...prev, open }
    );
  }, []);
  const { opening } = state;
  // A slow submit from an earlier opening must not close a newer one.
  const context = React.useMemo(
    () => ({
      close: () =>
        setState((prev) =>
          prev.opening === opening ? { ...prev, open: false } : prev
        ),
    }),
    [opening]
  );
  return (
    <Dialog onOpenChange={change} open={state.open}>
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
  DateField,
  FormCheckboxField,
  FormDialog,
  FormError,
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
