"use client";

import { useState } from "react";
import { LoaderCircle, LocateFixed } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

type NearbyMapProps = {
  locale: string;
  labels: Dictionary["cities"]["map"];
};

type Status = "idle" | "locating" | "located" | "denied" | "unavailable" | "unsupported";

/** Les événements de démonstration se déroulent en Tunisie (D-18). */
const DEFAULT_PLACE = "Tunis, Tunisie";

function mapUrl(query: string, zoom: number, locale: string): string {
  const params = new URLSearchParams({ q: query, z: String(zoom), hl: locale, output: "embed" });
  return `https://maps.google.com/maps?${params}`;
}

export default function NearbyMap({ locale, labels }: NearbyMapProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [position, setPosition] = useState<string | null>(null);

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition(`${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}`);
        setStatus("located");
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const message = status === "idle" || status === "locating" ? labels.privacy : labels[status];
  const locating = status === "locating";

  return (
    <div className="mx-auto max-w-360 px-4 pt-6 pb-20 md:px-8 md:pb-28">
      <div className="bg-band px-5 pt-7 pb-5 md:px-8 md:pt-9 md:pb-8">
        <div className="flex items-center justify-between gap-6 md:justify-start">
          <h3 className="text-step-head font-semibold tracking-[-0.03em]">{labels.title}</h3>
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            aria-label={locating ? labels.locating : labels.locate}
            title={labels.locate}
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-paper transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:translate-y-px disabled:cursor-progress"
          >
            {locating ? (
              <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
            ) : (
              <LocateFixed aria-hidden="true" className="size-6" />
            )}
          </button>
        </div>
        <p aria-live="polite" className="mt-4 max-w-2xl text-step-body">
          {message}
        </p>
        <div className="relative mt-6 aspect-4/3 overflow-hidden bg-band-tile md:mt-8 md:aspect-21/9">
          <iframe
            title={labels.frameTitle}
            src={position ? mapUrl(position, 14, locale) : mapUrl(DEFAULT_PLACE, 11, locale)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0 dark:brightness-90 dark:contrast-110 dark:hue-rotate-180 dark:invert"
          />
        </div>
      </div>
    </div>
  );
}
