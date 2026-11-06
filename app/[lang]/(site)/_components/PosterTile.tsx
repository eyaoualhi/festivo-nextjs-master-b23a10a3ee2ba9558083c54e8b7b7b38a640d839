import Image from "next/image";
import Link from "next/link";
import { formatShortDate, formatTime } from "@/lib/format";
import { localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";

/** Couleurs de l'étiquette, en rotation pour que deux affiches voisines ne se ressemblent pas. */
const strips = ["bg-blue-600 text-paper", "bg-band text-paper", "bg-tile text-ink"];

type PosterTileProps = {
  event: EventSummary;
  index: number;
  priority?: boolean;
  /** Apparition au défilement (`HomeMotion`) ; pas dans un onglet masqué, qui n'a pas de position. */
  reveal?: boolean;
};

export default async function PosterTile({
  event,
  index,
  priority = false,
  reveal = false,
}: PosterTileProps) {
  const { locale, dict } = await getI18n();
  const strip = strips[index % strips.length];
  const full = event.spotsLeft === 0;

  return (
    <article data-reveal={reveal || undefined} className="group relative flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden bg-tile">
        <Image
          src={event.imageUrl}
          alt={event.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
      </div>
      <div className={`flex min-h-32 flex-1 flex-col gap-2 p-3 md:p-4 ${strip}`}>
        <h3 dir="auto" className="line-clamp-2 text-step-body leading-snug font-semibold">
          <Link
            href={localizePath(locale, `/evenements/${event.id}`)}
            className="underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-primary"
          >
            {event.title}
          </Link>
        </h3>
        <p className="mt-auto flex flex-wrap justify-between gap-x-3 text-step-small tabular-nums">
          <span>
            {formatShortDate(locale, event.startsAt)} · {formatTime(locale, event.startsAt)}
          </span>
          <span dir="auto">{event.city}</span>
        </p>
        <p className="flex flex-wrap justify-between gap-x-3 text-step-small font-medium">
          <span>
            {full ? dict.card.full : plural(locale, event.spotsLeft, dict.card.spotsLeft)}
          </span>
          <span>{dict.common.free}</span>
        </p>
      </div>
    </article>
  );
}
