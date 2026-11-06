import type { LucideIcon } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  title: string;
  description: string;
  tone?: "default" | "inverse";
};

export default function SectionHeading({
  id,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  tone = "default",
}: SectionHeadingProps) {
  const inverse = tone === "inverse";

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          inverse ? "bg-white/10 text-white" : "bg-primary-soft text-primary"
        }`}
      >
        <EyebrowIcon aria-hidden="true" className="size-3.5" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`font-display text-3xl leading-[1.12] font-extrabold tracking-tight md:text-5xl ${
          inverse ? "text-white" : "text-ink"
        }`}
      >
        <TextReveal text={title} />
      </h2>
      <p
        className={`text-base leading-relaxed md:text-lg ${inverse ? "text-white/75" : "text-muted"}`}
      >
        {description}
      </p>
    </div>
  );
}
