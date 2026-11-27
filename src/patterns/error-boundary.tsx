import * as React from "react";
import { useFailureText } from "../components/admin-provider";
import { Button } from "../components/button";
import { EmptyState } from "../components/empty-state";

/**
 * Routers throw these for their own boundaries above: Next.js redirect() and
 * notFound() as errors with a NEXT_ digest, TanStack Router as plain objects.
 */
const isRouterSignal = (error: unknown) =>
  !(error instanceof Error) ||
  ("digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_"));

// biome-ignore lint/style/useReactFunctionComponents: React has no hook to catch render errors.
class Boundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean; error?: unknown }
> {
  static getDerivedStateFromError(error: unknown) {
    if (isRouterSignal(error)) {
      throw error;
    }
    return { failed: true, error };
  }

  state: { failed: boolean; error?: unknown } = { failed: false };

  reset = () => this.setState({ failed: false, error: undefined });

  render() {
    return this.state.failed ? (
      <Fallback error={this.state.error} onReset={this.reset} />
    ) : (
      this.props.children
    );
  }
}

function Fallback({ error, onReset }: { error: unknown; onReset: () => void }) {
  const failureText = useFailureText();
  React.useEffect(() => {
    window.navigation?.addEventListener("currententrychange", onReset);
    return () =>
      window.navigation?.removeEventListener("currententrychange", onReset);
  }, [onReset]);

  return (
    <EmptyState
      action={
        <Button onClick={onReset} variant="outline">
          Try again
        </Button>
      }
      title={failureText(error, "Something went wrong")}
    />
  );
}

/**
 * Shows "Something went wrong" with "Try again" when its children throw while
 * rendering (the session message for a session error, see AdminProvider),
 * so the rest of the admin keeps working. It tries again by itself
 * when the URL changes. AdminShell wraps the page in one.
 */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <Boundary>{children}</Boundary>;
}

export { ErrorBoundary };
