import type { Metadata, Viewport } from "next";
import { Albert_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import AuthSessionProvider from "@/components/layout/AuthSessionProvider";
import InlineScript from "@/components/layout/InlineScript";
import OfflineBanner from "@/components/layout/OfflineBanner";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import { localeInfo, locales } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { themeScript } from "@/lib/theme";
import "../globals.css";

const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export async function generateStaticParams(): Promise<{ lang: string }[]> {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: {
      default: "Festivo",
      template: "%s | Festivo",
    },
    description: dict.meta.description,
    applicationName: "Festivo",
    manifest: "/manifest.json",
    icons: {
      icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
      apple: "/icons/icon-192x192.png",
    },
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [localeInfo[locale].htmlLang, `/${locale}`]),
      ),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2748c4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await getI18n();
  const { htmlLang, dir } = localeInfo[locale];

  return (
    <html
      lang={htmlLang}
      dir={dir}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${albert.variable} ${arabic.variable} h-full antialiased`}
    >
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body className="flex min-h-full flex-col">
        <ServiceWorkerRegister />
        <OfflineBanner label={dict.offline.banner} />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
