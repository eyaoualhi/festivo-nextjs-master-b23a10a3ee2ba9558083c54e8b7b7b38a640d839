import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/** Photo de profil (D-32) : une seule par compte, déjà réduite à 256 × 256 px. */
const AvatarSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true },
);

export type AvatarDocument = InferSchemaType<typeof AvatarSchema>;

const Avatar: Model<AvatarDocument> =
  (mongoose.models.Avatar as Model<AvatarDocument> | undefined) ??
  mongoose.model<AvatarDocument>("Avatar", AvatarSchema);

export default Avatar;
