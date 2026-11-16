import { PlusIcon } from "lucide-react";
import { z } from "zod";
import {
  Button,
  DialogBody,
  DialogFooter,
  PageBody,
  PageHeader,
  PageSection,
} from "../../../src";
import {
  AdminForm,
  FormDialog,
  type FormResult,
  useAdminForm,
} from "../../../src/form";

/** Empty (null) while editing, required on submit: the form holds `T | null`, the parsed value is `T`. */
function filled<T extends z.ZodType>(schema: T, message: string) {
  return schema.nullable().transform((value, ctx): z.output<T> => {
    if (value === null) {
      ctx.addIssue({ code: "custom", message });
      return z.NEVER;
    }
    return value;
  });
}

const listingSchema = z.object({
  title: z.string().min(3, "Use at least 3 characters."),
  status: z.enum(["draft", "live"], "Choose a status."),
  rent: filled(
    z.number().int().positive("Rent must be above 0."),
    "Enter the rent."
  ),
  availableFrom: filled(z.string(), "Choose a date."),
  tags: z.array(z.string()),
  billing: z.string(),
  featured: z.boolean(),
  notes: z.string(),
});

type ListingInput = z.input<typeof listingSchema>;

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Live" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Stands in for the app's backend, like a Convex mutation. */
async function saveListing(value: z.output<typeof listingSchema>) {
  await wait(800);
  if (value.title.toLowerCase().includes("taken")) {
    return {
      ok: false,
      message: "The listing wasn't saved.",
      fieldErrors: { title: "Another listing already uses this title." },
    } satisfies FormResult;
  }
  if (value.status === "live" && value.rent > 5000) {
    return {
      ok: false,
      message: "Listings above €5,000 need a manager's approval to go live.",
    } satisfies FormResult;
  }
  return { ok: true, message: `Saved ${value.title}.` } satisfies FormResult;
}

const emptyListing: ListingInput = {
  title: "",
  status: "draft",
  rent: null,
  availableFrom: null,
  tags: [],
  billing: "monthly",
  featured: false,
  notes: "",
};

const sunnyLoft: ListingInput = {
  ...emptyListing,
  title: "Sunny loft by the Spree",
  rent: 1850,
  availableFrom: "2026-12-01",
  tags: ["balcony"],
};

function EditListingForm() {
  const form = useAdminForm({
    defaultValues: sunnyLoft,
    validators: { onSubmit: listingSchema },
    onSubmit: ({ value }) => saveListing(listingSchema.parse(value)),
  });

  return (
    <AdminForm form={form}>
      <form.AppField name="title">
        {(field) => (
          <field.TextField
            description="Try a title with “taken”, or Live above €5,000."
            label="Title"
          />
        )}
      </form.AppField>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="status">
          {(field) => (
            <field.SelectField label="Status" options={statusOptions} />
          )}
        </form.AppField>
        <form.AppField name="rent">
          {(field) => (
            <field.NumberField
              format={{ style: "currency", currency: "EUR" }}
              label="Monthly rent"
            />
          )}
        </form.AppField>
      </div>
      <form.AppField name="availableFrom">
        {(field) => <field.DateField label="Available from" />}
      </form.AppField>
      <form.AppField name="tags">
        {(field) => (
          <field.TagsField
            label="Tags"
            suggestions={["balcony", "garden", "pets allowed"]}
          />
        )}
      </form.AppField>
      <form.AppField name="billing">
        {(field) => (
          <field.RadioGroupField
            label="Billing"
            options={[
              { value: "monthly", label: "Monthly" },
              {
                value: "yearly",
                label: "Yearly",
                description: "Two months free.",
              },
            ]}
          />
        )}
      </form.AppField>
      <form.AppField name="featured">
        {(field) => (
          <field.SwitchField
            description="Shown first on the homepage."
            label="Featured"
          />
        )}
      </form.AppField>
      <form.AppField name="notes">
        {(field) => <field.TextareaField label="Internal notes" />}
      </form.AppField>
      <form.FormError />
      <div>
        <form.SubmitButton>Save listing</form.SubmitButton>
      </div>
    </AdminForm>
  );
}

function NewListingForm() {
  const form = useAdminForm({
    defaultValues: emptyListing,
    validators: { onSubmit: listingSchema },
    onSubmit: ({ value }) => saveListing(listingSchema.parse(value)),
  });

  return (
    <AdminForm className="flex min-h-0 flex-col" form={form}>
      <DialogBody>
        <form.AppField name="title">
          {(field) => <field.TextField autoFocus label="Title" />}
        </form.AppField>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="status">
            {(field) => (
              <field.SelectField
                label="Status"
                options={statusOptions}
                placeholder="Choose a status"
              />
            )}
          </form.AppField>
          <form.AppField name="rent">
            {(field) => (
              <field.NumberField
                format={{ style: "currency", currency: "EUR" }}
                label="Monthly rent"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="availableFrom">
          {(field) => <field.DateField label="Available from" />}
        </form.AppField>
        <form.FormError />
      </DialogBody>
      <DialogFooter>
        <form.SubmitButton>Create listing</form.SubmitButton>
      </DialogFooter>
    </AdminForm>
  );
}

function TypedFormsPage() {
  return (
    <>
      <PageHeader
        actions={
          <FormDialog
            description="It starts empty each time it opens, and closes once saved."
            title="New listing"
            trigger={
              <Button variant="accent">
                <PlusIcon />
                New listing
              </Button>
            }
          >
            <NewListingForm />
          </FormDialog>
        }
        title="Typed forms"
      />
      <PageBody width="narrow">
        <PageSection
          description="useAdminForm with a Zod schema. Values are typed from the schema, and the save returns ok or refused."
          title="Edit listing"
        >
          <EditListingForm />
        </PageSection>
      </PageBody>
    </>
  );
}

export { TypedFormsPage };
