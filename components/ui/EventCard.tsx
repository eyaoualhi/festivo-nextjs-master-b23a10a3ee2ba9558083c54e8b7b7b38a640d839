import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/format";
import { localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";
import { categoryStyles } from "./categoryStyles";
import DateBadge from "./DateBadge";

type EventCardProps = {
  event: EventSummary;
  priority?: boolean;
};

function spotsDot(spotsLeft: number, capacity: number): string {
  if (spotsLeft === 0) return "bg-red-400";
  if (spotsLeft / capacity <= 0.15) return "bg-amber-300";
  return "bg-emerald-400";
}

/** Affiche plein cadre : le détail se dévoile au survol, et reste visible sur écran tactile. */
const reveal =
  "grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100";

export default async function EventCard({ event, priority = false }: EventCardProps) {
  const { locale, dict } = await getI18n();
  const { id, title, category, startsAt, venue, city, imageUrl, imageAlt, capacity, spotsLeft } =
    event;
  const CategoryIcon = categoryStyles[category].icon;

  return (
    <article className="group @container relative isolate aspect-3/4 overflow-hidden rounded-2xl bg-ink shadow-md ring-1 shadow-ink/10 ring-ink/5 transition duration-300 ease-out focus-within:ring-2 focus-within:ring-primary hover:z-10 hover:scale-[1.04] hover:shadow-2xl hover:shadow-ink/30 motion-reduce:hover:scale-100">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 240px, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 48vw"
        className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/95 via-black/40 to-black/10"
      />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <DateBadge date={startsAt} className="shrink-0" />
        {spotsLeft === 0 ? (
          <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {dict.card.full}
          </span>
        ) : (
          <span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md @[13rem]:inline-flex">
            <CategoryIcon aria-hidden="true" className="size-3.5" />
            {dict.categories[category]}
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3.5 text-white @[13rem]:p-4">
        <time
          dateTime={startsAt.toISOString()}
          className="text-[11px] font-semibold tracking-wide text-white/75 uppercase rtl:tracking-normal"
        >
          {formatShortDate(locale, startsAt)} · {formatTime(locale, startsAt)}
        </time>
        <h3
          dir="auto"
          className="line-clamp-2 font-display text-base leading-snug font-bold text-balance @[13rem]:text-lg"
        >
          <Link
            href={localizePath(locale, `/evenements/${id}`)}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-xs text-white/75">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          <span dir="auto" className="truncate">
            {city}
            <span className="hidden @[13rem]:inline"> · {venue}</span>
          </span>
        </p>
        <div className={reveal}>
          <div className="overflow-hidden">
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-bold">{dict.common.free}</span>
                <span className="inline-flex items-center gap-1.5 truncate text-[11px] font-medium text-white/80">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 shrink-0 rounded-full ${spotsDot(spotsLeft, capacity)}`}
                  />
                  {spotsLeft === 0
                    ? dict.card.full
                    : plural(locale, spotsLeft, dict.card.spotsLeft)}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-white px-3.5 text-xs font-bold text-black transition-colors group-hover:bg-cta group-hover:text-white"
              >
                {dict.common.view}
                <ArrowRight className="size-3.5 rtl:-scale-x-100" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
