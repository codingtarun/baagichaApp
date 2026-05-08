# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This VS Code workspace (`baagichaApp.code-workspace`) contains two projects:

| Project | Path | Purpose |
|---------|------|---------|
| `baagichaApp` | `.` | React Native mobile app |
| `web_baagicha` | `../web_baagicha` | Laravel 12 web backend + admin panel |

The Laravel project has its own `CLAUDE.md` at `../web_baagicha/CLAUDE.md` with detailed backend rules — read that when working on the web side. The rules in `.claude/rules/` there are auto-loaded by file path.

---

## React Native App (baagichaApp)

### Commands

```bash
react-native start              # Start Metro bundler
react-native run-android        # Build and run on Android
react-native run-ios            # Build and run on iOS (Mac only)
npx jest                        # Run all tests
npx jest __tests__/App.test.jsx # Run a single test file
npx eslint .                    # Lint
```

### Current State

Early bootstrap phase — the app renders the default React Native template screen. These are not yet wired up:
- Navigation (no React Navigation or equivalent)
- State management (no Redux / Zustand / Context)
- API client (no Axios / TanStack Query)
- Screen/component directory structure

When adding features, establish the `src/` directory tree before writing components.

### Stack

- React 19 + React Native 0.85
- TypeScript (use `.tsx` for components/screens, `.ts` for plain modules)
- `react-native-safe-area-context` for insets
- Jest + `@react-native/jest-preset` for tests
- ESLint (`@react-native` preset) + Prettier (single quotes, trailing commas)

### What to mirror from the web app

The mobile app is the companion to `web_baagicha`. When implementing features:
- Respect the same **altitude bands** (`below_6000` / `6000_8000` / `above_8000`) — this is the central business rule for disease, variety, and spray content filtering.
- Use the same **bilingual model** (English + Hindi) for all user-visible content.
- Consume the Laravel backend via its web routes or a future REST/JSON API; do not duplicate business logic.

---

## Laravel Web App (web_baagicha)

See `../web_baagicha/CLAUDE.md` for quick-start commands, stack, and project map.
See `../web_baagicha/.claude/rules/` for all coding conventions (architecture, models, controllers, blade, CSS, JS, testing).

Key facts needed for mobile integration work:
- Auth: Laravel Breeze session-based (no Sanctum/Passport yet — token auth will need to be added for mobile API).
- API responses follow `{ success: bool, data: mixed, message: string }`.
- Rate limits: 60 req/min public, 120 req/min authenticated.
- All content has `is_published` (editorial) and `is_active` (visibility) flags — only fetch where both are true.
