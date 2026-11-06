import "server-only";
import { Types } from "mongoose";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { formatMonthLabel, getMonthKey } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import Event, { type EventDocument } from "@/models/Event";
import User from "@/models/User";
import type {
  EventCategory,
  EventDetail,
  EventFilters,
  EventSummary,
  Organizer,
} from "@/types/event";

export type FilterOption = {
  value: string;
  label: string;
};

/** Étiquette du cache des événements publiés : BF-03 appelle `updateTag(EVENTS_TAG)` (D-33). */
export const EVENTS_TAG = "events";

const ALMOST_FULL_RATIO = 0.15;

type OrganizerRef = {
  _id: Types.ObjectId;
  name: string;
  organizer?: { name: string; bio: string } | null;
};

function toEventDetail(
  event: Omit<EventDocument, "organizer">,
  organizer: OrganizerRef,
): EventDetail {
  return {
    id: event.slug,
    title: event.title,
    category: event.category,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    venue: event.venue,
    address: event.address,
    city: event.city,
    imageUrl: event.imageUrl,
    imageAlt: event.imageAlt,
    capacity: event.capacity,
    spotsLeft: Math.max(0, event.capacity - event.registrationCount),
    description: event.description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    organizer: {
      id: String(organizer._id),
      name: organizer.organizer?.name ?? organizer.name,
      bio: organizer.organizer?.bio ?? "",
    },
  };
}

/**
 * Événements publiés, triés par date, partagés entre les visiteurs pendant quelques minutes.
 * Ne pas appeler directement : passer par `publishedEvents()`, qui exclut la lecture du build.
 */
async function loadPublishedEvents(): Promise<EventDetail[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(EVENTS_TAG);

  await connectDB();
  const events = await Event.find({ status: "publie" })
    .sort({ startsAt: 1 })
    .populate<{ organizer: OrganizerRef | null }>({
      path: "organizer",
      model: User,
      select: "name organizer.name organizer.bio",
    })
    .lean();
  return events.flatMap(({ organizer, ...event }) =>
    organizer ? [toEventDetail(event, organizer)] : [],
  );
}

/** D-33 : lecture à l'exécution seulement ; le build ne se connecte jamais à la base. */
async function publishedEvents(): Promise<EventDetail[]> {
  await connection();
  return loadPublishedEvents();
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function matchesQuery(event: EventDetail, query: string): boolean {
  const haystack = normalize(
    [event.title, event.venue, event.city, event.organizer.name, ...event.description].join(" "),
  );
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export async function getUpcomingEvents(limit?: number): Promise<EventSummary[]> {
  return (await publishedEvents()).slice(0, limit);
}

export async function getAlmostFullEvents(limit?: number): Promise<EventSummary[]> {
  return (await publishedEvents())
    .filter((event) => event.spotsLeft > 0 && event.spotsLeft / event.capacity <= ALMOST_FULL_RATIO)
    .slice(0, limit);
}

export async function searchEvents(filters: EventFilters): Promise<EventSummary[]> {
  const { query, category, city, month } = filters;
  return (await publishedEvents()).filter(
    (event) =>
      (!query || matchesQuery(event, query)) &&
      (!category || event.category === category) &&
      (!city || event.city === city) &&
      (!month || getMonthKey(event.startsAt) === month),
  );
}

export async function getEventById(id: string): Promise<EventDetail | undefined> {
  return (await publishedEvents()).find((event) => event.id === id);
}

/** Événements publiés d'un organisateur, sauf `excludedId` (la fiche affichée). */
export async function getOrganizerEvents(
  organizerId: string,
  excludedId?: string,
): Promise<EventSummary[]> {
  return (await publishedEvents()).filter(
    (event) => event.organizer.id === organizerId && event.id !== excludedId,
  );
}

export async function countOrganizerEvents(organizerId: string): Promise<number> {
  return (await getOrganizerEvents(organizerId)).length;
}

export type OrganizerSummary = {
  organizer: Organizer;
  eventCount: number;
  categories: EventCategory[];
  nextEvent: EventSummary;
};

export async function getOrganizerSummaries(): Promise<OrganizerSummary[]> {
  const summaries = new Map<string, OrganizerSummary>();
  for (const event of await publishedEvents()) {
    const summary = summaries.get(event.organizer.id);
    if (!summary) {
      summaries.set(event.organizer.id, {
        organizer: event.organizer,
        eventCount: 1,
        categories: [event.category],
        nextEvent: event,
      });
      continue;
    }
    summary.eventCount += 1;
    if (!summary.categories.includes(event.category)) summary.categories.push(event.category);
  }
  return [...summaries.values()].sort((a, b) => b.eventCount - a.eventCount);
}

export async function getCityOptions(): Promise<FilterOption[]> {
  const cities = [...new Set((await publishedEvents()).map((event) => event.city))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  return cities.map((city) => ({ value: city, label: city }));
}

export async function getMonthOptions(locale: Locale): Promise<FilterOption[]> {
  const months = new Map<string, string>();
  for (const event of await publishedEvents()) {
    months.set(getMonthKey(event.startsAt), formatMonthLabel(locale, event.startsAt));
  }
  return [...months].map(([value, label]) => ({ value, label }));
}

export type OrganizerStats = {
  events: number;
  published: number;
  registrations: number;
};

/** Tableau de bord organisateur : tous ses événements, quel que soit leur statut (jamais en cache). */
export async function getOrganizerStats(organizerId: string): Promise<OrganizerStats> {
  await connectDB();
  const [stats] = await Event.aggregate<OrganizerStats>([
    { $match: { organizer: new Types.ObjectId(organizerId) } },
    {
      $group: {
        _id: null,
        events: { $sum: 1 },
        published: { $sum: { $cond: [{ $eq: ["$status", "publie"] }, 1, 0] } },
        registrations: { $sum: "$registrationCount" },
      },
    },
    { $project: { _id: 0, events: 1, published: 1, registrations: 1 } },
  ]);
  return stats ?? { events: 0, published: 0, registrations: 0 };
}
