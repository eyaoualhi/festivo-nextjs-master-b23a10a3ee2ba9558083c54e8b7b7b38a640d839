import { Suspense } from "react";
import type { Metadata } from "next";
import { requireUser } from "@/lib/dal";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";
import AvatarForm from "./AvatarForm";
import DeleteAccount from "./DeleteAccount";
import ProfileForm from "./ProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.profile.metaTitle };
}

export default async function ProfilePage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const { locale, dict } = await getI18n();
  const user = await requireUser(locale);

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-step-head font-extrabold tracking-tight text-ink">
          {dict.profile.title}
        </h1>
        <p className="text-step-lead text-muted">{dict.profile.description}</p>
      </header>
      <AvatarForm
        locale={locale}
        user={{ id: user.id, name: user.name, avatarVersion: user.avatarVersion }}
        t={dict.profile}
        auth={dict.auth}
      />
      <ProfileForm
        locale={locale}
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          organizer: user.organizer,
        }}
        t={dict.profile}
        auth={dict.auth}
        roleLabel={dict.dashboard.roles[user.role]}
      />
      <DeleteAccount locale={locale} t={dict.profile} auth={dict.auth} />
    </div>
  );
}
