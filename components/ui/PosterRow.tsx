"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PosterRowProps = {
  /** Noms accessibles des flèches de défilement. */
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
};

const arrowClasses =
  "absolute top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 shadow-xl backdrop-blur-md transition group-hover/row:opacity-100 hover:scale-110 hover:bg-black/80 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary md:flex";

/** Rangée d'affiches qui défile horizontalement, flèches sur les bords (façon plateforme de streaming). */
export default function PosterRow({ previousLabel, nextLabel, children }: PosterRowProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const towardsEnd = getComputedStyle(list).direction === "rtl" ? -direction : direction;
    list.scrollBy({ left: towardsEnd * list.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pt-3 pb-6 md:-mx-10 md:scroll-px-10 md:gap-4 md:px-10"
      >
        {children}
      </ul>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label={previousLabel}
        className={`${arrowClasses} -start-2 md:-start-5`}
      >
        <ChevronLeft aria-hidden="true" className="size-6 rtl:-scale-x-100" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={nextLabel}
        className={`${arrowClasses} -end-2 md:-end-5`}
      >
        <ChevronRight aria-hidden="true" className="size-6 rtl:-scale-x-100" />
      </button>
    </div>
  );
}

export function PosterRowItem({ children }: { children: ReactNode }) {
  return (
    <li className="w-[46%] max-w-60 shrink-0 snap-start sm:w-[31%] md:w-[calc((100%-3rem)/4)] md:max-w-none lg:w-[calc((100%-4rem)/5)] xl:w-[calc((100%-5rem)/6)]">
      {children}
    </li>
  );
}
