# Issue: `npm run test:e2e` で `playwright: not found` が発生する問題を解消する

## 背景
PR #11 のレビューコメント（https://github.com/rugby3m1d/one-screen-ai-tool/pull/11#issuecomment-4056905872）で、以下のエラーにより E2E テストが実行できない状態です。

- ⚠️ `npm run test:e2e`（この環境では `playwright: not found` のため実行不可）

CI / ローカル環境のどちらでも、`playwright` バイナリが確実に利用可能になる導線が不足している可能性があります。

## 問題
`npm run test:e2e` 実行時に Playwright の実行バイナリが見つからず、E2E テストが開始されない。

## 期待する状態
- `npm run test:e2e` がクリーン環境（CI 含む）で再現性高く実行できる
- セットアップ手順に沿えば `playwright: not found` が発生しない

## 対応案
1. `@playwright/test` が `devDependencies` に存在するかを確認し、未設定なら追加する
2. 初回セットアップ手順として `npx playwright install --with-deps`（または CI 用の等価手順）を README に明記する
3. CI のワークフローで Playwright のブラウザインストール工程を追加する
4. 必要に応じて `test:e2e` スクリプトを見直し、`npx playwright test` で実行されることを保証する

## 受け入れ条件
- [ ] クリーン環境で `npm ci && npx playwright install --with-deps && npm run test:e2e` が成功する
- [ ] CI 上で E2E ジョブが成功する
- [ ] README に E2E 実行の前提条件が追記されている

## 補足
本 issue は「テスト自体の不具合修正」ではなく、「E2E 実行基盤（依存関係・セットアップ・CI）を安定化する」ことを主目的とする。
