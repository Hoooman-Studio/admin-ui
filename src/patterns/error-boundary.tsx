import * as React from "react";
import { Button } from "../components/button";
import { EmptyState } from "../components/empty-state";

/** Next.js redirect() and notFound() throw these for its own boundaries above. */
const isNextSignal = (error: unknown) =>
  error instanceof Error &&
  "digest" in error &&
  typeof error.digest === "string" &&
  error.digest.startsWith("NEXT_");

interface BoundaryState {
  error: unknown;
  failed: boolean;
}

// biome-ignore lint/style/useReactFunctionComponents: React has no hook to catch render errors.
class Boundary extends React.Component<
  { children: React.ReactNode },
  BoundaryState
> {
  static getDerivedStateFromError(error: unknown): BoundaryState {
    if (isNextSignal(error)) {
      throw error;
    }
    return { error, failed: true };
  }

  state: BoundaryState = { error: null, failed: false };

  reset = () => this.setState({ error: null, failed: false });

  render() {
    return this.state.failed ? (
      <Fallback error={this.state.error} onReset={this.reset} />
    ) : (
      this.props.children
    );
  }
}

function Fallback({ error, onReset }: { error: unknown; onReset: () => void }) {
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
      description={error instanceof Error ? error.message : undefined}
      title="Something went wrong"
    />
  );
}

/**
 * Shows "Something went wrong" with "Try again" when its children throw while
 * rendering, so the rest of the admin keeps working. It tries again by itself
 * when the URL changes. AdminShell wraps the page in one.
 */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <Boundary>{children}</Boundary>;
}

export { ErrorBoundary };
