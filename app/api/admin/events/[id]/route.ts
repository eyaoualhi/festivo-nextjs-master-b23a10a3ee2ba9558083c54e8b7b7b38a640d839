import { isValidObjectId } from "mongoose";
import { revalidateTag, updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { EVENTS_TAG } from "@/lib/events";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "administrateur") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }

  try {
    await connectDB();
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Supprimer les inscriptions liées à cet événement
    await Registration.deleteMany({ event: event._id });

    // Supprimer l'événement
    await event.deleteOne();

    try {
      revalidateTag(EVENTS_TAG, "default");
    } catch {}
    try {
      updateTag(EVENTS_TAG);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
