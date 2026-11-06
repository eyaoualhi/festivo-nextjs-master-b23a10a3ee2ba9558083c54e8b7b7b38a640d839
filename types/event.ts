export const EVENT_CATEGORIES = ["musique", "tech", "sport", "art", "business", "atelier"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

/** Statuts stockés (D-33) ; seuls les événements publiés sont visibles des visiteurs. */
export const EVENT_STATUSES = ["brouillon", "publie", "annule"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type Organizer = {
  id: string;
  name: string;
  bio: string;
};

export type EventSummary = {
  id: string;
  title: string;
  category: EventCategory;
  startsAt: Date;
  endsAt: Date;
  venue: string;
  city: string;
  imageUrl: string;
  imageAlt: string;
  capacity: number;
  spotsLeft: number;
};

export type EventDetail = EventSummary & {
  address: string;
  description: string[];
  organizer: Organizer;
};

export type EventFilters = {
  query?: string;
  category?: EventCategory;
  city?: string;
  month?: string;
};
