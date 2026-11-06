/**
 * D-33 : charge le jeu de démonstration (D-18) dans la base de `MONGODB_URI` : six comptes
 * organisateurs et leurs événements publiés. Relancer la commande met les données à jour sans
 * doublon (clés : e-mail des comptes, `slug` des événements).
 *
 * Usage : `npm run seed` (lit `.env.local` comme Next.js).
 */
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import mongoose, { type Types } from "mongoose";
import { demoEvents } from "@/lib/demo/events";
import { PASSWORD_MIN_LENGTH } from "@/lib/validation";
import Event from "@/models/Event";
import User from "@/models/User";
import type { OrganizerType } from "@/types/user";

/** Ce que le jeu de démonstration ne fournit pas pour remplir un profil organisateur (D-29). */
const ORGANIZER_DETAILS: Record<string, { type: OrganizerType; city: string; phone: string }> = {
  "collectif-sonora": { type: "association", city: "Tunis", phone: "+216 70 100 101" },
  "tunis-tech-hub": { type: "association", city: "Tunis", phone: "+216 70 100 102" },
  "carthage-run-club": { type: "association", city: "Carthage", phone: "+216 70 100 103" },
  "galerie-bleu-medina": { type: "entreprise", city: "Tunis", phone: "+216 70 100 104" },
  "reseau-jeunes-entrepreneurs": { type: "association", city: "Sousse", phone: "+216 70 100 105" },
  "maison-des-savoir-faire": { type: "entreprise", city: "La Marsa", phone: "+216 70 100 106" },
};

function demoEmail(organizerId: string): string {
  return `contact@${organizerId}.demo.festivo.tn`;
}

async function seed() {
  loadEnvConfig(process.cwd());
  const uri = process.env.MONGODB_URI;
  const password = process.env.SEED_ORGANIZER_PASSWORD ?? "";
  if (!uri) throw new Error("MONGODB_URI manque dans .env.local.");
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(
      `SEED_ORGANIZER_PASSWORD manque dans .env.local (${PASSWORD_MIN_LENGTH} caractères minimum).`,
    );
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  await Promise.all([User.init(), Event.init()]);

  const organizers = new Map(demoEvents.map((event) => [event.organizer.id, event.organizer]));
  const passwordHash = await bcrypt.hash(password, 12);
  const userIds = new Map<string, Types.ObjectId>();

  for (const organizer of organizers.values()) {
    const details = ORGANIZER_DETAILS[organizer.id];
    if (!details) throw new Error(`Profil manquant pour l'organisateur « ${organizer.id} ».`);
    const user = await User.findOneAndUpdate(
      { email: demoEmail(organizer.id) },
      {
        $set: {
          name: organizer.name,
          role: "organisateur",
          passwordHash,
          organizer: { name: organizer.name, bio: organizer.bio, ...details },
        },
      },
      { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
    );
    if (!user) throw new Error(`Compte non créé pour l'organisateur « ${organizer.id} ».`);
    userIds.set(organizer.id, user._id);
  }

  for (const event of demoEvents) {
    await Event.updateOne(
      { slug: event.id },
      {
        $set: {
          title: event.title,
          description: event.description.join("\n\n"),
          category: event.category,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          venue: event.venue,
          address: event.address,
          city: event.city,
          imageUrl: event.imageUrl,
          imageAlt: event.imageAlt,
          capacity: event.capacity,
          registrationCount: event.capacity - event.spotsLeft,
          status: "publie",
          organizer: userIds.get(event.organizer.id),
        },
      },
      { upsert: true, runValidators: true },
    );
  }

  console.log(
    `Jeu de démonstration chargé : ${organizers.size} organisateurs, ${demoEvents.length} événements publiés.`,
  );
  console.log(
    `Comptes : contact@<organisateur>.demo.festivo.tn (mot de passe : SEED_ORGANIZER_PASSWORD).`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
