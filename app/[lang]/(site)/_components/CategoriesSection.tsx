import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryStyles } from "@/components/ui/categoryStyles";
import { categories } from "@/lib/categories";
import { formatDayMonth } from "@/lib/format";
import { interpolate, localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";

type CategoriesSectionProps = {
  events: EventSummary[];
};

export default async function CategoriesSection({ events }: CategoriesSectionProps) {
  const { locale, dict } = await getI18n();
  const t = dict.categoriesSection;

  const tiles = categories.map((category) => {
    const matching = events.filter((event) => event.category === category);
    const next = matching.at(0);
    return {
      category,
      count: next ? plural(locale, matching.length, t.count) : t.none,
      from: next ? interpolate(t.from, { date: formatDayMonth(locale, next.startsAt) }) : null,
    };
  });

  return (
    <section id="categories" aria-labelledby="categories-title" className="bg-band text-paper">
      <div className="mx-auto max-w-360 px-4 py-20 md:px-8 md:py-28">
        <h2
          id="categories-title"
          data-reveal
          className="text-step-head font-semibold tracking-[-0.03em] text-balance"
        >
          {t.title}
        </h2>
        <nav aria-label={t.navLabel} className="mt-10 md:mt-14">
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {tiles.map(({ category, count, from }) => {
              const Icon = categoryStyles[category].icon;
              return (
                <li key={category} data-reveal>
                  <Link
                    href={localizePath(locale, `/evenements?categorie=${category}`)}
                    className="group flex h-full min-h-40 flex-col justify-between gap-8 bg-band-tile p-5 transition-colors hover:bg-blue-600 focus-visible:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper md:min-h-48 md:p-7"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <Icon
                        aria-hidden="true"
                        className="size-6 text-blue-400 transition-colors group-hover:text-paper group-focus-visible:text-paper"
                      />
                      <ArrowRight
                        aria-hidden="true"
                        className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                      />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-step-lead font-semibold">{t.names[category]}</span>
                      <span className="text-step-small tabular-nums opacity-80 group-hover:opacity-100">
                        {count}
                        {from && ` · ${from}`}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
