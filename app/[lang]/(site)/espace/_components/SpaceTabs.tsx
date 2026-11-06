"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, UserRoundPen } from "lucide-react";
import { useSession } from "next-auth/react";
import { localizePath, type Locale } from "@/lib/i18n/config";

type SpaceTabsProps = {
  locale: Locale;
  labels: { navigation: string; overview: string; profile: string; admin?: string };
};

export default function SpaceTabs({ locale, labels }: SpaceTabsProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "administrateur";

  const overviewHref = localizePath(locale, "/espace");
  const profileHref = localizePath(locale, "/espace/profil");
  const adminHref = localizePath(locale, "/espace/administrateur");

  const tabs = [
    {
      href: overviewHref,
      label: labels.overview,
      icon: LayoutDashboard,
      active: pathname !== profileHref && !pathname.startsWith(adminHref),
    },
    {
      href: profileHref,
      label: labels.profile,
      icon: UserRoundPen,
      active: pathname === profileHref,
    },
    ...(isAdmin
      ? [
          {
            href: adminHref,
            label: labels.admin ?? "Administration",
            icon: ShieldCheck,
            active: pathname.startsWith(adminHref),
          },
        ]
      : []),
  ];

  return (
    <nav aria-label={labels.navigation}>
      <ul className="flex gap-1 rounded-2xl border border-line bg-surface p-1">
        {tabs.map(({ href, label, icon: Icon, active }) => (
          <li key={href} className="flex-1 sm:flex-none">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                active ? "bg-card text-ink shadow-xs" : "text-muted hover:text-ink"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
