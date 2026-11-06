import { isValidObjectId } from "mongoose";
import { revalidateTag, updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { EVENTS_TAG } from "@/lib/events";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "participant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { eventId } = body ?? {};
    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    await connectDB();
    const event = isValidObjectId(eventId)
      ? await Event.findById(eventId)
      : await Event.findOne({ slug: eventId });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "publie") {
      return NextResponse.json({ error: "Event not published" }, { status: 400 });
    }

    if (new Date(event.startsAt).getTime() <= Date.now()) {
      return NextResponse.json({ error: "Event already started or passed" }, { status: 400 });
    }

    if (event.registrationCount >= event.capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    const existing = await Registration.findOne({
      user: session.user.id,
      event: event._id,
      status: "active",
    });

    if (existing) {
      return NextResponse.json({ error: "Already registered" }, { status: 409 });
    }

    const registration = await Registration.create({
      user: session.user.id,
      event: event._id,
      status: "active",
    });

    await Event.findByIdAndUpdate(event._id, { $inc: { registrationCount: 1 } });

    try {
      revalidateTag(EVENTS_TAG, "default");
    } catch {}
    try {
      updateTag(EVENTS_TAG);
    } catch {}

    return NextResponse.json({ id: registration._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Error creating registration", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
