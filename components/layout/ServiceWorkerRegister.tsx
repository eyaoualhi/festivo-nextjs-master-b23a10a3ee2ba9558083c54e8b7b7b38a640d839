"use client";

import { useEffect } from "react";

/**
 * Enregistre `public/sw.js` (D-27). En développement, les fichiers changent sans changer de nom :
 * un Service Worker servirait du code périmé, donc on retire ceux qui resteraient d'un test.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          registrations.forEach((registration) => registration.unregister()),
        );
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error: unknown) => console.error("Service Worker non enregistré", error));
  }, []);

  return null;
}
