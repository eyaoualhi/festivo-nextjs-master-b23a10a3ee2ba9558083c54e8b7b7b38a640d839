import { expect, test, type Page } from "@playwright/test";

/** Attend que le Service Worker contrôle la page ; faux en développement, où il est désactivé. */
async function serviceWorkerControls(page: Page): Promise<boolean> {
  const ready = await page.evaluate(() =>
    Promise.race([
      navigator.serviceWorker.ready.then(() => true),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10_000)),
    ]),
  );
  if (!ready) return false;
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  // L'installation enregistre l'accueil et la page « hors ligne » de chaque langue.
  await page.waitForFunction(async () => {
    const cache = await caches.open("festivo-pages-v1");
    return Boolean(await cache.match("/fr/hors-ligne"));
  });
  return true;
}

test.describe("Manifest", () => {
  test("rend l'application installable", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.ok()).toBe(true);
    const manifest = await response.json();

    expect(manifest).toMatchObject({
      id: "/",
      short_name: "Festivo",
      start_url: "/",
      scope: "/",
      display: "standalone",
      theme_color: "#2748c4",
    });
    const purposes = manifest.icons.map((icon: { purpose: string }) => icon.purpose);
    expect(purposes).toEqual(expect.arrayContaining(["any", "maskable"]));

    const files = [
      ...manifest.icons.map((icon: { src: string }) => icon.src),
      ...manifest.screenshots.map((shot: { src: string }) => shot.src),
    ];
    for (const file of files) {
      expect((await request.get(file)).ok(), file).toBe(true);
    }
  });

  test("est déclaré par chaque page", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.json");
  });
});

test.describe("Mode hors ligne", () => {
  test("la page hors ligne existe dans chaque langue", async ({ page }) => {
    for (const [lang, title] of [
      ["fr", "Vous êtes hors ligne"],
      ["en", "You're offline"],
      ["ar", "ما فماش كونيكسيون"],
    ]) {
      await page.goto(`/${lang}/hors-ligne`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    }
  });

  test("les pages déjà ouvertes restent disponibles sans réseau", async ({ page, context }) => {
    await page.goto("/fr");
    test.skip(!(await serviceWorkerControls(page)), "Service Worker actif en production seulement");

    await page.goto("/fr/evenements/meetup-react-nextjs");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Meetup React & Next.js Tunis",
    );

    await context.setOffline(true);
    try {
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Meetup React & Next.js Tunis",
      );
      await expect(page.getByRole("status").filter({ hasText: "Hors ligne" })).toBeVisible();

      await page.goto("/fr/evenements/semi-marathon-carthage");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vous êtes hors ligne");
      await expect(page.getByRole("link", { name: /Meetup React & Next\.js Tunis/ })).toBeVisible();

      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /Ne ratez plus\s*aucune sortie\./,
      );
    } finally {
      await context.setOffline(false);
    }
  });
});
