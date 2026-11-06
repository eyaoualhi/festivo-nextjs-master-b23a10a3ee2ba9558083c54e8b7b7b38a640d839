import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import CancelAction from "@/app/[lang]/(site)/evenements/[id]/_components/CancelAction";
import { formatLongDate, formatShortDate, formatTime } from "@/lib/format";
import { interpolate, localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { RegistrationWithEvent } from "@/lib/registrations";

type RegistrationItemProps = {
  registration: RegistrationWithEvent;
  locale: Locale;
  t: Dictionary["dashboard"]["registrationCard"];
  eventT: Dictionary["event"];
};

export default function RegistrationItem({
  registration,
  locale,
  t,
  eventT,
}: RegistrationItemProps) {
  const { event, registeredAt, isUpcoming } = registration;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-card shadow-xs sm:size-24">
          <Image
            src={event.imageUrl}
            alt={event.imageAlt}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isUpcoming
                  ? "bg-primary/10 text-primary"
                  : "bg-surface-elevated border border-line text-muted"
              }`}
            >
              {isUpcoming ? t.upcoming : t.past}
            </span>
            <span className="text-xs text-muted">
              {interpolate(t.registeredOn, {
                date: formatShortDate(locale, registeredAt),
              })}
            </span>
          </div>

          <h3 className="font-display text-base font-bold text-ink sm:text-lg">
            <Link
              href={localizePath(locale, `/evenements/${event.id}`)}
              className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              {event.title}
            </Link>
          </h3>

          <div className="flex flex-col gap-1 text-xs text-muted sm:flex-row sm:items-center sm:gap-4">
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
              {formatLongDate(locale, event.startsAt)}
            </span>
            <span className="flex items-center gap-1.5" dir="ltr">
              <Clock aria-hidden="true" className="size-3.5 text-primary" />
              {formatTime(locale, event.startsAt)} – {formatTime(locale, event.endsAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 shrink-0 sm:mt-0">
        <CancelAction
          registrationId={registration.id}
          label={t.cancelButton}
          confirmText={eventT.cancelConfirm}
          successText={eventT.cancelSuccess}
          errorText={eventT.cancelError}
          variant="secondary"
          className="min-h-10 rounded-xl px-4 text-xs font-semibold text-danger hover:border-danger/30 hover:bg-danger/10"
        />
      </div>
    </article>
  );
}
