import Form from "next/form";
import Link from "next/link";
import { CalendarDays, MapPin, Search, X } from "lucide-react";
import type { FilterOption } from "@/lib/events";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { buttonClasses } from "./buttonClasses";

type EventsFilterFormProps = {
  query?: string;
  category?: string;
  city?: string;
  month?: string;
  cities: FilterOption[];
  months: FilterOption[];
};

const fieldClasses =
  "min-h-12 w-full rounded-xl border border-line bg-card ps-10 pe-3 text-sm text-ink transition outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

const iconClasses =
  "pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted";

export async function EventsFilterForm({
  query,
  category,
  city,
  month,
  cities,
  months,
}: EventsFilterFormProps) {
  const { locale, dict } = await getI18n();
  const t = dict.events;
  const hasFilters = Boolean(query || category || city || month);

  return (
    <Form
      action={localizePath(locale, "/evenements")}
      role="search"
      className="grid gap-3 rounded-3xl border border-line bg-card p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] md:p-4"
    >
      {category && <input type="hidden" name="categorie" value={category} />}
      <div className="relative">
        <label htmlFor="events-search" className="sr-only">
          {t.keywordLabel}
        </label>
        <Search aria-hidden="true" className={iconClasses} />
        <input
          id="events-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={t.keywordPlaceholder}
          className={`${fieldClasses} placeholder:text-muted`}
        />
      </div>
      <div className="relative">
        <label htmlFor="events-city" className="sr-only">
          {t.cityLabel}
        </label>
        <MapPin aria-hidden="true" className={iconClasses} />
        <select id="events-city" name="ville" defaultValue={city ?? ""} className={fieldClasses}>
          <option value="">{t.allCities}</option>
          {cities.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="relative">
        <label htmlFor="events-month" className="sr-only">
          {t.dateLabel}
        </label>
        <CalendarDays aria-hidden="true" className={iconClasses} />
        <select id="events-month" name="mois" defaultValue={month ?? ""} className={fieldClasses}>
          <option value="">{t.allDates}</option>
          {months.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className={buttonClasses("cta", "flex-1 md:flex-none")}>
          <Search aria-hidden="true" className="size-4" />
          {t.search}
        </button>
        {hasFilters && (
          <Link
            href={localizePath(locale, "/evenements")}
            aria-label={t.clear}
            title={t.clear}
            className={buttonClasses("secondary", "px-3.5")}
          >
            <X aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
    </Form>
  );
}
