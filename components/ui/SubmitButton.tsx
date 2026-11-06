"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle, type LucideIcon } from "lucide-react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";

type SubmitButtonProps = {
  children: ReactNode;
  /** Texte affiché pendant l'envoi du formulaire au serveur (cours ch. 5). */
  pendingLabel?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  /** Icône affichée à la place de la flèche. */
  icon?: LucideIcon;
};

export default function SubmitButton({
  children,
  pendingLabel,
  fullWidth = true,
  variant = "primary",
  icon: Icon,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={buttonClasses(variant, `group ${fullWidth ? "w-full" : ""} active:scale-[0.99]`)}
    >
      {pending && pendingLabel ? pendingLabel : children}
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : Icon ? (
        <Icon aria-hidden="true" className="size-4" />
      ) : (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      )}
    </button>
  );
}
