"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/** Événement propre aux navigateurs Chromium, absent des types du DOM. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallButtonProps = {
  label: string;
  shortLabel: string;
};

/**
 * Propose l'installation quand le navigateur la permet (manifest valide, D-27). Ailleurs (Safari,
 * Firefox), le bouton n'apparaît pas et l'installation passe par le menu du navigateur.
 */
export default function InstallButton({ label, shortLabel }: InstallButtonProps) {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function onPrompt(event: Event) {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!prompt) return null;

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }

  return (
    <button
      type="button"
      onClick={install}
      aria-label={label}
      title={label}
      className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 bg-tile px-2.5 text-sm font-semibold text-ink transition-colors hover:bg-blue-100 hover:text-night focus-visible:outline-2 focus-visible:outline-primary"
    >
      <Download aria-hidden="true" className="size-4" />
      <span className="hidden sm:inline">{shortLabel}</span>
    </button>
  );
}
