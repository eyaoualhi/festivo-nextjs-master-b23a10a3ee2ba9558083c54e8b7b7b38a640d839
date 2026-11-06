import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "@/types/event";

/** Entité Event (D-33) ; « terminé » se déduit de `endsAt`, il n'est pas stocké. */
const EventSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    /** Paragraphes séparés par une ligne vide. */
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: String, required: true, enum: EVENT_CATEGORIES },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    venue: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    imageUrl: { type: String, required: true, trim: true },
    imageAlt: { type: String, required: true, trim: true, maxlength: 200 },
    capacity: { type: Number, required: true, min: 1 },
    /** Tenu à jour par les inscriptions (BF-04) ; places restantes = capacité − inscrits. */
    registrationCount: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, required: true, enum: EVENT_STATUSES, default: "brouillon" },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

EventSchema.index({ status: 1, startsAt: 1 });
EventSchema.index({ organizer: 1, startsAt: 1 });

export type EventDocument = InferSchemaType<typeof EventSchema>;

const Event: Model<EventDocument> =
  (mongoose.models.Event as Model<EventDocument> | undefined) ??
  mongoose.model<EventDocument>("Event", EventSchema);

export default Event;
