import { getDictionary } from "@/lib/i18n/server";
import type { EventCategory } from "@/types/event";
import { categoryStyles } from "./categoryStyles";

type CategoryPillProps = {
  category: EventCategory;
  className?: string;
};

export default async function CategoryPill({ category, className = "" }: CategoryPillProps) {
  const dict = await getDictionary();
  const { icon: Icon, tone } = categoryStyles[category];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone} ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {dict.categories[category]}
    </span>
  );
}
