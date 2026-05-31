import { expect, test } from "@playwright/test";

test("public user can browse EventDrop home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "All Events" })).toBeVisible();
  await expect(page.getByRole("button", { name: "All Events" })).toBeVisible();
  await expect(page.getByRole("link", { name: /EventDrop/ })).toBeVisible();
});
