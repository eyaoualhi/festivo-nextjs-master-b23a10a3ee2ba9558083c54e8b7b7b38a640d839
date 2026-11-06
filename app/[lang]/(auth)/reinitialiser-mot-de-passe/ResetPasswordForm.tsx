"use client";

import { useActionState, useState, type FormEvent } from "react";
import { CircleCheck, KeyRound, LogIn } from "lucide-react";
import { resetPassword, type FormState, type ResetField } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import ButtonLink from "@/components/ui/ButtonLink";
import PasswordField from "@/components/ui/PasswordField";
import SubmitButton from "@/components/ui/SubmitButton";
import TextLink from "@/components/ui/TextLink";
import { focusField } from "@/lib/form-focus";
import { interpolate, localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";
import {
  PASSWORD_FIELDS,
  PASSWORD_MIN_LENGTH,
  readFields,
  validatePassword,
  type FieldErrors,
} from "@/lib/validation";
import PasswordStrength from "@/app/[lang]/(auth)/_components/PasswordStrength";

type ResetPasswordFormProps = {
  locale: Locale;
  token: string;
  t: Dictionary["auth"];
};

/** Identifiants propres à ce formulaire : une page cachée peut avoir les mêmes champs. */
const fieldId = (field: ResetField) => `reset-${field}`;
const idle: FormState<ResetField> = { status: "idle" };

export default function ResetPasswordForm({ locale, token, t }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [clientErrors, setClientErrors] = useState<FieldErrors<ResetField> | null>(null);

  const [state, formAction] = useActionState(
    async (previous: FormState<ResetField>, formData: FormData) => {
      const result = await resetPassword(previous, formData);
      setPassword("");
      setConfirmation("");
      return result;
    },
    idle,
  );

  const validate = (formData: FormData) => validatePassword(readFields(formData, PASSWORD_FIELDS));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors = validate(new FormData(event.currentTarget));
    const firstInvalid = PASSWORD_FIELDS.find((field) => nextErrors[field]);
    if (!firstInvalid) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(nextErrors);
    focusField(event.currentTarget, firstInvalid);
  };

  const revalidate = (event: FormEvent<HTMLFormElement>) => {
    if (clientErrors) setClientErrors(validate(new FormData(event.currentTarget)));
  };

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-6">
        <Alert tone="success" title={t.reset.successTitle}>
          {t.reset.successText}
        </Alert>
        <ButtonLink href={localizePath(locale, "/connexion")} className="w-full">
          <LogIn aria-hidden="true" className="size-4" />
          {t.reset.login}
        </ButtonLink>
      </div>
    );
  }

  const errorKeys =
    clientErrors ?? (state.status === "error" ? state.fieldErrors : undefined) ?? {};
  const errors = fieldMessages(t.errors, errorKeys);
  const passwordsMatch = confirmation.length > 0 && confirmation === password;

  return (
    <div className="flex flex-col gap-6">
      {Object.keys(errorKeys).length > 0 && (
        <Alert tone="error" title={t.reset.errorTitle}>
          {t.login.errorText}
        </Alert>
      )}
      {state.status === "error" && state.error && (
        <Alert tone="error" title={t.reset.failedTitle}>
          {errorMessage(t.errors, state.error)}{" "}
          {state.error === "resetInvalid" && (
            <TextLink href={localizePath(locale, "/mot-de-passe-oublie")}>
              {t.reset.requestNew}
            </TextLink>
          )}
        </Alert>
      )}
      <form
        noValidate
        action={formAction}
        onSubmit={handleSubmit}
        onChange={revalidate}
        className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8"
      >
        <input type="hidden" name="token" value={token} />
        <PasswordField
          id={fieldId("password")}
          name="password"
          label={t.reset.password}
          placeholder={interpolate(t.register.passwordPlaceholder, { n: PASSWORD_MIN_LENGTH })}
          autoComplete="new-password"
          showLabel={t.fields.showPassword}
          hideLabel={t.fields.hidePassword}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        >
          <PasswordStrength password={password} labels={t.strength} />
        </PasswordField>
        <PasswordField
          id={fieldId("passwordConfirmation")}
          name="passwordConfirmation"
          label={t.register.confirmation}
          icon={KeyRound}
          placeholder={t.register.confirmationPlaceholder}
          autoComplete="new-password"
          showLabel={t.fields.showPassword}
          hideLabel={t.fields.hidePassword}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={errors.passwordConfirmation}
          required
        >
          {passwordsMatch && (
            <p className="flex items-center gap-1.5 text-xs text-success">
              <CircleCheck aria-hidden="true" className="size-4" />
              {t.register.passwordsMatch}
            </p>
          )}
        </PasswordField>
        <SubmitButton pendingLabel={t.reset.pending}>{t.reset.submit}</SubmitButton>
      </form>
    </div>
  );
}
