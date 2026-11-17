/** A Standard Schema issue: an object with a string `message`. */
function isIssue(error: object): error is { message: string } {
  return "message" in error && typeof error.message === "string";
}

/** An error from a validator or the server as text. Standard Schema validators report issues, not strings. */
function errorText(error: unknown): string | null {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && isIssue(error)) {
    return error.message;
  }
  return null;
}

/**
 * The form-wide message in a form-level Standard Schema result: a map of paths
 * to issues. Issues without a path (like a `refine` across fields) and issues
 * for fields the form doesn't render (like `tags[0]`) would otherwise show
 * nowhere, so they belong to the form.
 */
function formErrorText(
  error: unknown,
  isRendered: (path: string) => boolean
): string | null {
  if (!error || typeof error !== "object" || isIssue(error)) {
    return errorText(error);
  }
  for (const [path, issues] of Object.entries(error)) {
    if (Array.isArray(issues) && (path === "" || !isRendered(path))) {
      const text = errorText(issues[0]);
      if (text) {
        return text;
      }
    }
  }
  return null;
}

/** A refused submit's error for a field the form doesn't render, which would otherwise show nowhere. */
function hiddenFieldError(
  fieldErrors: Record<string, string>,
  isRendered: (name: string) => boolean
): string | undefined {
  return Object.entries(fieldErrors).find(
    ([name, text]) => text && !isRendered(name)
  )?.[1];
}

export { errorText, formErrorText, hiddenFieldError };
