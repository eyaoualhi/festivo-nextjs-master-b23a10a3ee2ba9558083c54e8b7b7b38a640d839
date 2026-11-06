"use client";

import { useActionState, useState, type FormEvent } from "react";
import { BadgeCheck, Building2, Globe, Mail, MapPin, Phone, Shapes, UserRound } from "lucide-react";
import { updateProfile, type FormState, type ProfileField } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import SelectField from "@/components/ui/SelectField";
import SubmitButton from "@/components/ui/SubmitButton";
import TextAreaField from "@/components/ui/TextAreaField";
import TextField from "@/components/ui/TextField";
import { useSessionRedirect } from "@/hooks/useSessionRedirect";
import { interpolate, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { focusField } from "@/lib/form-focus";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";
import {
  ACCOUNT_FIELDS,
  BIO_MAX_LENGTH,
  errorValues,
  ORGANIZER_FIELDS,
  readFields,
  validateAccount,
  validateOrganizer,
  type FieldErrors,
} from "@/lib/validation";
import { ORGANIZER_TYPES, type AccountUser } from "@/types/user";

type ProfileFormProps = {
  locale: Locale;
  user: Pick<AccountUser, "name" | "email" | "role" | "organizer">;
  t: Dictionary["profile"];
  auth: Dictionary["auth"];
  roleLabel: string;
};

const FIELD_ORDER: ProfileField[] = [...ACCOUNT_FIELDS, ...ORGANIZER_FIELDS];
/** Identifiants propres à ce formulaire : une page cachée peut avoir les mêmes champs. */
const fieldId = (field: ProfileField) => `profile-${field}`;
const idle: FormState<ProfileField> = { status: "idle" };

export default function ProfileForm({ locale, user, t, auth, roleLabel }: ProfileFormProps) {
  const refreshSession = useSessionRedirect();
  const isOrganizer = user.role === "organisateur";
  const [clientErrors, setClientErrors] = useState<FieldErrors<ProfileField> | null>(null);

  const [state, formAction] = useActionState(
    async (previous: FormState<ProfileField>, formData: FormData) => {
      const result = await updateProfile(previous, formData);
      if (result.status === "success") await refreshSession();
      return result;
    },
    idle,
  );

  const validate = (formData: FormData): FieldErrors<ProfileField> => ({
    ...validateAccount(readFields(formData, ACCOUNT_FIELDS)),
    ...(isOrganizer ? validateOrganizer(readFields(formData, ORGANIZER_FIELDS)) : {}),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors = validate(new FormData(event.currentTarget));
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
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

  const errorKeys =
    clientErrors ?? (state.status === "error" ? state.fieldErrors : undefined) ?? {};
  const errors = fieldMessages(auth.errors, errorKeys);
  const submitted = state.status === "error" ? (state.values ?? {}) : {};
  const organizer = user.organizer;
  const values: Partial<Record<ProfileField, string>> = {
    name: user.name,
    email: user.email,
    organizerName: organizer?.name,
    organizerType: organizer?.type,
    phone: organizer?.phone,
    city: organizer?.city,
    bio: organizer?.bio,
    website: organizer?.website,
    ...submitted,
  };

  return (
    <div className="flex flex-col gap-6">
      {Object.keys(errorKeys).length > 0 && (
        <Alert tone="error" title={t.errorTitle}>
          {auth.register.errorText}
        </Alert>
      )}
      {state.status === "error" && state.error && (
        <Alert tone="error" title={t.failedTitle}>
          {errorMessage(auth.errors, state.error)}
        </Alert>
      )}
      {state.status === "success" && !clientErrors && <Alert tone="success" title={t.saved} />}
      <form
        noValidate
        action={formAction}
        onSubmit={handleSubmit}
        onChange={revalidate}
        className="flex flex-col gap-8 rounded-3xl border border-line bg-card p-6 md:p-8"
      >
        <input type="hidden" name="locale" value={locale} />
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-5 font-display text-xl font-bold text-ink">{t.accountTitle}</legend>
          <TextField
            id={fieldId("name")}
            name="name"
            label={auth.register.name}
            icon={UserRound}
            autoComplete="name"
            defaultValue={values.name}
            error={errors.name}
            required
          />
          <TextField
            id={fieldId("email")}
            name="email"
            label={auth.fields.email}
            type="email"
            icon={Mail}
            autoComplete="email"
            inputMode="email"
            defaultValue={values.email}
            error={errors.email}
            required
          />
          <TextField
            id="profile-role"
            label={t.role}
            icon={BadgeCheck}
            value={roleLabel}
            hint={t.roleHint}
            readOnly
            disabled
          />
        </fieldset>

        {isOrganizer && (
          <fieldset className="flex flex-col gap-5">
            <legend className="mb-5 font-display text-xl font-bold text-ink">
              {t.organizerTitle}
            </legend>
            <TextField
              id={fieldId("organizerName")}
              name="organizerName"
              label={auth.organizer.name}
              icon={Building2}
              hint={auth.organizer.nameHint}
              autoComplete="organization"
              defaultValue={values.organizerName}
              error={errors.organizerName}
              required
            />
            <SelectField
              id={fieldId("organizerType")}
              name="organizerType"
              label={auth.organizer.type}
              icon={Shapes}
              placeholder={auth.organizer.typePlaceholder}
              options={ORGANIZER_TYPES.map((type) => ({
                value: type,
                label: auth.organizer.types[type],
              }))}
              defaultValue={values.organizerType ?? ""}
              error={errors.organizerType}
              required
            />
            <TextField
              id={fieldId("phone")}
              name="phone"
              label={auth.organizer.phone}
              type="tel"
              icon={Phone}
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.phone}
              error={errors.phone}
              required
            />
            <TextField
              id={fieldId("city")}
              name="city"
              label={auth.organizer.city}
              icon={MapPin}
              autoComplete="address-level2"
              defaultValue={values.city}
              error={errors.city}
              required
            />
            <TextAreaField
              id={fieldId("bio")}
              name="bio"
              label={auth.organizer.bio}
              hint={interpolate(auth.organizer.bioHint, errorValues)}
              maxLength={BIO_MAX_LENGTH}
              defaultValue={values.bio}
              error={errors.bio}
              required
            />
            <TextField
              id={fieldId("website")}
              name="website"
              label={auth.organizer.website}
              icon={Globe}
              placeholder={auth.organizer.websitePlaceholder}
              autoComplete="url"
              inputMode="url"
              defaultValue={values.website}
              error={errors.website}
            />
          </fieldset>
        )}

        <div className="sm:self-start">
          <SubmitButton pendingLabel={t.pending}>{t.save}</SubmitButton>
        </div>
      </form>
    </div>
  );
}
