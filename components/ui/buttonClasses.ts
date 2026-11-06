export type ButtonVariant = "primary" | "cta" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-800 disabled:hover:bg-blue-600",
  cta: "bg-cta text-white hover:bg-cta-hover disabled:hover:bg-cta",
  secondary: "bg-tile text-ink hover:bg-blue-100 hover:text-night disabled:hover:bg-tile",
  ghost: "text-ink hover:bg-tile",
  danger: "bg-red-700 text-white hover:bg-red-800 disabled:hover:bg-red-700",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`.trim();
}
