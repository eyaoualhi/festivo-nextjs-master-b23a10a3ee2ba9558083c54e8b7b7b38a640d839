"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";

type CancelActionProps = {
  registrationId: string;
  label: string;
  confirmText?: string;
  successText?: string;
  errorText?: string;
  variant?: ButtonVariant;
  className?: string;
};

export default function CancelAction({
  registrationId,
  label,
  confirmText,
  successText,
  errorText,
  variant = "danger",
  className = "",
}: CancelActionProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleCancel() {
    if (confirmText && !window.confirm(confirmText)) {
      return;
    }

    setIsPending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? errorText ?? "Erreur lors de l'annulation");
        setIsPending(false);
        return;
      }

      setSuccessMessage(successText ?? "Inscription annulée");
      router.refresh();
    } catch {
      setErrorMessage(errorText ?? "Erreur de connexion");
      setIsPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className={buttonClasses(variant, className)}
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <XCircle aria-hidden="true" className="size-5" />
        )}
        {label}
      </button>
      {errorMessage && (
        <p role="alert" className="text-center text-xs font-medium text-danger">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-center text-xs font-medium text-success">
          {successMessage}
        </p>
      )}
    </div>
  );
}
