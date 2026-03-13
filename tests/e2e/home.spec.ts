import { expect, test } from '@playwright/test';

test('トップ画面の主要要素が表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'One Screen AI Tool' })).toBeVisible();
  await expect(page.getByLabel('Input text')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'summary' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'bullets' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'tasks' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible();
});

test('実行時にAPIエラーが表示される', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Input text').fill('議事録の要約をお願いします');
  await page.getByRole('button', { name: 'Run' }).click();

  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Error: AI processing failed. Please try again later.' })
  ).toBeVisible();
});
