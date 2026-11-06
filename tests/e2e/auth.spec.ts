import { expect, test, type Page } from "@playwright/test";

/** Les parcours complets écrivent dans la base : ils demandent MONGODB_URI et AUTH_SECRET. */
const hasAuth = Boolean(process.env.AUTH_SECRET);
const hasDatabase = hasAuth && Boolean(process.env.MONGODB_URI);
const PASSWORD = "Festivo-e2e-2026";

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@festivo.test`;
}

async function fillAccount(page: Page, name: string, email: string) {
  await page.getByLabel("Nom complet").fill(name);
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirmer le mot de passe").fill(PASSWORD);
}

async function fillOrganizer(page: Page) {
  await page.getByLabel("Nom de la structure").fill("Association Rythmes de Tunis");
  await page.getByLabel("Type de structure").selectOption("association");
  await page.getByLabel("Téléphone de contact").fill("+216 20 123 456");
  await page.getByLabel("Ville principale").fill("Tunis");
  await page
    .getByLabel("Présentation")
    .fill("Concerts et ateliers de musique pour tous les publics depuis 2015.");
}

test.describe("Inscription : interface", () => {
  test("le rôle Participant est choisi par défaut et le formulaire tient en une étape", async ({
    page,
  }) => {
    await page.goto("/fr/inscription");
    await expect(page.getByRole("radio", { name: /Participant/ })).toBeChecked();
    await expect(page.getByText(/Étape 1 sur 2/)).toHaveCount(0);
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(page.getByRole("alert").first()).toContainText("4 champs sont à corriger");
    await expect(page.getByLabel("Nom complet")).toBeFocused();
  });

  test("le rôle Organisateur ajoute une étape pour la structure", async ({ page }) => {
    await page.goto("/fr/inscription");
    await page.getByText("Organisateur", { exact: true }).click();
    await expect(page.getByRole("radio", { name: /Organisateur/ })).toBeChecked();
    await expect(page.getByText(/Étape 1 sur 2/)).toBeVisible();

    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page.getByLabel("Nom complet")).toBeFocused();
    await expect(page.getByLabel("Nom de la structure")).toBeHidden();

    await fillAccount(page, "Amira Ben Salah", uniqueEmail("ui"));
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page.getByText(/Étape 2 sur 2/)).toBeVisible();
    await expect(page.getByLabel("Nom de la structure")).toBeFocused();

    await page.getByRole("button", { name: "Créer mon compte organisateur" }).click();
    await expect(
      page.getByText("Saisissez le nom de votre structure", { exact: false }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Retour" }).click();
    await expect(page.getByLabel("Nom complet")).toHaveValue("Amira Ben Salah");
  });

  test("la connexion vérifie les champs avant l'envoi", async ({ page }) => {
    await page.goto("/fr/connexion");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByText("Saisissez votre adresse e-mail.")).toBeVisible();
    await expect(page.getByLabel("Adresse e-mail")).toBeFocused();
  });

  for (const { lang, colorScheme } of [
    { lang: "fr", colorScheme: "dark" },
    { lang: "ar", colorScheme: "light" },
  ] as const) {
    test(`capture de l'inscription organisateur /${lang}, thème ${colorScheme}`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(`/${lang}/inscription`);
      await page.locator('input[name="role"][value="organisateur"]').check({ force: true });
      await page.screenshot({
        path: testInfo.outputPath(`inscription-${lang}-${colorScheme}.png`),
        fullPage: true,
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("Espace personnel : accès", () => {
  test.skip(!hasAuth, "AUTH_SECRET manque dans .env.local");

  test("sans session, /espace renvoie vers la connexion", async ({ page }) => {
    await page.goto("/fr/espace/organisateur");
    await page.waitForURL(/\/fr\/connexion$/);
  });
});

test.describe("Comptes : parcours complets", () => {
  test.skip(!hasDatabase, "MONGODB_URI et AUTH_SECRET manquent dans .env.local");

  test("un participant s'inscrit, arrive sur son tableau de bord puis se déconnecte", async ({
    page,
  }, testInfo) => {
    const email = uniqueEmail("participant");
    await page.goto("/fr/inscription");
    await fillAccount(page, "Youssef Test", email);
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await page.waitForURL(/\/fr\/espace\/participant$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bonjour Youssef Test");
    await expect(page.getByRole("heading", { name: "Mes inscriptions" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("espace-participant.png"), fullPage: true });

    // Un participant ne voit pas l'espace organisateur.
    await page.goto("/fr/espace/organisateur");
    await page.waitForURL(/\/fr\/espace\/participant$/);

    await page.getByRole("button", { name: "Se déconnecter" }).first().click();
    await page.waitForURL(/\/fr$/);
    await page.goto("/fr/espace");
    await page.waitForURL(/\/fr\/connexion$/);

    // La même adresse ne peut pas servir deux fois.
    await page.goto("/fr/inscription");
    await fillAccount(page, "Youssef Test", email);
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(page.getByText("Un compte existe déjà avec cette adresse e-mail.")).toBeVisible();
  });

  test("un organisateur s'inscrit avec sa structure et modifie son profil", async ({
    page,
  }, testInfo) => {
    const email = uniqueEmail("organisateur");
    await page.goto("/fr/inscription");
    await page.getByText("Organisateur", { exact: true }).click();
    await fillAccount(page, "Amira Ben Salah", email);
    await page.getByRole("button", { name: "Continuer" }).click();
    await fillOrganizer(page);
    await page.getByRole("button", { name: "Créer mon compte organisateur" }).click();

    await page.waitForURL(/\/fr\/espace\/organisateur$/);
    await expect(page.getByRole("button", { name: "Créer un événement" })).toBeDisabled();
    await expect(page.getByText("Association Rythmes de Tunis", { exact: false })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("espace-organisateur.png"), fullPage: true });

    await page.getByRole("link", { name: "Modifier mon profil" }).click();
    await page.waitForURL(/\/fr\/espace\/profil$/);
    await page.getByLabel("Ville principale").fill("Sousse");
    await page.getByRole("button", { name: "Enregistrer les modifications" }).click();
    await expect(page.getByText("Vos modifications sont enregistrées.")).toBeVisible();
    await expect(page.getByLabel("Ville principale")).toHaveValue("Sousse");
  });

  test("une erreur de connexion ne dit pas si le compte existe", async ({ page }) => {
    await page.goto("/fr/connexion");
    await page.getByLabel("Adresse e-mail").fill(uniqueEmail("inconnu"));
    await page.getByLabel("Mot de passe", { exact: true }).fill("mauvais-mot-de-passe");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByText("E-mail ou mot de passe incorrect.")).toBeVisible();
  });
});
