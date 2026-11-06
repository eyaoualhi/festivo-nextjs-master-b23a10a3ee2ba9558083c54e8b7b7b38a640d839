import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarSearch, Ticket } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { requireRole } from "@/lib/dal";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import { getParticipantRegistrations } from "@/lib/registrations";
import EmptyState from "@/app/[lang]/(site)/espace/_components/EmptyState";
import ProfileCard from "@/app/[lang]/(site)/espace/_components/ProfileCard";
import SpaceHeader from "@/app/[lang]/(site)/espace/_components/SpaceHeader";
import SpaceSection from "@/app/[lang]/(site)/espace/_components/SpaceSection";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";
import RegistrationList from "./_components/RegistrationList";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.participant.metaTitle };
}

export default async function ParticipantDashboardPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <ParticipantDashboard />
    </Suspense>
  );
}

async function ParticipantDashboard() {
  const { locale, dict } = await getI18n();
  const user = await requireRole(locale, "participant");
  const t = dict.dashboard;
  const registrations = await getParticipantRegistrations(user.id);

  return (
    <div className="flex flex-col gap-8">
      <SpaceHeader locale={locale} user={user} description={t.participant.description} t={t} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <SpaceSection id="registrations-title" title={t.participant.registrationsTitle}>
          {registrations.length > 0 ? (
            <RegistrationList
              registrations={registrations}
              locale={locale}
              t={t.registrationCard}
              eventT={dict.event}
            />
          ) : (
            <EmptyState icon={Ticket} title={t.participant.registrationsEmpty}>
              <p className="max-w-sm text-sm text-muted">{t.participant.registrationsHint}</p>
              <ButtonLink href={localizePath(locale, "/evenements")} className="mt-2">
                <CalendarSearch aria-hidden="true" className="size-4" />
                {t.participant.explore}
              </ButtonLink>
            </EmptyState>
          )}
        </SpaceSection>
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
