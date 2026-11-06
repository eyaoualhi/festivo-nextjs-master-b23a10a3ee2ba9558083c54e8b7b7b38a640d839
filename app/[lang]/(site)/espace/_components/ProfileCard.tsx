import { Building2, Globe, Mail, MapPin, Phone, UserRoundPen } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import ButtonLink from "@/components/ui/ButtonLink";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { AccountUser } from "@/types/user";

type ProfileCardProps = {
  locale: Locale;
  user: AccountUser;
  t: Dictionary["dashboard"]["profileCard"];
  organizerTypes: Dictionary["auth"]["organizer"]["types"];
};

export default function ProfileCard({ locale, user, t, organizerTypes }: ProfileCardProps) {
  const { organizer } = user;
  const details = [
    { icon: Mail, label: user.email, isolate: true },
    ...(organizer
      ? [
          { icon: Building2, label: `${organizer.name} · ${organizerTypes[organizer.type]}` },
          { icon: MapPin, label: organizer.city },
          { icon: Phone, label: organizer.phone, isolate: true },
          ...(organizer.website
            ? [{ icon: Globe, label: organizer.website.replace(/^https?:\/\//, ""), isolate: true }]
            : []),
        ]
      : []),
  ];

  return (
    <section
      aria-labelledby="profile-card-title"
      className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-5 md:p-6"
    >
      <h2 id="profile-card-title" className="font-display text-xl font-bold text-ink">
        {t.title}
      </h2>
      <div className="flex items-center gap-3">
        <Avatar userId={user.id} name={user.name} version={user.avatarVersion} />
        <p dir="auto" className="min-w-0 truncate font-semibold text-ink">
          {user.name}
        </p>
      </div>
      <ul className="flex flex-col gap-3 text-sm text-muted">
        {details.map(({ icon: Icon, label, isolate }) => (
          <li key={label} className="flex min-w-0 items-center gap-2.5">
            <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
            <span dir={isolate ? "ltr" : "auto"} className="min-w-0 truncate">
              {label}
            </span>
          </li>
        ))}
      </ul>
      {organizer && (
        <p className="text-sm leading-relaxed text-muted" dir="auto">
          {organizer.bio}
        </p>
      )}
      <ButtonLink
        href={localizePath(locale, "/espace/profil")}
        variant="secondary"
        className="w-full"
      >
        <UserRoundPen aria-hidden="true" className="size-4" />
        {t.edit}
      </ButtonLink>
    </section>
  );
}
