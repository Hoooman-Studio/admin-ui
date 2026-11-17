// Type tests for ./form: each @ts-expect-error is a misuse that must not compile.
// Checked by `tsc --noEmit`; not built or run.
import {
  AdminForm,
  FormCheckboxField,
  NumberField,
  SubmitButton,
  TextField,
  useAdminForm,
} from "./form";

const listing: { title: string; rent: number | null } = {
  title: "",
  rent: null,
};

// biome-ignore lint/correctness/noUnusedVariables: only type-checked.
function Misuses() {
  const form = useAdminForm({
    defaultValues: listing,
    onSubmit: () => undefined,
  });
  useAdminForm({
    defaultValues: listing,
    // @ts-expect-error onSubmit returns a FormResult or nothing.
    onSubmit: () => ({ ok: "yes" }),
  });
  return (
    <AdminForm form={form}>
      <form.Field name="rent">
        {/* @ts-expect-error A number field needs a NumberField. */}
        {(field) => <TextField field={field} label="Rent" />}
      </form.Field>
      <form.Field name="title">
        {/* @ts-expect-error A string field can't use a NumberField. */}
        {(field) => <NumberField field={field} label="Title" />}
      </form.Field>
      <form.Field name="title">
        {/* @ts-expect-error A checkbox needs a boolean field. */}
        {(field) => <FormCheckboxField field={field} label="Title" />}
      </form.Field>
      <SubmitButton aria-label="Save" size="icon" />
      {/* @ts-expect-error An icon-only button needs an aria-label. */}
      <SubmitButton size="icon" />
    </AdminForm>
  );
}
