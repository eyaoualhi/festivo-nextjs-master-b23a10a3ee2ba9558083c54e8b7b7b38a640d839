"use client";

import { useActionState, useRef } from "react";
import { signOut } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { deleteAccount, type DeleteField, type FormState } from "@/app/actions/User";
import Alert from "@/components/ui/Alert";
import PasswordField from "@/components/ui/PasswordField";
import SubmitButton from "@/components/ui/SubmitButton";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { focusField } from "@/lib/form-focus";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { errorMessage, fieldMessages } from "@/lib/i18n/errors";

type DeleteAccountProps = {
  locale: Locale;
  t: Dictionary["profile"];
  auth: Dictionary["auth"];
};

const idle: FormState<DeleteField> = { status: "idle" };

/** D-34 : suppression définitive, confirmée par le mot de passe, puis fermeture de la session. */
export default function DeleteAccount({ locale, t, auth }: DeleteAccountProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    async (previous: FormState<DeleteField>, formData: FormData) => {
      const result = await deleteAccount(previous, formData);
      if (result.status === "success") {
        await signOut({ redirectTo: localizePath(locale, "/") });
      } else {
        focusField(formRef.current, "password");
      }
      return result;
    },
    idle,
  );

  const errors = fieldMessages(
    auth.errors,
    state.status === "error" ? state.fieldErrors : undefined,
  );

  return (
    <section
      aria-labelledby="delete-account-title"
      className="flex flex-col gap-4 rounded-3xl border border-danger/30 bg-card p-6 md:p-8"
    >
      <h2 id="delete-account-title" className="font-display text-xl font-bold text-ink">
        {t.deleteTitle}
      </h2>
      <p className="text-sm leading-relaxed text-muted">{t.deleteText}</p>
      <details className="flex flex-col gap-5">
        <summary
          className={buttonClasses(
            "secondary",
            "w-fit cursor-pointer list-none [&::-webkit-details-marker]:hidden",
          )}
        >
          {t.deleteOpen}
        </summary>
        <form ref={formRef} noValidate action={formAction} className="mt-5 flex flex-col gap-5">
          {state.status === "error" && state.error && (
            <Alert tone="error" title={t.deleteFailed}>
              {errorMessage(auth.errors, state.error)}
            </Alert>
          )}
          <PasswordField
            id="delete-password"
            name="password"
            label={t.deletePassword}
            autoComplete="current-password"
            showLabel={auth.fields.showPassword}
            hideLabel={auth.fields.hidePassword}
            error={errors.password}
            required
          />
          <div className="sm:self-start">
            <SubmitButton variant="danger" icon={Trash2} pendingLabel={t.deletePending}>
              {t.deleteSubmit}
            </SubmitButton>
          </div>
        </form>
      </details>
    </section>
  );
}
