import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import CategoryPill from "@/components/ui/CategoryPill";
import EventCard from "@/components/ui/EventCard";
import EventRail, { EventRailItem } from "@/components/ui/EventRail";
import { countOrganizerEvents, getEventById, getOrganizerEvents } from "@/lib/events";
import { formatLongDate, formatTime } from "@/lib/format";
import { interpolate, localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import EventDetailSkeleton from "./_components/EventDetailSkeleton";
import OrganizerCard from "./_components/OrganizerCard";
import RegistrationBar from "./_components/RegistrationBar";
import RegistrationCard from "./_components/RegistrationCard";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/evenements/[id]">): Promise<Metadata> {
  const [{ id }, dict] = await Promise.all([params, getDictionary()]);
  const event = await getEventById(id);
  if (!event) return { title: dict.event.notFoundMeta };
  return { title: event.title, description: event.description[0] };
}

type EventParams = PageProps<"/[lang]/evenements/[id]">["params"];

export default async function EventPage({ params }: PageProps<"/[lang]/evenements/[id]">) {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<EventDetailSkeleton label={dict.event.loading} />}>
      <EventDetail params={params} />
    </Suspense>
  );
}

async function EventDetail({ params }: { params: EventParams }) {
  const [{ id }, { locale, dict }] = await Promise.all([params, getI18n()]);
  const event = await getEventById(id);
  if (!event) notFound();

  const t = dict.event;
  const [otherEvents, organizerEventCount] = await Promise.all([
    getOrganizerEvents(event.organizer.id, event.id),
    countOrganizerEvents(event.organizer.id),
  ]);

  const facts = [
    { icon: CalendarDays, label: formatLongDate(locale, event.startsAt), capitalize: true },
    {
      icon: Clock,
      label: `${formatTime(locale, event.startsAt)} – ${formatTime(locale, event.endsAt)}`,
      isolate: true,
    },
    { icon: MapPin, label: `${event.venue}, ${event.city}` },
  ];
  const otherEventsTitle = interpolate(t.otherEvents, { name: event.organizer.name });

  return (
    <>
      <div className="mx-auto flex w-full max-w-360 flex-col gap-12 px-4 pt-6 pb-16 md:px-10 md:pt-8 lg:pb-24">
        <div className="flex flex-col gap-4">
          <nav aria-label={t.breadcrumb}>
            <Link
              href={localizePath(locale, "/evenements")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              {t.back}
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
            <article className="flex min-w-0 flex-col gap-10">
              <div className="relative aspect-video overflow-hidden rounded-3xl bg-surface shadow-lg shadow-ink/10 xl:aspect-[2/1]">
                <Image
                  src={event.imageUrl}
                  alt={event.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1440px) 900px, (min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>

              <header className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryPill category={event.category} />
                  <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                    {dict.common.free}
                  </span>
                </div>
                <h1
                  dir="auto"
                  className="max-w-4xl font-display text-3xl leading-tight font-extrabold tracking-tight text-ink md:text-5xl"
                >
                  {event.title}
                </h1>
                <ul className="flex flex-col gap-2.5 text-sm text-ink md:text-base lg:hidden">
                  {facts.map(({ icon: Icon, label, capitalize, isolate }) => (
                    <li key={label} className="flex items-center gap-2.5">
                      <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
                      <span
                        dir={isolate ? "ltr" : "auto"}
                        className={capitalize ? "first-letter:uppercase" : undefined}
                      >
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </header>

              <section aria-labelledby="about-title" className="flex max-w-3xl flex-col gap-4">
                <h2
                  id="about-title"
                  className="font-display text-xl font-bold text-ink md:text-2xl"
                >
                  {t.about}
                </h2>
                <div lang="fr" className="flex flex-col gap-4 text-base leading-relaxed text-muted">
                  {event.description.map((paragraph) => (
                    <p key={paragraph} dir="auto">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              <section aria-labelledby="venue-title" className="flex max-w-3xl flex-col gap-4">
                <h2
                  id="venue-title"
                  className="font-display text-xl font-bold text-ink md:text-2xl"
                >
                  {t.venue}
                </h2>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  <address dir="auto" className="flex flex-col gap-0.5 not-italic">
                    <span className="font-semibold text-ink">{event.venue}</span>
                    <span className="text-sm text-muted">{event.address}</span>
                  </address>
                </div>
              </section>

              <section aria-labelledby="organizer-title" className="flex max-w-3xl flex-col gap-4">
                <h2
                  id="organizer-title"
                  className="font-display text-xl font-bold text-ink md:text-2xl"
                >
                  {t.organizer}
                </h2>
                <OrganizerCard organizer={event.organizer} eventCount={organizerEventCount} />
              </section>
            </article>

            <aside aria-label={t.registration}>
              <RegistrationCard event={event} className="lg:sticky lg:top-24" />
            </aside>
          </div>
        </div>

        {otherEvents.length > 0 && (
          <EventRail
            id="organizer-events-title"
            title={otherEventsTitle}
            description={t.otherEventsDescription}
            previousLabel={interpolate(dict.rail.previous, { title: otherEventsTitle })}
            nextLabel={interpolate(dict.rail.next, { title: otherEventsTitle })}
          >
            {otherEvents.map((other) => (
              <EventRailItem key={other.id}>
                <EventCard event={other} />
              </EventRailItem>
            ))}
          </EventRail>
        )}
      </div>
      <RegistrationBar spotsLeft={event.spotsLeft} capacity={event.capacity} eventSlug={event.id} />
    </>
  );
}
