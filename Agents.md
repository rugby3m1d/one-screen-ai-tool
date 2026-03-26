# AGENTS.md

## Project
- Name: One Screen AI Tool
- Goal: ユーザー入力テキストを 1 画面で処理し、AI の結果を返す最小構成の Web アプリを維持する。

## Product Scope
アプリは次のフローを提供する。
1. ユーザーがテキストを入力
2. 処理モードを選択
3. 実行
4. サーバー側で AI が処理
5. 結果表示

## Tech Stack
- Frontend: Next.js (App Router)
- Backend: Next.js API Routes
- Deployment: Vercel
- Repository: GitHub
- AI: Server-side LLM API

## Architecture
```text
User
 ↓
Next.js UI
 ↓
/api/agent
 ↓
LLM API
 ↓
Result
```

## Security / Runtime Rules
- API キーをクライアントに公開しない。
- AI API の呼び出しは必ずサーバー側で行う。
- 入力バリデーションを実装する。
- API エラーは適切に処理する。
- 実行環境はオフライン前提。`npm install` などネットワーク依存コマンドは実行しない。

## Directory Reference
```text
project-root
├ app
│ ├ page.tsx
│ └ api/agent/route.ts
├ components/InputForm.tsx
├ docs/PR_PLAN.md
├ .env.example
└ README.md
```

## UI Specification
### Input Area
- meeting notes
- requirement drafts
- email text
- support messages

### Processing Mode
- summary
- bullets
- tasks

### Output Area
- 処理結果を表示する。

### Buttons
- Run
- Copy result

## API Specification
### Endpoint
`POST /api/agent`

### Request
```json
{
  "text": "string",
  "mode": "summary" | "bullets" | "tasks"
}
```

### Response
```json
{
  "result": "string"
}
```

## AI Processing Modes
- summary: 入力文を要約
- bullets: 箇条書き化
- tasks: 実行タスク抽出

## Prompt Guidelines
出力は日本語にする。
- summary: `次の文章を簡潔に要約してください。`
- bullets: `次の文章を箇条書きに整理してください。`
- tasks: `次の文章から実行すべきタスクを抽出してください。`

## Environment Variables
```dotenv
OPENAI_API_KEY=
```

## Deployment
```text
PR merge
 ↓
main branch update
 ↓
automatic deployment (Vercel)
```

## Development Workflow
1. 1 機能単位で実装
2. PR を作成
3. CI (lint/build/test) の成功を確認
4. レビュー待ち

> PR ごとの実装スコープ・受け入れ条件は `docs/PR_PLAN.md` に分離して管理する。

## Project Principles
- keep the application minimal
- prefer simple implementations
- avoid unnecessary dependencies
- maintain clear separation between UI and AI logic
