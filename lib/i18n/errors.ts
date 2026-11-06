import type { ActionErrorKey } from "@/app/actions/User";
import { interpolate } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";
import { errorValues, type FieldErrorKey, type FieldErrors } from "@/lib/validation";

type ErrorMessages = Dictionary["auth"]["errors"];

/** Message traduit d'une clé d'erreur renvoyée par la validation ou une Server Action. */
export function errorMessage(messages: ErrorMessages, key: FieldErrorKey | ActionErrorKey): string {
  return interpolate(messages[key], errorValues);
}

export function fieldMessages<F extends string>(
  messages: ErrorMessages,
  errors: FieldErrors<F> | undefined,
): Partial<Record<F, string>> {
  const result: Partial<Record<F, string>> = {};
  for (const [field, key] of Object.entries(errors ?? {}) as [F, FieldErrorKey][]) {
    result[field] = errorMessage(messages, key);
  }
  return result;
}
