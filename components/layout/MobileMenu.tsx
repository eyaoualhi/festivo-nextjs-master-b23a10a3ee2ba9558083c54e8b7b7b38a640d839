"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import AccountMenu, { type AccountLabels } from "@/components/layout/AccountMenu";
import type { NavLink } from "@/components/layout/navigation";
import type { Locale } from "@/lib/i18n/config";

type MobileMenuProps = {
  locale: Locale;
  links: NavLink[];
  labels: Record<"navigation" | "open" | "close", string>;
  accountLabels: AccountLabels;
};

export default function MobileMenu({ locale, links, labels, accountLabels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        className="flex size-11 items-center justify-center bg-tile text-ink transition-colors hover:bg-blue-100 hover:text-night focus-visible:outline-2 focus-visible:outline-primary"
      >
        {open ? (
          <X aria-hidden="true" className="size-5" />
        ) : (
          <Menu aria-hidden="true" className="size-5" />
        )}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 bg-tile px-4 pt-2 pb-5 md:px-8">
          <nav aria-label={labels.navigation}>
            <ul className="flex flex-col">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    className="flex min-h-12 items-center justify-between text-step-body font-medium text-ink transition-colors hover:text-cta"
                  >
                    {label}
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-muted rtl:-scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <AccountMenu
            locale={locale}
            labels={accountLabels}
            onNavigate={close}
            className="mt-4 grid grid-cols-2 gap-3 sm:hidden"
          />
        </div>
      )}
    </div>
  );
}
