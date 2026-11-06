import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import BorderBeam from "@/components/ui/BorderBeam";
import CategoryChips from "@/components/ui/CategoryChips";
import EventCard from "@/components/ui/EventCard";
import { EventsFilterForm } from "@/components/ui/SearchForm";
import TextReveal from "@/components/ui/TextReveal";
import { isEventCategory } from "@/lib/categories";
import { getCityOptions, getMonthOptions, searchEvents } from "@/lib/events";
import { localizePath, plural } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import EventGridSkeleton from "./_components/EventGridSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.events.metaTitle, description: dict.events.metaDescription };
}

type SearchParams = Awaited<PageProps<"/[lang]/evenements">["searchParams"]>;

function readParam(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  const text = (Array.isArray(value) ? value[0] : value)?.trim();
  return text || undefined;
}

async function EventResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [{ locale, dict }, params] = await Promise.all([getI18n(), searchParams]);
  const t = dict.events;
  const query = readParam(params, "q");
  const rawCategory = readParam(params, "categorie");
  const category = rawCategory && isEventCategory(rawCategory) ? rawCategory : undefined;
  const city = readParam(params, "ville");
  const month = readParam(params, "mois");

  const [events, cities, months] = await Promise.all([
    searchEvents({ query, category, city, month }),
    getCityOptions(),
    getMonthOptions(locale),
  ]);
  const [beforeQuery, afterQuery = ""] = t.forQuery.split("{query}");

  return (
    <div className="flex flex-col gap-6">
      <div className="relative rounded-3xl">
        <EventsFilterForm
          query={query}
          category={category}
          city={city}
          month={month}
          cities={cities}
          months={months}
        />
        <BorderBeam size={160} duration={14} />
      </div>
      <CategoryChips
        active={category ?? "tous"}
        params={{ q: query, ville: city, mois: month }}
        label={t.filterByCategory}
      />
      <p aria-live="polite" className="text-sm font-medium text-muted">
        {events.length === 0 ? t.noResults : plural(locale, events.length, t.results)}
        {query && (
          <>
            {" "}
            {beforeQuery}
            <span className="font-semibold text-ink">{query}</span>
            {afterQuery}
          </>
        )}
      </p>
      {events.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {events.map((event, index) => (
            <li key={event.id}>
              <EventCard event={event} priority={index < 6} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-card text-muted shadow-xs">
            <SearchX aria-hidden="true" className="size-7" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-bold text-ink">{t.emptyTitle}</p>
            <p className="max-w-sm text-sm text-muted">{t.emptyDescription}</p>
          </div>
          <Link
            href={localizePath(locale, "/evenements")}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {t.seeAll}
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps<"/[lang]/evenements">) {
  const dict = await getDictionary();
  const t = dict.events;

  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-8 px-4 pt-8 pb-16 md:px-10 md:pt-12 md:pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          <TextReveal text={t.title} />
        </h1>
        <p className="max-w-2xl text-base text-muted md:text-lg">{t.description}</p>
      </header>
      <Suspense fallback={<EventGridSkeleton label={t.loading} />}>
        <EventResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
