# One Screen AI Tool - Specification & Design

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

---

## Tech Stack

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

## Architecture

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

---

## Directory Structure

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

## UI Specification

The application contains a single screen.

### Input Area

A textarea where users can paste text such as:

- meeting notes
- requirement drafts
- email text
- support messages

### Processing Mode

Radio buttons:

- summary
- bullets
- tasks

### Output Area

Displays the processed result.

### Buttons

- Run
- Copy result

---

## API Specification

### Endpoint

```
POST /api/agent
```

### Request

```
{
  text: string,
  mode: "summary" | "bullets" | "tasks"
}
```

### Response

```
{
  result: string
}
```

---

## AI Processing Modes

### summary
Summarize the input text.

### bullets
Convert the text into bullet points.

### tasks
Extract actionable tasks from the text.

---

## Initial Development Roadmap

### PR1: UI Implementation

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

### PR2: API Implementation

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
