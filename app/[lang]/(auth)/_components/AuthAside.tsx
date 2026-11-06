import { CalendarCheck, LayoutDashboard, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import Logo from "@/components/layout/Logo";
import IconBadge from "@/components/ui/IconBadge";
import TextReveal from "@/components/ui/TextReveal";
import { getDictionary } from "@/lib/i18n/server";

const benefitIcons = {
  search: Search,
  register: CalendarCheck,
  dashboard: LayoutDashboard,
  security: ShieldCheck,
} satisfies Record<string, LucideIcon>;

const benefitKeys = ["search", "register", "dashboard", "security"] as const;

export default async function AuthAside() {
  const dict = await getDictionary();
  const t = dict.auth.aside;

  return (
    <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary to-primary-hover p-12 lg:flex xl:p-16">
      <div className="absolute -end-24 -top-24 -z-10 size-96 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="absolute -start-20 -bottom-32 -z-10 size-96 rounded-full bg-indigo-950/40 blur-3xl" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-size-[24px_24px]"
      />

      <Logo tone="inverse" />

      <div className="flex max-w-md flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-4xl leading-tight font-extrabold tracking-tight text-white">
            <TextReveal text={t.title} />
          </h2>
          <p className="text-base text-white/75">{t.description}</p>
        </div>
        <ul className="flex flex-col gap-5">
          {benefitKeys.map((key) => (
            <li key={key} className="flex items-start gap-4">
              <IconBadge icon={benefitIcons[key]} tone="inverse" />
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-white">{t.benefits[key].title}</p>
                <p className="text-sm text-white/70">{t.benefits[key].description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/60">{dict.common.tagline}</p>
    </aside>
  );
}
