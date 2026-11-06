import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import FormHeading from "@/components/ui/FormHeading";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import ForgotPasswordForm from "./ForgotPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.forgot.metaTitle };
}

export default async function ForgotPasswordPage() {
  const { locale, dict } = await getI18n();

  return (
    <div className="flex flex-col gap-8">
      <FormHeading
        icon={KeyRound}
        title={dict.auth.forgot.title}
        description={dict.auth.forgot.description}
      />
      <ForgotPasswordForm locale={locale} t={dict.auth} />
    </div>
  );
}
