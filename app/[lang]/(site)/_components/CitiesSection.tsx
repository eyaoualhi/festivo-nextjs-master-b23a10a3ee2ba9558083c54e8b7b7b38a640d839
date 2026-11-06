import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDayMonth } from "@/lib/format";
import { interpolate, localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";
import NearbyMap from "./NearbyMap";

const CITIES_SHOWN = 5;

type CitiesSectionProps = {
  events: EventSummary[];
};

type CitySummary = {
  city: string;
  count: number;
  next: Date;
};

function summarizeCities(events: EventSummary[]): CitySummary[] {
  const cities = new Map<string, CitySummary>();
  for (const event of events) {
    const summary = cities.get(event.city);
    if (summary) summary.count += 1;
    else cities.set(event.city, { city: event.city, count: 1, next: event.startsAt });
  }
  return [...cities.values()].sort((a, b) => b.count - a.count);
}

function cityHref(locale: Parameters<typeof localizePath>[0], city: string): string {
  return localizePath(locale, `/evenements?ville=${encodeURIComponent(city)}`);
}

export default async function CitiesSection({ events }: CitiesSectionProps) {
  const { locale, dict } = await getI18n();
  const t = dict.cities;
  const cities = summarizeCities(events);
  const shown = cities.slice(0, CITIES_SHOWN);
  const others = cities.slice(CITIES_SHOWN);

  return (
    <section id="villes" aria-labelledby="cities-title" className="bg-blue-600 text-paper">
      <div className="mx-auto grid max-w-360 gap-4 px-4 pt-20 pb-10 md:grid-cols-12 md:items-end md:gap-8 md:px-8 md:pt-28 md:pb-14">
        <h2
          id="cities-title"
          data-reveal
          className="text-step-head font-semibold tracking-[-0.03em] md:col-span-6"
        >
          {t.title}
        </h2>
        <p data-reveal className="text-step-body md:col-span-5 md:col-start-8">
          {t.description}
        </p>
      </div>

      <ul className="mx-auto flex max-w-360 flex-col gap-1 px-4 md:px-8">
        {shown.map(({ city, count, next }) => (
          <li key={city} data-reveal>
            <Link
              href={cityHref(locale, city)}
              className="group flex min-h-20 flex-col justify-center gap-1 bg-blue-700 px-5 py-4 transition-colors hover:bg-band focus-visible:bg-band focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:grid md:min-h-24 md:grid-cols-12 md:items-center md:gap-8 md:px-7"
            >
              <span className="text-step-lead font-semibold md:col-span-6 md:text-step-head md:tracking-[-0.03em]">
                <bdi>{city}</bdi>
              </span>
              <span className="flex items-center justify-between gap-3 text-step-body tabular-nums md:col-span-6">
                {plural(locale, count, t.count)} ·{" "}
                {interpolate(t.next, { date: formatDayMonth(locale, next) })}
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 shrink-0 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {others.length > 0 && (
        <p className="mx-auto flex max-w-360 flex-wrap items-baseline gap-x-5 gap-y-2 px-4 py-6 text-step-lead md:px-8 md:py-8">
          <span>{t.others}</span>
          {others.map(({ city }) => (
            <Link
              key={city}
              href={cityHref(locale, city)}
              dir="auto"
              className="font-medium underline decoration-2 underline-offset-[6px] hover:decoration-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              {city}
            </Link>
          ))}
        </p>
      )}

      <NearbyMap locale={locale} labels={t.map} />
    </section>
  );
}
