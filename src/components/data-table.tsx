import { CheckboxGroup } from "@ui-sdk/react/checkbox";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EllipsisIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import type { SortState } from "../lib/sort-rows";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { EmptyState } from "./empty-state";
import { aboveRowLink, RowLink, type RowLinkElement } from "./list-row";
import { Loader } from "./loader";
import { Menu, MenuContent, MenuTrigger } from "./menu";

/** Values a column can show without its own `cell`. */
type Shown = string | number | null | undefined;

type ShownKey<Row> = {
  [K in keyof Row & string]: Row[K] extends Shown ? K : never;
}[keyof Row & string];

const hideBelowClass = {
  sm: "hidden @xl/data-table:table-cell",
  md: "hidden @3xl/data-table:table-cell",
  lg: "hidden @5xl/data-table:table-cell",
};

const alignClass = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

interface ColumnOptions {
  align?: keyof typeof alignClass;
  header: React.ReactNode;
  /** Hides the column while the table is narrower than sm (576px), md (768px) or lg (1024px). */
  hideBelow?: keyof typeof hideBelowClass;
  /** Shows a sort button in the header. Sorting itself is yours: `sort` and `onSortChange`, and `sortRows` for client data. */
  sortable?: boolean;
  /** A CSS width, like `"8rem"`. The first column takes the space that's left. */
  width?: string;
}

/**
 * A column. `key` names a field of the row, shown as is, or with its own `cell`
 * render; any other key needs a `cell`. The key is also what `sort.key` holds.
 */
type DataTableColumn<Row> =
  | (ColumnOptions & {
      key: ShownKey<Row>;
      cell?: (row: Row) => React.ReactNode;
    })
  | (ColumnOptions & { key: string; cell: (row: Row) => React.ReactNode });

type SelectionProps =
  | {
      /** The ids of the selected rows, from `getRowId`. Ids on other pages stay selected. */
      selected: readonly string[];
      onSelectedChange: (ids: string[]) => void;
      /** Buttons for the bar that shows while rows are selected, like "Archive". */
      bulkActions?: React.ReactNode;
    }
  | {
      selected?: undefined;
      onSelectedChange?: undefined;
      bulkActions?: undefined;
    };

type DataTableProps<Row> = SelectionProps & {
  /** Names the table for screen readers, like "Listings". */
  "aria-label": string;
  className?: string;
  /** The first column names the row: it holds the row's link and labels its checkbox and menu. */
  columns: readonly DataTableColumn<NoInfer<Row>>[];
  /** Shown when there are no rows. Usually an EmptyState. */
  empty?: React.ReactNode;
  /** Shown instead of the rows when they couldn't load, like the error's message. */
  error?: React.ReactNode;
  getRowId: (row: Row) => string;
  onSortChange?: (sort: SortState | null) => void;
  /** MenuItems for the row's "…" menu. Return null for no menu. */
  rowActions?: (row: Row) => React.ReactNode;
  /** Makes the whole row open a link: `(row) => <a href={…} />` or your router's `<Link />`. */
  rowLink?: (row: Row) => RowLinkElement;
  /** The rows to show; `undefined` while they load. */
  rows: readonly Row[] | undefined;
  sort?: SortState | null;
  /** Where the header sticks, like `"4.75rem"` under a sticky PageHeader. */
  stickyTop?: string;
};

const edgeStart = "ps-4 @xl/data-table:ps-6";
const edgeEnd = "pe-4 @xl/data-table:pe-6";

function nextSort(sort: SortState | null | undefined, key: string) {
  if (sort?.key !== key) {
    return { key, direction: "asc" } as const;
  }
  return sort.direction === "asc"
    ? ({ key, direction: "desc" } as const)
    : null;
}

function ariaSort(sort: SortState | null | undefined, key: string) {
  if (sort?.key !== key) {
    return;
  }
  return sort.direction === "asc" ? "ascending" : "descending";
}

function SortButton({
  columnKey,
  align,
  sort,
  onSortChange,
  children,
}: {
  columnKey: string;
  align: ColumnOptions["align"];
  sort: SortState | null | undefined;
  onSortChange: (sort: SortState | null) => void;
  children: React.ReactNode;
}) {
  const direction = sort?.key === columnKey ? sort.direction : undefined;
  const changeSort = React.useCallback(
    () => onSortChange(nextSort(sort, columnKey)),
    [onSortChange, sort, columnKey]
  );
  return (
    <button
      className={cn(
        "group/sort focus-visible:outline-accent -mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 transition-colors duration-100 outline-none hover:text-gray-950 focus-visible:outline-2 [&_svg]:size-3.5 [&_svg]:shrink-0",
        direction && "text-gray-950",
        align === "end" && "flex-row-reverse"
      )}
      onClick={changeSort}
      type="button"
    >
      {children}
      <SortIcon direction={direction} />
    </button>
  );
}

function SortIcon({
  direction,
}: {
  direction: SortState["direction"] | undefined;
}) {
  if (direction === "asc") {
    return <ArrowUpIcon aria-hidden="true" />;
  }
  if (direction === "desc") {
    return <ArrowDownIcon aria-hidden="true" />;
  }
  return (
    <ArrowUpDownIcon
      aria-hidden="true"
      className="opacity-0 transition-opacity group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"
    />
  );
}

/**
 * A table of rows from your own data hook, styled like the dashboard's lists.
 * Sorting, selection and paging are controlled, so the same table works for client and server data.
 */
function DataTable<Row>({
  "aria-label": label,
  rows,
  columns,
  getRowId,
  sort,
  onSortChange,
  selected,
  onSelectedChange,
  bulkActions,
  rowLink,
  rowActions,
  empty,
  error,
  stickyTop = "0px",
  className,
}: DataTableProps<Row>) {
  const baseId = React.useId();
  const selectable = selected !== undefined;
  const pageIds = rows?.map(getRowId) ?? [];
  const selectedSet = new Set(selected);
  const columnCount =
    columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  /** Keeps the rows selected on other pages when the checkboxes on this one change. */
  const selectOnPage = React.useCallback(
    (onPage: string[]) =>
      onSelectedChange?.([
        ...(selected ?? []).filter((id) => !pageIds.includes(id)),
        ...onPage,
      ]),
    [onSelectedChange, selected, pageIds]
  );
  const thClass =
    "sticky z-20 h-12 border-b border-alpha/10 bg-gray-50 px-3 text-sm font-medium whitespace-nowrap text-gray-500";

  let body: React.ReactNode;
  if (error) {
    body = (
      <StateRow columnCount={columnCount}>
        <EmptyState description={error} title="This list couldn't load" />
      </StateRow>
    );
  } else if (rows === undefined) {
    body = (
      <StateRow columnCount={columnCount}>
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      </StateRow>
    );
  } else if (rows.length === 0) {
    body = (
      <StateRow columnCount={columnCount}>
        {empty ?? <EmptyState title="Nothing here yet" />}
      </StateRow>
    );
  } else {
    body = rows.map((row, index) => {
      const id = getRowId(row);
      const nameId = `${baseId}-name-${index}`;
      const actions = rowActions?.(row);
      return (
        <tr
          className="group/row hover:bg-alpha/2 data-selected:bg-alpha/4 relative transition-colors duration-100"
          data-selected={selectedSet.has(id) ? "" : undefined}
          key={id}
        >
          {selectable ? (
            <td
              className={cn(
                "border-alpha/5 relative z-10 w-px border-b pe-1",
                edgeStart
              )}
            >
              <Checkbox
                aria-labelledby={`${baseId}-select ${nameId}`}
                className="flex"
                value={id}
              />
            </td>
          ) : null}
          {columns.map((column, columnIndex) => {
            const primary = columnIndex === 0;
            const content = column.cell
              ? column.cell(row)
              : (row[column.key as ShownKey<Row>] as Shown);
            return (
              <td
                className={cn(
                  "border-alpha/5 h-19 border-b px-3 text-sm font-medium whitespace-nowrap text-gray-600",
                  !primary && "tabular",
                  alignClass[column.align ?? "start"],
                  column.hideBelow && hideBelowClass[column.hideBelow],
                  primary && !selectable && edgeStart,
                  primary &&
                    !column.width &&
                    "w-full max-w-0 text-base font-semibold text-gray-950",
                  columnIndex === columns.length - 1 && !rowActions && edgeEnd
                )}
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {primary ? (
                  <div className="truncate" id={nameId}>
                    <RowLink link={rowLink?.(row)}>{content}</RowLink>
                  </div>
                ) : (
                  content
                )}
              </td>
            );
          })}
          {rowActions ? (
            <td
              className={cn(
                "border-alpha/5 relative z-10 w-px border-b ps-1 text-end",
                edgeEnd
              )}
            >
              {actions ? (
                <Menu>
                  <MenuTrigger
                    render={
                      <Button
                        aria-label="Actions"
                        aria-labelledby={`${baseId}-actions ${nameId}`}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <EllipsisIcon />
                      </Button>
                    }
                  />
                  <MenuContent align="end">{actions}</MenuContent>
                </Menu>
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    });
  }

  const table = (
    <table
      aria-label={label}
      className="w-full border-separate border-spacing-0"
    >
      <thead>
        <tr>
          {selectable ? (
            <th
              className={cn(thClass, "w-px pe-1", edgeStart)}
              style={{ top: stickyTop }}
            >
              <Checkbox
                aria-label="Select all rows"
                className="flex"
                disabled={pageIds.length === 0}
                parent
              />
            </th>
          ) : null}
          {columns.map((column, columnIndex) => (
            <th
              aria-sort={
                column.sortable ? ariaSort(sort, column.key) : undefined
              }
              className={cn(
                thClass,
                alignClass[column.align ?? "start"],
                column.hideBelow && hideBelowClass[column.hideBelow],
                columnIndex === 0 && !selectable && edgeStart,
                columnIndex === 0 && !column.width && "w-full",
                columnIndex === columns.length - 1 && !rowActions && edgeEnd
              )}
              key={column.key}
              scope="col"
              style={{ top: stickyTop, width: column.width }}
            >
              {column.sortable && onSortChange ? (
                <SortButton
                  align={column.align}
                  columnKey={column.key}
                  onSortChange={onSortChange}
                  sort={sort}
                >
                  {column.header}
                </SortButton>
              ) : (
                column.header
              )}
            </th>
          ))}
          {rowActions ? (
            <th
              className={cn(thClass, "w-px", edgeEnd)}
              style={{ top: stickyTop }}
            >
              <span className="sr-only">Actions</span>
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody className={aboveRowLink}>{body}</tbody>
    </table>
  );

  return (
    <div className={cn("@container/data-table isolate w-full", className)}>
      <span hidden id={`${baseId}-select`}>
        Select
      </span>
      <span hidden id={`${baseId}-actions`}>
        Actions for
      </span>
      {selectable ? (
        <CheckboxGroup
          allValues={pageIds}
          aria-label={label}
          onValueChange={selectOnPage}
          value={pageIds.filter((id) => selectedSet.has(id))}
        >
          {table}
          {selected.length > 0 && pageIds.length > 0 && !error ? (
            <BulkBar
              count={selected.length}
              onSelectedChange={onSelectedChange}
            >
              {bulkActions}
            </BulkBar>
          ) : null}
        </CheckboxGroup>
      ) : (
        table
      )}
    </div>
  );
}

function StateRow({
  columnCount,
  children,
}: {
  columnCount: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td className="border-alpha/5 border-b" colSpan={columnCount}>
        {children}
      </td>
    </tr>
  );
}

function BulkBar({
  count,
  onSelectedChange,
  children,
}: {
  count: number;
  onSelectedChange: (ids: string[]) => void;
  children: React.ReactNode;
}) {
  const clear = React.useCallback(
    () => onSelectedChange([]),
    [onSelectedChange]
  );
  return (
    <div className="pointer-events-none sticky bottom-4 z-30 flex justify-center px-4 py-3">
      <div className="border-alpha/10 shadow-floating pointer-events-auto flex items-center gap-2 rounded-2xl border bg-gray-50 p-2 ps-4">
        <span className="tabular me-2 text-sm font-medium whitespace-nowrap text-gray-950">
          {count} selected
        </span>
        {children}
        <Button
          aria-label="Clear selection"
          onClick={clear}
          size="icon"
          variant="ghost"
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}

export type { DataTableColumn, DataTableProps };
export { DataTable };
