import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ORGANIZER_TYPES, USER_ROLES } from "@/types/user";

const OrganizerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    type: { type: String, required: true, enum: ORGANIZER_TYPES },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    bio: { type: String, required: true, trim: true, maxlength: 500 },
    website: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
);

/** Demande de réinitialisation du mot de passe (D-31) : seule l'empreinte du jeton est gardée. */
const PasswordResetSchema = new Schema(
  {
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    requestedAt: { type: Date, required: true },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: USER_ROLES, default: "participant" },
    organizer: { type: OrganizerSchema, required: false },
    passwordReset: { type: PasswordResetSchema, required: false, select: false },
    /** Version de la photo de profil (D-32), absente sans photo ; change l'adresse de l'image. */
    avatarVersion: { type: Number, required: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument> | undefined) ??
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
