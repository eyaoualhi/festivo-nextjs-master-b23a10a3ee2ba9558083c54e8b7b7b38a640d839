import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { localizePath, type Locale } from "@/lib/i18n/config";
import User, { type UserDocument } from "@/models/User";
import type { AccountUser, UserRole } from "@/types/user";

/** Tableau de bord de chaque rôle (BF-01, BF-06). */
export function dashboardPath(locale: Locale, role: UserRole): string {
  if (role === "administrateur") {
    return localizePath(locale, "/espace/administrateur");
  }
  return localizePath(
    locale,
    role === "organisateur" ? "/espace/organisateur" : "/espace/participant",
  );
}

function toAccountUser(user: UserDocument & { _id: unknown }): AccountUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    ...(typeof user.active === "boolean" ? { active: user.active } : {}),
    ...(user.avatarVersion ? { avatarVersion: user.avatarVersion } : {}),
    ...(user.organizer
      ? {
          organizer: {
            name: user.organizer.name,
            type: user.organizer.type,
            phone: user.organizer.phone,
            city: user.organizer.city,
            bio: user.organizer.bio,
            ...(user.organizer.website ? { website: user.organizer.website } : {}),
          },
        }
      : {}),
  };
}

/**
 * Utilisateur connecté, relu en base à chaque requête (un compte supprimé perd l'accès).
 * Lit les cookies : à appeler sous un `<Suspense>` (Cache Components).
 */
export const getCurrentUser = cache(async (): Promise<AccountUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;
  await connectDB();
  const user = await User.findById(session.user.id).lean<UserDocument & { _id: unknown }>();
  return user ? toAccountUser(user) : null;
});

export async function requireUser(locale: Locale): Promise<AccountUser> {
  const user = await getCurrentUser();
  if (!user) redirect(localizePath(locale, "/connexion"));
  return user;
}

/** Un rôle différent renvoie l'utilisateur vers son propre tableau de bord (BF-01). */
export async function requireRole(locale: Locale, role: UserRole): Promise<AccountUser> {
  const user = await requireUser(locale);
  if (user.role !== role) redirect(dashboardPath(locale, user.role));
  return user;
}
