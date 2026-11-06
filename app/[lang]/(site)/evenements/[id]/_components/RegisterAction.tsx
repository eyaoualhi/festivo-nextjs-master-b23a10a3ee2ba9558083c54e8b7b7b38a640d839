"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/buttonClasses";

type RegisterActionProps = {
  eventId: string;
  label: string;
  successText?: string;
  errorText?: string;
  className?: string;
};

export default function RegisterAction({
  eventId,
  label,
  successText,
  errorText,
  className = "",
}: RegisterActionProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleRegister() {
    setIsPending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? errorText ?? "Erreur lors de l'inscription");
        setIsPending(false);
        return;
      }

      setSuccessMessage(successText ?? "Inscription confirmée !");
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
        onClick={handleRegister}
        disabled={isPending}
        className={buttonClasses("cta", className)}
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <CalendarCheck aria-hidden="true" className="size-5" />
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
