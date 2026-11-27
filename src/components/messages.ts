import * as React from "react";

/** Where a moving row is, for what screen readers hear while reordering. */
interface Place {
  name: string;
  position: number;
  total: number;
}

/**
 * Every word admin-ui shows by itself, in English. AdminProvider's `messages`
 * replaces any of them: a string, or a function of the values in braces.
 */
const englishMessages = {
  // Answers
  cancel: "Cancel",
  confirm: "Confirm",
  close: "Close",
  dismiss: "Dismiss",
  back: "Back",
  remove: "Remove",
  tryAgain: "Try again",
  clearAll: "Clear all",
  discardChanges: "Discard changes?",
  keepEditing: "Keep editing",
  discard: "Discard",

  // Errors and states
  failed: "Something went wrong. Try again.",
  sessionExpired: "Your session expired. Sign in again.",
  pageFailed: "Something went wrong",
  listFailed: "This list couldn't load",
  listEmpty: "Nothing here yet",
  /** What screen readers hear while something loads or an action is pending. */
  loading: "Loading",
  loadingFile: ({ name }: { name: string }) => `Loading ${name}`,
  /** The region toasts show in, for screen readers. */
  notifications: "Notifications",

  // Navigation
  mainNav: "Main",
  openMenu: "Open menu",
  expandMenu: "Expand menu",
  collapseMenu: "Collapse menu",
  openAccountMenu: "Open account menu",
  openStudio: "Open Hooman Studio",
  theme: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  pagination: "Pagination",
  previous: "Previous",
  next: "Next",
  previousPage: "Previous page",
  nextPage: "Next page",
  pageRange: ({
    first,
    last,
    total,
  }: {
    first: number;
    last: number;
    total: number;
  }) => `${first}–${last} of ${total}`,

  // Search and commands
  search: "Search",
  clearSearch: "Clear search",
  openSearch: "Search…",
  commandPalette: "Command palette",
  commandPlaceholder: "Search or jump to…",
  nothingFound: "Nothing found.",

  // Fields
  showOptions: "Show options",
  removeItem: ({ name }: { name: string }) => `Remove ${name}`,
  chooseDate: "Choose date",
  endDate: "End date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  decrease: "Decrease",
  increase: "Increase",

  // Lists and tables
  actions: "Actions",
  actionsFor: ({ name }: { name: string }) => `Actions for ${name}`,
  /** Read before a DataTable row's name, which may not be plain text, for its "…" button. */
  actionsForRow: "Actions for",
  /** Read before a DataTable row's name for its checkbox. */
  selectRow: "Select",
  selectAllRows: "Select all rows",
  selectedCount: ({ count }: { count: number }) => `${count} selected`,
  clearSelection: "Clear selection",
  reorder: ({ name }: { name: string }) => `Reorder ${name}`,
  reorderInstructions:
    "Press Space or Enter to pick it up, the arrow keys to move it, then Space or Enter to drop it. Escape puts it back.",
  pickedUp: ({ name, position, total }: Place) =>
    `Picked up ${name}, position ${position} of ${total}.`,
  moved: ({ name, position, total }: Place) =>
    `${name}, position ${position} of ${total}.`,
  dropped: ({ name, position, total }: Place) =>
    `Dropped ${name} at position ${position} of ${total}.`,
  movedBack: ({ name, position, total }: Place) =>
    `Moved ${name} back to position ${position} of ${total}.`,

  // Files
  dropFiles: "Drag files here",
  browseFiles: "Browse files",
  chooseFile: "Choose file",
  replaceFile: "Replace",
  noFile: "No file",
  currentFile: "Current file",
  fileNotAccepted: "This type of file isn't accepted.",
  uploadFailed: "The upload failed. Try again.",
  uploading: ({ name }: { name: string }) => `Uploading ${name}`,
  uploaded: ({ name }: { name: string }) => `Uploaded ${name}`,
  image: "Image",
  video: "Video",
  audio: "Audio",
  file: "File",
  play: ({ name }: { name: string }) => `Play ${name}`,
  pause: ({ name }: { name: string }) => `Pause ${name}`,
  playbackPosition: ({ name }: { name: string }) => `Position in ${name}`,
};

type Messages = typeof englishMessages;

/** The words AdminProvider hands down: its `messages` over the ones around it. */
const MessagesContext = React.createContext<Messages>(englishMessages);

function useMessages() {
  return React.use(MessagesContext);
}

export type { Messages };
export { MessagesContext, useMessages };
