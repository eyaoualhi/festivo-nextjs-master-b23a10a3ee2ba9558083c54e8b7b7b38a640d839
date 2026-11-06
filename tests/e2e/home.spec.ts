import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("Accueil", () => {
  test("la racine redirige vers la langue et affiche le titre", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Ne ratez plus\s*aucune sortie\./,
    );
    await expect(page.getByRole("link", { name: "Voir le programme" })).toBeVisible();
  });

  for (const { lang, dir, title } of [
    { lang: "fr", dir: "ltr", title: /Ne ratez plus\s*aucune sortie\./ },
    { lang: "en", dir: "ltr", title: /Never miss\s*what's on\./ },
    { lang: "ar", dir: "rtl", title: /ما تفلّتش\s*حتى خرجة\./ },
  ]) {
    test(`/${lang} : sens de lecture, titre et aucune barre de défilement horizontale`, async ({
      page,
    }) => {
      await page.goto(`/${lang}`);
      await expect(page.locator("html")).toHaveAttribute("dir", dir);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.getByRole("heading", { level: 2 })).toHaveCount(9);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("une catégorie ouvre la liste filtrée", async ({ page }) => {
    await page.goto("/fr");
    await page
      .getByRole("navigation", { name: "Catégories d'événements" })
      .getByRole("link", { name: /Musique/ })
      .click();
    await page.waitForURL(/\/fr\/evenements\?categorie=musique/);
    await expect(page.getByText(/événements? trouvés?/)).toBeVisible();
  });

  test("les onglets changent la sélection d'événements", async ({ page }) => {
    await page.goto("/fr");
    const tab = page.getByRole("tab", { name: "Bientôt complets" });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveCount(1);
    await expect(panel.getByRole("article").first()).toBeVisible();
  });

  test("l'accordéon des étapes ouvre une étape à la fois", async ({ page }) => {
    await page.goto("/fr");
    const steps = page.locator("#etapes").getByRole("button");
    await expect(steps.first()).toHaveAttribute("aria-expanded", "true");
    await steps.nth(3).click();
    await expect(steps.nth(3)).toHaveAttribute("aria-expanded", "true");
    await expect(steps.first()).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.locator("#etapes").getByText("Renseignez le titre, la description"),
    ).toBeVisible();
  });

  test("la FAQ garde une seule réponse ouverte", async ({ page }) => {
    await page.goto("/fr");
    const faq = page.locator("#faq details");
    await faq.nth(0).locator("summary").click();
    await expect(faq.nth(0)).toHaveAttribute("open", "");
    await faq.nth(2).locator("summary").click();
    await expect(faq.nth(2)).toHaveAttribute("open", "");
    await expect(faq.nth(0)).not.toHaveAttribute("open");
  });

  test("« Me localiser » centre la carte sur la position", async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 36.8065, longitude: 10.1815 });
    await page.goto("/fr");
    await page.getByRole("button", { name: "Me localiser" }).click();
    await expect(page.getByText("Carte centrée sur votre position.")).toBeVisible();
    await expect(page.locator("#villes iframe")).toHaveAttribute("src", /36\.80650%2C10\.18150/);
  });

  for (const { lang, colorScheme } of [
    { lang: "fr", colorScheme: "light" },
    { lang: "fr", colorScheme: "dark" },
    { lang: "ar", colorScheme: "light" },
  ] as const) {
    test(`capture pleine page /${lang}, thème ${colorScheme}`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(`/${lang}`);
      await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
      await page.screenshot({
        path: testInfo.outputPath(`accueil-${lang}-${colorScheme}.png`),
        fullPage: true,
      });
    });
  }
});
