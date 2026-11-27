import * as React from "react";
import { failedMessage, sessionMessage } from "../lib/form-result";
import { ConfirmDialog, RefusalDialog } from "./alert-dialog";
import { useResolvedTheme } from "./theme";
import { Toaster } from "./toast";

interface AdminProviderProps {
  /** The client's brand colour, any CSS colour. */
  accent?: string;
  children: React.ReactNode;
  /** Spacing and layout for the admin's box on a site page, like `mt-8`. */
  className?: string;
  /**
   * Whether a thrown error means the person's session expired, like
   * `(error) => error instanceof ConvexError && error.data === "Unauthenticated"`.
   * Forms, uploads and `confirm()` actions then ask them to sign in again
   * instead of showing a generic error. Applies to every provider it's nested with.
   */
  isSessionError?: (error: unknown) => boolean;
}

type SessionCheck = NonNullable<AdminProviderProps["isSessionError"]>;

/** The outermost provider's session checks, which every provider inside adds to. */
const ProviderContext = React.createContext<SessionCheck[] | null>(null);

/** Throws outside AdminProvider, so a missing provider isn't silent. */
function useAdminProvider(name: string) {
  if (!React.use(ProviderContext)) {
    throw new Error(`${name} must be inside AdminProvider.`);
  }
}

/** What to show for an error thrown at the admin: the session message when an AdminProvider's `isSessionError` matches it, else `fallback`. */
function failureText(
  checks: SessionCheck[] | null,
  error: unknown,
  fallback = failedMessage
) {
  return checks?.some((check) => check(error)) ? sessionMessage : fallback;
}

/** `failureText` for the providers around the caller. */
function useFailureText() {
  const checks = React.use(ProviderContext);
  return React.useCallback(
    (error: unknown, fallback?: string) => failureText(checks, error, fallback),
    [checks]
  );
}

let checkedStyles = false;

/** Warns once when the package's CSS isn't on the page, the most likely setup mistake. */
function useStylesCheck() {
  React.useEffect(() => {
    if (checkedStyles) {
      return;
    }
    checkedStyles = true;
    const loaded = getComputedStyle(document.documentElement)
      .getPropertyValue("--au-gray-50")
      .trim();
    if (!loaded) {
      console.warn(
        '@hooman-studio/admin-ui: its CSS isn\'t loaded, so the admin is unstyled. Import "@hooman-studio/admin-ui/styles.css" in your admin route, or "@hooman-studio/admin-ui/tailwind.css" from your admin CSS on Tailwind v4.'
      );
    }
  }, []);
}

/**
 * Sets up the admin. Put it in the admin's layout route, around every admin
 * page including login. Everything inside gets Hooman Studio's font, reset,
 * theme and accent, and the rest of the page is left alone. It shows what
 * `toast()` and `confirm()` ask for; a provider inside another leaves that to
 * the outer one. It's a block with the admin's background and text colour,
 * so admin pieces stay readable on a site page in either theme.
 */
function AdminProvider({
  accent,
  children,
  className,
  isSessionError,
}: AdminProviderProps) {
  const outer = React.use(ProviderContext);
  const nested = outer !== null;
  const [own] = React.useState<SessionCheck[]>([]);
  const checks = outer ?? own;
  React.useEffect(() => {
    if (!isSessionError) {
      return;
    }
    checks.push(isSessionError);
    return () => {
      checks.splice(checks.indexOf(isSessionError), 1);
    };
  }, [checks, isSessionError]);
  const confirmFailureText = React.useCallback(
    (error: unknown) => failureText(checks, error),
    [checks]
  );
  const theme = useResolvedTheme();
  useStylesCheck();
  return (
    <div
      className={className}
      data-admin-ui=""
      data-au-theme={theme}
      // A provider inside another adds no box, so it keeps the page's layout.
      style={
        {
          display: nested ? "contents" : undefined,
          "--au-accent": accent,
        } as React.CSSProperties
      }
    >
      <ProviderContext value={checks}>
        {children}
        {nested ? null : (
          <>
            <Toaster />
            <ConfirmDialog failureText={confirmFailureText} />
            <RefusalDialog />
          </>
        )}
      </ProviderContext>
    </div>
  );
}

export type { AdminProviderProps };
export { AdminProvider, useAdminProvider, useFailureText };
