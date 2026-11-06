import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import Event, { type EventDocument } from "@/models/Event";
import User from "@/models/User";
import SpaceSection from "@/app/[lang]/(site)/espace/_components/SpaceSection";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";
import EventRowActions from "./_components/EventRowActions";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.admin.events.metaTitle };
}

export default async function AdminEventsPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <AdminEventsContent />
    </Suspense>
  );
}

type PopulatedOrganizer = {
  _id: unknown;
  name: string;
  email: string;
};

async function AdminEventsContent() {
  const { locale, dict } = await getI18n();
  await requireRole(locale, "administrateur");
  const t = dict.dashboard.admin;

  await connectDB();
  const events = await Event.find()
    .sort({ startsAt: -1 })
    .populate<{ organizer: PopulatedOrganizer | null }>({
      path: "organizer",
      model: User,
      select: "name email",
    })
    .lean<
      (Omit<EventDocument, "organizer"> & {
        _id: unknown;
        organizer: PopulatedOrganizer | null;
      })[]
    >();

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Retour">
        <Link
          href={localizePath(locale, "/espace/administrateur")}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {t.metaTitle}
        </Link>
      </nav>

      <SpaceSection id="admin-events-list" title={t.events.metaTitle}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs font-semibold tracking-wider text-muted uppercase">
              <tr>
                <th scope="col" className="pr-4 pb-3">
                  {t.events.title}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.events.organizer}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  Date
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.events.status}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.events.registrations}
                </th>
                <th scope="col" className="pb-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {events.map((ev) => {
                const evId = String(ev._id);
                const isPublished = ev.status === "publie";
                const isCancelled = ev.status === "annule";

                return (
                  <tr key={evId} className="transition-colors hover:bg-surface/50">
                    <td className="py-3.5 pr-4 font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                          <CalendarDays aria-hidden="true" className="size-4" />
                        </span>
                        <Link
                          href={localizePath(locale, `/evenements/${ev.slug}`)}
                          className="line-clamp-1 rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          {ev.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      {ev.organizer?.name ?? "Inconnu"}
                      {ev.organizer?.email && (
                        <span className="block text-xs text-muted/70">{ev.organizer.email}</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      {formatShortDate(locale, ev.startsAt)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isPublished
                            ? "bg-success/10 text-success"
                            : isCancelled
                              ? "bg-danger/10 text-danger"
                              : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      <span className="font-semibold text-ink">{ev.registrationCount ?? 0}</span> /{" "}
                      {ev.capacity}
                    </td>
                    <td className="py-3.5 text-right">
                      <EventRowActions
                        eventId={evId}
                        confirmText={t.events.deleteConfirm}
                        deletedText={t.events.deleted}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SpaceSection>
    </div>
  );
}
