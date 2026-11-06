"use client";

import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/layout/LogoutButton";
import ButtonLink from "@/components/ui/ButtonLink";
import type { ButtonVariant } from "@/components/ui/buttonClasses";
import { localizePath, type Locale } from "@/lib/i18n/config";

export type AccountLabels = Record<"login" | "register" | "space" | "logout", string>;

type AccountMenuProps = {
  locale: Locale;
  labels: AccountLabels;
  /** Appelé après un clic sur un lien (fermeture du menu mobile). */
  onNavigate?: () => void;
  /** Variante du bouton secondaire (connexion, déconnexion). */
  quietVariant?: ButtonVariant;
  className?: string;
};

/** Boutons du compte : la session est lue côté client pour garder l'en-tête statique (D-30). */
export default function AccountMenu({
  locale,
  labels,
  onNavigate,
  quietVariant = "secondary",
  className = "",
}: AccountMenuProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div aria-hidden="true" className={`h-11 animate-pulse rounded-xl bg-surface ${className}`} />
    );
  }

  if (status === "authenticated") {
    return (
      <div className={className}>
        <ButtonLink href={localizePath(locale, "/espace")} onClick={onNavigate}>
          <LayoutDashboard aria-hidden="true" className="size-4" />
          {labels.space}
        </ButtonLink>
        <LogoutButton locale={locale} label={labels.logout} variant={quietVariant} />
      </div>
    );
  }

  return (
    <div className={className}>
      <ButtonLink
        href={localizePath(locale, "/connexion")}
        variant={quietVariant}
        onClick={onNavigate}
      >
        <LogIn aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        {labels.login}
      </ButtonLink>
      <ButtonLink href={localizePath(locale, "/inscription")} onClick={onNavigate}>
        <UserPlus aria-hidden="true" className="size-4" />
        {labels.register}
      </ButtonLink>
    </div>
  );
}
