"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type DropdownProps = {
  /** Nom accessible du bouton. */
  label: string;
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
};

export const dropdownItemClasses =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-start text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary";

export default function Dropdown({ label, trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 bg-tile px-2.5 text-sm font-semibold text-ink transition-colors hover:bg-blue-100 hover:text-night focus-visible:outline-2 focus-visible:outline-primary"
      >
        {trigger}
      </button>
      {open && (
        <div id={panelId} className="absolute end-0 top-full z-40 mt-2 w-48 bg-tile p-1.5">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
