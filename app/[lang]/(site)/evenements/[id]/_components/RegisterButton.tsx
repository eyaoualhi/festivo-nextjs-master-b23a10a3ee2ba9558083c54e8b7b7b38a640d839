import { CalendarCheck, CircleSlash, ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import ButtonLink from "@/components/ui/ButtonLink";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { connectDB } from "@/lib/db";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { getUserRegistration } from "@/lib/registrations";
import Event from "@/models/Event";
import CancelAction from "./CancelAction";
import RegisterAction from "./RegisterAction";

type RegisterButtonProps = {
  full: boolean;
  eventId?: string;
  eventSlug: string;
  className?: string;
};

export default async function RegisterButton({
  full,
  eventId,
  eventSlug,
  className = "",
}: RegisterButtonProps) {
  const { locale, dict } = await getI18n();
  const session = await auth();

  // 1. Visiteur non connecté : rediriger vers la page de connexion
  if (!session?.user) {
    if (full) {
      return (
        <button type="button" disabled className={buttonClasses("secondary", className)}>
          <CircleSlash aria-hidden="true" className="size-5" />
          {dict.event.full}
        </button>
      );
    }

    return (
      <ButtonLink href={localizePath(locale, "/connexion")} variant="cta" className={className}>
        <CalendarCheck aria-hidden="true" className="size-5" />
        {dict.event.register}
      </ButtonLink>
    );
  }

  // 2. Utilisateur connecté avec un rôle autre que participant
  if (session.user.role !== "participant") {
    return (
      <button
        type="button"
        disabled
        className={buttonClasses("secondary", `${className} cursor-not-allowed opacity-75`)}
      >
        <ShieldAlert aria-hidden="true" className="size-5" />
        {dict.event.notForRole}
      </button>
    );
  }

  // 3. Participant connecté : vérifier si déjà inscrit
  const registration = await getUserRegistration(session.user.id, eventSlug);

  if (registration) {
    return (
      <div className="flex w-full flex-col gap-2">
        <CancelAction
          registrationId={registration.id}
          label={dict.event.cancelRegistration}
          confirmText={dict.event.cancelConfirm}
          successText={dict.event.cancelSuccess}
          errorText={dict.event.cancelError}
          className={className}
        />
        <p className="text-center text-xs font-semibold text-success">
          {dict.event.alreadyRegistered}
        </p>
      </div>
    );
  }

  // Événement complet
  if (full) {
    return (
      <button type="button" disabled className={buttonClasses("secondary", className)}>
        <CircleSlash aria-hidden="true" className="size-5" />
        {dict.event.full}
      </button>
    );
  }

  // Résoudre l'ObjectId mongo si nécessaire
  let targetEventId = eventId;
  if (!targetEventId) {
    await connectDB();
    const eventDoc = await Event.findOne({ slug: eventSlug }).select("_id");
    if (eventDoc) {
      targetEventId = eventDoc._id.toString();
    }
  }

  if (!targetEventId) {
    return (
      <button type="button" disabled className={buttonClasses("secondary", className)}>
        {dict.event.registerError}
      </button>
    );
  }

  return (
    <RegisterAction
      eventId={targetEventId}
      label={dict.event.register}
      successText={dict.event.registerSuccess}
      errorText={dict.event.registerError}
      className={className}
    />
  );
}
