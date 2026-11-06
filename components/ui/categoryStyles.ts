import {
  BriefcaseBusiness,
  Cpu,
  Music,
  Palette,
  Shapes,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { EventCategory } from "@/types/event";

type CategoryStyle = {
  icon: LucideIcon;
  tone: string;
};

export const categoryStyles: Record<EventCategory, CategoryStyle> = {
  musique: {
    icon: Music,
    tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  tech: { icon: Cpu, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  sport: {
    icon: Trophy,
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  art: { icon: Palette, tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  business: {
    icon: BriefcaseBusiness,
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  atelier: {
    icon: Shapes,
    tone: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
};
