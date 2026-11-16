import { useSyncExternalStore } from "react";
import { Button } from "../../src";
import { BasicsPage } from "./pages/basics";
import { DataPage } from "./pages/data";
import { FormsPage } from "./pages/forms";
import { LayoutPage } from "./pages/layout";
import { OverlaysPage } from "./pages/overlays";

const pages = {
  basics: BasicsPage,
  forms: FormsPage,
  overlays: OverlaysPage,
  layout: LayoutPage,
  data: DataPage,
};

type PageName = keyof typeof pages;

function readPage(): PageName {
  const name = window.location.hash.replace("#/", "");
  return name in pages ? (name as PageName) : "basics";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function toggleTheme() {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
}

function App() {
  const page = useSyncExternalStore(subscribe, readPage);
  const Page = pages[page];
  return (
    <div className="min-h-dvh">
      <nav className="border-alpha/10 flex flex-wrap items-center gap-1 border-b px-4 py-2">
        {Object.keys(pages).map((name) => (
          <a
            aria-current={name === page ? "page" : undefined}
            className="hover:bg-alpha/5 rounded-lg px-2 py-1 text-sm text-gray-600 aria-[current=page]:text-gray-950"
            href={`#/${name}`}
            key={name}
          >
            {name}
          </a>
        ))}
        <Button
          className="ml-auto"
          onClick={toggleTheme}
          size="sm"
          variant="ghost"
        >
          Toggle theme
        </Button>
      </nav>
      <Page />
    </div>
  );
}

export { App };
