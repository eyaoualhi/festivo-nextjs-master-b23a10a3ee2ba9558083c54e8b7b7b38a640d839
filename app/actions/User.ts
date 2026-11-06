"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { revalidatePath, updateTag } from "next/cache";
import { AuthError } from "next-auth";
import sharp from "sharp";
import { auth, signIn, unstable_update } from "@/auth";
import { connectDB } from "@/lib/db";
import { EVENTS_TAG } from "@/lib/events";
import { defaultLocale, interpolate, isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionaryFor } from "@/lib/i18n/server";
import { escapeHtml, sendMail } from "@/lib/mail";
import {
  ACCOUNT_FIELDS,
  isSignupRole,
  isValidEmail,
  ORGANIZER_FIELDS,
  PASSWORD_FIELDS,
  readFields,
  toOrganizerProfile,
  validateAccount,
  validateAvatar,
  validateOrganizer,
  validatePassword,
  type AccountField,
  type FieldErrors,
  type OrganizerField,
  type PasswordField,
} from "@/lib/validation";
import Avatar from "@/models/Avatar";
import Event from "@/models/Event";
import User from "@/models/User";

const BCRYPT_ROUNDS = 12;
/** Réinitialisation du mot de passe (D-31) : durée de validité du lien et délai entre deux envois. */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const RESET_THROTTLE_MS = 2 * 60 * 1000;
/** Photo de profil (D-32) : côté du carré enregistré, en pixels. */
const AVATAR_SIZE = 256;

/** Clés des messages d'erreur globaux, traduites dans `auth.errors` (D-19). */
export type ActionErrorKey =
  "emailTaken" | "invalidCredentials" | "resetInvalid" | "server" | "unauthorized";

export type FormState<F extends string> =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error?: ActionErrorKey;
      fieldErrors?: FieldErrors<F>;
      /** Valeurs saisies, renvoyées pour remplir à nouveau le formulaire (jamais les mots de passe). */
      values?: Partial<Record<F, string>>;
    };

export type RegisterField = AccountField | PasswordField | OrganizerField | "role";
export type LoginField = "email" | "password";
export type ProfileField = AccountField | OrganizerField;
export type ForgotField = "email";
export type ResetField = PasswordField;
export type AvatarField = "avatar";
export type DeleteField = "password";

function readLocale(formData: FormData): Locale {
  const value = formData.get("locale")?.toString();
  return isLocale(value) ? value : defaultLocale;
}

function isDuplicateKey(error: unknown): boolean {
  return error instanceof mongoose.mongo.MongoServerError && error.code === 11000;
}

function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}

/** Seule l'empreinte du jeton est stockée : une fuite de la base ne donne aucun lien valable. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function resetLink(locale: Locale, token: string): string {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error("APP_URL n'est pas défini : impossible de construire le lien.");
  const url = new URL(localizePath(locale, "/reinitialiser-mot-de-passe"), appUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendResetMail(locale: Locale, to: string, name: string, link: string) {
  const t = getDictionaryFor(locale).mail.reset;
  const greeting = interpolate(t.greeting, { name });
  const dir = locale === "ar" ? "rtl" : "ltr";
  await sendMail({
    to,
    subject: t.subject,
    text: [greeting, t.intro, link, t.expiry, t.ignore, t.signature].join("\n\n"),
    html: `<div dir="${dir}" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a">
<p>${escapeHtml(greeting)}</p>
<p>${escapeHtml(t.intro)}</p>
<p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold">${escapeHtml(t.cta)}</a></p>
<p style="font-size:13px;color:#475569">${escapeHtml(link)}</p>
<p>${escapeHtml(t.expiry)}</p>
<p>${escapeHtml(t.ignore)}</p>
<p>${escapeHtml(t.signature)}</p>
</div>`,
  });
}

/** BF-01 : création d'un compte participant ou organisateur (D-29), puis ouverture de session. */
export async function register(
  _previous: FormState<RegisterField>,
  formData: FormData,
): Promise<FormState<RegisterField>> {
  const account = readFields(formData, ACCOUNT_FIELDS);
  const passwords = readFields(formData, PASSWORD_FIELDS);
  const organizer = readFields(formData, ORGANIZER_FIELDS);
  const role = formData.get("role")?.toString();
  // Le rôle administrateur, ou toute valeur inconnue, n'est jamais accepté à l'inscription.
  if (!isSignupRole(role)) return { status: "error", error: "unauthorized" };

  const fieldErrors: FieldErrors<RegisterField> = {
    ...validateAccount(account),
    ...validatePassword(passwords),
    ...(role === "organisateur" ? validateOrganizer(organizer) : {}),
  };
  const values = { ...account, ...(role === "organisateur" ? organizer : {}), role };
  if (hasErrors(fieldErrors)) return { status: "error", fieldErrors, values };

  const email = account.email.trim().toLowerCase();
  try {
    await connectDB();
    if (await User.exists({ email })) {
      return { status: "error", fieldErrors: { email: "emailTaken" }, values };
    }
    await User.create({
      name: account.name.trim(),
      email,
      passwordHash: await bcrypt.hash(passwords.password, BCRYPT_ROUNDS),
      role,
      ...(role === "organisateur" ? { organizer: toOrganizerProfile(organizer) } : {}),
    });
  } catch (error) {
    if (isDuplicateKey(error)) {
      return { status: "error", fieldErrors: { email: "emailTaken" }, values };
    }
    console.error("Inscription impossible", error);
    return { status: "error", error: "server", values };
  }

  try {
    await signIn("credentials", { email, password: passwords.password, redirect: false });
  } catch (error) {
    console.error("Ouverture de session impossible après l'inscription", error);
    return { status: "error", error: "server", values };
  }
  return { status: "success" };
}

/** BF-01 : connexion. Le message d'erreur ne dit jamais si le compte existe (cahier §06). */
export async function login(
  _previous: FormState<LoginField>,
  formData: FormData,
): Promise<FormState<LoginField>> {
  const { email, password } = readFields(formData, ["email", "password"] as const);
  const fieldErrors: FieldErrors<LoginField> = {};
  if (!email.trim()) fieldErrors.email = "emailRequired";
  else if (!isValidEmail(email)) fieldErrors.email = "emailInvalid";
  if (!password) fieldErrors.password = "passwordRequired";
  if (hasErrors(fieldErrors)) return { status: "error", fieldErrors, values: { email } };

  try {
    await signIn("credentials", { email: email.trim(), password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { status: "error", error: "invalidCredentials", values: { email } };
    }
    console.error("Connexion impossible", error);
    return { status: "error", error: "server", values: { email } };
  }
  return { status: "success" };
}

/** BF-01 : modification de son profil ; la session est relue ici, jamais reçue du client. */
export async function updateProfile(
  _previous: FormState<ProfileField>,
  formData: FormData,
): Promise<FormState<ProfileField>> {
  const session = await auth();
  if (!session?.user?.id) return { status: "error", error: "unauthorized" };

  const locale = readLocale(formData);
  const account = readFields(formData, ACCOUNT_FIELDS);
  const organizer = readFields(formData, ORGANIZER_FIELDS);
  const isOrganizer = session.user.role === "organisateur";
  const fieldErrors: FieldErrors<ProfileField> = {
    ...validateAccount(account),
    ...(isOrganizer ? validateOrganizer(organizer) : {}),
  };
  const values = { ...account, ...(isOrganizer ? organizer : {}) };
  if (hasErrors(fieldErrors)) return { status: "error", fieldErrors, values };

  const name = account.name.trim();
  const email = account.email.trim().toLowerCase();
  try {
    await connectDB();
    if (await User.exists({ email, _id: { $ne: session.user.id } })) {
      return { status: "error", fieldErrors: { email: "emailTaken" }, values };
    }
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { name, email, ...(isOrganizer ? { organizer: toOrganizerProfile(organizer) } : {}) },
      { runValidators: true },
    );
    if (!updated) return { status: "error", error: "unauthorized" };
  } catch (error) {
    if (isDuplicateKey(error)) {
      return { status: "error", fieldErrors: { email: "emailTaken" }, values };
    }
    console.error("Mise à jour du profil impossible", error);
    return { status: "error", error: "server", values };
  }

  await unstable_update({ user: { name, email } });
  revalidatePath(localizePath(locale, "/espace"), "layout");
  return { status: "success" };
}

/**
 * D-14, D-31 : envoi d'un lien de réinitialisation. La réponse est la même que le compte
 * existe ou non (cahier §06) ; un seul e-mail toutes les deux minutes par compte.
 */
export async function requestPasswordReset(
  _previous: FormState<ForgotField>,
  formData: FormData,
): Promise<FormState<ForgotField>> {
  const locale = readLocale(formData);
  const { email } = readFields(formData, ["email"] as const);
  if (!email.trim()) return { status: "error", fieldErrors: { email: "emailRequired" } };
  if (!isValidEmail(email)) {
    return { status: "error", fieldErrors: { email: "emailInvalid" }, values: { email } };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordReset");
    const now = Date.now();
    const lastRequest = user?.passwordReset?.requestedAt?.getTime() ?? 0;
    if (user && now - lastRequest >= RESET_THROTTLE_MS) {
      const token = randomBytes(32).toString("base64url");
      const link = resetLink(locale, token);
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordReset: {
              tokenHash: hashToken(token),
              expiresAt: new Date(now + RESET_TOKEN_TTL_MS),
              requestedAt: new Date(now),
            },
          },
        },
      );
      try {
        await sendResetMail(locale, user.email, user.name, link);
      } catch (error) {
        // Sans e-mail envoyé, une nouvelle demande doit rester possible tout de suite.
        await User.updateOne({ _id: user._id }, { $unset: { passwordReset: 1 } });
        throw error;
      }
    }
  } catch (error) {
    console.error("Demande de réinitialisation impossible", error);
    return { status: "error", error: "server", values: { email } };
  }
  return { status: "success" };
}

/** D-31 : nouveau mot de passe ; le lien ne sert qu'une fois et expire au bout d'une heure. */
export async function resetPassword(
  _previous: FormState<ResetField>,
  formData: FormData,
): Promise<FormState<ResetField>> {
  const token = formData.get("token")?.toString() ?? "";
  const passwords = readFields(formData, PASSWORD_FIELDS);
  const fieldErrors = validatePassword(passwords);
  if (hasErrors(fieldErrors)) return { status: "error", fieldErrors };
  if (!token) return { status: "error", error: "resetInvalid" };

  try {
    await connectDB();
    const updated = await User.findOneAndUpdate(
      {
        "passwordReset.tokenHash": hashToken(token),
        "passwordReset.expiresAt": { $gt: new Date() },
      },
      {
        $set: { passwordHash: await bcrypt.hash(passwords.password, BCRYPT_ROUNDS) },
        $unset: { passwordReset: 1 },
      },
    );
    if (!updated) return { status: "error", error: "resetInvalid" };
  } catch (error) {
    console.error("Réinitialisation du mot de passe impossible", error);
    return { status: "error", error: "server" };
  }
  return { status: "success" };
}

/** D-14, D-32 : la photo est recadrée en carré et convertie en WebP avant d'être stockée. */
export async function updateAvatar(
  _previous: FormState<AvatarField>,
  formData: FormData,
): Promise<FormState<AvatarField>> {
  const session = await auth();
  if (!session?.user?.id) return { status: "error", error: "unauthorized" };

  const locale = readLocale(formData);
  const file = formData.get("avatar");
  const photo = file instanceof File ? file : null;
  const fieldError = validateAvatar(photo);
  if (fieldError || !photo) return { status: "error", fieldErrors: { avatar: fieldError } };

  let data: Buffer;
  try {
    data = await sharp(Buffer.from(await photo.arrayBuffer()))
      .rotate()
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    // Le type annoncé par le navigateur ne garantit pas que le fichier est une image lisible.
    return { status: "error", fieldErrors: { avatar: "avatarType" } };
  }

  try {
    await connectDB();
    if (!(await User.exists({ _id: session.user.id }))) {
      return { status: "error", error: "unauthorized" };
    }
    await Avatar.updateOne(
      { user: session.user.id },
      { $set: { data, contentType: "image/webp" } },
      { upsert: true },
    );
    await User.updateOne({ _id: session.user.id }, { $set: { avatarVersion: Date.now() } });
  } catch (error) {
    console.error("Enregistrement de la photo impossible", error);
    return { status: "error", error: "server" };
  }

  revalidatePath(localizePath(locale, "/espace"), "layout");
  return { status: "success" };
}

export async function removeAvatar(
  _previous: FormState<AvatarField>,
  formData: FormData,
): Promise<FormState<AvatarField>> {
  const session = await auth();
  if (!session?.user?.id) return { status: "error", error: "unauthorized" };

  const locale = readLocale(formData);
  try {
    await connectDB();
    await Avatar.deleteOne({ user: session.user.id });
    await User.updateOne({ _id: session.user.id }, { $unset: { avatarVersion: 1 } });
  } catch (error) {
    console.error("Suppression de la photo impossible", error);
    return { status: "error", error: "server" };
  }

  revalidatePath(localizePath(locale, "/espace"), "layout");
  return { status: "success" };
}

/**
 * D-34 : suppression définitive du compte, confirmée par le mot de passe. Le client ferme
 * ensuite la session (`signOut`).
 */
export async function deleteAccount(
  _previous: FormState<DeleteField>,
  formData: FormData,
): Promise<FormState<DeleteField>> {
  const session = await auth();
  if (!session?.user?.id) return { status: "error", error: "unauthorized" };

  const password = formData.get("password")?.toString() ?? "";
  if (!password) return { status: "error", fieldErrors: { password: "passwordRequired" } };

  try {
    await connectDB();
    const user = await User.findById(session.user.id).select("+passwordHash");
    if (!user) return { status: "error", error: "unauthorized" };
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return { status: "error", fieldErrors: { password: "passwordIncorrect" } };
    }
    const { deletedCount } = await Event.deleteMany({ organizer: user._id });
    await Avatar.deleteOne({ user: user._id });
    await user.deleteOne();
    if (deletedCount > 0) updateTag(EVENTS_TAG);
  } catch (error) {
    console.error("Suppression du compte impossible", error);
    return { status: "error", error: "server" };
  }
  return { status: "success" };
}
