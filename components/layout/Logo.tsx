import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

type LogoProps = {
  tone?: "default" | "inverse";
};

export default async function Logo({ tone = "default" }: LogoProps) {
  const { locale, dict } = await getI18n();
  const inverse = tone === "inverse";

  return (
    <Link
      href={localizePath(locale, "/")}
      aria-label={dict.common.logoLabel}
      className="inline-flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${
          inverse ? "bg-white text-primary" : "bg-blue-600 text-white"
        }`}
      >
        <PartyPopper aria-hidden="true" className="size-5" />
      </span>
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${
          inverse ? "text-white" : "text-ink"
        }`}
      >
        Festivo
      </span>
    </Link>
  );
}
