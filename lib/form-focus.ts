/**
 * Place le focus sur un champ, cherché par son `name` dans le formulaire lui-même : les pages
 * précédentes restent dans le DOM, cachées (Activity, Cache Components), avec leurs propres
 * champs. Attend le prochain rendu, le champ pouvant appartenir à une étape qui s'affiche.
 */
export function focusField(form: HTMLFormElement | null, name: string) {
  requestAnimationFrame(() => {
    const field = form?.elements.namedItem(name);
    if (field instanceof HTMLElement) field.focus();
  });
}
