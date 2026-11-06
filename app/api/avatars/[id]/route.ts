import { isValidObjectId } from "mongoose";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Avatar from "@/models/Avatar";

/**
 * Photo de profil (D-32). L'adresse versionnée (`?v=`) change à chaque nouvelle photo : le
 * navigateur peut donc la garder en cache sans jamais la revérifier.
 */
export async function GET(request: NextRequest, { params }: RouteContext<"/api/avatars/[id]">) {
  const { id } = await params;
  if (!isValidObjectId(id)) return new Response(null, { status: 404 });

  await connectDB();
  const avatar = await Avatar.findOne({ user: id });
  if (!avatar) return new Response(null, { status: 404 });

  const versioned = request.nextUrl.searchParams.has("v");
  return new Response(new Uint8Array(avatar.data), {
    headers: {
      "Content-Type": avatar.contentType,
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
