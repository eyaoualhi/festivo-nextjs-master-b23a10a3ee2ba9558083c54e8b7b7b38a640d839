"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  LoaderCircle,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import { buttonClasses } from "@/components/ui/buttonClasses";
import SelectField from "@/components/ui/SelectField";
import TextAreaField from "@/components/ui/TextAreaField";
import TextField from "@/components/ui/TextField";
import { localizePath, type Locale } from "@/lib/i18n/config";

const PRESET_IMAGES = [
  { url: "/images/demo/concert-2.jpg", label: "Concert" },
  { url: "/images/demo/festival-1.jpg", label: "Festival" },
  { url: "/images/demo/tech-1.jpg", label: "Tech" },
  { url: "/images/demo/sport-1.jpg", label: "Sport" },
  { url: "/images/demo/art-2.jpg", label: "Art" },
  { url: "/images/demo/atelier-1.jpg", label: "Atelier" },
  { url: "/images/demo/business-2.jpg", label: "Business" },
];

const CATEGORY_OPTIONS = [
  { value: "musique", label: "Musique & Concerts" },
  { value: "tech", label: "Tech & Innovation" },
  { value: "sport", label: "Sport & Bien-être" },
  { value: "art", label: "Art & Culture" },
  { value: "business", label: "Business & Networking" },
  { value: "atelier", label: "Ateliers & Formations" },
];

export default function CreateEventForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);

  const [formData, setFormData] = useState({
    title: "",
    category: "musique",
    startsAtDate: "",
    startsAtTime: "18:00",
    endsAtDate: "",
    endsAtTime: "21:00",
    venue: "",
    address: "",
    city: "Tunis",
    capacity: "50",
    description: "",
    customImageUrl: "",
    status: "publie",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Veuillez saisir un titre pour l'événement.");
      return;
    }
    if (!formData.startsAtDate) {
      setError("Veuillez choisir une date de début.");
      return;
    }

    const startDate = new Date(`${formData.startsAtDate}T${formData.startsAtTime || "00:00"}`);
    const endDate = formData.endsAtDate
      ? new Date(`${formData.endsAtDate}T${formData.endsAtTime || "23:59"}`)
      : new Date(startDate.getTime() + 3 * 3600 * 1000); // 3h plus tard par défaut

    if (endDate < startDate) {
      setError("La date et heure de fin doivent être après le début.");
      return;
    }

    const imageUrl = formData.customImageUrl.trim() || selectedImage;

    startTransition(async () => {
      try {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            startsAt: startDate.toISOString(),
            endsAt: endDate.toISOString(),
            venue: formData.venue,
            address: formData.address,
            city: formData.city,
            capacity: Number(formData.capacity) || 50,
            description: formData.description,
            imageUrl,
            imageAlt: formData.title,
            status: formData.status,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Une erreur est survenue.");
          return;
        }

        router.push(localizePath(locale, "/espace/organisateur"));
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion avec le serveur.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-line bg-card p-6 md:p-8"
    >
      {error && <Alert tone="error" title={error} />}

      {/* 1. Informations générales */}
      <div className="flex flex-col gap-5 border-b border-line pb-6">
        <h2 className="text-lg font-bold text-ink">Informations générales</h2>
        <TextField
          id="title"
          label="Titre de l'événement"
          placeholder="ex. Festival des Sons de Carthage"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            id="category"
            label="Catégorie"
            placeholder="Sélectionnez une catégorie"
            options={CATEGORY_OPTIONS}
            value={formData.category}
            onChange={handleChange}
            icon={Tag}
          />
          <SelectField
            id="status"
            label="Statut initial"
            placeholder="Statut"
            options={[
              { value: "publie", label: "Publié immédiatement" },
              { value: "brouillon", label: "Brouillon (non visible)" },
            ]}
            value={formData.status}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 2. Dates et Horaires */}
      <div className="flex flex-col gap-5 border-b border-line pb-6">
        <h2 className="text-lg font-bold text-ink">Date et Horaires</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="startsAtDate"
            label="Date de début"
            type="date"
            icon={Calendar}
            value={formData.startsAtDate}
            onChange={handleChange}
            required
          />
          <TextField
            id="startsAtTime"
            label="Heure de début"
            type="time"
            icon={Clock}
            value={formData.startsAtTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="endsAtDate"
            label="Date de fin"
            type="date"
            icon={Calendar}
            value={formData.endsAtDate}
            onChange={handleChange}
          />
          <TextField
            id="endsAtTime"
            label="Heure de fin"
            type="time"
            icon={Clock}
            value={formData.endsAtTime}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 3. Lieu et Capacité */}
      <div className="flex flex-col gap-5 border-b border-line pb-6">
        <h2 className="text-lg font-bold text-ink">Lieu et Capacité</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            id="venue"
            label="Nom du lieu / Salle"
            placeholder="ex. Théâtre de plein air"
            value={formData.venue}
            onChange={handleChange}
            required
          />
          <TextField
            id="address"
            label="Adresse"
            placeholder="ex. Rue de la République"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            id="city"
            label="Ville"
            placeholder="ex. Tunis, Sousse..."
            icon={MapPin}
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <TextField
          id="capacity"
          label="Capacité maximale (nombre de places)"
          type="number"
          min="1"
          icon={Users}
          value={formData.capacity}
          onChange={handleChange}
          required
        />
      </div>

      {/* 4. Description */}
      <div className="flex flex-col gap-5 border-b border-line pb-6">
        <h2 className="text-lg font-bold text-ink">Description</h2>
        <TextAreaField
          id="description"
          label="Description de l'événement"
          placeholder="Décrivez votre événement, les artistes ou intervenants, le déroulement..."
          rows={5}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* 5. Image de couverture */}
      <div className="flex flex-col gap-4 border-b border-line pb-6">
        <h2 className="text-lg font-bold text-ink">Image de couverture</h2>
        <p className="text-sm text-muted">
          Sélectionnez une image d&apos;illustration prédéfinie ou saisissez une URL personnalisée :
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {PRESET_IMAGES.map((img) => {
            const isSelected = selectedImage === img.url && !formData.customImageUrl;
            return (
              <button
                key={img.url}
                type="button"
                onClick={() => {
                  setSelectedImage(img.url);
                  setFormData((p) => ({ ...p, customImageUrl: "" }));
                }}
                className={`relative flex flex-col items-center overflow-hidden rounded-xl border-2 p-1 transition ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={img.url} alt={img.label} fill className="object-cover" />
                </div>
                <span className="mt-1 text-xs font-medium text-ink">{img.label}</span>
              </button>
            );
          })}
        </div>
        <TextField
          id="customImageUrl"
          label="Ou adresse URL d'une image personnalisée (facultatif)"
          placeholder="https://..."
          icon={ImageIcon}
          value={formData.customImageUrl}
          onChange={handleChange}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={buttonClasses("primary", "flex min-w-44 items-center justify-center gap-2")}
        >
          {isPending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {isPending ? "Création en cours..." : "Créer l'événement"}
        </button>
      </div>
    </form>
  );
}
