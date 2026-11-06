import SpotsLeft from "@/components/ui/SpotsLeft";
import { getDictionary } from "@/lib/i18n/server";
import RegisterButton from "./RegisterButton";

type RegistrationBarProps = {
  spotsLeft: number;
  capacity: number;
  eventSlug: string;
};

export default async function RegistrationBar({
  spotsLeft,
  capacity,
  eventSlug,
}: RegistrationBarProps) {
  const dict = await getDictionary();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-8px_24px_rgb(0_0_0/0.06)] backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-display text-lg font-extrabold text-ink">{dict.common.free}</span>
          <SpotsLeft spotsLeft={spotsLeft} capacity={capacity} />
        </div>
        <RegisterButton
          full={spotsLeft === 0}
          eventSlug={eventSlug}
          className="min-h-13 flex-1 text-base"
        />
      </div>
    </div>
  );
}
