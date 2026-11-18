import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  FormField,
  Input,
  toast,
} from "../../../src";

function signIn(event: React.FormEvent) {
  event.preventDefault();
  window.location.hash = "#/overview";
  toast.success("Signed in.");
}

/** A page with its own layout instead of AdminShell, inside AdminProvider. */
function LoginPage() {
  return (
    <div className="au:flex au:min-h-dvh au:items-center au:justify-center au:bg-gray-50 au:p-6">
      <Card className="au:w-full au:max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Porta Europa admin</CardDescription>
        </CardHeader>
        <FieldGroup render={<form onSubmit={signIn} />}>
          <FormField label="Email" name="email">
            <Input defaultValue="lena@portaeuropa.com" type="email" />
          </FormField>
          <FormField label="Password" name="password">
            <Input defaultValue="password" type="password" />
          </FormField>
          <Button size="lg" type="submit">
            Sign in
          </Button>
        </FieldGroup>
      </Card>
    </div>
  );
}

export { LoginPage };
