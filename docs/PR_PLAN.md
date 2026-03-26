# PR Plan

このファイルは、PR 単位の実装スコープと受け入れ条件を管理する。

## PR 運用ルール
- 1 PR = 1 機能。
- 変更が大きい場合はさらに分割する。
- 仕様変更時は AGENTS.md ではなく、まずこのファイルを更新する。

---

## PR1: UI Implementation
### Scope
基本 UI を実装する。

### Required Components
- Text input area
- Mode selection
- Run button
- Result display

### Behavior
Run ボタン押下時はダミー結果を返す（API 呼び出しなし）。

例:
```text
Processed result:
<user input>
```

### Acceptance Criteria
- `npm run lint` passes
- UI が正常に描画される
- ボタン操作が機能する

---

## PR2: API Implementation
### Scope
`app/api/agent/route.ts` を実装し、フロントエンドを API 接続に切り替える。

### API Contract
```json
{ "text": "...", "mode": "summary|bullets|tasks" }
```

### Behavior
mode ごとにダミー結果を返す。

例:
```text
summary -> "Summary: ..."
bullets -> "- item ..."
tasks -> "- TODO ..."
```

### Acceptance Criteria
- `npm run build` passes
- API エラーハンドリングがある
- Loading state が実装される

---

## PR3: AI Integration
### Scope
ダミー処理を実 AI 呼び出しへ置き換える。

### Requirements
- `OPENAI_API_KEY` を利用する
- 秘匿情報をハードコードしない
- `.env.example` を更新する

### Suggested Checks
- mode ごとのプロンプトが正しい
- 失敗時のフォールバック表示がある
- サーバー側のみで AI API を呼び出している
