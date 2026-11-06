import { formatDay, formatMonthShort } from "@/lib/format";
import { getLocale } from "@/lib/i18n/server";

type DateBadgeProps = {
  date: Date;
  size?: "md" | "lg";
  className?: string;
};

export default async function DateBadge({ date, size = "md", className = "" }: DateBadgeProps) {
  const locale = await getLocale();
  const large = size === "lg";

  return (
    <span
      className={`flex flex-col items-center justify-center rounded-2xl bg-card/95 shadow-sm backdrop-blur-md ${
        large ? "size-16" : "size-14"
      } ${className}`}
    >
      <span
        className={`font-display leading-none font-extrabold text-ink ${large ? "text-2xl" : "text-xl"}`}
      >
        {formatDay(locale, date)}
      </span>
      <span className="mt-0.5 text-[11px] font-bold tracking-wider text-accent">
        {formatMonthShort(locale, date)}
      </span>
    </span>
  );
}
