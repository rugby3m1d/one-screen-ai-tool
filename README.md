# One Screen AI Tool

Next.js（App Router）+ TypeScript で構成した最小構成のプロジェクトです。

## 環境変数

`.env.local` を作成し、以下を設定してください。

```bash
OPENAI_API_KEY=your_api_key
```

サンプルは `.env.example` を参照してください。

## ローカル起動方法

```bash
npm install
npm run dev
```

`http://localhost:3000` にアクセスしてください。

## ビルド方法

```bash
npm run build
npm run start
```

## テスト

### As-Isテスト

現状機能の維持確認用に、E2Eに近いAs-Isテストを用意しています。

```bash
npm run test:as-is
```

このテストはNext.js開発サーバーを自動起動し、以下を検証します。

- トップ画面の主要UIが表示されること
- `/api/agent` の入力バリデーション
- `OPENAI_API_KEY` 未設定時のエラーハンドリング

### Playwright E2Eテスト

Playwright を使ったブラウザE2Eテストを追加しています。

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

検証内容:

- トップ画面の主要UI要素表示
- 実行ボタン押下時のエラーメッセージ表示

## Lint

```bash
npm run lint
```


## E2E Test Strategy

- Default E2E (`npm run test:e2e`) uses API-mocked scenarios and excludes tests tagged with `@real-api` to keep CI stable.
- Real API E2E (`npm run test:e2e:real-api`) targets only `@real-api` tests and requires `OPENAI_API_KEY`.
- GitHub Actions can run real API E2E manually from `workflow_dispatch` with `run_real_api_e2e=true`.
