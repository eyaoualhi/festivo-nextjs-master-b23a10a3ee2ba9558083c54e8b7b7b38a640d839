"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Mail, Search, Ticket, UserCheck, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/config";
import type { OrganizerEventTracking } from "@/lib/registrations";

type EventParticipantsTrackingProps = {
  trackingList: OrganizerEventTracking[];
  locale: Locale;
};

export default function EventParticipantsTracking({
  trackingList,
  locale,
}: EventParticipantsTrackingProps) {
  // Store which event cards are expanded (by event slug)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>(() => {
    // Expand the first event by default if it has participants
    const initial: Record<string, boolean> = {};
    if (trackingList.length > 0) {
      initial[trackingList[0].event.id] = true;
    }
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const filteredList = trackingList.map((item) => {
    if (!searchQuery.trim()) return item;
    const q = searchQuery.toLowerCase().trim();
    const matchingParticipants = item.participants.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    );
    return {
      ...item,
      participants: matchingParticipants,
    };
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Search filter for participants */}
      {trackingList.some((t) => t.participants.length > 0) && (
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un participant par nom ou email…"
            className="w-full rounded-xl border border-line bg-card py-2.5 ps-9 pe-4 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      <ul className="flex flex-col gap-4">
        {filteredList.map(({ event, participants }) => {
          const isExpanded = !!expandedEvents[event.id];
          const hasParticipants = participants.length > 0;
          const startsAtDate = new Date(event.startsAt);
          const formattedDate = startsAtDate.toLocaleDateString(
            locale === "ar" ? "ar-TN" : locale === "en" ? "en-US" : "fr-FR",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          );

          return (
            <li
              key={event.id}
              className="overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-md"
            >
              {/* Event Header Banner */}
              <div
                onClick={() => toggleEvent(event.id)}
                className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-4 md:p-5"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {event.category}
                    </span>
                    <span className="text-xs text-muted">
                      {formattedDate} • {event.city}
                    </span>
                  </div>
                  <h3 className="truncate font-display text-base font-bold text-ink md:text-lg">
                    {event.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink">
                    <Users className="size-3.5 text-primary" />
                    <span>
                      {participants.length} / {event.capacity} inscrits
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? "Masquer les participants" : "Voir les participants"}
                    className="flex size-8 items-center justify-center rounded-lg border border-line bg-surface text-muted transition hover:text-ink"
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Participants List */}
              {isExpanded && (
                <div className="border-t border-line bg-surface/50 p-4 md:p-5">
                  <div className="flex items-center justify-between pb-3 text-xs font-bold uppercase tracking-wider text-muted">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="size-4 text-primary" />
                      Liste des participants ({participants.length})
                    </span>
                    <Link
                      href={localizePath(locale, `/evenements/${event.id}`)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Voir la fiche événement →
                    </Link>
                  </div>

                  {hasParticipants ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-sm">
                        <thead>
                          <tr className="border-b border-line text-xs font-semibold text-muted">
                            <th className="py-2.5 text-start font-medium">Participant</th>
                            <th className="py-2.5 text-start font-medium hidden sm:table-cell">
                              Email
                            </th>
                            <th className="py-2.5 text-start font-medium hidden md:table-cell">
                              Date d&apos;inscription
                            </th>
                            <th className="py-2.5 text-end font-medium">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/60">
                          {participants.map((participant) => {
                            const regDate = new Date(participant.registeredAt);
                            const regDateStr = regDate.toLocaleDateString(
                              locale === "ar" ? "ar-TN" : locale === "en" ? "en-US" : "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            );
                            const initial = participant.name
                              ? participant.name.charAt(0).toUpperCase()
                              : "P";

                            return (
                              <tr
                                key={participant.id}
                                className="transition-colors hover:bg-card/50"
                              >
                                <td className="py-3 pe-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                      {initial}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-ink">
                                        {participant.name}
                                      </span>
                                      <span className="text-xs text-muted sm:hidden flex items-center gap-1">
                                        <Mail className="size-3" />
                                        {participant.email}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 pe-4 text-muted hidden sm:table-cell">
                                  <span className="flex items-center gap-1.5">
                                    <Mail className="size-3.5 text-muted" />
                                    {participant.email}
                                  </span>
                                </td>
                                <td className="py-3 pe-4 text-xs text-muted hidden md:table-cell">
                                  {regDateStr}
                                </td>
                                <td className="py-3 text-end">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Inscrit
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Ticket className="size-8 text-muted/50 mb-2" />
                      <p className="text-sm font-semibold text-ink">
                        Aucun participant inscrit pour cet événement
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Dès qu&apos;un participant confirme sa présence, il apparaîtra ici.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
