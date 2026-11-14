import "server-only";
import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/db";
import Event, { type EventDocument } from "@/models/Event";
import Registration from "@/models/Registration";
import type { EventSummary } from "@/types/event";

export type RegistrationWithEvent = {
  id: string;
  event: EventSummary;
  registeredAt: Date;
  status: "active" | "annulee";
  isUpcoming: boolean;
};

/** Vérifie si l'utilisateur a une inscription active pour un événement. */
export async function getUserRegistration(
  userId: string,
  eventSlug: string,
): Promise<{ id: string } | null> {
  if (!userId || !eventSlug) return null;
  await connectDB();

  const event = isValidObjectId(eventSlug)
    ? await Event.findById(eventSlug).select("_id")
    : await Event.findOne({ slug: eventSlug }).select("_id");

  if (!event) return null;

  const registration = await Registration.findOne({
    user: new Types.ObjectId(userId),
    event: event._id,
    status: "active",
  }).select("_id");

  return registration ? { id: registration._id.toString() } : null;
}

/** Récupère toutes les inscriptions actives d'un participant avec les détails des événements. */
export async function getParticipantRegistrations(
  userId: string,
): Promise<RegistrationWithEvent[]> {
  if (!userId) return [];
  await connectDB();

  const registrations = await Registration.find({
    user: new Types.ObjectId(userId),
    status: "active",
  })
    .sort({ createdAt: -1 })
    .populate<{ event: EventDocument & { _id: Types.ObjectId } }>("event")
    .lean();

  return registrations
    .filter((reg) => reg.event && reg.event.title)
    .map((reg) => {
      const ev = reg.event;
      return {
        id: String(reg._id),
        registeredAt: reg.createdAt,
        status: reg.status as "active" | "annulee",
        isUpcoming: new Date(ev.startsAt).getTime() > Date.now(),
        event: {
          id: ev.slug,
          title: ev.title,
          category: ev.category,
          startsAt: ev.startsAt,
          endsAt: ev.endsAt,
          venue: ev.venue,
          city: ev.city,
          imageUrl: ev.imageUrl,
          imageAlt: ev.imageAlt,
          capacity: ev.capacity,
          spotsLeft: Math.max(0, ev.capacity - (ev.registrationCount ?? 0)),
        },
      };
    });
}

export type EventParticipantInfo = {
  id: string; // registration id
  userId: string;
  name: string;
  email: string;
  registeredAt: Date;
  status: "active" | "annulee";
};

export type OrganizerEventTracking = {
  event: {
    id: string; // slug
    mongoId: string;
    title: string;
    category: string;
    startsAt: Date;
    endsAt: Date;
    venue: string;
    city: string;
    capacity: number;
    registrationCount: number;
    status: string;
  };
  participants: EventParticipantInfo[];
};

/** Récupère les participants actifs inscrits à un événement particulier (par slug ou ObjectId). */
export async function getEventParticipants(
  eventSlugOrId: string,
): Promise<{ eventTitle: string; eventCapacity: number; participants: EventParticipantInfo[] } | null> {
  if (!eventSlugOrId) return null;
  await connectDB();

  const event = isValidObjectId(eventSlugOrId)
    ? await Event.findById(eventSlugOrId).select("_id title capacity slug status")
    : await Event.findOne({ slug: eventSlugOrId }).select("_id title capacity slug status");

  if (!event) return null;

  const registrations = await Registration.find({
    event: event._id,
    status: "active",
  })
    .sort({ createdAt: -1 })
    .populate<{ user: { _id: Types.ObjectId; name: string; email: string } }>("user", "name email")
    .lean();

  return {
    eventTitle: event.title,
    eventCapacity: event.capacity,
    participants: registrations
      .filter((r) => r.user && r.user.name)
      .map((r) => ({
        id: String(r._id),
        userId: String(r.user._id),
        name: r.user.name,
        email: r.user.email,
        registeredAt: r.createdAt,
        status: r.status as "active" | "annulee",
      })),
  };
}

/** Récupère tous les événements d'un organisateur avec la liste détaillée de leurs participants. */
export async function getOrganizerEventsWithParticipants(
  organizerId: string,
): Promise<OrganizerEventTracking[]> {
  if (!organizerId) return [];
  await connectDB();

  const events = await Event.find({ organizer: new Types.ObjectId(organizerId) })
    .sort({ startsAt: -1 })
    .lean();

  if (events.length === 0) return [];

  const eventIds = events.map((e) => e._id);

  const registrations = await Registration.find({
    event: { $in: eventIds },
    status: "active",
  })
    .sort({ createdAt: -1 })
    .populate<{ user: { _id: Types.ObjectId; name: string; email: string } }>("user", "name email")
    .lean();

  return events.map((ev) => {
    const eventRegs = registrations.filter(
      (r) => String(r.event) === String(ev._id),
    );

    return {
      event: {
        id: ev.slug,
        mongoId: String(ev._id),
        title: ev.title,
        category: ev.category,
        startsAt: ev.startsAt,
        endsAt: ev.endsAt,
        venue: ev.venue,
        city: ev.city,
        capacity: ev.capacity,
        registrationCount: ev.registrationCount ?? eventRegs.length,
        status: ev.status,
      },
      participants: eventRegs
        .filter((r) => r.user && r.user.name)
        .map((r) => ({
          id: String(r._id),
          userId: String(r.user._id),
          name: r.user.name,
          email: r.user.email,
          registeredAt: r.createdAt,
          status: r.status as "active" | "annulee",
        })),
    };
  });
}
