import type { LucideIcon } from "lucide-react";

type IconBadgeTone = "primary" | "accent" | "success" | "warning" | "danger" | "inverse";
type IconBadgeSize = "sm" | "md" | "lg";

type IconBadgeProps = {
  icon: LucideIcon;
  tone?: IconBadgeTone;
  size?: IconBadgeSize;
  className?: string;
};

const tones: Record<IconBadgeTone, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  inverse: "bg-white/15 text-white ring-1 ring-white/20",
};

const sizes: Record<IconBadgeSize, { box: string; icon: string }> = {
  sm: { box: "size-9 rounded-lg", icon: "size-5" },
  md: { box: "size-11 rounded-xl", icon: "size-6" },
  lg: { box: "size-14 rounded-2xl", icon: "size-7" },
};

export default function IconBadge({
  icon: Icon,
  tone = "primary",
  size = "md",
  className = "",
}: IconBadgeProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${sizes[size].box} ${tones[tone]} ${className}`.trim()}
    >
      <Icon aria-hidden="true" className={sizes[size].icon} />
    </span>
  );
}
