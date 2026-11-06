"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import Dropdown, { dropdownItemClasses } from "@/components/ui/Dropdown";
import {
  applyTheme,
  readThemeChoice,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemeChoice,
} from "@/lib/theme";

type ThemeSwitcherProps = {
  labels: Record<ThemeChoice | "theme", string>;
};

const options: { value: ThemeChoice; icon: LucideIcon }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

function subscribe(onChange: () => void): () => void {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    applyTheme(readThemeChoice());
    onChange();
  };
  media.addEventListener("change", sync);
  window.addEventListener("storage", sync);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", sync);
    window.removeEventListener("storage", sync);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export default function ThemeSwitcher({ labels }: ThemeSwitcherProps) {
  const choice = useSyncExternalStore(subscribe, readThemeChoice, () => "system" as const);

  // Le script en ligne ne s'exécute pas quand React rend `<html>` côté client (page 404,
  // remontage du mode strict en développement) : on réapplique le thème avant l'affichage.
  useLayoutEffect(() => {
    applyTheme(readThemeChoice());
  }, []);
  const current = options.find((option) => option.value === choice) ?? options[2];
  const CurrentIcon = current.icon;

  const select = (value: ThemeChoice) => {
    localStorage.setItem(THEME_STORAGE_KEY, value);
    applyTheme(value);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <Dropdown
      label={`${labels.theme} (${labels[choice]})`}
      trigger={<CurrentIcon aria-hidden="true" className="size-5" />}
    >
      {(close) => (
        <ul className="flex flex-col">
          {options.map(({ value, icon: Icon }) => (
            <li key={value}>
              <button
                type="button"
                aria-pressed={choice === value}
                onClick={() => {
                  select(value);
                  close();
                }}
                className={dropdownItemClasses}
              >
                <Icon aria-hidden="true" className="size-4 text-muted" />
                <span className="flex-1">{labels[value]}</span>
                {choice === value && <Check aria-hidden="true" className="size-4 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
