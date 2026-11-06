import { NextResponse } from "next/server";
import { revalidateTag, updateTag } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { EVENTS_TAG } from "@/lib/events";
import Event from "@/models/Event";
import {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  type EventCategory,
  type EventStatus,
} from "@/types/event";

function slugify(text: string): string {
  const base = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "evenement"}-${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    if (session.user.role !== "organisateur" && session.user.role !== "administrateur") {
      return NextResponse.json(
        { error: "Seuls les organisateurs ou administrateurs peuvent créer un événement" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      startsAt,
      endsAt,
      venue,
      address,
      city,
      capacity,
      imageUrl,
      imageAlt,
      status = "publie",
    } = body;

    // Validation des champs obligatoires
    if (!title?.trim()) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "La description est requise" }, { status: 400 });
    }
    if (!category || !EVENT_CATEGORIES.includes(category as EventCategory)) {
      return NextResponse.json({ error: "La catégorie est invalide" }, { status: 400 });
    }
    if (!venue?.trim() || !address?.trim() || !city?.trim()) {
      return NextResponse.json(
        { error: "Les informations de lieu sont requises" },
        { status: 400 },
      );
    }

    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
    }
    if (end < start) {
      return NextResponse.json(
        { error: "La date de fin ne peut pas précéder la date de début" },
        { status: 400 },
      );
    }

    const cap = Number(capacity);
    if (!cap || cap < 1) {
      return NextResponse.json(
        { error: "La capacité doit être d'au moins 1 personne" },
        { status: 400 },
      );
    }

    const eventStatus = EVENT_STATUSES.includes(status as EventStatus) ? status : "publie";
    const slug = slugify(title);

    await connectDB();

    const createdEvent = await Event.create({
      slug,
      title: title.trim(),
      description: description.trim(),
      category,
      startsAt: start,
      endsAt: end,
      venue: venue.trim(),
      address: address.trim(),
      city: city.trim(),
      capacity: cap,
      registrationCount: 0,
      imageUrl: imageUrl?.trim() || "/images/demo/concert-2.jpg",
      imageAlt: imageAlt?.trim() || title.trim(),
      status: eventStatus,
      organizer: session.user.id,
    });

    try {
      revalidateTag(EVENTS_TAG, "default");
      updateTag(EVENTS_TAG);
    } catch {
      // Ignoré si hors contexte cache
    }

    return NextResponse.json(
      { success: true, slug: createdEvent.slug, id: createdEvent._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'événement :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de l'événement" },
      { status: 500 },
    );
  }
}
