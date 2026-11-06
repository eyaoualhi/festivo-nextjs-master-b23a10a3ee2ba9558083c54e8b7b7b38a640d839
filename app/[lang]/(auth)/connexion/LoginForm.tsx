"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { login, type FormState, type LoginField } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import Divider from "@/components/ui/Divider";
import PasswordField from "@/components/ui/PasswordField";
import SubmitButton from "@/components/ui/SubmitButton";
import TextField from "@/components/ui/TextField";
import TextLink from "@/components/ui/TextLink";
import { useSessionRedirect } from "@/hooks/useSessionRedirect";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { focusField } from "@/lib/form-focus";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";
import { isValidEmail, readFields, type FieldErrors } from "@/lib/validation";

type LoginFormProps = {
  locale: Locale;
  t: Dictionary["auth"];
  orLabel: string;
};

const FIELDS = ["email", "password"] as const satisfies LoginField[];
/** Identifiants propres à ce formulaire : une page cachée peut avoir les mêmes champs. */
const fieldId = (field: LoginField) => `login-${field}`;

function validate(formData: FormData): FieldErrors<LoginField> {
  const { email, password } = readFields(formData, FIELDS);
  const errors: FieldErrors<LoginField> = {};
  if (!email.trim()) errors.email = "emailRequired";
  else if (!isValidEmail(email)) errors.email = "emailInvalid";
  if (!password) errors.password = "passwordRequired";
  return errors;
}

const idle: FormState<LoginField> = { status: "idle" };

export default function LoginForm({ locale, t, orLabel }: LoginFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const redirectWithSession = useSessionRedirect();
  const [clientErrors, setClientErrors] = useState<FieldErrors<LoginField> | null>(null);

  const [state, formAction] = useActionState(
    async (previous: FormState<LoginField>, formData: FormData) => {
      const result = await login(previous, formData);
      if (result.status === "success") {
        await redirectWithSession(localizePath(locale, "/espace"));
      } else {
        focusField(formRef.current, "password");
      }
      return result;
    },
    idle,
  );

  const errorKeys =
    clientErrors ?? (state.status === "error" ? state.fieldErrors : undefined) ?? {};
  const errors = fieldMessages(t.errors, errorKeys);
  const values = state.status === "error" ? (state.values ?? {}) : {};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors = validate(new FormData(event.currentTarget));
    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
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

  return (
    <div className="flex flex-col gap-6">
      {Object.keys(errorKeys).length > 0 && (
        <Alert tone="error" title={t.login.errorTitle}>
          {t.login.errorText}
        </Alert>
      )}
      {state.status === "error" && state.error && (
        <Alert tone="error" title={t.login.failedTitle}>
          {errorMessage(t.errors, state.error)}
        </Alert>
      )}
      <form
        ref={formRef}
        noValidate
        action={formAction}
        onSubmit={handleSubmit}
        onChange={revalidate}
        className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8"
      >
        <TextField
          id={fieldId("email")}
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
        <PasswordField
          id={fieldId("password")}
          name="password"
          label={t.fields.password}
          placeholder={t.login.passwordPlaceholder}
          autoComplete="current-password"
          showLabel={t.fields.showPassword}
          hideLabel={t.fields.hidePassword}
          error={errors.password}
          required
          labelAction={
            <TextLink href={localizePath(locale, "/mot-de-passe-oublie")} className="text-xs">
              {t.login.forgotPassword}
            </TextLink>
          }
        />
        <SubmitButton pendingLabel={t.login.pending}>{t.login.submit}</SubmitButton>
        <Divider label={orLabel} />
        <p className="text-center text-sm text-muted">
          {t.login.noAccount}{" "}
          <TextLink href={localizePath(locale, "/inscription")}>{t.login.createAccount}</TextLink>
        </p>
      </form>
    </div>
  );
}
