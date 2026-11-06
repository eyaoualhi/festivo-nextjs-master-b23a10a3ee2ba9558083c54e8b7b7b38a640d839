import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowRight, CalendarRange, Ticket, Users } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { requireRole } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";
import ProfileCard from "@/app/[lang]/(site)/espace/_components/ProfileCard";
import SpaceHeader from "@/app/[lang]/(site)/espace/_components/SpaceHeader";
import SpaceSection from "@/app/[lang]/(site)/espace/_components/SpaceSection";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.admin.metaTitle };
}

export default async function AdminDashboardPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const { locale, dict } = await getI18n();
  const user = await requireRole(locale, "administrateur");
  const t = dict.dashboard;

  await connectDB();
  const [usersCount, eventsCount, registrationsCount] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments({ status: "active" }),
  ]);

  const stats = [
    { icon: Users, label: t.admin.stats.users, value: usersCount },
    { icon: CalendarRange, label: t.admin.stats.events, value: eventsCount },
    { icon: Ticket, label: t.admin.stats.registrations, value: registrationsCount },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SpaceHeader locale={locale} user={user} description={t.admin.description} t={t} />

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
          <SpaceSection id="admin-users-title" title={t.admin.usersTitle}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Consultez la liste des utilisateurs, modifiez leurs rôles ou supprimez des comptes.
              </p>
              <ButtonLink
                href={localizePath(locale, "/espace/administrateur/utilisateurs")}
                variant="primary"
                className="shrink-0"
              >
                <Users aria-hidden="true" className="size-4" />
                {t.admin.viewUsers}
                <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </ButtonLink>
            </div>
          </SpaceSection>

          <SpaceSection id="admin-events-title" title={t.admin.eventsTitle}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Consultez tous les événements enregistrés et supprimez ceux qui enfreignent les
                règles.
              </p>
              <ButtonLink
                href={localizePath(locale, "/espace/administrateur/evenements")}
                variant="primary"
                className="shrink-0"
              >
                <CalendarRange aria-hidden="true" className="size-4" />
                {t.admin.viewEvents}
                <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </ButtonLink>
            </div>
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
