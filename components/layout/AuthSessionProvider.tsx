"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

/**
 * Session lue côté client (`useSession`, cours ch. 4) : les pages publiques restent statiques
 * et le Service Worker ne met jamais en cache de données personnelles (D-30).
 */
export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>;
}
