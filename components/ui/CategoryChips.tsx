import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { categories } from "@/lib/categories";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import type { EventCategory } from "@/types/event";
import { categoryStyles } from "./categoryStyles";

type CategoryChipsProps = {
  /** Puce mise en avant ; aucune si absent. */
  active?: EventCategory | "tous";
  /** Paramètres conservés quand on change de catégorie (recherche, ville, mois). */
  params?: Record<string, string | undefined>;
  label: string;
};

function searchFor(params: CategoryChipsProps["params"], category?: EventCategory): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) search.set(key, value);
  }
  if (category) search.set("categorie", category);
  const query = search.toString();
  return query ? `/evenements?${query}` : "/evenements";
}

const chipClasses =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default async function CategoryChips({ active, params, label }: CategoryChipsProps) {
  const { locale, dict } = await getI18n();
  const items = [
    { slug: undefined, label: dict.categories.all, icon: LayoutGrid, tone: "bg-surface text-ink" },
    ...categories.map((slug) => ({
      slug,
      label: dict.categories[slug],
      ...categoryStyles[slug],
    })),
  ];

  return (
    <nav aria-label={label}>
      <ul className="-mx-4 flex [scrollbar-width:none] gap-2.5 overflow-x-auto px-4 pb-1 md:-mx-10 md:flex-wrap md:px-10">
        {items.map(({ slug, label: itemLabel, icon: Icon, tone }) => {
          const isActive = (slug ?? "tous") === active;
          return (
            <li key={slug ?? "tous"}>
              <Link
                href={localizePath(locale, searchFor(params, slug))}
                aria-current={isActive ? "page" : undefined}
                className={`${chipClasses} ${
                  isActive
                    ? "border-ink bg-ink text-canvas"
                    : "border-line bg-card text-ink hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${
                    isActive ? "bg-canvas/15 text-canvas" : tone
                  }`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {itemLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
