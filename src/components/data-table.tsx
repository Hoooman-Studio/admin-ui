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
  sm: "au:hidden au:@xl/data-table:table-cell",
  md: "au:hidden au:@3xl/data-table:table-cell",
  lg: "au:hidden au:@5xl/data-table:table-cell",
};

const alignClass = {
  start: "au:text-start",
  center: "au:text-center",
  end: "au:text-end",
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

const edgeStart = "au:ps-4 au:@xl/data-table:ps-6";
const edgeEnd = "au:pe-4 au:@xl/data-table:pe-6";

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
        "au:group/sort au:focus-visible:outline-accent au:-mx-1.5 au:inline-flex au:h-7 au:items-center au:gap-1 au:rounded-md au:px-1.5 au:transition-colors au:duration-100 au:outline-none au:hover:text-gray-950 au:focus-visible:outline-2 au:[&_svg]:size-3.5 au:[&_svg]:shrink-0",
        direction && "au:text-gray-950",
        align === "end" && "au:flex-row-reverse"
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
      className="au:opacity-0 au:transition-opacity au:group-hover/sort:opacity-100 au:group-focus-visible/sort:opacity-100"
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
  const pageIds = React.useMemo(
    () => rows?.map(getRowId) ?? [],
    [rows, getRowId]
  );
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
    "au:sticky au:z-20 au:h-12 au:border-b au:border-alpha/10 au:bg-gray-50 au:px-3 au:text-sm au:font-medium au:whitespace-nowrap au:text-gray-500";

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
        <div className="au:flex au:justify-center au:py-20">
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
          className="au:group/row au:hover:bg-alpha/2 au:data-selected:bg-alpha/4 au:relative au:transition-colors au:duration-100"
          data-selected={selectedSet.has(id) ? "" : undefined}
          key={id}
        >
          {selectable ? (
            <td
              className={cn(
                "au:border-alpha/5 au:relative au:z-10 au:w-px au:border-b au:pe-1",
                edgeStart
              )}
            >
              <Checkbox
                aria-labelledby={`${baseId}-select ${nameId}`}
                className="au:flex"
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
                  "au:border-alpha/5 au:h-19 au:border-b au:px-3 au:text-sm au:font-medium au:whitespace-nowrap au:text-gray-600",
                  !primary && "au:tabular",
                  alignClass[column.align ?? "start"],
                  column.hideBelow && hideBelowClass[column.hideBelow],
                  primary && !selectable && edgeStart,
                  primary &&
                    !column.width &&
                    "au:w-full au:max-w-0 au:text-base au:font-semibold au:text-gray-950",
                  columnIndex === columns.length - 1 && !rowActions && edgeEnd
                )}
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {primary ? (
                  <div className="au:truncate" id={nameId}>
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
                "au:border-alpha/5 au:relative au:z-10 au:w-px au:border-b au:ps-1 au:text-end",
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
      className="au:w-full au:border-separate au:border-spacing-0"
    >
      <thead>
        <tr>
          {selectable ? (
            <th
              className={cn(thClass, "au:w-px au:pe-1", edgeStart)}
              style={{ top: stickyTop }}
            >
              <Checkbox
                aria-label="Select all rows"
                className="au:flex"
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
                columnIndex === 0 && !column.width && "au:w-full",
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
              className={cn(thClass, "au:w-px", edgeEnd)}
              style={{ top: stickyTop }}
            >
              <span className="au:sr-only">Actions</span>
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody className={aboveRowLink}>{body}</tbody>
    </table>
  );

  return (
    <div
      className={cn("au:@container/data-table au:isolate au:w-full", className)}
    >
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
      <td className="au:border-alpha/5 au:border-b" colSpan={columnCount}>
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
    <div className="au:pointer-events-none au:sticky au:bottom-4 au:z-30 au:flex au:justify-center au:px-4 au:py-3">
      <div className="au:border-alpha/10 au:shadow-floating au:pointer-events-auto au:flex au:items-center au:gap-2 au:rounded-2xl au:border au:bg-gray-50 au:p-2 au:ps-4">
        <span className="au:tabular au:me-2 au:text-sm au:font-medium au:whitespace-nowrap au:text-gray-950">
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
