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
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid registration id" }, { status: 400 });
  }

  try {
    await connectDB();
    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const isOwner = registration.user.toString() === session.user.id;
    const isAdmin = session.user.role === "administrateur";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (registration.status === "active") {
      registration.status = "annulee";
      await registration.save();

      await Event.findByIdAndUpdate(registration.event, {
        $inc: { registrationCount: -1 },
      });

      try {
        revalidateTag(EVENTS_TAG, "default");
      } catch {}
      try {
        updateTag(EVENTS_TAG);
      } catch {}
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling registration", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
