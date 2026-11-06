import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";
import EventTabs, { type EventTab } from "./EventTabs";
import PosterTile from "./PosterTile";

const EVENTS_PER_TAB = 12;

type EventsShowcaseProps = {
  upcoming: EventSummary[];
  almostFull: EventSummary[];
  music: EventSummary[];
};

function PosterGrid({ events, eager }: { events: EventSummary[]; eager: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-3 md:gap-y-7 lg:grid-cols-4">
      {events.slice(0, EVENTS_PER_TAB).map((event, index) => (
        <PosterTile
          key={event.id}
          event={event}
          index={index}
          priority={eager && index < 4}
          reveal={eager}
        />
      ))}
    </div>
  );
}

export default async function EventsShowcase({ upcoming, almostFull, music }: EventsShowcaseProps) {
  const { locale, dict } = await getI18n();
  const t = dict.showcase;

  const groups = [
    { key: "upcoming", events: upcoming, texts: t.tabs.upcoming, href: "/evenements" },
    { key: "almostFull", events: almostFull, texts: t.tabs.almostFull, href: "/evenements" },
    {
      key: "music",
      events: music,
      texts: t.tabs.music,
      href: "/evenements?categorie=musique",
    },
  ].filter(({ events }) => events.length > 0);

  const tabs: EventTab[] = groups.map(({ key, events, texts, href }, index) => ({
    key,
    label: texts.label,
    description: texts.description,
    href: localizePath(locale, href),
    panel: <PosterGrid events={events} eager={index === 0} />,
  }));

  return (
    <section
      id="evenements"
      aria-labelledby="showcase-title"
      className="mx-auto max-w-360 bg-canvas px-4 py-20 md:px-8 md:py-28"
    >
      <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
        <h2
          id="showcase-title"
          data-reveal
          className="text-step-head font-semibold tracking-[-0.03em] text-ink md:col-span-6"
        >
          {t.title}
        </h2>
        <p data-reveal className="text-step-body text-muted md:col-span-5 md:col-start-8">
          {t.description}
        </p>
      </div>
      <div className="mt-10 md:mt-14">
        {tabs.length > 0 ? (
          <EventTabs tabs={tabs} listLabel={t.tabsLabel} seeAllLabel={t.seeAll} />
        ) : (
          <p className="text-step-body text-muted">{dict.events.noResults}</p>
        )}
      </div>
    </section>
  );
}
