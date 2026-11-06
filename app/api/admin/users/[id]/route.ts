import { isValidObjectId } from "mongoose";
import { revalidateTag, updateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { EVENTS_TAG } from "@/lib/events";
import Avatar from "@/models/Avatar";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";
import { USER_ROLES, type UserRole } from "@/types/user";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "administrateur") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role, active } = body ?? {};

    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (role !== undefined) {
      if (!USER_ROLES.includes(role as UserRole)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      user.role = role;
    }

    if (typeof active === "boolean") {
      user.active = active;
    }

    await user.save();
    return NextResponse.json({
      success: true,
      user: { id: user._id.toString(), role: user.role, active: user.active },
    });
  } catch (error) {
    console.error("Error updating user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  if (session.user.id === id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte administrateur." },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Supprimer les inscriptions de l'utilisateur
    await Registration.deleteMany({ user: user._id });

    // Si organisateur : supprimer les événements et leurs inscriptions
    const userEvents = await Event.find({ organizer: user._id }).select("_id");
    if (userEvents.length > 0) {
      const eventIds = userEvents.map((e) => e._id);
      await Registration.deleteMany({ event: { $in: eventIds } });
      await Event.deleteMany({ _id: { $in: eventIds } });
      try {
        revalidateTag(EVENTS_TAG, "default");
      } catch {}
      try {
        updateTag(EVENTS_TAG);
      } catch {}
    }

    // Supprimer l'avatar
    await Avatar.deleteOne({ user: user._id });

    // Supprimer l'utilisateur
    await user.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
