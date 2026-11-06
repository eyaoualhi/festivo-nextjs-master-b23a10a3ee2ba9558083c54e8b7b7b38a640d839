import type { ReactNode } from "react";

type SpaceSectionProps = {
  id: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function SpaceSection({ id, title, action, children }: SpaceSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-5 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="font-display text-xl font-bold text-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
