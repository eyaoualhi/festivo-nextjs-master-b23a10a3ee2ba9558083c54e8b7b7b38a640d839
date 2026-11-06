"use client";

import { useId, useState } from "react";

export type StepItem = {
  title: string;
  description: string;
  track: string;
};

/** Du noir au bleu vif : l'ordre des étapes se lit dans la couleur. */
const tones = [
  "bg-band text-paper",
  "bg-blue-900 text-paper",
  "bg-blue-800 text-paper",
  "bg-blue-700 text-paper",
  "bg-blue-600 text-paper",
  "bg-blue-500 text-paper",
];

export default function StepsAccordion({ items }: { items: StepItem[] }) {
  const baseId = useId();
  const [active, setActive] = useState(0);

  return (
    <ol className="flex flex-col lg:h-[24rem] lg:flex-row">
      {items.map(({ title, description, track }, index) => {
        const open = index === active;
        const panelId = `${baseId}-step-${index}`;
        return (
          <li
            key={title}
            className={`flex min-w-0 flex-col transition-[flex-grow] duration-450 ease-out lg:basis-0 ${
              open ? "lg:grow-7" : "lg:grow"
            } ${tones[index % tones.length]}`}
          >
            <h3 className="lg:flex-1">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(index)}
                className={`flex w-full items-center px-5 text-start transition-colors focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current md:px-8 ${
                  open
                    ? "min-h-16 pt-6 text-step-head font-semibold tracking-[-0.03em] lg:pt-8"
                    : "min-h-16 text-step-lead font-semibold hover:bg-black/10 lg:h-full lg:items-end lg:px-0 lg:pb-8"
                }`}
              >
                <span
                  className={
                    open
                      ? "text-balance"
                      : "lg:mx-auto lg:rotate-180 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]"
                  }
                >
                  {title}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              hidden={!open}
              className="fade-rise flex flex-col gap-3 px-5 pt-4 pb-8 md:px-8 lg:pt-0 lg:pb-8"
            >
              <p className="max-w-[36ch] text-step-body">{description}</p>
              <p className="text-step-small font-medium">{track}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
