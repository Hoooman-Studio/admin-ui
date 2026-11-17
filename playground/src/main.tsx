import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./admin.css";
import "./site.css";
import { App } from "./app";

const root = document.querySelector("#root");
if (!root) {
  throw new Error("Missing #root");
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
