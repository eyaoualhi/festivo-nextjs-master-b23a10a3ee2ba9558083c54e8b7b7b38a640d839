import type { EventCategory } from "@/types/event";

export const categories: EventCategory[] = [
  "musique",
  "tech",
  "sport",
  "art",
  "business",
  "atelier",
];

export function isEventCategory(value: string): value is EventCategory {
  return categories.some((category) => category === value);
}
