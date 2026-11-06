import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RegistrationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["active", "annulee"], default: "active", required: true },
  },
  { timestamps: true },
);

// Index unique pour éviter les doublons actifs
RegistrationSchema.index({ user: 1, event: 1, status: 1 });

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema>;

const Registration: Model<RegistrationDocument> =
  (mongoose.models.Registration as Model<RegistrationDocument> | undefined) ??
  mongoose.model<RegistrationDocument>("Registration", RegistrationSchema);

export default Registration;
