"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UserCheck, UserX } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { USER_ROLES, type UserRole } from "@/types/user";

type UserRowActionsProps = {
  userId: string;
  currentRole: UserRole;
  currentActive: boolean;
  isSelf: boolean;
  labels: Dictionary["dashboard"]["admin"]["users"];
};

export default function UserRowActions({
  userId,
  currentRole,
  currentActive,
  isSelf,
  labels,
}: UserRowActionsProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(currentRole);
  const [active, setActive] = useState(currentActive);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(newRole: UserRole) {
    if (newRole === role) return;
    setIsPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Erreur");
        setIsPending(false);
        return;
      }

      setRole(newRole);
      router.refresh();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsPending(false);
    }
  }

  async function handleToggleActive() {
    setIsPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Erreur");
        setIsPending(false);
        return;
      }

      setActive(!active);
      router.refresh();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(labels.deleteConfirm)) return;

    setIsPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
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
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        disabled={isPending || isSelf}
        aria-label={labels.role}
        className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors focus:border-primary focus:outline-none disabled:opacity-50"
      >
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleToggleActive}
        disabled={isPending || isSelf}
        title={active ? "Désactiver" : "Activer"}
        className={`inline-flex size-8 items-center justify-center rounded-xl border border-line transition-colors disabled:opacity-50 ${
          active
            ? "bg-surface text-muted hover:border-amber-300 hover:text-amber-600"
            : "bg-danger/10 text-danger hover:bg-danger/20"
        }`}
      >
        {active ? (
          <UserX aria-hidden="true" className="size-4" />
        ) : (
          <UserCheck aria-hidden="true" className="size-4" />
        )}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending || isSelf}
        title={labels.deleted}
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
