"use client";

import { useActionState, useState, type FormEvent } from "react";
import { ArrowLeft, Inbox, Link2, Mail } from "lucide-react";
import { requestPasswordReset, type ForgotField, type FormState } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import SubmitButton from "@/components/ui/SubmitButton";
import TextField from "@/components/ui/TextField";
import TextLink from "@/components/ui/TextLink";
import { focusField } from "@/lib/form-focus";
import { interpolate, localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";
import { isValidEmail, type FieldErrors } from "@/lib/validation";

type ForgotPasswordFormProps = {
  locale: Locale;
  t: Dictionary["auth"];
};

const stepIcons = [Mail, Inbox, Link2];
const idle: FormState<ForgotField> = { status: "idle" };

function validate(formData: FormData): FieldErrors<ForgotField> {
  const email = formData.get("email")?.toString() ?? "";
  if (!email.trim()) return { email: "emailRequired" };
  if (!isValidEmail(email)) return { email: "emailInvalid" };
  return {};
}

export default function ForgotPasswordForm({ locale, t }: ForgotPasswordFormProps) {
  const [clientErrors, setClientErrors] = useState<FieldErrors<ForgotField> | null>(null);
  const [state, formAction] = useActionState(requestPasswordReset, idle);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors = validate(new FormData(event.currentTarget));
    if (!nextErrors.email) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(nextErrors);
    focusField(event.currentTarget, "email");
  };

  const revalidate = (event: FormEvent<HTMLFormElement>) => {
    if (clientErrors) setClientErrors(validate(new FormData(event.currentTarget)));
  };

  const errors = fieldMessages(
    t.errors,
    clientErrors ?? (state.status === "error" ? state.fieldErrors : undefined),
  );
  const values = state.status === "error" ? (state.values ?? {}) : {};

  return (
    <div className="flex flex-col gap-6">
      {state.status === "success" && (
        <Alert tone="success" title={t.forgot.sentTitle}>
          {t.forgot.sentText}
        </Alert>
      )}
      {state.status === "error" && state.error && (
        <Alert tone="error" title={t.forgot.failedTitle}>
          {errorMessage(t.errors, state.error)}
        </Alert>
      )}
      <form
        noValidate
        action={formAction}
        onSubmit={handleSubmit}
        onChange={revalidate}
        className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8"
      >
        <input type="hidden" name="locale" value={locale} />
        <ol className="flex flex-col gap-3 rounded-xl bg-surface p-4">
          {t.forgot.steps.map((text, index) => {
            const Icon = stepIcons[index] ?? Mail;
            return (
              <li key={text} className="flex items-center gap-3 text-sm text-ink">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-xs">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <span className="sr-only">
                    {interpolate(t.forgot.stepLabel, { n: index + 1 })}
                  </span>
                  {text}
                </span>
              </li>
            );
          })}
        </ol>
        <TextField
          id="forgot-email"
          name="email"
          label={t.fields.email}
          type="email"
          icon={Mail}
          placeholder={t.fields.emailPlaceholder}
          autoComplete="email"
          inputMode="email"
          defaultValue={values.email}
          error={errors.email}
          required
        />
        <SubmitButton pendingLabel={t.forgot.pending}>{t.forgot.submit}</SubmitButton>
        <p className="text-center text-sm">
          <TextLink
            href={localizePath(locale, "/connexion")}
            className="inline-flex items-center gap-1.5"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {t.forgot.back}
          </TextLink>
        </p>
      </form>
    </div>
  );
}
