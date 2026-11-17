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
 * The message for the form as a whole. A form-level Standard Schema reports a
 * map of paths to issues, and a refused submit a map of field names to
 * messages. Errors without a path (like a `refine` across fields), and errors
 * for fields the form doesn't render (like `tags[0]`), would otherwise show
 * nowhere, so they belong to the form.
 */
function formErrorText(
  error: unknown,
  isRendered: (path: string) => boolean
): string | null {
  if (!error || typeof error !== "object" || isIssue(error)) {
    return errorText(error);
  }
  for (const [path, value] of Object.entries(error)) {
    if (path === "" || !isRendered(path)) {
      const text = errorText(Array.isArray(value) ? value[0] : value);
      if (text) {
        return text;
      }
    }
  }
  return null;
}

export { errorText, formErrorText };
