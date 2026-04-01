# AGENTS.md

## Permanent Rules

- Keep the implementation simple, maintainable, and easy for agents to modify.
- Make small, focused pull requests; avoid monolithic changes.
- Prefer one feature per pull request.
- Call external AI APIs from server-side code only.
- Never expose API keys to client-side code.
- Do not run Playwright E2E tests in Codex (`npm run test:e2e`); E2E execution is delegated to CI/CD.

## Specification & Design

Detailed project specification and design have been moved to:

- `docs/SPECIFICATION.md`
