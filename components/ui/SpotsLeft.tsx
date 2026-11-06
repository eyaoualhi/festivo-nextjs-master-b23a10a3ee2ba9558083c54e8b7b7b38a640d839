import { Users } from "lucide-react";
import { plural } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

type SpotsLeftProps = {
  spotsLeft: number;
  capacity: number;
  className?: string;
};

function spotsTone(spotsLeft: number, capacity: number): string {
  if (spotsLeft === 0) return "text-danger";
  if (spotsLeft / capacity <= 0.15) return "text-accent";
  return "text-success";
}

export default async function SpotsLeft({ spotsLeft, capacity, className = "" }: SpotsLeftProps) {
  const { locale, dict } = await getI18n();

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${spotsTone(spotsLeft, capacity)} ${className}`}
    >
      <Users aria-hidden="true" className="size-3.5" />
      {spotsLeft === 0 ? dict.card.full : plural(locale, spotsLeft, dict.card.spotsLeft)}
    </span>
  );
}
