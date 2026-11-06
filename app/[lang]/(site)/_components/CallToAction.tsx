import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

export default async function CallToAction() {
  const { locale, dict } = await getI18n();
  const t = dict.cta;

  return (
    <section aria-labelledby="cta-title" className="bg-blue-600 text-paper">
      <div className="mx-auto flex max-w-360 flex-col gap-10 px-4 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col gap-6">
          <h2
            id="cta-title"
            data-reveal
            className="text-step-display font-semibold tracking-[-0.04em]"
          >
            {t.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p data-reveal className="max-w-xl text-step-lead">
            {t.description}
          </p>
        </div>
        <div data-reveal>
          <Link
            href={localizePath(locale, "/inscription")}
            className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-paper px-7 text-step-body font-semibold text-night transition-colors hover:bg-band hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper active:translate-y-px"
          >
            {t.primary}
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
