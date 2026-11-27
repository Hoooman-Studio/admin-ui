import { PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
  Card,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ErrorBoundary,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FormField,
  Input,
  InputClear,
  InputGroup,
  Menu,
  MenuContent,
  MenuTrigger,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
  ThemeMenuItems,
  toast,
  useTheme,
} from "../../../src";
import { SessionExpiredError } from "../session";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Buttons of each shape, to press at once and compare pending with idle. */
function PendingButtons() {
  const row = useRef<HTMLDivElement>(null);
  const release = useRef<() => void>(() => undefined);
  const hold = useRef<Promise<void>>(Promise.resolve());

  const pressAll = () => {
    hold.current = new Promise((resolve) => {
      release.current = resolve;
    });
    for (const button of row.current?.querySelectorAll("button") ?? []) {
      button.click();
    }
  };
  const held = () => hold.current;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button onClick={pressAll} size="sm" variant="outline">
          Press all
        </Button>
        <Button onClick={() => release.current()} size="sm" variant="outline">
          Release
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2" ref={row}>
        <Button onClick={held}>Save</Button>
        <Button onClick={held} variant="outline">
          <PlusIcon />
          New listing
        </Button>
        <Button onClick={held} size="lg" variant="accent">
          Publish changes
        </Button>
        <Button aria-label="Delete" onClick={held} size="icon" variant="danger">
          <TrashIcon />
        </Button>
        <Button aria-label="Add" onClick={held} size="icon-sm" variant="ghost">
          <PlusIcon />
        </Button>
      </div>
    </section>
  );
}

/** A button that makes it throw while rendering, until it remounts. `expired` throws a session error. */
function Breakable({ label, expired }: { label: string; expired?: boolean }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    throw expired
      ? new SessionExpiredError("Unauthenticated")
      : new Error("Listing 42 has no price.");
  }
  return (
    <Button onClick={() => setBroken(true)} size="sm" variant="outline">
      {label}
    </Button>
  );
}

/** The card is caught by its own ErrorBoundary, the page by AdminShell's. */
function Crashes() {
  return (
    <section className="flex flex-wrap items-center gap-3">
      <Breakable label="Break this page" />
      <Card className="flex-1">
        <ErrorBoundary>
          <div className="flex flex-wrap gap-3">
            <Breakable label="Break this card" />
            <Breakable expired label="Expire the session" />
          </div>
        </ErrorBoundary>
      </Card>
    </section>
  );
}

/** The admin's theme choice, outside the account menu. */
function ThemeMenu() {
  const { theme } = useTheme();
  return (
    <Menu>
      <MenuTrigger render={<Button size="sm" variant="outline" />}>
        Theme: {theme}
      </MenuTrigger>
      <MenuContent>
        <ThemeMenuItems />
      </MenuContent>
    </Menu>
  );
}

function BasicsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-10">
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="danger">Danger</Button>
        <Button onClick={() => wait(1500)} variant="outline">
          Pending
        </Button>
        <Button disabled>Disabled</Button>
        <a className={buttonVariants({ variant: "ghost" })} href="#/site">
          A link as a button
        </a>
      </div>
      <PendingButtons />
      <Crashes />
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox aria-label="Select row" />
        <Switch aria-label="Published" defaultChecked />
        <RadioGroup aria-label="Size" className="au:flex-row" defaultValue="s">
          <Radio aria-label="Small" value="s" />
          <Radio aria-label="Large" value="l" />
        </RadioGroup>
        <ThemeMenu />
      </div>
      <FieldGroup render={<form />}>
        <FormField description="Shown to the client." label="Name" name="name">
          <Input placeholder="Porta Europa" required />
        </FormField>
        <FormField error="This slug is taken." label="Slug" name="slug">
          <Input defaultValue="porta" />
        </FormField>
        <FormField label="Notes" name="notes">
          <Textarea />
        </FormField>
        <FormField label="Search" name="search">
          <InputGroup>
            <SearchIcon aria-hidden="true" />
            <Input defaultValue="canal" />
            <InputClear aria-label="Clear search" />
          </InputGroup>
        </FormField>
        <Field name="email">
          <FieldLabel>Plain field</FieldLabel>
          <Input required type="email" />
          <FieldError match="valueMissing">Enter an email address.</FieldError>
        </Field>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </FieldGroup>
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Open dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New client</DialogTitle>
              <DialogDescription>Add a client to the admin.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <FormField label="Name">
                <Input />
              </FormField>
            </DialogBody>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>
                Cancel
              </DialogClose>
              <Button>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="danger-subtle" />}>
            Delete client
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Porta Europa?</AlertDialogTitle>
            <AlertDialogDescription>
              Its listings and files go too. This cannot be undone.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>
                Cancel
              </AlertDialogClose>
              <AlertDialogClose
                action={async () => {
                  await wait(1500);
                  toast.success("Client deleted");
                }}
                render={<Button variant="danger" />}
              >
                Delete
              </AlertDialogClose>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card variant="flush">
        <Command aria-label="Commands">
          <CommandInput
            aria-label="Search commands"
            placeholder="Search commands"
          />
          <CommandList>
            <CommandGroup>
              <CommandItem value="new-client">New client</CommandItem>
              <CommandItem value="new-listing">New listing</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem value="settings">Settings</CommandItem>
            </CommandGroup>
            <CommandEmpty>No commands found.</CommandEmpty>
          </CommandList>
        </Command>
      </Card>
    </div>
  );
}

export { BasicsPage };
