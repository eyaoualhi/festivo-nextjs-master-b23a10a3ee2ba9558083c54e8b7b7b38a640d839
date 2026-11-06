import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import BorderBeam from "@/components/ui/BorderBeam";
import DateBadge from "@/components/ui/DateBadge";
import SpotsLeft from "@/components/ui/SpotsLeft";
import { formatLongDate, formatTime } from "@/lib/format";
import { plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";
import RegisterButton from "./RegisterButton";

type RegistrationCardProps = {
  event: EventSummary;
  className?: string;
};

export default async function RegistrationCard({ event, className = "" }: RegistrationCardProps) {
  const { locale, dict } = await getI18n();
  const { startsAt, endsAt, venue, city, capacity, spotsLeft } = event;
  const filled = Math.round(((capacity - spotsLeft) / capacity) * 100);

  return (
    <div
      className={`relative flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 shadow-xl shadow-ink/5 ${className}`}
    >
      <BorderBeam size={180} duration={14} />
      <div className="flex items-center gap-4">
        <DateBadge date={startsAt} size="lg" className="shrink-0 bg-surface shadow-none" />
        <div className="flex min-w-0 flex-col">
          <p className="font-display text-2xl font-extrabold text-ink">{dict.common.free}</p>
          <p className="text-sm text-muted">{dict.event.freeHint}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-3 border-y border-line py-5 text-sm text-ink">
        <li className="flex items-start gap-3">
          <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <time dateTime={startsAt.toISOString()} className="first-letter:uppercase">
            {formatLongDate(locale, startsAt)}
          </time>
        </li>
        <li className="flex items-start gap-3">
          <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <span dir="ltr">
            {formatTime(locale, startsAt)} – {formatTime(locale, endsAt)}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <span dir="auto">
            {venue}
            <span className="block text-muted">{city}</span>
          </span>
        </li>
      </ul>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <SpotsLeft spotsLeft={spotsLeft} capacity={capacity} className="text-sm" />
          <span className="text-xs text-muted">
            {plural(locale, capacity, dict.event.totalSpots)}
          </span>
        </div>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface">
          <div
            className={`h-full rounded-full ${spotsLeft === 0 ? "bg-danger" : "bg-linear-to-r from-primary to-accent"}`}
            style={{ width: `${filled}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <RegisterButton
          full={spotsLeft === 0}
          eventSlug={event.id}
          className="min-h-14 w-full text-base"
        />
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <Ticket aria-hidden="true" className="size-3.5" />
          {dict.event.loginRequired}
        </p>
      </div>
    </div>
  );
}
