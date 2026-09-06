# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This VS Code workspace (`baagichaApp.code-workspace`) contains two projects:

| Project | Path | Purpose |
|---------|------|---------|
| `baagichaApp` | `.` | React Native mobile app |
| `web_baagicha` | `../web_baagicha` | Laravel 12 web backend + admin panel |

The Laravel project has its own config at `../web_baagicha/.opencode/` with detailed backend rules — read that when working on the web side.

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

> **Corrected 2026-09-06.** This section previously described an empty bootstrap project.
> It has been wrong for a long time.

The app is substantial: ~44 screens, 123 `.tsx` and 65 `.ts` files under `src/`.

- **Navigation:** React Navigation — 5 bottom tabs (Home, Spray, Shop, Discover, MyOrchard),
  each wrapping a native stack, plus auth and onboarding stacks.
- **State:** Zustand, 7 stores in `src/store/`. No Context, no Redux.
- **Persistence:** `react-native-mmkv`. No AsyncStorage.
- **API client:** axios in `src/services/api.ts`, 20 domain clients + 19 hooks. No TanStack Query.
- **Also wired:** Firebase messaging (push), Google + Facebook sign-in, Razorpay,
  fast-image, video, geolocation.

Known gaps: 4 standing `tsc --noEmit` errors, one default Jest test, no deep linking,
and no production `API_BASE_URL`. See the workspace `.claude/context/known-issues.md`.

See `.opencode/AGENTS.md` for the conventions to follow.

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
- Consume the Laravel backend via its versioned JSON API under `/api/v1`; do not duplicate business logic.

---

## Laravel Web App (web_baagicha)

See `../web_baagicha/CLAUDE.md` for quick-start commands, stack, and project map — it is
accurate and current.

`../web_baagicha/.opencode/skills/` holds the coding conventions. Those conventions are still
broadly right, but the skills predate the move to `Modules/` and their **path references are
stale** — claims like "no API layer" and "no repository pattern" are now false. All feature
code lives in `Modules/<Name>/`, not `app/`.

Key facts needed for mobile integration work:
- Auth: **Laravel Sanctum bearer tokens** for the mobile API (Breeze session auth is the web
  side only). The token is stored in MMKV and attached by the axios interceptor.
- The API is versioned at `/api/v1` — 138 of 144 API routes live there. The six exceptions
  (`api/brands*`, `api/weather/*`) are unversioned strays, not a pattern to copy.
- API responses follow `{ success: bool, data: mixed, message: string }`.
- Rate limits: 60 req/min public, 120 req/min authenticated.
- All content has `is_published` (editorial) and `is_active` (visibility) flags — only fetch where both are true.
