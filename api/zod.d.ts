import { z } from "zod";

/**
 * A field that is empty (`null`) while editing and required on submit: the
 * form holds `T | null`, the parsed value is `T`. Empty number, date and
 * select fields in useAdminForm are `null`.
 */
declare function required<T extends z.ZodType>(
  schema: T,
  message: string
): z.ZodPipe<
  z.ZodNullable<T>,
  z.ZodTransform<Awaited<z.output<T>>, z.infer<T> | null>
>;

export { required };
