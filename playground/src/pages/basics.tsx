import { SearchIcon } from "lucide-react";
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
                onClick={() => toast.success("Client deleted")}
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
