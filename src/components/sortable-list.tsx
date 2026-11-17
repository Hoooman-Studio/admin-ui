import {
  type ChangeDetails,
  createChange,
  createReorder,
  definePrimitive,
  type ReorderDraft,
  type ReorderReason,
} from "@ui-sdk/core";
import { createParts } from "@ui-sdk/react/primitive";
import { GripVerticalIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import { ListRow, type ListRowProps } from "./list-row";

interface SortableListOptions {
  onValueChange?: (
    value: string[],
    details: ChangeDetails<ReorderReason> & { key: string }
  ) => void;
  value?: string[];
}

const sortableList = definePrimitive({
  name: "sortable-list",
  options: {
    value: "list",
    onValueChange: "callback",
  },
  controlled: ["value"],
  state: (options: SortableListOptions) => ({
    value: options.value ?? [],
    moving: null as ReorderDraft | null,
  }),
  sync: (options) =>
    options.value === undefined ? {} : { value: options.value },
  api: (context) => {
    const change = createChange(context);
    const reorder = createReorder(context, {
      slot: "item",
      key: "value",
      draft: "moving",
      set: (value, details) =>
        change("value", value, {
          ...details,
          key: context.store.get().moving?.key ?? "",
        }),
      label: (key) => context.props<{ label: string }>("item", key)?.label,
    });
    return { reorder };
  },
  slots: (slot) => ({
    list: slot<object, { order: string[] }>({
      state: (state, { api }) => ({ order: api.reorder.order(state) }),
    }),
    item: slot<{ value: string; label: string }>({
      props: { value: "string", label: "string" },
      attrs: (state, { api, key }) => ({
        "data-grabbed": api.reorder.moving(state, key) ? "" : undefined,
        "data-dragging": api.reorder.dragging(state, key) ? "" : undefined,
      }),
      bind: (el, part) => part.api.reorder.bind(el, part),
    }),
    handle: slot<{ value: string }>({
      props: { value: "string" },
      role: "button",
      focus: "native",
      press: { none: "Space and Enter pick the row up on keydown." },
      attrs: (state, { api, id, key }) => ({
        type: "button",
        "aria-pressed": String(api.reorder.moving(state, key)),
        "aria-describedby": `${id}-instructions`,
      }),
      on: {
        keydown: (event, { api, key }) => {
          api.reorder.keydown(event, key);
        },
        pointerdown: (event, { api, key }) =>
          api.reorder.pointerdown(event, key),
      },
    }),
    instructions: slot({
      attrs: (_state, { id }) => ({ id: `${id}-instructions`, hidden: "" }),
    }),
  }),
});

const parts = createParts(sortableList, {
  list: "ul",
  item: "li",
  handle: "button",
  instructions: "span",
});

/** Which row moved, and the rows now on either side, for a "move after" or fractional index mutation. */
interface SortableMove<Row> {
  next: Row | null;
  previous: Row | null;
  /** `drag` for a pointer, `move-key` for the keyboard. */
  reason: ReorderReason;
  row: Row;
}

type SortableListProps<Row> = Omit<React.ComponentProps<"ul">, "children"> & {
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  /**
   * The rows in their new order, to save however you like. The list shows the
   * new order until `rows` changes, or goes back if the returned promise rejects.
   */
  onReorder: (rows: Row[], move: SortableMove<Row>) => unknown;
  /** One SortableListRow per row. */
  children: (row: Row) => React.ReactNode;
};

const RowIdContext = React.createContext("");

/**
 * A short list people reorder by its grips: drag one, or focus it and press
 * Space, the arrows, then Space again. Put it in a `Card variant="flush"`.
 */
function SortableList<Row>({
  rows,
  getRowId,
  onReorder,
  children,
  className,
  ...props
}: SortableListProps<Row>) {
  const byId = React.useMemo(
    () => new Map(rows.map((row) => [getRowId(row), row])),
    [rows, getRowId]
  );
  // The dropped order, shown until `rows` catches up, so rows don't jump back while it saves.
  const [dropped, setDropped] = React.useState<{
    rows: readonly Row[];
    order: string[];
  } | null>(null);
  const value = React.useMemo(
    () => (dropped?.rows === rows ? dropped.order : [...byId.keys()]),
    [dropped, rows, byId]
  );
  const rowOf = (id: string) => byId.get(id);
  const change = React.useCallback<
    NonNullable<SortableListOptions["onValueChange"]>
  >(
    (order, { key, reason }) => {
      const reordered = order.flatMap((id) => byId.get(id) ?? []);
      const row = byId.get(key);
      if (!row) {
        return;
      }
      const index = order.indexOf(key);
      const drop = { rows, order };
      setDropped(drop);
      Promise.resolve(
        onReorder(reordered, {
          row,
          previous: reordered[index - 1] ?? null,
          next: reordered[index + 1] ?? null,
          reason,
        })
      ).catch(() => setDropped((now) => (now === drop ? null : now)));
    },
    [rows, byId, onReorder]
  );

  return (
    <parts.Root onValueChange={change} value={value}>
      <parts.List className={cn("au:flex au:flex-col", className)} {...props}>
        {({ order }) =>
          order.map((id) => {
            const row = rowOf(id);
            return row ? (
              <RowIdContext.Provider key={id} value={id}>
                {children(row)}
              </RowIdContext.Provider>
            ) : null;
          })
        }
      </parts.List>
      <parts.Instructions>
        Press Space or Enter to pick it up, the arrow keys to move it, then
        Space or Enter to drop it. Escape puts it back.
      </parts.Instructions>
    </parts.Root>
  );
}

type SortableListRowProps = Omit<ListRowProps, "title"> & {
  /** Also names the grip for screen readers, so it's plain text. */
  title: string;
};

/** A ListRow with a grip at the start. Use inside SortableList. */
function SortableListRow({
  title,
  leading,
  className,
  ...props
}: SortableListRowProps) {
  const id = React.use(RowIdContext);
  return (
    <parts.Item
      label={title}
      render={
        <ListRow
          className={cn(
            "au:data-grabbed:not-data-dragging:bg-alpha/5 au:data-dragging:shadow-card au:data-dragging:ring-alpha/10 au:data-dragging:z-20 au:data-dragging:rounded-xl au:data-dragging:ring-1 au:data-dragging:bg-gray-50 au:data-dragging:[transform:translate(var(--drag-x,0),var(--drag-y,0))] au:data-dragging:select-none",
            className
          )}
          leading={
            <div className="au:flex au:items-center au:gap-3 au:sm:gap-4">
              <parts.Handle
                aria-label={`Reorder ${title}`}
                className="au:focus-visible:outline-accent au:aria-pressed:text-gray-950 au:-ms-1.5 au:flex au:size-6 au:cursor-grab au:touch-none au:items-center au:justify-center au:rounded au:text-gray-500 au:transition-colors au:hover:text-gray-950 au:focus-visible:outline-2 au:in-data-dragging:cursor-grabbing"
                value={id}
              >
                <GripVerticalIcon aria-hidden="true" className="au:size-4" />
              </parts.Handle>
              {leading}
            </div>
          }
          title={title}
          {...props}
        />
      }
      value={id}
    />
  );
}

export type { SortableListProps, SortableListRowProps, SortableMove };
export { SortableList, SortableListRow };
