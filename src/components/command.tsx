import {
  CommandEmpty as CommandEmptyPart,
  CommandGroupLabel as CommandGroupLabelPart,
  CommandGroup as CommandGroupPart,
  CommandInput as CommandInputPart,
  CommandItemIcon as CommandItemIconPart,
  CommandItem as CommandItemPart,
  CommandList as CommandListPart,
  Command as CommandPart,
  CommandSeparator as CommandSeparatorPart,
  CommandShortcut as CommandShortcutPart,
} from "@ui-sdk/react/command";
import { DialogShortcut } from "@ui-sdk/react/dialog";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/cn";
import type { WithClass } from "../lib/types";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";

const keysClass =
  "ms-auto flex shrink-0 gap-0.5 font-sans text-gray-500 text-xs tracking-widest";

/** A search field over a list of commands. On its own, or in a CommandPalette. */
function Command({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandPart>>) {
  return (
    <CommandPart
      className={cn("flex min-h-0 flex-col", className)}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandInputPart>>) {
  return (
    <div className="border-alpha/10 flex h-14 shrink-0 items-center gap-3 border-b px-4 text-gray-500">
      <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
      <CommandInputPart
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-base text-gray-950 outline-none placeholder:text-gray-500",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandListPart>>) {
  return (
    <CommandListPart
      className={cn(
        "max-h-[min(24rem,60dvh)] scroll-py-2 overflow-y-auto p-2",
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandEmptyPart>>) {
  return (
    <CommandEmptyPart
      className={cn(
        "px-4 py-10 text-center text-sm text-gray-500 not-data-empty:hidden",
        className
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandGroupPart>>) {
  return (
    <CommandGroupPart
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function CommandGroupLabel({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandGroupLabelPart>>) {
  return (
    <CommandGroupLabelPart
      className={cn(
        "px-2 pt-2 pb-1 text-xs font-medium text-gray-500",
        className
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandItemPart>>) {
  return (
    <CommandItemPart
      className={cn(
        "data-highlighted:bg-alpha/5 [&_mark]:text-accent flex min-h-10 cursor-default items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-gray-950 outline-none select-none data-disabled:opacity-40 data-pending:cursor-progress [&_mark]:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function CommandItemIcon({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandItemIconPart>>) {
  return (
    <CommandItemIconPart
      className={cn(
        "flex size-4 shrink-0 items-center justify-center text-gray-600 [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

/** Shows the command's `shortcut`, like ⌘P. */
function CommandShortcut({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandShortcutPart>>) {
  return (
    <CommandShortcutPart className={cn(keysClass, className)} {...props} />
  );
}

function CommandSeparator({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandSeparatorPart>>) {
  return (
    <CommandSeparatorPart
      className={cn("bg-alpha/10 -mx-2 my-2 h-px", className)}
      {...props}
    />
  );
}

interface CommandPaletteProps {
  /** CommandGroups and CommandItems. Each item does its work in `onSelect`, like navigating; the palette closes after. */
  children: React.ReactNode;
  emptyText?: React.ReactNode;
  placeholder?: string;
  /** The palette's name for screen readers. */
  title?: string;
  /** What opens it besides ⌘K / Ctrl+K. Defaults to a "Search…" button showing the shortcut. */
  trigger?: React.ReactElement<Record<string, unknown>>;
}

/** A command palette in a dialog, opened with ⌘K / Ctrl+K from anywhere on the page or with its trigger. */
function CommandPalette({
  children,
  title = "Command palette",
  placeholder = "Search or jump to…",
  emptyText = "Nothing found.",
  trigger,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button
              className="w-9 justify-start px-0 text-gray-500 sm:w-56 sm:px-3 [&_svg]:mx-auto sm:[&_svg]:mx-0"
              variant="outline"
            />
          )
        }
        shortcut="mod+k"
      >
        {trigger ? null : (
          <>
            <SearchIcon />
            <span className="sr-only sm:not-sr-only sm:font-normal">
              Search…
            </span>
            <DialogShortcut className={cn(keysClass, "hidden sm:flex")} />
          </>
        )}
      </DialogTrigger>
      <DialogContent className="top-[12dvh] bottom-auto" size="md">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <Command loop onAction={close}>
          <CommandInput aria-label={title} placeholder={placeholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandList>{children}</CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export type { CommandPaletteProps };
export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandPalette,
  CommandSeparator,
  CommandShortcut,
};
