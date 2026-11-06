import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { OrganizerSummary } from "@/lib/events";
import { localizePath, plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventSummary } from "@/types/event";

type OrganizersSectionProps = {
  organizers: OrganizerSummary[];
  /** Photo découpée en arc, comme les portes de Sidi Bou Saïd. */
  picture?: EventSummary;
};

function ArchPhoto({ picture, className }: { picture: EventSummary; className: string }) {
  return (
    <div className={`relative aspect-3/4 overflow-hidden rounded-t-full bg-band-tile ${className}`}>
      <div data-parallax="5" className="absolute inset-x-0 -top-[7%] -bottom-[7%]">
        <Image
          src={picture.imageUrl}
          alt={picture.imageAlt}
          fill
          sizes="(min-width: 1024px) 34vw, 86vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default async function OrganizersSection({ organizers, picture }: OrganizersSectionProps) {
  const { locale, dict } = await getI18n();
  const t = dict.organizers;

  return (
    <section
      id="organisateurs"
      aria-labelledby="organizers-title"
      className="mx-auto max-w-360 px-4 py-20 md:px-8 md:py-28"
    >
      <div className="grid overflow-hidden bg-band text-paper lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        <div className="flex flex-col gap-10 px-6 pt-14 md:px-14 md:pt-16">
          <div className="flex max-w-xl flex-col gap-5">
            <h2
              id="organizers-title"
              data-reveal
              className="text-step-head font-semibold tracking-[-0.03em] text-balance"
            >
              {t.title}
            </h2>
            <p data-reveal className="text-step-body opacity-80">
              {t.description}
            </p>
          </div>
          {picture && (
            <ArchPhoto
              picture={picture}
              className="mt-auto hidden w-[min(34vw,30rem)] translate-y-1/5 lg:block"
            />
          )}
        </div>

        <div className="flex flex-col gap-10 px-6 py-14 md:px-14 md:py-16 lg:ps-0">
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-1">
            {organizers.map(({ organizer, eventCount, categories }) => (
              <li key={organizer.id} data-reveal className="flex flex-col gap-1.5">
                <h3 dir="auto" className="text-step-lead font-semibold">
                  {organizer.name}
                </h3>
                <p className="text-step-small font-medium text-blue-400">
                  {plural(locale, eventCount, dict.event.published)} ·{" "}
                  {categories.map((category) => dict.categories[category]).join(", ")}
                </p>
                <p dir="auto" className="text-step-body opacity-80">
                  {organizer.bio}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href={localizePath(locale, "/inscription")}
            className="group inline-flex min-h-14 items-center justify-center gap-3 self-start bg-blue-600 px-7 text-step-body font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:translate-y-px"
          >
            {t.action}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {picture && (
          <ArchPhoto
            picture={picture}
            className="mx-auto w-[86%] max-w-md translate-y-1/4 lg:hidden"
          />
        )}
      </div>
    </section>
  );
}
