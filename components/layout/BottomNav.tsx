"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, House, UserRound, type LucideIcon } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n/config";

type BottomNavProps = {
  locale: Locale;
  labels: Record<"navigation" | "home" | "explore" | "account", string>;
};

type BottomNavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  /** Chemin sans le préfixe de langue. */
  isActive: (path: string) => boolean;
};

/** La fiche d'un événement affiche sa propre barre d'inscription à la place. */
const hiddenOn = /^\/evenements\/[^/]+/;

/** La barre s'efface quand on descend pour laisser le texte lisible, et revient quand on remonte. */
function useHiddenOnScrollDown(): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (Math.abs(current - last) < 8) return;
      setHidden(current > last && current > 80);
      last = current;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export default function BottomNav({ locale, labels }: BottomNavProps) {
  const pathname = usePathname();
  const hidden = useHiddenOnScrollDown();
  const path = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  if (hiddenOn.test(path)) return null;

  const items: BottomNavItem[] = [
    { path: "/", label: labels.home, icon: House, isActive: (current) => current === "/" },
    {
      path: "/evenements",
      label: labels.explore,
      icon: Compass,
      isActive: (current) => current.startsWith("/evenements"),
    },
    {
      path: "/espace",
      label: labels.account,
      icon: UserRound,
      isActive: (current) => current.startsWith("/espace"),
    },
  ];

  return (
    <nav
      aria-label={labels.navigation}
      className={`fixed inset-x-0 bottom-0 z-30 bg-tile pb-[env(safe-area-inset-bottom)] transition-transform duration-300 focus-within:translate-y-0 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <ul className="grid grid-cols-3">
        {items.map(({ path: itemPath, label, icon: Icon, isActive }) => {
          const active = isActive(path);
          return (
            <li key={itemPath}>
              <Link
                href={localizePath(locale, itemPath)}
                aria-current={active ? "page" : undefined}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.8125rem] font-semibold text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
