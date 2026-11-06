import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import type { RegistrationWithEvent } from "@/lib/registrations";
import RegistrationItem from "./RegistrationItem";

type RegistrationListProps = {
  registrations: RegistrationWithEvent[];
  locale: Locale;
  t: Dictionary["dashboard"]["registrationCard"];
  eventT: Dictionary["event"];
};

export default function RegistrationList({
  registrations,
  locale,
  t,
  eventT,
}: RegistrationListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {registrations.map((registration) => (
        <li key={registration.id}>
          <RegistrationItem registration={registration} locale={locale} t={t} eventT={eventT} />
        </li>
      ))}
    </ul>
  );
}
