# KIMI.md — Workspace Memory for Kimi Code CLI

> This file provides guidance to Kimi Code CLI when working with code in this repository.
> It is the single source of truth for project context, conventions, and decisions.
> **Keep this file updated** as the project evolves.

---

## Workspace Overview

This VS Code workspace (`baagichaApp.code-workspace`) contains two projects:

| Project | Path | Purpose | Tech Stack |
|---------|------|---------|------------|
| `baagichaApp` | `.` | React Native mobile app | React 19 + RN 0.85 + TypeScript |
| `web_baagicha` | `../web_baagicha` | Laravel 12 web backend + admin panel | Laravel 12 + PHP 8.2 + MySQL 8.0 + Bootstrap 5 |

The Laravel project has its own `CLAUDE.md` at `../web_baagicha/CLAUDE.md` and rules in `.claude/rules/`.

---

## Product: Baagicha (बागीचा)

Apple orchard management platform for **Himalayan farmers** (Himachal Pradesh, Uttarakhand, J&K).

### Central Business Rules

1. **Altitude Bands** — THE core engine. Everything filters through these:
   - `below_6000` (< 1829m / < 6000 ft)
   - `6000_8000` (1829–2438m / 6000–8000 ft)
   - `above_8000` (> 2438m / > 8000 ft)

2. **Spray Timing Shifts by Altitude**:
   - `below_6000` = -7 days from baseline
   - `6000_8000` = 0 days (baseline)
   - `above_8000` = +14 days from baseline

3. **Bilingual Model** — All user-visible content in English + Hindi:
   - Column pairs: `{field}_en` / `{field}_hi` (e.g., `name_en`, `name_hi`)
   - Admin forms: both required
   - User-facing forms: `_en` required, `_hi` optional
   - JSON bilingual columns use `{ en: ..., hi: ... }` structure

4. **Content Flags** — Every public query MUST filter:
   - `is_published` = editorial workflow (default false)
   - `is_active` = visibility toggle (default true)
   - Only fetch where **both** are `true`

---

## React Native App (baagichaApp)

### Commands

```bash
npm start              # Start Metro bundler
npm run android        # Build and run on Android
npm run ios            # Build and run on iOS (Mac only)
npm test               # Run Jest tests
npm run lint           # Run ESLint
```

### Stack

- React 19.2.3 + React Native 0.85.3
- TypeScript (strict mode enabled)
  - `.tsx` for components and screens
  - `.ts` for plain modules
- `react-native-safe-area-context` ^5.5.2 for safe area insets
- Jest + `@react-native/jest-preset` for testing
- ESLint (`@react-native` preset)
- Prettier: single quotes, trailing commas, arrow parens avoid
- Node >= 22.11.0

### Current State

Early bootstrap. The app renders a minimal screen. These are **NOT yet wired up**:
- Navigation (no React Navigation)
- State management (no Redux / Zustand / Context)
- API client (no Axios / TanStack Query)
- Auth flow
- Most screen/component directory structure

### Existing Source Files

```
src/
├── components/
│   └── ScreenWrapper.tsx     # Flex 1 + bgPrimary background
├── screens/
│   └── HomeScreen.tsx        # Renders "Hello" inside ScreenWrapper
├── services/                 # EMPTY — add API client here
├── theme/
│   ├── colors.ts             # Full color palette
│   └── style.ts              # globalStyle.screen / .centeredScreen
```

### Color Palette (from `src/theme/colors.ts`)

```ts
// Brand
bgPrimary:    '#1a2e1a'   // Dark green background
bgSecondary:  '#2d4a2d'
primary:      '#3a7d44'   // Brand green
primaryLight: '#52a85f'
accent:       '#e8b84b'   // Gold
accentLight:  '#f5d07a'

// Status
success: '#22c55e'
warning: '#f59e0b'
danger:  '#ef4444'
info:    '#3b82f6'

// Grays (Tailwind-style scale)
gray50  → '#f8fafc'
gray100 → '#f1f5f9'
gray200 → '#e2e8f0'
gray300 → '#cbd5e1'
gray400 → '#94a3b8'
gray500 → '#64748b'
gray600 → '#475569'
gray700 → '#334155'
gray800 → '#1e293b'
gray900 → '#0f172a'

// Base
white: '#ffffff'
black: '#000000'
```

### Entry Point

`App.tsx` → `SafeAreaProvider` → `SafeAreaView` → `HomeScreen`

### Testing

- Framework: Jest with `@react-native/jest-preset`
- Single test: `__tests__/App.test.tsx` — renders `<App />` via `react-test-renderer`
- Run single file: `npx jest __tests__/App.test.tsx`

---

## Laravel Web App (web_baagicha)

### Quick Commands

```bash
composer setup      # install, key:generate, migrate, seed, build
composer dev        # server + queue:listen + pail + vite (concurrent)
composer test       # config:clear + phpunit
php artisan pint    # code formatting
```

### Stack

- Laravel 12 · PHP 8.2+ · MySQL 8.0
- Bootstrap 5 + custom CSS
- Laravel Breeze (phone-first auth)
- Spatie: permission, medialibrary, sluggable, sitemap
- SEOTools · mcamara/localization (en/hi)

### Project Map

```
app/Http/Controllers/Admin/     22 admin CRUD controllers
app/Http/Controllers/App/       13 public-facing controllers
app/Http/Requests/Admin/        12 Form Request classes
app/Models/                     32 Eloquent models
app/Services/                   WeatherService, SprayScheduleService, NotificationService
routes/web/admin/               10 admin route files
routes/web/app/                 18 app route route files
database/migrations/            34 migrations (+ app/ subdirectory)
resources/views/layouts/app/    base.blade.php — THE ONLY public layout
resources/views/components/     56 Blade components
public/css/                     19 CSS files (style.css = shared)
public/js/                      16 JS files (script.js = shared)
DOCS/                           project documentation
```

### Existing Services

| Service | Lines | Purpose |
|---------|-------|---------|
| `WeatherService` | ~647 | OpenWeatherMap + Open-Meteo fallback, DB cache 15-min freshness |
| `SprayScheduleService` | ~413 | Schedule loading, altitude-aware stage computation, slug mapping |
| `NotificationService` | — | Notification creation and delivery |

### Auth

- Phone-first auth via Laravel Breeze — phone is primary identifier, email optional
- Roles: `admin`, `manager`, `farmer` (via `spatie/laravel-permission`)
- SMS OTP via MSG91 planned
- `Gate::before()` grants `admin` full access
- **No API auth yet** — session-based only. Token auth (Sanctum/Passport) is pending for mobile.

### API Status (Critical for Mobile Integration)

- **No `routes/api.php` exists yet** — all routes are web/Blade
- Do NOT create API routes without explicit instruction
- When API is built, responses must follow: `{ success: bool, data: mixed, message: string }`
- Rate limits planned:
  - Public: 60 req/min by IP
  - Authenticated: 120 req/min by user ID
  - API: 30 req/min by IP
  - Search: 20 req/min by IP

### Response Patterns

```php
// Web views
return view('app.diseases.show', compact('disease', 'related'));

// Redirects
return redirect()->route('admin.diseases.index')->with('success', 'Disease created.');

// AJAX / future API
return response()->json(['success' => true, 'data' => $result, 'message' => '...']);
```

### Naming Conventions (Backend)

| Thing | Convention | Example |
|-------|-----------|---------|
| Models | PascalCase singular | `BlogPost`, `UserOrchard` |
| Tables | snake_case plural | `blog_posts`, `user_orchards` |
| Controllers | `{Entity}Controller` | `DiseaseController` |
| Form Requests | `{Store\|Update}{Entity}Request` | `StoreDiseaseRequest` |
| Services | `{Domain}Service` | `SprayScheduleService` |
| Jobs | `{Verb}{Noun}Job` | `FetchWeatherJob` |
| Events | `{Noun}{PastVerb}` | `DiseaseCreated` |
| Policies | `{Model}Policy` | `DiseasePolicy` |
| Routes (URL) | kebab-case | `/spray-schedule`, `/blog-categories` |
| Views | dot-notation | `admin.chemicals.index`, `app.diseases.show` |
| Bilingual columns | `{field}_en` / `{field}_hi` | `name_en`, `name_hi` |

### Data Rules

- All bilingual content uses `_en` / `_hi` column suffixes — always paired
- `users` table is thin — extended data lives in `user_profiles` and `user_preferences`
- `ratings` and `saved_content` tables are polymorphic
- JSON columns for semi-structured content (descriptions, identification steps, prevention methods)
- Denormalized counts (`view_count`, `rating_count`, `comment_count`, `post_count`) — update via model events or jobs, never raw increment in controllers
- Altitude auto-computed: `altitude_band` on `user_orchards` is set via `syncAltitudeData()` in `booted()` — NEVER set manually
- Same auto-sync for `altitude_feet` ↔ `altitude_meters` and `area_hectare` ↔ `area_kanal`

### Performance Rules

- Cache aggressively: knowledge base content 1-6 hours, weather 15 min, spray schedules 24 hours
- Queue everything slow: weather API, email, notifications, image processing, view counts
- Never query in Blade — all data from controller or class-based component
- Paginate everything: max 50 items per page
- Eager load always — enable `Model::preventLazyLoading()` in non-prod
- Never use `Model::all()`
- Never use `LIKE '%term%'` on large tables — use FULLTEXT with `MATCH ... AGAINST`
- Use `select()` for listing pages — don't load full `body_en`/`body_hi`

### Security Rules

- Always chain `->active()->published()` on public queries
- Never expose internal IDs — use slugs for public URLs
- Use Policy classes for authorization, never inline role checks
- Phone validation: `regex:/^[6-9]\d{9}$/`
- Altitude: positive integer, range 1000–4000 meters
- CSRF protection enabled globally
- Use `abort_if(!$model->is_published, 404)` — never throw generic exceptions for 404s

### Validation Rules

```php
'phone'            => ['required', 'regex:/^[6-9]\d{9}$/'],
'altitude_meters'  => ['required', 'integer', 'between:1000,4000'],
'altitude_band'    => ['required', Rule::in(['below_6000', '6000_8000', 'above_8000'])],
'slug'             => ['required', 'string', 'max:255', 'unique:diseases,slug'],
'name_en'          => ['required', 'string', 'max:255'],
'name_hi'          => ['required', 'string', 'max:255'],  // admin only
'is_published'     => ['boolean'],
'is_active'        => ['boolean'],
```

### Testing

- PHPUnit 11 with `RefreshDatabase`
- Naming: `test_{action}_{context}_{expectedResult}()`
- Priority: Auth guards → Altitude filtering → Published/active scoping → Form validation → Cache invalidation → External API fallbacks
- Never mock the database — use `RefreshDatabase`
- Test behavior, not implementation
- Run `php artisan pint` before committing

### Cache Key Patterns

| Data | TTL | Key Pattern |
|------|-----|-------------|
| Disease index | 6h | `diseases:index:{locale}` |
| Chemical index | 6h | `chemicals:index:{locale}` |
| Variety index | 6h | `varieties:index:{locale}` |
| Rootstock index | 6h | `rootstocks:index:{locale}` |
| Blog post list | 1h | `blog:list:{page}:{category}` |
| Single entity | 6h | `{entity}:{slug}` |
| Spray schedules | 24h | `spray:{fruit}:{region}:{band}` |
| Home sections | 1h | `home:{section}:{band}` |
| Nav counts | 15m | `stats:{type}` |

### Pending Decisions (Do Not Change Without Explicit Instruction)

1. **Phone-first auth** — settled
2. **Altitude bands as core engine** — settled
3. **Bilingual with column suffixes** — settled (not translations table)
4. **Spatie ecosystem** — settled (permission, medialibrary, sluggable)
5. **JSON columns for structured content** — settled
6. **No repository pattern** — settled (direct Eloquent)
7. **No API layer yet** — settled (future phase)
8. **Database-first for dev** — sessions/cache/queue use database driver

**Truly Pending** (need decision):
- API auth strategy (Sanctum vs Passport)
- AI assistant model (Claude API integration)
- Cache backend (Redis vs Memcached)
- Image CDN for production
- Search engine (Scout + Meilisearch vs FULLTEXT)
- Notification channels (in-app, SMS, push)

---

## Mobile ↔ Web Integration Notes

When implementing mobile features:

1. **Respect altitude bands** — same filtering logic as web
2. **Use bilingual model** — same `_en` / `_hi` pattern
3. **Consume Laravel backend** — via web routes or future REST/JSON API; do NOT duplicate business logic
4. **Match web design system** — colors, domain colors, card styles, typography
5. **Establish `src/` directory tree** before writing new components:
   ```
   src/
   ├── components/       # Reusable UI components
   ├── screens/          # Full-screen components
   ├── navigation/       # React Navigation setup
   ├── services/         # API client, auth service
   ├── theme/            # Colors, typography, spacing
   └── hooks/            # Custom React hooks
   ```
6. **Add navigation first** — React Navigation is the logical next step
7. **Add API client second** — Axios or fetch wrapper to hit Laravel endpoints
8. **Add auth third** — coordinate with backend on token strategy

---

## Domain Color Reference (for Mobile UI)

| Entity | Attribute | Values |
|--------|-----------|--------|
| Disease severity | Critical | `#dc2626` |
| | High | `#ea580c` |
| | Medium | `#ca8a04` |
| | Low | `#2563eb` |
| Variety season | Early | `#f97316` |
| | Mid | `#3a7d44` |
| | Late | `#7c3aed` |
| | Very Late | `#4338ca` |
| Rootstock vigour | Dwarfing | `#0ea5e9` |
| | Semi-Dwarfing | `#22c55e` |
| | Semi-Vigorous | `#d97706` |
| | Vigorous | `#ea580c` |
| Chemical toxicity | Class I | `#991b1b` |
| | Class II | `#dc2626` |
| | Class III | `#d97706` |
| | Class IV | `#22c55e` |

---

## Last Updated

2026-05-08 — Initial memory file created after full workspace exploration.
