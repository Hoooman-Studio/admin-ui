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
import { useMessages } from "./messages";

const keysClass =
  "au:ms-auto au:flex au:shrink-0 au:gap-0.5 au:font-sans au:text-gray-500 au:text-xs au:tracking-widest";

/** A search field over a list of commands. On its own, or in a CommandPalette. */
function Command({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandPart>>) {
  return (
    <CommandPart
      className={cn("au:flex au:min-h-0 au:flex-col", className)}
      pendingAnnouncement={useMessages().loading}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: WithClass<React.ComponentProps<typeof CommandInputPart>>) {
  return (
    <div className="au:border-alpha/10 au:flex au:h-14 au:shrink-0 au:items-center au:gap-3 au:border-b au:px-4 au:text-gray-500">
      <SearchIcon aria-hidden="true" className="au:size-4 au:shrink-0" />
      <CommandInputPart
        className={cn(
          "au:h-full au:min-w-0 au:flex-1 au:bg-transparent au:text-base au:text-gray-950 au:outline-none au:placeholder:text-gray-500",
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
        "au:max-h-[min(24rem,60dvh)] au:scroll-py-2 au:overflow-y-auto au:p-2",
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
        "au:px-4 au:py-10 au:text-center au:text-sm au:text-gray-500 au:not-data-empty:hidden",
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
      className={cn("au:flex au:flex-col au:gap-0.5", className)}
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
        "au:px-2 au:pt-2 au:pb-1 au:text-xs au:font-medium au:text-gray-500",
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
        "au:data-highlighted:bg-alpha/5 au:[&_mark]:text-accent au:flex au:min-h-10 au:cursor-default au:items-center au:gap-3 au:rounded-xl au:px-2.5 au:text-sm au:font-medium au:text-gray-950 au:outline-none au:select-none au:data-disabled:opacity-40 au:data-pending:cursor-progress au:[&_mark]:bg-transparent",
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
        "au:flex au:size-4 au:shrink-0 au:items-center au:justify-center au:text-gray-600 au:[&_svg]:size-4",
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
      className={cn("au:bg-alpha/10 au:-mx-2 au:my-2 au:h-px", className)}
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
  title,
  placeholder,
  emptyText,
  trigger,
}: CommandPaletteProps) {
  const messages = useMessages();
  const name = title ?? messages.commandPalette;
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button
              className="au:w-9 au:justify-start au:px-0 au:text-gray-500 au:sm:w-56 au:sm:px-3 au:[&_svg]:mx-auto au:sm:[&_svg]:mx-0"
              variant="outline"
            />
          )
        }
        shortcut="mod+k"
      >
        {trigger ? null : (
          <>
            <SearchIcon />
            <span className="au:sr-only au:sm:not-sr-only au:sm:font-normal">
              {messages.openSearch}
            </span>
            <DialogShortcut className={cn(keysClass, "au:hidden au:sm:flex")} />
          </>
        )}
      </DialogTrigger>
      <DialogContent className="au:top-[12dvh] au:bottom-auto" size="md">
        <DialogTitle className="au:sr-only">{name}</DialogTitle>
        <Command loop onAction={close}>
          <CommandInput
            aria-label={name}
            placeholder={placeholder ?? messages.commandPlaceholder}
          />
          <CommandEmpty>{emptyText ?? messages.nothingFound}</CommandEmpty>
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
