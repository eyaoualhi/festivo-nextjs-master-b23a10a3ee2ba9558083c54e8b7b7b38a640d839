"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** Bandeau affiché tant que le navigateur signale l'absence de réseau (D-27). */
export default function OfflineBanner({ label }: { label: string }) {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return (
    <div role="status" aria-live="polite">
      {!online && (
        <p className="flex items-center justify-center gap-2 bg-band px-4 py-2.5 text-center text-sm font-medium text-paper">
          <WifiOff aria-hidden="true" className="size-4 shrink-0" />
          {label}
        </p>
      )}
    </div>
  );
}
