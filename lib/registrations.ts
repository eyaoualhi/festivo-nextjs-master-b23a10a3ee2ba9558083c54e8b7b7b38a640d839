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
