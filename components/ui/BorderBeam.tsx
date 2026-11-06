import type { CSSProperties } from "react";

type BorderBeamProps = {
  size?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

/** Faisceau lumineux qui parcourt la bordure du parent (`relative`, coins arrondis) — Vengeance UI. */
export default function BorderBeam({
  size = 200,
  duration = 12,
  delay = 0,
  className = "",
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--beam-size": size,
          "--beam-duration": duration,
          "--beam-delay": delay,
        } as CSSProperties
      }
      className={`border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
    />
  );
}
