import { createAlertDialogController } from "@ui-sdk/react/alert-dialog";
import { toast } from "@ui-sdk/react/toast";
import type { FormResult } from "../lib/form-result";

interface Refusal {
  /** Without one, the generic failure message. */
  message?: string;
  /** The refused action, like the button's name. */
  title: string;
}

/** Opens the RefusalDialog that AdminProvider mounts. */
const refusals = createAlertDialogController<Refusal>();

/** Shows a done FormResult: `message` as a success toast, `warning` as a warning toast that stays until dismissed. */
function toastDone({ message, warning }: Extract<FormResult, { ok: true }>) {
  // Newest shows on top: the warning goes first, so `message` reads above it.
  if (warning) {
    toast.warning(warning, {
      duration: Number.POSITIVE_INFINITY,
      // The Toaster names a cancel button without a label.
      cancel: { label: undefined },
    });
  }
  if (message) {
    toast.success(message);
  }
}

/** Shows the result of the action named `title`: a refusal in an alert dialog, a done result as toasts. */
function showResult(title: string, result: FormResult) {
  if (result.ok) {
    toastDone(result);
    return;
  }
  refusals.open({
    payload: { title, message: result.message },
  });
}

export type { Refusal };
export { refusals, showResult, toastDone };
