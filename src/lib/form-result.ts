/**
 * What a form submit returns. `ok: false` keeps the form as typed: `message`
 * shows above the submit button and `fieldErrors` under their fields. Without
 * a `message`, an error for a field the form doesn't render shows above the
 * submit button instead.
 * `ok: true` shows `message` as a toast and closes a FormDialog.
 */
type FormResult =
  | { ok: true; message?: string }
  | { ok: false; message?: string; fieldErrors?: Record<string, string> };

export type { FormResult };
