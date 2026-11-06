import {
  ORGANIZER_TYPES,
  SIGNUP_ROLES,
  type OrganizerProfile,
  type OrganizerType,
  type SignupRole,
} from "@/types/user";

export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;
export const BIO_MIN_LENGTH = 20;
export const BIO_MAX_LENGTH = 500;
/** Photo de profil (D-32) : taille maximale du fichier envoyé, en Mo, et formats acceptés. */
export const AVATAR_MAX_MB = 4;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{8,20}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Clés des messages d'erreur, traduites dans `auth.errors` (D-19). */
export type FieldErrorKey =
  | "nameTooShort"
  | "emailRequired"
  | "emailInvalid"
  | "emailTaken"
  | "passwordRequired"
  | "passwordIncorrect"
  | "passwordTooShort"
  | "confirmationRequired"
  | "confirmationMismatch"
  | "organizerNameRequired"
  | "organizerTypeRequired"
  | "phoneInvalid"
  | "cityRequired"
  | "bioLength"
  | "websiteInvalid"
  | "avatarRequired"
  | "avatarType"
  | "avatarTooLarge";

/** Valeurs passées dans les messages (`{n}`, `{min}`, `{max}`, `{size}`). */
export const errorValues = {
  n: PASSWORD_MIN_LENGTH,
  min: BIO_MIN_LENGTH,
  max: BIO_MAX_LENGTH,
  size: AVATAR_MAX_MB,
};

export type AccountField = "name" | "email";
export type PasswordField = "password" | "passwordConfirmation";
export type OrganizerField =
  "organizerName" | "organizerType" | "phone" | "city" | "bio" | "website";
export type FieldErrors<F extends string> = Partial<Record<F, FieldErrorKey>>;

export function isSignupRole(value: unknown): value is SignupRole {
  return typeof value === "string" && (SIGNUP_ROLES as readonly string[]).includes(value);
}

export function isOrganizerType(value: unknown): value is OrganizerType {
  return typeof value === "string" && (ORGANIZER_TYPES as readonly string[]).includes(value);
}

export function validateAccount(values: Record<AccountField, string>): FieldErrors<AccountField> {
  const errors: FieldErrors<AccountField> = {};
  const name = values.name.trim();
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) errors.name = "nameTooShort";
  if (!values.email.trim()) errors.email = "emailRequired";
  else if (!isValidEmail(values.email)) errors.email = "emailInvalid";
  return errors;
}

export function validatePassword(
  values: Record<PasswordField, string>,
): FieldErrors<PasswordField> {
  const errors: FieldErrors<PasswordField> = {};
  if (values.password.length < PASSWORD_MIN_LENGTH) errors.password = "passwordTooShort";
  if (!values.passwordConfirmation) errors.passwordConfirmation = "confirmationRequired";
  else if (values.passwordConfirmation !== values.password)
    errors.passwordConfirmation = "confirmationMismatch";
  return errors;
}

/** Contrôle du fichier choisi ; le serveur vérifie en plus qu'il s'agit bien d'une image. */
export function validateAvatar(file: File | null): FieldErrorKey | undefined {
  if (!file || file.size === 0) return "avatarRequired";
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) return "avatarType";
  if (file.size > AVATAR_MAX_MB * 1024 * 1024) return "avatarTooLarge";
  return undefined;
}

/** Ajoute `https://` quand l'adresse n'a pas de protocole ; `null` si elle n'est pas valide. */
export function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export function validateOrganizer(
  values: Record<OrganizerField, string>,
): FieldErrors<OrganizerField> {
  const errors: FieldErrors<OrganizerField> = {};
  const name = values.organizerName.trim();
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH)
    errors.organizerName = "organizerNameRequired";
  if (!isOrganizerType(values.organizerType)) errors.organizerType = "organizerTypeRequired";
  const phone = values.phone.trim();
  if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 8)
    errors.phone = "phoneInvalid";
  if (values.city.trim().length < 2) errors.city = "cityRequired";
  const bio = values.bio.trim();
  if (bio.length < BIO_MIN_LENGTH || bio.length > BIO_MAX_LENGTH) errors.bio = "bioLength";
  if (normalizeWebsite(values.website) === null) errors.website = "websiteInvalid";
  return errors;
}

/** Profil organisateur nettoyé, à n'appeler qu'après `validateOrganizer` sans erreur. */
export function toOrganizerProfile(values: Record<OrganizerField, string>): OrganizerProfile {
  const website = normalizeWebsite(values.website);
  return {
    name: values.organizerName.trim(),
    type: values.organizerType as OrganizerType,
    phone: values.phone.trim(),
    city: values.city.trim(),
    bio: values.bio.trim(),
    ...(website ? { website } : {}),
  };
}

/** Lit des champs texte d'un `FormData` (valeur absente : chaîne vide). */
export function readFields<F extends string>(
  formData: FormData,
  fields: readonly F[],
): Record<F, string> {
  return Object.fromEntries(
    fields.map((field) => [field, formData.get(field)?.toString() ?? ""]),
  ) as Record<F, string>;
}

export const ACCOUNT_FIELDS = ["name", "email"] as const satisfies AccountField[];
export const PASSWORD_FIELDS = [
  "password",
  "passwordConfirmation",
] as const satisfies PasswordField[];
export const ORGANIZER_FIELDS = [
  "organizerName",
  "organizerType",
  "phone",
  "city",
  "bio",
  "website",
] as const satisfies OrganizerField[];

export type PasswordCheck = {
  /** Clé du libellé dans le dictionnaire (`auth.strength`). */
  key: "minLength" | "mixedCase" | "digit" | "symbol";
  passed: boolean;
  required: boolean;
};

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { key: "minLength", passed: password.length >= PASSWORD_MIN_LENGTH, required: true },
    {
      key: "mixedCase",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
      required: false,
    },
    { key: "digit", passed: /\d/.test(password), required: false },
    { key: "symbol", passed: /[^A-Za-z0-9]/.test(password), required: false },
  ];
}
