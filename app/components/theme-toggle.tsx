"use client";

import { useEffect, useSyncExternalStore } from "react";

const storageKey = "markly-theme";

type Theme = "light" | "dark";

const themeListeners = new Set<() => void>();

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light" as Theme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getThemeSnapshot(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readStoredTheme() ?? getSystemTheme();
}

function getServerThemeSnapshot(): Theme | null {
  return null;
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(listener);
    };
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => listener();

  mediaQuery.addEventListener("change", handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    themeListeners.delete(listener);
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    if (!theme) {
      return;
    }

    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const activeTheme = theme ?? getSystemTheme();
    const nextTheme = activeTheme === "dark" ? "light" : "dark";

    window.localStorage.setItem(storageKey, nextTheme);
    notifyThemeChange();
  };

  const buttonLabel = theme === "dark" ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground/30"
      aria-pressed={theme === "dark"}
    >
      {theme ? buttonLabel : "Theme"}
    </button>
  );
}
