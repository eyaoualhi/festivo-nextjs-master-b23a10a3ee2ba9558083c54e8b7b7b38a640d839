import { getI18n } from "@/lib/i18n/server";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default async function PreferenceControls() {
  const { locale, dict } = await getI18n();
  const { theme, light, dark, system, language } = dict.preferences;

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher locale={locale} label={language} />
      <ThemeSwitcher labels={{ theme, light, dark, system }} />
    </div>
  );
}
