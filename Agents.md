# AGENTS.md

## Project
One Screen AI Tool

## Goal
Create a minimal one-page AI web application that processes user text input and returns AI-generated results.

The application should follow a simple flow:

1. User inputs text
2. User selects processing mode
3. User executes processing
4. AI processes the text
5. Result is displayed

The system must be simple, maintainable, and easy for AI agents to modify.

---

# Tech Stack

Frontend:
- Next.js (App Router)

Backend:
- Next.js API Routes

Deployment:
- Vercel

Repository:
- GitHub

AI:
- Server-side LLM API

---

# Architecture

```
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

The AI API must only be called from the server.

Never expose API keys to the client.

---

# Directory Structure

```
project-root
│
├ app
│ ├ page.tsx
│ └ api
│   └ agent
│     └ route.ts
│
├ components
│ └ InputForm.tsx
│
├ .env.example
└ README.md
```

---

# UI Specification

The application contains a single screen.

## Input Area

A textarea where users can paste text such as:

- meeting notes
- requirement drafts
- email text
- support messages

---

## Processing Mode

Radio buttons:

- summary
- bullets
- tasks

---

## Output Area

Displays the processed result.

---

## Buttons

- Run
- Copy result

---

# API Specification

## Endpoint

```
POST /api/agent
```

---

## Request

```
{
  text: string,
  mode: "summary" | "bullets" | "tasks"
}
```

---

## Response

```
{
  result: string
}
```

---

# AI Processing Modes

## summary

Summarize the input text.

---

## bullets

Convert the text into bullet points.

---

## tasks

Extract actionable tasks from the text.

---

# Development Strategy

Development must be split into small pull requests.

Agents must avoid large monolithic changes.

Each PR should implement a single feature.

---

# PR1: UI Implementation

Create the basic UI.

Required components:

- Text input area
- Mode selection
- Run button
- Result display

The run button should return a dummy result.

Example:

```
Processed result:
<user input>
```

No API calls yet.

Acceptance criteria:

- `npm run lint` passes
- The UI renders correctly
- Button interaction works

---

# PR2: API Implementation

Create the API endpoint.

```
app/api/agent/route.ts
```

The endpoint should accept:

```
{text, mode}
```

Return dummy results based on mode.

Example:

```
summary → "Summary: ..."
bullets → "- item ..."
tasks → "- TODO ..."
```

Frontend should call the API instead of returning dummy results.

Acceptance criteria:

- `npm run build` passes
- API error handling exists
- Loading state implemented

---

# PR3: AI Integration

Replace dummy processing with an AI call.

The AI API key must be read from:

```
OPENAI_API_KEY
```

Do not hardcode secrets.

Add:

```
.env.example
```

---

# Prompt Guidelines

Agents must generate Japanese output.

Example prompts:

## summary

```
次の文章を簡潔に要約してください。
```

## bullets

```
次の文章を箇条書きに整理してください。
```

## tasks

```
次の文章から実行すべきタスクを抽出してください。
```

---

# Security Rules

Agents must follow these rules:

- Never expose API keys
- Never call AI APIs from the client
- Always validate input
- Handle API errors gracefully

---

# Environment Variables

```
OPENAI_API_KEY=
```

---

# Deployment

The application must deploy automatically using Vercel.

Workflow:

```
PR merge
 ↓
main branch update
 ↓
automatic deployment
```

---

# Development Workflow

Agents operate through pull requests.

Steps:

1. Implement feature
2. Create PR
3. Ensure build passes
4. Await review

---

# Future Extensions

Possible future improvements:

- result history
- authentication
- prompt templates
- knowledge search
- tool-based AI agent capabilities

---

# Project Principles

- keep the application minimal
- prefer simple implementations
- avoid unnecessary dependencies
- maintain clear separation between UI and AI logic

---

# Execution Environment Policy

- Do not run network-dependent commands such as `npm install`, because the execution environment is offline.
- Always validate behavior for edited content through GitHub Actions CI/CD.
