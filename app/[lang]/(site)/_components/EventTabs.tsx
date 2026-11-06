"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type EventTab = {
  key: string;
  label: string;
  description: string;
  href: string;
  panel: ReactNode;
};

type EventTabsProps = {
  tabs: EventTab[];
  listLabel: string;
  seeAllLabel: string;
};

export default function EventTabs({ tabs, listLabel, seeAllLabel }: EventTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const current = tabs[active] ?? tabs[0];

  function focusTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const backward = rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward) focusTab(active + 1);
    else if (event.key === backward) focusTab(active - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(tabs.length - 1);
    else return;
    event.preventDefault();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div
          role="tablist"
          aria-label={listLabel}
          onKeyDown={handleKeyDown}
          className="flex flex-wrap gap-2"
        >
          {tabs.map(({ key, label }, index) => {
            const selected = index === active;
            return (
              <button
                key={key}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={`inline-flex min-h-12 shrink-0 items-center px-5 text-step-body font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px ${
                  selected
                    ? "bg-ink text-canvas"
                    : "bg-tile text-ink hover:bg-blue-100 hover:text-night"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <Link
          href={current.href}
          className="group inline-flex min-h-12 shrink-0 items-center gap-2 self-start text-step-body font-semibold text-ink underline decoration-2 underline-offset-[6px] transition-colors hover:text-cta focus-visible:outline-2 focus-visible:outline-primary md:self-auto"
        >
          {seeAllLabel}
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </Link>
      </div>
      <p aria-live="polite" className="text-step-body text-ink">
        {current.description}
      </p>
      {tabs.map(({ key, panel }, index) => (
        <div
          key={key}
          role="tabpanel"
          id={`${baseId}-panel-${key}`}
          aria-labelledby={`${baseId}-tab-${key}`}
          hidden={index !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
