import { formatMonthLabel } from "@/lib/format";
import { interpolate, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { AccountUser } from "@/types/user";

type SpaceHeaderProps = {
  locale: Locale;
  user: AccountUser;
  description: string;
  t: Dictionary["dashboard"];
};

export default function SpaceHeader({ locale, user, description, t }: SpaceHeaderProps) {
  const since = formatMonthLabel(locale, user.createdAt);

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">
          {t.roles[user.role]}
        </span>
        <span className="text-muted">{interpolate(t.memberSince, { date: since })}</span>
      </div>
      <h1 className="text-step-head font-extrabold tracking-tight text-ink">
        <span dir="auto">{interpolate(t.greeting, { name: user.name })}</span>
      </h1>
      <p className="max-w-2xl text-step-lead text-muted">{description}</p>
    </header>
  );
}
