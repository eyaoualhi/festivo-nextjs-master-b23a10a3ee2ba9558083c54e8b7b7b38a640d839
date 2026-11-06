import { Check, ShieldCheck, X } from "lucide-react";
import { interpolate } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { PASSWORD_MIN_LENGTH, getPasswordChecks } from "@/lib/validation";

type PasswordStrengthProps = {
  password: string;
  labels: Dictionary["auth"]["strength"];
};

const levelTones = [
  { text: "text-danger", bar: "bg-danger" },
  { text: "text-danger", bar: "bg-danger" },
  { text: "text-warning", bar: "bg-warning" },
  { text: "text-primary", bar: "bg-primary" },
  { text: "text-success", bar: "bg-success" },
];

export default function PasswordStrength({ password, labels }: PasswordStrengthProps) {
  const checks = getPasswordChecks(password);
  const score = checks[0].passed ? checks.filter((check) => check.passed).length : 0;
  const tone = levelTones[score];

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface p-3.5" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          {labels.title}
        </span>
        <span className={`font-semibold ${password ? tone.text : "text-muted"}`}>
          {password ? labels.levels[score] : "—"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`h-1.5 rounded-full transition-colors ${
              password && score >= step ? tone.bar : "bg-line"
            }`}
          />
        ))}
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {checks.map(({ key, passed, required }) => (
          <li
            key={key}
            className={`flex items-center gap-1.5 text-xs ${passed ? "text-success" : "text-muted"}`}
          >
            {passed ? (
              <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={3} />
            ) : (
              <X aria-hidden="true" className="size-3.5 shrink-0" />
            )}
            <span>
              {interpolate(labels[key], { n: PASSWORD_MIN_LENGTH })}
              {required && <span className="sr-only">{labels.required}</span>}
              <span className="sr-only">{passed ? labels.passed : labels.failed}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
