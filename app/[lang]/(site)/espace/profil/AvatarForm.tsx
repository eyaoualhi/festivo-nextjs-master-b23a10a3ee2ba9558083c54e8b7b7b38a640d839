"use client";

import { useActionState, useState, type FormEvent } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { removeAvatar, updateAvatar, type AvatarField, type FormState } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import FieldMessage from "@/components/ui/FieldMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import { focusField } from "@/lib/form-focus";
import { interpolate, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { errorMessage } from "@/lib/i18n/errors";
import { AVATAR_TYPES, errorValues, validateAvatar, type FieldErrorKey } from "@/lib/validation";

type AvatarFormProps = {
  locale: Locale;
  user: { id: string; name: string; avatarVersion?: number };
  t: Dictionary["profile"];
  auth: Dictionary["auth"];
};

const FIELD_ID = "avatar-file";
const idle: FormState<AvatarField> = { status: "idle" };

/** D-14, D-32 : envoi, remplacement ou retrait de la photo de profil. */
export default function AvatarForm({ locale, user, t, auth }: AvatarFormProps) {
  const [clientError, setClientError] = useState<FieldErrorKey | null>(null);
  const [uploadState, uploadAction] = useActionState(updateAvatar, idle);
  const [removeState, removeAction] = useActionState(removeAvatar, idle);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const file = new FormData(event.currentTarget).get("avatar");
    const error = validateAvatar(file instanceof File ? file : null);
    setClientError(error ?? null);
    if (!error) return;
    event.preventDefault();
    focusField(event.currentTarget, "avatar");
  };

  const fieldError =
    clientError ?? (uploadState.status === "error" ? uploadState.fieldErrors?.avatar : undefined);
  const actionError =
    (uploadState.status === "error" && uploadState.error) ||
    (removeState.status === "error" && removeState.error) ||
    undefined;
  const hasPhoto = Boolean(user.avatarVersion);
  const hint = interpolate(t.avatarHint, errorValues);
  const messageId = `${FIELD_ID}-message`;

  return (
    <section
      aria-labelledby="avatar-title"
      className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 md:p-8"
    >
      <h2 id="avatar-title" className="font-display text-xl font-bold text-ink">
        {t.avatarTitle}
      </h2>
      {actionError && (
        <Alert tone="error" title={t.avatarFailed}>
          {errorMessage(auth.errors, actionError)}
        </Alert>
      )}
      {uploadState.status === "success" && !clientError && hasPhoto && (
        <Alert tone="success" title={t.avatarSaved} />
      )}
      {removeState.status === "success" && !hasPhoto && (
        <Alert tone="success" title={t.avatarRemoved} />
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar
          userId={user.id}
          name={user.name}
          version={user.avatarVersion}
          className="size-24 rounded-3xl text-2xl"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <form
            noValidate
            action={uploadAction}
            onSubmit={handleSubmit}
            onChange={() => setClientError(null)}
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="locale" value={locale} />
            <div className="flex flex-col gap-2">
              <label htmlFor={FIELD_ID} className="text-sm font-semibold text-ink">
                {t.avatarField}
              </label>
              <input
                id={FIELD_ID}
                name="avatar"
                type="file"
                accept={AVATAR_TYPES.join(",")}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={messageId}
                className="block w-full min-w-0 text-sm text-muted file:me-3 file:min-h-11 file:cursor-pointer file:border-0 file:bg-tile file:px-4 file:font-semibold file:text-ink hover:file:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <FieldMessage
                id={messageId}
                error={fieldError ? errorMessage(auth.errors, fieldError) : undefined}
                hint={hint}
              />
            </div>
            <div className="sm:self-start">
              <SubmitButton icon={ImageUp} pendingLabel={t.avatarPending}>
                {t.avatarSave}
              </SubmitButton>
            </div>
          </form>
          {hasPhoto && (
            <form action={removeAction} className="sm:self-start">
              <input type="hidden" name="locale" value={locale} />
              <SubmitButton variant="ghost" icon={Trash2} pendingLabel={t.avatarRemovePending}>
                {t.avatarRemove}
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
