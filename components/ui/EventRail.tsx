import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PosterRow from "./PosterRow";

type EventRailProps = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  /** Noms accessibles des flèches de défilement. */
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
};

export default function EventRail({
  id,
  title,
  description,
  href,
  linkLabel,
  previousLabel,
  nextLabel,
  children,
}: EventRailProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2
            id={id}
            className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl"
          >
            {title}
          </h2>
          {description && <p className="text-sm text-muted md:text-base">{description}</p>}
        </div>
        {href && linkLabel && (
          <Link
            href={href}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {linkLabel}
            <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Link>
        )}
      </div>
      <PosterRow previousLabel={previousLabel} nextLabel={nextLabel}>
        {children}
      </PosterRow>
    </section>
  );
}

export { PosterRowItem as EventRailItem } from "./PosterRow";
