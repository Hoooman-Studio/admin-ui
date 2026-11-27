/**
 * What a form submit returns. `ok: false` keeps the form as typed: `message`
 * shows above the submit button and `fieldErrors` under their fields. Without
 * a `message`, an error for a field the form doesn't render shows above the
 * submit button instead.
 * `ok: true` shows `message` as a toast and closes a FormDialog. Its
 * `warning`, for a side effect that failed, shows as a toast that stays until
 * dismissed.
 */
type FormResult =
  | { ok: true; message?: string; warning?: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> };

const failedMessage = "Something went wrong. Try again.";

/** A plain object with a boolean `ok`, so a fetch Response isn't one. */
function isFormResult(value: unknown): value is FormResult {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype &&
    "ok" in value &&
    typeof value.ok === "boolean"
  );
}

export type { FormResult };
export { failedMessage, isFormResult };
