import { getDictionary } from "@/lib/i18n/server";
import StepsAccordion, { type StepItem } from "./StepsAccordion";

export default async function StepsSection() {
  const dict = await getDictionary();
  const t = dict.steps;

  const items: StepItem[] = [t.participants, t.organizers].flatMap(({ title: track, steps }) =>
    steps.map((step) => ({ ...step, track })),
  );

  return (
    <section
      id="etapes"
      aria-labelledby="steps-title"
      className="mx-auto max-w-360 px-4 pb-20 md:px-8 md:pb-28"
    >
      <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
        <h2
          id="steps-title"
          data-reveal
          className="text-step-head font-semibold tracking-[-0.03em] text-balance text-ink md:col-span-6"
        >
          {t.title}
        </h2>
        <p data-reveal className="text-step-body text-muted md:col-span-5 md:col-start-8">
          {t.description}
        </p>
      </div>
      <div data-reveal className="mt-10 md:mt-14">
        <StepsAccordion items={items} />
      </div>
    </section>
  );
}
