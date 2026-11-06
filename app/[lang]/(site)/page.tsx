import { Suspense } from "react";
import {
  getAlmostFullEvents,
  getEventById,
  getOrganizerSummaries,
  getUpcomingEvents,
  searchEvents,
} from "@/lib/events";
import { getDictionary } from "@/lib/i18n/server";
import CallToAction from "./_components/CallToAction";
import CategoriesSection from "./_components/CategoriesSection";
import CitiesSection from "./_components/CitiesSection";
import EventsShowcase from "./_components/EventsShowcase";
import FaqSection from "./_components/FaqSection";
import HeroSection from "./_components/HeroSection";
import HomeMotion from "./_components/HomeMotion";
import HomeSkeleton from "./_components/HomeSkeleton";
import OrganizersSection from "./_components/OrganizersSection";
import StepsSection from "./_components/StepsSection";

/** Le vernissage de la Galerie Bleu Médina illustre la page des organisateurs. */
const ORGANIZERS_PICTURE = "vernissage-regards-medina";

export default async function HomePage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<HomeSkeleton label={dict.home.loading} />}>
      <HomeContent />
    </Suspense>
  );
}

/** Lit les événements à chaque requête (D-33) ; les animations démarrent avec le contenu. */
async function HomeContent() {
  const [allEvents, almostFull, music, organizers, picture] = await Promise.all([
    getUpcomingEvents(),
    getAlmostFullEvents(),
    searchEvents({ category: "musique" }),
    getOrganizerSummaries(),
    getEventById(ORGANIZERS_PICTURE),
  ]);

  return (
    <HomeMotion>
      <HeroSection events={allEvents} organizerCount={organizers.length} />
      <CategoriesSection events={allEvents} />
      <EventsShowcase upcoming={allEvents} almostFull={almostFull} music={music} />
      <CitiesSection events={allEvents} />
      <OrganizersSection organizers={organizers} picture={picture} />
      <StepsSection />
      <FaqSection />
      <CallToAction />
    </HomeMotion>
  );
}
