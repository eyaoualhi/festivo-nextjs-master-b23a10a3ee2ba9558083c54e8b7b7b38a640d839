import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
};

export default function EmptyState({ icon: Icon, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-surface text-muted">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <p className="max-w-sm font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}
