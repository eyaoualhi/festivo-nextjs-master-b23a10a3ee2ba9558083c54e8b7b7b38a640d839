"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Après une Server Action qui ouvre ou modifie la session : relit la session côté client
 * (en-tête à jour sans rechargement) puis, si demandé, navigue vers `href`.
 */
export function useSessionRedirect() {
  const router = useRouter();
  const { update } = useSession();

  return async (href?: string) => {
    await update();
    if (href) router.push(href);
  };
}
