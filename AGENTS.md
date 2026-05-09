# Baagicha App — Agent Guidelines

> For AI assistants working on the Baagicha React Native mobile app.

---

## 1. Project Overview

- **Name:** Baagicha (बागीचा)
- **Platform:** React Native (bare, CLI-bootstrapped with `@react-native-community/cli`)
- **React Native Version:** 0.85.3
- **React Version:** 19.2.3
- **Language:** TypeScript
- **Target:** Himalayan apple farmers (HP, UK, J&K)
- **Design Source:** Laravel web PWA at `/home/tarun-chauhan/Desktop/Apps/web_baagicha`

---

## 2. Architecture Principles

### 2.1 Folder Structure
```
src/
├── components/       # Reusable UI components (buttons, cards, inputs)
├── screens/          # Full-screen page components
├── navigation/       # React Navigation setup
├── services/         # API calls, external services
├── theme/            # Colors, global styles
├── typography/       # Font system, text components
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
├── types/            # Shared TypeScript interfaces
├── constants/        # App constants (routes, config)
└── context/          # React Context providers
```

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

### 5.2 Global State
- Use **React Context** for app-wide state (auth, user, orchards).
- Use **AsyncStorage** for persisted local data (task completion, pins, preferences).
- Avoid Redux unless explicitly requested — Context + hooks are sufficient for this app.

### 5.3 Data Fetching
- Use a custom `useApi` hook or `react-query` / `@tanstack/react-query` for server state.
- Cache responses appropriately.
- Show loading skeletons, not spinners.
- Handle errors with retry UI, not just toasts.

---

## 6. Navigation

### 6.1 Stack Navigator
- Auth flow: `LoginScreen` → `RegisterScreen`
- Main app: Tab navigator inside a stack
- Detail screens pushed onto stack

### 6.2 Tab Navigator
5 tabs: Home, Spray, Disease, Varieties, Rootstock

### 6.3 Deep Linking
Support these URLs:
- `baagicha://spray-schedule`
- `baagicha://disease/{slug}`
- `baagicha://variety/{slug}`
- `baagicha://blog/{slug}`

---

## 7. API Integration

### 7.1 Base Config
```typescript
const api = axios.create({
  baseURL: 'https://api.baagicha.app',
  headers: { 'Accept': 'application/json' },
});
```

### 7.2 Auth Interceptor
Attach CSRF token / auth token to every request.

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

### 9.1 Unit Tests
- Test utility functions and hooks.
- Use Jest (already configured).

### 9.2 Component Tests
- Test component rendering with `@testing-library/react-native`.
- Test user interactions (press, scroll, input).

### 9.3 E2E Tests
- Use Detox for critical user flows (login → home → spray schedule).

---

## 10. Git Workflow

- **Feature branches:** `feature/home-screen`
- **Bugfix branches:** `fix/typography-colors`
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`)
- **No direct commits to main** — always through PRs.

---

## 11. Reference Documents

All design data extracted from the Laravel web app is stored in `.kimi/`:

| File | Content |
|------|---------|
| `.kimi/DESIGN_SPEC.md` | Colors, typography, layout, shadows, spacing, animations |
| `.kimi/DATA_MODELS.md` | All TypeScript interfaces |
| `.kimi/API_REFERENCE.md` | All API endpoints |
| `.kimi/SCREEN_BREAKDOWN.md` | Every screen with components |

**Always refer to these documents** before building any screen or component.

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
