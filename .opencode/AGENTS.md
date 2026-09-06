# Baagicha App — Agent Guidelines

> For AI assistants working on the Baagicha React Native mobile app.
>
> Corrected 2026-09-06 against the actual source tree. Sections 5, 6.2, 6.3, 7 and 9
> previously described a stack this app has never used.

---

## 1. Project Overview

- **Name:** Baagicha (बागीचा)
- **Platform:** React Native (bare, CLI-bootstrapped with `@react-native-community/cli`)
- **React Native Version:** 0.85.3
- **React Version:** 19.2.3
- **Language:** TypeScript
- **Target:** Himalayan apple farmers (HP, UK, J&K)
- **Design Source:** Laravel web app at `../web_baagicha` (same workspace)
- **Backend:** all APIs live in Laravel; this app is a pure client

---

## 2. Architecture Principles

### 2.1 Folder Structure
```
src/
├── api/              # (thin — only notifications.ts; most API code is in services/)
├── components/       # Reusable UI  (+ dashboard/, home/, intelligence/, shop/)
├── config/           # env.ts — react-native-config access
├── hooks/            # Custom hooks, one per resource (useVarieties, useOrchards, …)
├── navigation/       # React Navigation setup (+ stacks/)
├── screens/          # Full-screen components (+ Auth/, Home/, Onboarding/, shop/)
├── services/         # API clients, one per domain (varietyApi.ts, shopApi.ts, …)
├── store/            # Zustand stores
├── theme/            # Colors, global styles
├── types/            # Shared TypeScript interfaces
└── typography/       # Font system, text components
```

There is no `utils/`, `constants/` or `context/` directory. Do not invent them —
if you need one, say so first.

### 2.2 Component Rules
- **One component per file** — keep files focused and readable.
- **Use functional components** with hooks (no class components).
- **Export as default** for screen components; named exports for reusable UI.
- **Always type props** with a `Props` or `{ComponentName}Props` interface.
- **Prefix screen components** with the screen name (e.g., `HomeScreen`, `SprayScheduleScreen`).

### 2.3 File Naming
- Components: `PascalCase.tsx` (e.g., `VarietyCard.tsx`)
- Hooks: `useCamelCase.ts` (e.g., `useWeather.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Styles: Co-located in the same file or `ComponentName.styles.ts`

---

## 3. Code Style

### 3.1 TypeScript
- **Strict mode enabled** — no `any` without justification.
- **Prefer interfaces** over `type` for object shapes.
- **Use union types** for finite string values (e.g., `'essential' | 'recommended' | 'conditional'`).
- **Avoid `as` assertions** — let the type system infer correctly.

### 3.2 Imports
```typescript
// 1. React & libraries
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Absolute project imports
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

// 3. Relative imports (same folder)
import { CardTitle } from './CardTitle';
```

### 3.3 Styling
- **Use `StyleSheet.create`** for all component styles (better performance than inline objects).
- **Colors from theme only** — never hardcode hex values; import from `src/theme/colors.ts`.
- **Typography from system only** — use `src/typography/` components/styles.
- **Spacing values** — use the 4px grid: 4, 8, 12, 16, 20, 24, 32.

### 3.4 Comments
- **JSDoc for all exported functions/components** — explain what, why, and parameters.
- **Inline comments** for complex logic or non-obvious decisions.
- **Section dividers** in large files:
  ```typescript
  // ═══════════════════════════════════════════
  // SECTION: Header Components
  // ═══════════════════════════════════════════
  ```

---

## 4. React Native Best Practices

### 4.1 Performance
- **Memoize callbacks** with `useCallback` when passed to child components.
- **Memoize expensive computations** with `useMemo`.
- **Use `React.memo`** for pure presentational components receiving props.
- **FlatList for long lists** — never map >20 items to static JSX.
- **Avoid inline functions in render** — define handlers outside JSX.

### 4.2 Platform Differences
- **Use `Platform.select`** for platform-specific values:
  ```typescript
  const shadow = Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    android: { elevation: 4 },
  });
  ```
- **Safe areas** — use `react-native-safe-area-context` for notch/home indicator handling.
- **Status bar** — set `StatusBar` style per screen (dark on light bg, light on dark bg).

### 4.3 Accessibility
- **Add `accessibilityLabel`** to all touchable elements.
- **Add `accessibilityRole`** (button, link, header, etc.).
- **Ensure 44×44dp minimum touch targets**.
- **Support screen readers** — test with TalkBack / VoiceOver.

### 4.4 Images
- **Use `react-native-fast-image`** for remote images (caching + performance).
- **Placeholder system** — show a colored placeholder while loading.
- **Lazy loading** — load below-fold images only when approaching viewport.

---

## 5. State Management

### 5.1 Local State
- Use `useState` for component-level state.
- Use `useReducer` for complex local state logic.

### 5.2 Global State — Zustand, not Context

The app uses **Zustand**. There are no React Context providers anywhere in `src/`.
Seven stores live in `src/store/`:

`authStore` · `cartStore` · `intelligenceStore` · `notificationStore` ·
`onboardingStore` · `orchardStore` · `toastStore`

Add state to an existing store before creating a new one.

### 5.3 Persistence — MMKV, not AsyncStorage

Persisted data (auth token, onboarding progress, preferences) uses
**`react-native-mmkv`**. `AsyncStorage` is not installed.

### 5.4 Data Fetching — hand-written hooks, no react-query

`@tanstack/react-query` is **not** a dependency. The pattern is a pair:

- `src/services/<domain>Api.ts` — axios calls against the Laravel API
- `src/hooks/use<Resource>.ts` — loading/error/data state around them

Follow that pattern for new resources rather than introducing a data library.
Show loading skeletons, not spinners. Handle errors with retry UI, not just toasts.

---

## 6. Navigation

### 6.1 Stack Navigator
- Auth flow: `LoginScreen` → `RegisterScreen`
- Main app: Tab navigator inside a stack
- Detail screens pushed onto stack

### 6.2 Tab Navigator
5 tabs, each wrapping its own native stack (`src/navigation/stacks/`):

**Home · Spray · Shop · Discover · MyOrchard**

Diseases, varieties and rootstocks are reached through Discover, not from their own tabs.

### 6.3 Deep Linking
**Not implemented.** No `baagicha://` scheme is registered in `AndroidManifest.xml` and
React Navigation has no `linking` config. Treat deep links as unbuilt work, not as
something to match.

---

## 7. API Integration

### 7.1 Base Config
The client is `src/services/api.ts`; the base URL comes from `src/config/env.ts`,
which reads `react-native-config`:

```
API_BASE_URL   # must end in /api/v1
```

Set it in `.env`. Android emulator uses `http://10.0.2.2:8000/api/v1`; a physical
device needs the dev machine's LAN IP. **There is no production API URL configured
yet** — see the workspace `.claude/context/known-issues.md`.

### 7.2 Auth Interceptor
Sanctum **bearer token**, stored in MMKV, attached to every request. Not CSRF —
this is a token API, not a stateful SPA.

### 7.3 Error Handling
- `401` → Clear auth, navigate to Login
- `422` → Show validation errors per field
- Network errors → Show offline UI with retry

---

## 8. Design Compliance

### 8.1 Colors
All colors must come from `src/theme/colors.ts`. No hardcoded hex values anywhere.

### 8.2 Typography
All text must use `src/typography/` system. No direct `fontFamily`, `fontSize`, or `color` on `<Text>` components.

### 8.3 Spacing
Use the 4px grid. Common values:
- `4` (xs), `8` (sm), `12`, `16` (md), `20`, `24` (lg), `32` (xl)

### 8.4 Shadows
Use `Platform.select` for shadows. iOS uses `shadow*` props; Android uses `elevation`.

### 8.5 Border Radius
Use tokens: `8` (sm), `16` (md), `24` (lg), `32` (xl), `999` (full)

---

## 9. Testing

**Current reality:** the only test is the default `__tests__/App.test.tsx`.
`@testing-library/react-native` and Detox are **not** installed, and `@types/jest`
is missing (which is one of the four standing `tsc --noEmit` errors). The rest of
this section is the intended target, not a description of the repo.

### 9.1 Unit Tests
- Test utility functions and hooks. Jest is configured.

### 9.2 Component Tests
- Would need `@testing-library/react-native` added first.

### 9.3 E2E Tests
- Would need Detox added first.

---

## 10. Git Workflow

- **Feature branches:** `feature/home-screen`
- **Bugfix branches:** `fix/typography-colors`
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`)
- **No direct commits to main** — always through PRs.

---

## 11. Reference Documents

All design data is available as OpenCode skills in `.opencode/skills/`:

| Skill | Content |
|------|---------|
| `design-spec` | Colors, typography, layout, shadows, spacing, animations |
| `data-models` | All TypeScript interfaces |
| `api-reference` | All API endpoints |
| `screen-breakdown` | Every screen with components |

**Always refer to these skills** before building any screen or component.

---

## 12. Learning Comments

Since the user is learning React Native while building this app:

- **Explain WHY, not just WHAT** — every significant decision should have a comment.
- **Link to docs** when introducing new concepts (`useCallback`, `useMemo`, `React.memo`).
- **Show before/after** when optimizing — explain the performance benefit.
- **Use simple language** — avoid jargon without explanation.
- **Add "LEARN:" comments** for educational callouts:
  ```typescript
  // LEARN: useCallback prevents this function from being recreated on every render,
  // which helps child components avoid unnecessary re-renders.
  const handlePress = useCallback(() => { ... }, []);
  ```

---

*Guidelines for AI agents working on the Baagicha React Native app. Follow these strictly to maintain code quality and consistency.*
