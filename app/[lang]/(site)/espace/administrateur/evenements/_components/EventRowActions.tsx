"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

type EventRowActionsProps = {
  eventId: string;
  confirmText: string;
  deletedText: string;
};

export default function EventRowActions({
  eventId,
  confirmText,
  deletedText,
}: EventRowActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(confirmText)) return;

    setIsPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Erreur lors de la suppression");
        setIsPending(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Erreur de connexion");
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        title={deletedText}
        className="inline-flex size-8 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:border-danger/30 hover:bg-danger/10 hover:text-danger disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Trash2 aria-hidden="true" className="size-4" />
        )}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
