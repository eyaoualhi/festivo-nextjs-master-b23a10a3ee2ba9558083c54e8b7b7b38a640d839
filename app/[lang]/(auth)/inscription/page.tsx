import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import FormHeading from "@/components/ui/FormHeading";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import RegisterForm from "./RegisterForm";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.register.metaTitle };
}

export default async function RegisterPage() {
  const { locale, dict } = await getI18n();

  return (
    <div className="flex flex-col gap-8">
      <FormHeading
        icon={UserPlus}
        title={dict.auth.register.title}
        description={dict.auth.register.description}
      />
      <RegisterForm locale={locale} t={dict.auth} orLabel={dict.common.or} />
    </div>
  );
}
