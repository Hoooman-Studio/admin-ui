import type { AdminProviderProps } from "../../src";

/** Some of admin-ui's words in Dutch, as an app would hand them over from its own i18n library. `?lang=nl` turns them on. */
const dutch: AdminProviderProps["messages"] = {
  cancel: "Annuleren",
  confirm: "Bevestigen",
  close: "Sluiten",
  dismiss: "Sluiten",
  back: "Terug",
  remove: "Verwijderen",
  removeItem: ({ name }) => `${name} verwijderen`,
  tryAgain: "Opnieuw proberen",
  clearAll: "Alles wissen",
  discardChanges: "Wijzigingen weggooien?",
  keepEditing: "Verder bewerken",
  discard: "Weggooien",
  failed: "Er ging iets mis. Probeer het opnieuw.",
  sessionExpired: "Je sessie is verlopen. Log opnieuw in.",
  pageFailed: "Er ging iets mis",
  listEmpty: "Nog niets hier",
  theme: "Thema",
  themeSystem: "Systeem",
  themeLight: "Licht",
  themeDark: "Donker",
  previous: "Vorige",
  next: "Volgende",
  pageRange: ({ first, last, total }) => `${first}–${last} van ${total}`,
  search: "Zoeken",
  clearSearch: "Zoekopdracht wissen",
  openSearch: "Zoeken…",
  commandPlaceholder: "Zoek of ga naar…",
  nothingFound: "Niets gevonden.",
  selectedCount: ({ count }) => `${count} geselecteerd`,
  dropFiles: "Sleep bestanden hierheen",
  browseFiles: "Bestanden kiezen",
  chooseFile: "Bestand kiezen",
  replaceFile: "Vervangen",
  noFile: "Geen bestand",
};

const isDutch =
  new URLSearchParams(window.location.search).get("lang") === "nl";

export { dutch, isDutch };
