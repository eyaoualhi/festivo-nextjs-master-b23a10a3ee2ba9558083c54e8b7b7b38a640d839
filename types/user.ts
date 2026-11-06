export const USER_ROLES = ["participant", "organisateur", "administrateur"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Rôles proposés à l'inscription (D-29) ; l'administrateur est attribué par un administrateur. */
export const SIGNUP_ROLES = ["participant", "organisateur"] as const satisfies UserRole[];
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const ORGANIZER_TYPES = ["association", "entreprise", "particulier", "institution"] as const;
export type OrganizerType = (typeof ORGANIZER_TYPES)[number];

export type OrganizerProfile = {
  name: string;
  type: OrganizerType;
  phone: string;
  city: string;
  bio: string;
  website?: string;
};

/** Utilisateur tel qu'il est transmis aux pages : jamais le mot de passe chiffré. */
export type AccountUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizer?: OrganizerProfile;
  /** Présente seulement si le compte a une photo de profil (D-32). */
  avatarVersion?: number;
  active?: boolean;
  createdAt: Date;
};
