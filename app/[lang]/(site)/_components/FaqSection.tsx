import { getDictionary } from "@/lib/i18n/server";

const questionKeys = ["free", "install", "register", "organize", "privacy"] as const;

export default async function FaqSection() {
  const dict = await getDictionary();
  const t = dict.faq;

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-tile">
      <div className="mx-auto grid max-w-360 gap-8 px-4 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="flex flex-col gap-4 md:col-span-4 md:self-start lg:sticky lg:top-24">
          <h2
            id="faq-title"
            data-reveal
            className="text-step-head font-semibold tracking-[-0.03em] text-ink"
          >
            {t.title}
          </h2>
          <p data-reveal className="text-step-body text-muted">
            {t.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:col-span-8">
          {questionKeys.map((key) => (
            <details
              key={key}
              name="faq"
              data-reveal
              className="group bg-canvas text-ink transition-colors open:bg-blue-600 open:text-white"
            >
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-6 px-6 py-4 text-step-lead font-medium focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary group-open:focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                {t.items[key].question}
                <span aria-hidden="true" className="relative size-4 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90" />
                </span>
              </summary>
              <p className="max-w-[52ch] px-6 pb-6 text-step-body">{t.items[key].answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
