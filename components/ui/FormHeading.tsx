import type { LucideIcon } from "lucide-react";

type FormHeadingProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FormHeading({ icon: Icon, title, description }: FormHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-start">
      <span className="relative flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-xs">
        <Icon aria-hidden="true" className="size-7" />
        <span className="absolute -end-1 -top-1 size-3.5 rounded-full border-2 border-card bg-accent" />
      </span>
      <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-tight text-ink md:text-3xl">
        {title}
      </h1>
      <p className="max-w-sm text-sm text-muted md:text-base">{description}</p>
    </div>
  );
}
