/**
 * What a form submit returns. `ok: false` keeps the form as typed: `message`
 * shows above the submit button and `fieldErrors` under their fields. Without
 * a `message`, an error for a field the form doesn't render shows above the
 * submit button instead.
 * `ok: true` shows `message` as a toast and closes a FormDialog.
 */
type FormResult =
  | {
      ok: true;
      message?: string;
    }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Record<string, string>;
    };
/** The rows on one page, for lists paged on the client. */
declare function paginate<Row>(
  rows: readonly Row[],
  page: number,
  pageSize: number
): Row[];
type SortDirection = "asc" | "desc";
/** Which column a list is sorted by. `key` is the column's key. */
interface SortState {
  direction: SortDirection;
  key: string;
}
/**
 * Sorts rows on the client by the field named in `sort.key`: text in natural
 * order ("Unit 2" before "Unit 10"), numbers, dates and booleans by value.
 * Empty values (null, undefined) go last in both directions; ties keep their order.
 */
declare function sortRows<Row extends object>(
  rows: readonly Row[],
  sort: SortState | null | undefined
): readonly Row[];

export {
  type FormResult,
  paginate,
  type SortDirection,
  type SortState,
  sortRows,
};
