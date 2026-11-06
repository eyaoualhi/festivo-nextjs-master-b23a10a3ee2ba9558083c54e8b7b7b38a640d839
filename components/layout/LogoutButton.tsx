"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";
import { localizePath, type Locale } from "@/lib/i18n/config";

type LogoutButtonProps = {
  locale: Locale;
  label: string;
  variant?: ButtonVariant;
  className?: string;
};

/** Déconnexion côté client (cours ch. 4) : la session et l'en-tête sont vidés ensemble. */
export default function LogoutButton({
  locale,
  label,
  variant = "ghost",
  className,
}: LogoutButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut({ redirectTo: localizePath(locale, "/") });
      }}
      className={buttonClasses(variant, className)}
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <LogOut aria-hidden="true" className="size-4 rtl:-scale-x-100" />
      )}
      {label}
    </button>
  );
}
