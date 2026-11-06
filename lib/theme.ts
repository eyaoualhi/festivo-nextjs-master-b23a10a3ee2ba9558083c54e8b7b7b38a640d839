export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "festivo-theme";
export const THEME_CHANGE_EVENT = "festivo-theme-change";

/** Exécuté avant l'affichage pour éviter un flash de la mauvaise couleur. */
export const themeScript = `(function(){try{var c=localStorage.getItem("${THEME_STORAGE_KEY}");var d=c==="dark"||(c!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})()`;

export function readThemeChoice(): ThemeChoice {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : "system";
}

export function applyTheme(choice: ThemeChoice): void {
  const dark =
    choice === "dark" ||
    (choice === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}
