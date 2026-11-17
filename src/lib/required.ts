import type { z } from "zod";

/**
 * A field that is empty (`null`) while editing and required on submit: the
 * form holds `T | null`, the parsed value is `T`. Empty number, date and
 * select fields in useAdminForm are `null`.
 */
function required<T extends z.ZodType>(schema: T, message: string) {
  return schema.nullable().transform((value, ctx): z.output<T> => {
    if (value === null) {
      ctx.addIssue({ code: "custom", message });
      // Zod discards the value once an issue is added.
      return undefined as never;
    }
    return value;
  });
}

export { required };
