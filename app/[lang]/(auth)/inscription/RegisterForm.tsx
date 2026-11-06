"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarHeart,
  CircleCheck,
  Globe,
  KeyRound,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Shapes,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { register, type FormState, type RegisterField } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import PasswordField from "@/components/ui/PasswordField";
import SelectField from "@/components/ui/SelectField";
import SubmitButton from "@/components/ui/SubmitButton";
import TextAreaField from "@/components/ui/TextAreaField";
import TextField from "@/components/ui/TextField";
import TextLink from "@/components/ui/TextLink";
import { useSessionRedirect } from "@/hooks/useSessionRedirect";
import { interpolate, localizePath, plural, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { focusField } from "@/lib/form-focus";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";
import {
  ACCOUNT_FIELDS,
  BIO_MAX_LENGTH,
  errorValues,
  ORGANIZER_FIELDS,
  PASSWORD_FIELDS,
  PASSWORD_MIN_LENGTH,
  readFields,
  validateAccount,
  validateOrganizer,
  validatePassword,
  type FieldErrors,
} from "@/lib/validation";
import { ORGANIZER_TYPES, SIGNUP_ROLES, type SignupRole } from "@/types/user";
import PasswordStrength from "@/app/[lang]/(auth)/_components/PasswordStrength";

type RegisterFormProps = {
  locale: Locale;
  t: Dictionary["auth"];
  orLabel: string;
};

type Step = "account" | "organizer";

const ROLE_ICONS: Record<SignupRole, LucideIcon> = {
  participant: CalendarHeart,
  organisateur: Megaphone,
};

/** Ordre de parcours des champs, pour placer le focus sur la première erreur. */
const FIELD_ORDER: RegisterField[] = [...ACCOUNT_FIELDS, ...PASSWORD_FIELDS, ...ORGANIZER_FIELDS];
const ACCOUNT_STEP_FIELDS: RegisterField[] = [...ACCOUNT_FIELDS, ...PASSWORD_FIELDS];

function validateStep(
  formData: FormData,
  role: SignupRole,
  step: Step,
): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {
    ...validateAccount(readFields(formData, ACCOUNT_FIELDS)),
    ...validatePassword(readFields(formData, PASSWORD_FIELDS)),
  };
  if (role === "organisateur" && step === "organizer") {
    Object.assign(errors, validateOrganizer(readFields(formData, ORGANIZER_FIELDS)));
  }
  return errors;
}

function hasAccountError(errors: FieldErrors<RegisterField>): boolean {
  return ACCOUNT_STEP_FIELDS.some((field) => errors[field]);
}

function focusFirstInvalid(form: HTMLFormElement | null, errors: FieldErrors<RegisterField>) {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) focusField(form, first);
}

/** Identifiants propres à ce formulaire : une page cachée peut avoir les mêmes champs. */
const fieldId = (field: RegisterField) => `register-${field}`;

const idle: FormState<RegisterField> = { status: "idle" };

export default function RegisterForm({ locale, t, orLabel }: RegisterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const redirectWithSession = useSessionRedirect();
  const [role, setRole] = useState<SignupRole>("participant");
  const [step, setStep] = useState<Step>("account");
  // Seuls les mots de passe sont suivis : ils alimentent l'indicateur de robustesse.
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [clientErrors, setClientErrors] = useState<FieldErrors<RegisterField> | null>(null);

  const [state, formAction] = useActionState(
    async (previous: FormState<RegisterField>, formData: FormData) => {
      const result = await register(previous, formData);
      // Jamais de mot de passe gardé en mémoire, même dans la page cachée après la navigation.
      setPassword("");
      setConfirmation("");
      if (result.status === "success") {
        await redirectWithSession(localizePath(locale, "/espace"));
      } else if (result.status === "error" && result.fieldErrors) {
        if (hasAccountError(result.fieldErrors)) setStep("account");
        focusFirstInvalid(formRef.current, result.fieldErrors);
      }
      return result;
    },
    idle,
  );

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;
  const errorKeys = clientErrors ?? serverErrors ?? {};
  const errors = fieldMessages(t.errors, errorKeys);
  const errorCount = Object.keys(errorKeys).length;
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const isOrganizer = role === "organisateur";
  const totalSteps = isOrganizer ? 2 : 1;
  const passwordsMatch = confirmation.length > 0 && confirmation === password;

  const chooseRole = (value: SignupRole) => {
    setRole(value);
    setStep("account");
    setClientErrors(null);
  };

  const revalidate = () => {
    if (!clientErrors || !formRef.current) return;
    setClientErrors(validateStep(new FormData(formRef.current), role, step));
  };

  const goToOrganizerStep = () => {
    if (!formRef.current) return;
    const nextErrors = validateStep(new FormData(formRef.current), role, "account");
    if (Object.keys(nextErrors).length > 0) {
      setClientErrors(nextErrors);
      focusFirstInvalid(formRef.current, nextErrors);
      return;
    }
    setClientErrors(null);
    setStep("organizer");
    focusField(formRef.current, "organizerName");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors = validateStep(new FormData(event.currentTarget), role, step);
    if (Object.keys(nextErrors).length === 0) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(nextErrors);
    if (step === "organizer" && hasAccountError(nextErrors)) setStep("account");
    focusFirstInvalid(event.currentTarget, nextErrors);
  };

  const showAccountStep = step === "account";

  return (
    <div className="flex flex-col gap-6">
      {errorCount > 0 && (
        <Alert tone="error" title={plural(locale, errorCount, t.register.errorTitle)}>
          {t.register.errorText}
        </Alert>
      )}
      {state.status === "error" && state.error && (
        <Alert tone="error" title={t.register.failedTitle}>
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
        <input type="hidden" name="locale" value={locale} />

        <fieldset hidden={!showAccountStep} className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-semibold text-ink">{t.register.roleLegend}</legend>
          <div className="grid gap-3 min-[400px]:grid-cols-2">
            {SIGNUP_ROLES.map((value) => {
              const Icon = ROLE_ICONS[value];
              const checked = role === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition has-focus-visible:ring-4 has-focus-visible:ring-primary/20 ${
                    checked
                      ? "border-primary bg-primary-soft"
                      : "border-line hover:border-line-strong hover:bg-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={checked}
                    onChange={() => chooseRole(value)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2">
                    <Icon
                      aria-hidden="true"
                      className={`size-5 ${checked ? "text-primary" : "text-muted"}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`size-4 rounded-full border-2 transition ${
                        checked ? "border-[5px] border-primary" : "border-line-strong"
                      }`}
                    />
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {t.register.roles[value].title}
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {t.register.roles[value].description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {isOrganizer && (
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            {interpolate(t.register.step, { n: showAccountStep ? 1 : 2, total: totalSteps })}
            {" · "}
            {showAccountStep ? t.register.accountStep : t.register.organizerStep}
          </p>
        )}

        <div hidden={!showAccountStep} className="flex flex-col gap-5">
          <TextField
            id={fieldId("name")}
            name="name"
            label={t.register.name}
            icon={UserRound}
            placeholder={t.register.namePlaceholder}
            autoComplete="name"
            defaultValue={values.name}
            error={errors.name}
            required
          />
          <TextField
            id={fieldId("email")}
            name="email"
            label={t.fields.email}
            type="email"
            icon={Mail}
            placeholder={t.fields.emailPlaceholder}
            autoComplete="email"
            inputMode="email"
            hint={t.register.emailHint}
            defaultValue={values.email}
            error={errors.email}
            required
          />
          <PasswordField
            id={fieldId("password")}
            name="password"
            label={t.fields.password}
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
        </div>

        {isOrganizer && (
          <div hidden={showAccountStep} className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-muted">{t.register.organizerIntro}</p>
            <TextField
              id={fieldId("organizerName")}
              name="organizerName"
              label={t.organizer.name}
              icon={Building2}
              placeholder={t.organizer.namePlaceholder}
              hint={t.organizer.nameHint}
              autoComplete="organization"
              defaultValue={values.organizerName}
              error={errors.organizerName}
              required
            />
            <SelectField
              id={fieldId("organizerType")}
              name="organizerType"
              label={t.organizer.type}
              icon={Shapes}
              placeholder={t.organizer.typePlaceholder}
              options={ORGANIZER_TYPES.map((type) => ({
                value: type,
                label: t.organizer.types[type],
              }))}
              defaultValue={values.organizerType ?? ""}
              error={errors.organizerType}
              required
            />
            <TextField
              id={fieldId("phone")}
              name="phone"
              label={t.organizer.phone}
              type="tel"
              icon={Phone}
              placeholder={t.organizer.phonePlaceholder}
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.phone}
              error={errors.phone}
              required
            />
            <TextField
              id={fieldId("city")}
              name="city"
              label={t.organizer.city}
              icon={MapPin}
              placeholder={t.organizer.cityPlaceholder}
              autoComplete="address-level2"
              defaultValue={values.city}
              error={errors.city}
              required
            />
            <TextAreaField
              id={fieldId("bio")}
              name="bio"
              label={t.organizer.bio}
              placeholder={t.organizer.bioPlaceholder}
              hint={interpolate(t.organizer.bioHint, errorValues)}
              maxLength={BIO_MAX_LENGTH}
              defaultValue={values.bio}
              error={errors.bio}
              required
            />
            <TextField
              id={fieldId("website")}
              name="website"
              label={t.organizer.website}
              icon={Globe}
              placeholder={t.organizer.websitePlaceholder}
              autoComplete="url"
              inputMode="url"
              defaultValue={values.website}
              error={errors.website}
            />
          </div>
        )}

        {isOrganizer && showAccountStep ? (
          <Button onClick={goToOrganizerStep} className="group w-full">
            {t.register.continue}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
          </Button>
        ) : (
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {isOrganizer && (
              <Button variant="secondary" onClick={() => setStep("account")} className="sm:w-auto">
                <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                {t.register.back}
              </Button>
            )}
            <SubmitButton pendingLabel={t.register.pending}>
              {isOrganizer ? t.register.submitOrganizer : t.register.submit}
            </SubmitButton>
          </div>
        )}

        <Divider label={orLabel} />
        <p className="text-center text-sm text-muted">
          {t.register.hasAccount}{" "}
          <TextLink href={localizePath(locale, "/connexion")}>{t.register.login}</TextLink>
        </p>
      </form>
    </div>
  );
}
