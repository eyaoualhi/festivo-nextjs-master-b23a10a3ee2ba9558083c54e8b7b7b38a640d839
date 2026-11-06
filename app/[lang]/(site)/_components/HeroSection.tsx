import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDayMonth, formatShortDate, formatTime } from "@/lib/format";
import { interpolate, localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventCategory, EventSummary } from "@/types/event";

/** Catégories dont la première photo illustre le haut de page. */
const PICTURE_CATEGORIES: EventCategory[] = ["musique", "sport"];

type HeroSectionProps = {
  events: EventSummary[];
  organizerCount: number;
};

function Photo({ event, className }: { event: EventSummary; className: string }) {
  return (
    <div data-intro="photo" className={`relative overflow-hidden bg-tile ${className}`}>
      <div data-parallax="6" className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
        <Image
          src={event.imageUrl}
          alt={event.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 26vw, 60vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default async function HeroSection({ events, organizerCount }: HeroSectionProps) {
  const { locale, dict } = await getI18n();
  const t = dict.hero;
  const first = events.at(0);
  const last = events.at(-1);
  const cityCount = new Set(events.map((event) => event.city)).size;
  const pictures = PICTURE_CATEGORIES.map((category) =>
    events.find((event) => event.category === category),
  ).filter((event) => event !== undefined);

  const stats = [
    { value: events.length, label: plural(locale, events.length, t.stats.events) },
    { value: cityCount, label: plural(locale, cityCount, t.stats.cities) },
    { value: organizerCount, label: plural(locale, organizerCount, t.stats.organizers) },
  ];

  return (
    <section aria-labelledby="hero-title" className="bg-canvas">
      <div className="mx-auto grid max-w-360 gap-12 px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <h1
            id="hero-title"
            className="text-step-display font-semibold tracking-[-0.04em] text-ink"
          >
            {t.titleLines.map((line, index) => (
              <span
                key={line}
                data-accent={index === 1 || undefined}
                className={`block ${index === 1 ? "text-blue-600 dark:text-blue-400" : ""}`}
              >
                {line.split(" ").map((word, position) => (
                  <Fragment key={position}>
                    {position > 0 && " "}
                    <span className="-mx-[0.15em] -my-[0.4em] inline-block overflow-hidden px-[0.15em] py-[0.4em] align-bottom">
                      <span data-intro="word" className="inline-block">
                        {word}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
          <p data-intro="fade" className="max-w-xl text-step-lead text-ink">
            {t.description}
          </p>
          <div data-intro="fade">
            <Link
              href={localizePath(locale, "/evenements")}
              className="group inline-flex min-h-14 items-center justify-center gap-3 bg-blue-600 px-7 text-step-body font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:translate-y-px"
            >
              {t.action}
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </Link>
          </div>
          <div data-intro="fade" className="flex flex-col gap-3 pt-2">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <dt className="order-2 text-step-small font-medium text-muted">{label}</dt>
                  <dd
                    data-count={value}
                    className="order-1 text-step-head font-semibold tracking-[-0.03em] text-ink tabular-nums"
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            {first && last && (
              <p className="text-step-small text-muted">
                {interpolate(t.period, {
                  from: formatDayMonth(locale, first.startsAt),
                  to: formatDayMonth(locale, last.startsAt),
                })}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-[16rem_12rem] gap-2 md:h-[34rem] md:grid-cols-5 md:grid-rows-2 lg:col-span-5 lg:h-[38rem]">
          {pictures[0] && (
            <Photo event={pictures[0]} className="col-span-2 md:col-span-3 md:row-span-2" />
          )}
          {pictures[1] && <Photo event={pictures[1]} className="md:col-span-2" />}
          {first && (
            <div
              data-intro="photo"
              className="relative flex flex-col justify-between gap-3 bg-blue-600 p-4 text-paper transition-colors focus-within:bg-blue-800 hover:bg-blue-800 md:col-span-2 md:p-5"
            >
              <p className="text-step-small font-medium">{t.next}</p>
              <div className="flex flex-col gap-2">
                <p dir="auto" className="line-clamp-3 text-step-body leading-snug font-semibold">
                  <Link
                    href={localizePath(locale, `/evenements/${first.id}`)}
                    className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:-outline-offset-4 after:focus-visible:outline-paper"
                  >
                    {first.title}
                  </Link>
                </p>
                <p className="text-step-small tabular-nums">
                  {formatShortDate(locale, first.startsAt)} · {formatTime(locale, first.startsAt)}
                  <br />
                  <bdi>{first.city}</bdi>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
