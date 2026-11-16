import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Textarea,
} from "../../../src";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function BasicsPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-10">
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
      </div>
      <form className="flex flex-col gap-4">
        <FormField description="Shown to the client." label="Name" name="name">
          <Input placeholder="Porta Europa" required />
        </FormField>
        <FormField error="This slug is taken." label="Slug" name="slug">
          <Input defaultValue="porta" />
        </FormField>
        <FormField label="Notes" name="notes">
          <Textarea />
        </FormField>
        <Button className="self-start" type="submit">
          Save
        </Button>
      </form>
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
            <Button>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { BasicsPage };
