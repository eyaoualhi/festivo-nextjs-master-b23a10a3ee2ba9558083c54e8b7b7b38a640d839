import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/layout/Logo";
import PreferenceControls from "@/components/layout/PreferenceControls";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import AuthAside from "./_components/AuthAside";

export default async function AuthLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await getI18n();

  return (
    <div className="grid flex-1 lg:grid-cols-[1fr_1.05fr]">
      <AuthAside />
      <div className="flex flex-col bg-surface lg:bg-canvas">
        <header className="flex h-16 items-center justify-between gap-3 px-4 md:px-10">
          <Link
            href={localizePath(locale, "/")}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {dict.auth.back}
          </Link>
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Logo />
            </div>
            <PreferenceControls />
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center px-4 pt-4 pb-12 md:justify-center md:px-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
