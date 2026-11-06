import { CalendarDays } from "lucide-react";
import { getInitials } from "@/lib/format";
import { plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { Organizer } from "@/types/event";

type OrganizerCardProps = {
  organizer: Organizer;
  eventCount: number;
};

export default async function OrganizerCard({ organizer, eventCount }: OrganizerCardProps) {
  const { locale, dict } = await getI18n();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center">
      <span
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent font-display text-xl font-extrabold text-white shadow-lg shadow-primary/20"
      >
        {getInitials(organizer.name)}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p dir="auto" className="font-display text-lg font-bold text-ink">
          {organizer.name}
        </p>
        <p dir="auto" className="text-sm text-muted">
          {organizer.bio}
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
          <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
          {plural(locale, eventCount, dict.event.published)}
        </p>
      </div>
    </div>
  );
}
