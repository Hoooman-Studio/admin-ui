import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  CheckboxField,
  CheckboxGroup,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  DatePicker,
  Field,
  FieldDescription,
  FieldLabel,
  FileInput,
  FileInputDropzone,
  FileInputList,
  FormField,
  Input,
  List,
  ListRow,
  NumberInput,
  PageSection,
  RadioField,
  RadioGroup,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SwitchField,
  TagInput,
  Textarea,
  useAsyncOptions,
} from "../../../src";

const industries = [
  {
    label: "Commerce",
    items: [
      { value: "retail", label: "Retail" },
      { value: "food", label: "Food and drink" },
    ],
  },
  {
    label: "Services",
    items: [
      { value: "health", label: "Health care" },
      { value: "education", label: "Education" },
      { value: "legal", label: "Legal", disabled: true },
    ],
  },
];

const languages = [
  { value: "en", label: "English" },
  { value: "nl", label: "Dutch" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const team = [
  { value: "casper", label: "Casper Leerink" },
  { value: "maya", label: "Maya Okafor" },
  { value: "tomas", label: "Tomás Rivera" },
  { value: "ines", label: "Inès Moreau" },
  { value: "kofi", label: "Kofi Mensah" },
];

const companies = [
  "Porta Group",
  "Porta Holdings",
  "Northwind Traders",
  "Fabrikam",
  "Contoso",
  "Tailspin Toys",
  "Wide World Importers",
];

function searchCompanies(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase();
      resolve(
        companies
          .filter((name) => name.toLowerCase().includes(needle))
          .map((name) => ({ value: name, label: name }))
      );
    }, 400);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

const projects = [
  { id: "site", name: "Website relaunch", status: "open" },
  { id: "shop", name: "Online shop", status: "open" },
  { id: "brand", name: "Brand refresh", status: "archived" },
] as const;

type ProjectFilter = "open" | "archived" | "all";

function ProjectsToolbar() {
  const [filter, setFilter] = useState<ProjectFilter>("open");
  const shown = projects.filter(
    (project) => filter === "all" || project.status === filter
  );
  return (
    <PageSection title="Projects">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl<ProjectFilter>
          aria-label="Show projects"
          onValueChange={(next) => next && setFilter(next)}
          value={filter}
        >
          <SegmentedControlItem value="open">Open</SegmentedControlItem>
          <SegmentedControlItem value="archived">Archived</SegmentedControlItem>
          <SegmentedControlItem value="all">All</SegmentedControlItem>
        </SegmentedControl>
        <div className="w-52">
          <Select defaultValue="recent">
            <SelectTrigger aria-label="Sort projects">
              <span className="flex min-w-0 items-center gap-2">
                <ArrowUpDownIcon
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created">Date created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card variant="flush">
        <List>
          {shown.map((project) => (
            <ListRow key={project.id} title={project.name} />
          ))}
        </List>
      </Card>
    </PageSection>
  );
}

function FormsPage() {
  const companySearch = useAsyncOptions(searchCompanies, {
    debounce: 250,
    immediate: true,
  });
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-10 sm:px-10">
      <ProjectsToolbar />

      <form
        className="flex flex-col gap-10"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(
            JSON.stringify(
              [...data.entries()].map(([key, value]) => [key, String(value)])
            )
          );
        }}
      >
        <PageSection
          description="Porta Europa. Changes show in the client's admin right away."
          title="Edit client"
        />

        <PageSection title="General">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" name="name">
              <Input defaultValue="Porta Europa" required />
            </FormField>
            <FormField error="This slug is taken." label="Slug" name="slug">
              <Input defaultValue="porta" />
            </FormField>
            <FormField label="Industry" name="industry">
              <Select placeholder="Choose an industry" required>
                <SelectTrigger />
                <SelectContent>
                  {industries.map((group, index) => (
                    <SelectGroup key={group.label}>
                      {index > 0 ? <SelectSeparator /> : null}
                      <SelectGroupLabel>{group.label}</SelectGroupLabel>
                      {group.items.map((item) => (
                        <SelectItem
                          disabled={"disabled" in item}
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              description="Who the client talks to."
              label="Account manager"
              name="manager"
            >
              <Combobox defaultValue="maya">
                <ComboboxInput placeholder="Search the team" />
                <ComboboxContent>
                  <ComboboxEmpty>No one found.</ComboboxEmpty>
                  <ComboboxList>
                    {team.map((person) => (
                      <ComboboxItem
                        key={person.value}
                        label={person.label}
                        value={person.value}
                      >
                        {person.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FormField>
            <FormField label="Site languages" name="languages">
              <Select
                defaultValue={["en", "nl"]}
                items={languages}
                multiple
                placeholder="Choose languages"
              >
                <SelectTrigger />
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Parent company" name="parent">
              <Combobox
                filter={false}
                items={companySearch.items}
                onQueryChange={(query) => companySearch.setQuery(query)}
                status={companySearch.status}
              >
                <ComboboxInput placeholder="Search companies" />
                <ComboboxContent>
                  <ComboboxStatus>
                    {(state) => (state.loading ? "Searching…" : null)}
                  </ComboboxStatus>
                  <ComboboxEmpty>
                    {(state) =>
                      state.empty && !state.loading
                        ? "No companies found."
                        : null
                    }
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(state) =>
                      (state.items as { value: string; label: string }[]).map(
                        (item) => (
                          <ComboboxItem
                            key={item.value}
                            label={item.label}
                            value={item.value}
                          >
                            {item.label}
                          </ComboboxItem>
                        )
                      )
                    }
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FormField>
          </div>
          <FormField
            description="Press Enter to add a tag."
            label="Tags"
            name="tags"
          >
            <TagInput
              defaultValue={["retail", "priority"]}
              placeholder="Add a tag"
              suggestions={["retail", "priority", "b2b", "nonprofit"]}
            />
          </FormField>
          <FormField label="Internal notes" name="notes">
            <Textarea placeholder="Only the studio sees these." />
          </FormField>
        </PageSection>

        <PageSection title="Contract">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Monthly retainer" name="retainer">
              <NumberInput
                defaultValue={2400}
                format={{ style: "currency", currency: "EUR" }}
                min={0}
                step={100}
              />
            </FormField>
            <FormField
              description="Up to 80 hours."
              label="Hours included"
              name="hours"
            >
              <NumberInput defaultValue={20} max={80} min={0} required />
            </FormField>
            <FormField label="Start date" name="start">
              <DatePicker defaultValue="2026-01-05" required />
            </FormField>
            <FormField label="Reporting period" name="period">
              <DatePicker
                defaultValue={["2026-11-01", "2026-11-30"]}
                mode="range"
              />
            </FormField>
          </div>
          <Field>
            <FieldLabel>Billing cycle</FieldLabel>
            <RadioGroup defaultValue="monthly" name="cycle">
              <RadioField
                description="Invoice on the first of every month."
                label="Monthly"
                value="monthly"
              />
              <RadioField
                description="Two months free, paid up front."
                label="Yearly"
                value="yearly"
              />
              <RadioField
                description="Only for clients with a signed framework deal."
                disabled
                label="Per project"
                value="project"
              />
            </RadioGroup>
          </Field>
        </PageSection>

        <PageSection title="Admin features">
          <Field>
            <FieldLabel>Modules</FieldLabel>
            <CheckboxGroup defaultValue={["blog"]} name="modules">
              <CheckboxField label="Blog" value="blog" />
              <CheckboxField
                description="Products, orders and stock."
                label="Shop"
                value="shop"
              />
              <CheckboxField
                description="Needs the Enterprise plan."
                disabled
                label="Events"
                value="events"
              />
            </CheckboxGroup>
          </Field>
          <div className="flex flex-col gap-4">
            <SwitchField
              defaultChecked
              description="A summary of site traffic, every Monday."
              label="Weekly report"
              name="weeklyReport"
            />
            <SwitchField label="Invoice emails" name="invoiceEmails" />
            <SwitchField
              defaultChecked
              description="Set by the client's IT team."
              disabled
              label="Single sign-on"
              name="sso"
            />
          </div>
        </PageSection>

        <PageSection title="Brand">
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <FileInput accept="image/*" maxSize={2_000_000} name="logo">
              <FileInputDropzone title="Drop the logo here">
                SVG or PNG, up to 2 MB.
              </FileInputDropzone>
              <FileInputList aria-label="Logo" />
            </FileInput>
          </Field>
          <Field>
            <FieldLabel>Brand assets</FieldLabel>
            <FileInput multiple name="assets">
              <FileInputDropzone>
                Fonts, guidelines and photos.
              </FileInputDropzone>
              <FileInputList aria-label="Brand assets" />
            </FileInput>
            <FieldDescription>Shared with the whole team.</FieldDescription>
          </Field>
        </PageSection>

        <PageSection title="Locked">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField disabled label="Region" name="region">
              <Select defaultValue="eu">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField disabled label="Plan seats" name="seats">
              <NumberInput defaultValue={5} />
            </FormField>
            <FormField disabled label="Created" name="created">
              <DatePicker defaultValue="2024-03-12" />
            </FormField>
            <FormField disabled label="Owner" name="owner">
              <Combobox defaultValue="casper" items={team}>
                <ComboboxInput />
              </Combobox>
            </FormField>
          </div>
        </PageSection>

        <CheckboxField
          error="Confirm before saving."
          label="I checked these changes with the client"
          name="confirmed"
          required
        />

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button type="submit">Save client</Button>
            <Button type="reset" variant="outline">
              Reset
            </Button>
          </div>
          {submitted ? (
            <div className="break-all">
              <Banner description={submitted} title="Submitted" />
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export { FormsPage };
