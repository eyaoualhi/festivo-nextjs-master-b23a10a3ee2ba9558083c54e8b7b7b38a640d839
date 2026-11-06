import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import FormHeading from "@/components/ui/FormHeading";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import LoginForm from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.login.metaTitle };
}

export default async function LoginPage() {
  const { locale, dict } = await getI18n();

  return (
    <div className="flex flex-col gap-8">
      <FormHeading
        icon={LogIn}
        title={dict.auth.login.title}
        description={dict.auth.login.description}
      />
      <LoginForm locale={locale} t={dict.auth} orLabel={dict.common.or} />
    </div>
  );
}
