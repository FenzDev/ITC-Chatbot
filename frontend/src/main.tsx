import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/app/providers";
import "@/index.css";

function initializeTheme() {
  let savedTheme: string | null = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch {
    // Use the system preference when storage is unavailable.
  }

  const theme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  document.documentElement.classList.toggle("dark", theme === "dark");
}

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);
