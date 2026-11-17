type SortDirection = "asc" | "desc";

/** Which column a list is sorted by. `key` is the column's key. */
interface SortState {
  direction: SortDirection;
  key: string;
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function isEmpty(value: unknown) {
  return value === null || value === undefined;
}

function compare(a: unknown, b: unknown): number {
  if (typeof a === "string" && typeof b === "string") {
    return collator.compare(a, b);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if (
    (typeof a === "number" || typeof a === "bigint") &&
    (typeof b === "number" || typeof b === "bigint")
  ) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  return collator.compare(String(a), String(b));
}

/**
 * Sorts rows on the client by the field named in `sort.key`: text in natural
 * order ("Unit 2" before "Unit 10"), numbers, dates and booleans by value.
 * Empty values (null, undefined) go last in both directions; ties keep their order.
 */
function sortRows<Row extends object>(
  rows: readonly Row[],
  sort: SortState | null | undefined
): readonly Row[] {
  if (!sort) {
    return rows;
  }
  const factor = sort.direction === "desc" ? -1 : 1;
  const fieldOf = (row: Row): unknown =>
    (row as Record<string, unknown>)[sort.key];
  return rows.toSorted((rowA, rowB) => {
    const a = fieldOf(rowA);
    const b = fieldOf(rowB);
    if (isEmpty(a) || isEmpty(b)) {
      return Number(isEmpty(a)) - Number(isEmpty(b));
    }
    return compare(a, b) * factor;
  });
}

export type { SortDirection, SortState };
export { sortRows };
