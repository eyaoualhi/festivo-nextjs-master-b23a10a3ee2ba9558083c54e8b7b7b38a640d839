import Link from "next/link";
import { getSiteLinks, type NavLink } from "@/components/layout/navigation";
import { localizePath } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

export default async function SiteFooter() {
  const { locale, dict } = await getI18n();

  const accountLinks: NavLink[] = [
    { href: localizePath(locale, "/connexion"), label: dict.nav.login },
    { href: localizePath(locale, "/inscription"), label: dict.nav.register },
    { href: localizePath(locale, "/mot-de-passe-oublie"), label: dict.footer.forgotPassword },
  ];

  const columns = [
    { title: dict.footer.discover, links: getSiteLinks(locale, dict) },
    { title: dict.footer.account, links: accountLinks },
  ];

  return (
    <footer className="bg-band text-paper">
      <div className="mx-auto grid max-w-360 grid-cols-2 gap-x-6 gap-y-10 px-4 pt-16 md:grid-cols-12 md:gap-8 md:px-8 md:pt-20">
        <div className="col-span-2 flex max-w-sm flex-col gap-3 md:col-span-5">
          <p className="text-step-head font-semibold tracking-[-0.03em]">Festivo</p>
          <p className="text-step-body opacity-80">{dict.footer.description}</p>
        </div>
        {columns.map(({ title, links }, index) => (
          <nav
            key={title}
            aria-label={title}
            className={index === 0 ? "md:col-span-3 md:col-start-7" : "md:col-span-3"}
          >
            <h2 className="text-step-body font-semibold">{title}</h2>
            <ul className="mt-3 flex flex-col">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center text-step-body transition-colors hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-paper"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-360 px-4 pt-6 pb-8 text-step-small opacity-80 md:mt-16 md:px-8">
        {dict.common.tagline}
      </p>
    </footer>
  );
}
