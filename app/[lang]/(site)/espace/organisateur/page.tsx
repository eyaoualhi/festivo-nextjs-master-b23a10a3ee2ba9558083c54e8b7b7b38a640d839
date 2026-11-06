import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarPlus, CalendarRange, ClipboardList, Eye, UsersRound } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import EventCard from "@/components/ui/EventCard";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { requireRole } from "@/lib/dal";
import { getOrganizerEvents, getOrganizerStats } from "@/lib/events";
import { formatNumber } from "@/lib/format";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import EmptyState from "@/app/[lang]/(site)/espace/_components/EmptyState";
import ProfileCard from "@/app/[lang]/(site)/espace/_components/ProfileCard";
import SpaceHeader from "@/app/[lang]/(site)/espace/_components/SpaceHeader";
import SpaceSection from "@/app/[lang]/(site)/espace/_components/SpaceSection";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.organizer.metaTitle };
}

export default async function OrganizerDashboardPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <OrganizerDashboard />
    </Suspense>
  );
}

async function OrganizerDashboard() {
  const { locale, dict } = await getI18n();
  const user = await requireRole(locale, "organisateur");
  const t = dict.dashboard;
  const [counts, events] = await Promise.all([
    getOrganizerStats(user.id),
    getOrganizerEvents(user.id),
  ]);
  const stats = [
    { icon: CalendarRange, label: t.organizer.stats.events, value: counts.events },
    { icon: Eye, label: t.organizer.stats.published, value: counts.published },
    { icon: UsersRound, label: t.organizer.stats.registrations, value: counts.registrations },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SpaceHeader locale={locale} user={user} description={t.organizer.description} t={t} />

      <dl className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-card p-4 md:p-5"
          >
            <dt className="flex items-center gap-2 text-xs font-semibold text-muted md:text-sm">
              <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
              {label}
            </dt>
            <dd className="font-display text-2xl font-extrabold text-ink md:text-3xl">
              {formatNumber(locale, value)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <SpaceSection
            id="events-title"
            title={t.organizer.eventsTitle}
            action={
              <ButtonLink
                href={localizePath(locale, "/espace/organisateur/creer")}
                className={buttonClasses("primary")}
              >
                <CalendarPlus aria-hidden="true" className="size-4" />
                {t.organizer.create}
              </ButtonLink>
            }
          >
            {events.length > 0 ? (
              <div className="flex flex-col gap-4">
                <ul className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
                  {events.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState icon={CalendarRange} title={t.organizer.eventsEmpty}>
                <ButtonLink
                  href={localizePath(locale, "/espace/organisateur/creer")}
                  className="mt-2"
                >
                  <CalendarPlus aria-hidden="true" className="size-4" />
                  {t.organizer.create}
                </ButtonLink>
              </EmptyState>
            )}
          </SpaceSection>
          <SpaceSection id="tracking-title" title={t.organizer.registrationsTitle}>
            <EmptyState icon={ClipboardList} title={t.organizer.registrationsEmpty} />
          </SpaceSection>
        </div>
        <ProfileCard
          locale={locale}
          user={user}
          t={t.profileCard}
          organizerTypes={dict.auth.organizer.types}
        />
      </div>
    </div>
  );
}
