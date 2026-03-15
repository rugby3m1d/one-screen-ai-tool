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
  test.skip(!!process.env.OPENAI_API_KEY, '実API検証時は失敗ケースをスキップする');

  await page.goto('/');

  await page.getByLabel('Input text').fill('議事録の要約をお願いします');
  await page.getByRole('button', { name: 'Run' }).click();

  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'Error: AI processing failed. Please try again later.' })
  ).toBeVisible();
});

test('実APIで入力内容とモードを送信して結果が表示される', async ({ page }) => {
  test.skip(!process.env.OPENAI_API_KEY, 'OPENAI_API_KEY が未設定のためスキップ');

  const inputText = '来週の開発タスクを整理してください';

  await page.goto('/');
  await page.getByLabel('Input text').fill(inputText);
  await page.getByRole('radio', { name: 'tasks' }).check();
  await page.getByRole('button', { name: 'Run' }).click();

  await expect(page.getByRole('button', { name: 'Run' })).toBeEnabled({ timeout: 20_000 });

  const resultArea = page.locator('section.result pre');
  await expect(resultArea).not.toContainText('ここに結果が表示されます。');
  await expect(page.getByRole('alert')).toHaveCount(0);
});
