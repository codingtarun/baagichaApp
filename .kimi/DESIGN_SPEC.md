# Baagicha — Complete Design Specification

> Extracted from: `/home/tarun-chauhan/Desktop/Apps/web_baagicha/resources/views/app`
> Date: 2026-05-09
> Source: Laravel web frontend (style.css, home.css, blade templates)

---

## 1. Project Overview

**Baagicha** (बागीचा) is a farmer-focused mobile app for Himalayan apple growers in HP, UK, and J&K. It provides spray schedules, disease/pest libraries, weather forecasts with spray suitability, variety & rootstock guides, community disease reporting, and a blog/knowledge base.

**Web Stack:** Laravel + Blade + Custom CSS (mobile-first PWA)
**Mobile Target:** React Native (bare, CLI-bootstrapped)

---

## 2. Color Scheme

| Token | Hex | Usage |
|-------|-----|-------|
| `bgPrimary` | `#1a2e1a` | Dark green header bg |
| `bgSecondary` | `#2d4a2d` | Secondary dark green |
| `primary` | `#3a7d44` | Primary green (buttons, active states) |
| `primaryLight` | `#52a85f` | Light green |
| `accent` | `#e8b84b` | Gold/amber accent |
| `accentLight` | `#f5d07a` | Light gold |
| `gray50` | `#f8fafc` | Page background |
| `gray100` | `#f1f5f9` | Card backgrounds |
| `gray200` | `#e2e8f0` | Borders |
| `gray400` | `#94a3b8` | Secondary text |
| `gray500` | `#64748b` | Muted text |
| `gray600` | `#475569` | Body text |
| `gray700` | `#334155` | Headings |
| `gray800` | `#1e293b` | Dark text |
| `gray900` | `#0f172a` | Almost black |
| `success` | `#22c55e` | Success/good |
| `warning` | `#f59e0b` | Warning/caution |
| `danger` | `#ef4444` | Error/critical |
| `info` | `#3b82f6` | Info blue |

**Priority Colors:**
- Essential: `#dc2626` (red)
- Recommended: `#f59e0b` (amber)
- Conditional: `#60a5fa` (blue)

**Severity Colors:**
- Critical: `#dc2626`
- High: `#f97316`
- Medium: `#f59e0b`
- Low: `#22c55e`

---

## 3. Typography

| Purpose | Font | Fallback |
|---------|------|----------|
| Display/Headings | DM Serif Display | Georgia, serif |
| Body | DM Sans | system-ui, sans-serif |
| Hindi | Noto Sans Devanagari | DM Sans |
| Hindi Display | Yatra One | Noto Sans Devanagari |

**Font Sizes (mobile dp):**
- Hero title: `23` (1.45rem)
- Section headers: `20` (1.25rem)
- Sub-headings: `17` (1.05rem)
- Card titles: `15` (0.95rem)
- Body: `14` (0.82–0.88rem)
- Body small: `13` (0.76–0.8rem)
- Caption: `12` (0.72rem)
- Small (badges/pills): `11` (0.6–0.68rem)
- Micro (nav Hindi): `9` (0.5–0.55rem)

---

## 4. Layout Structure

```
┌─────────────────────────┐
│  App Header (sticky)    │  ← Dark gradient, greeting, location chip,
│  · Greeting             │     weather widget, stat pills
│  · Location Chip        │
│  · Weather Widget       │
│  · 3 Stat Pills         │
├─────────────────────────┤
│                         │
│  Main Content (scroll)  │  ← White bg (#f8fafc), 16px padding
│                         │
├─────────────────────────┤
│  App Footer             │  ← Minimal copyright + socials
├─────────────────────────┤
│  Bottom Navigation      │  ← Fixed, glassmorphism, 5 tabs
└─────────────────────────┘
```

**Header Behavior:** On scroll > 50px, compact mode shrinks header (hides stats, reduces padding & font sizes).

**App Container:** `max-width: 428px`, `100dvh`, centered on desktop, full-width on actual phones.

---

## 5. Shadows

| Token | Value |
|-------|-------|
| `shadowXs` | `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)` |
| `shadowSm` | `0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)` |
| `shadowMd` | `0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06)` |
| `shadowLg` | `0 4px 8px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08)` |
| `shadowXl` | `0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.1)` |
| `shadowPrimary` | `0 4px 14px rgba(58,125,68,0.15)` |
| `shadowAccent` | `0 4px 14px rgba(232,184,75,0.2)` |

---

## 6. Border Radius

| Token | Value |
|-------|-------|
| `radiusSm` | `8px` |
| `radiusMd` | `16px` |
| `radiusLg` | `24px` |
| `radiusXl` | `32px` |
| `radiusFull` | `999px` |

---

## 7. Spacing

| Token | Value |
|-------|-------|
| `spaceXs` | `4px` |
| `spaceSm` | `8px` |
| `spaceMd` | `16px` |
| `spaceLg` | `24px` |
| `spaceXl` | `32px` |

---

## 8. Transitions

| Token | Value |
|-------|-------|
| `transitionFast` | `150ms cubic-bezier(0.2, 0, 0, 1)` |
| `transitionBase` | `250ms cubic-bezier(0.2, 0, 0, 1)` |
| `transitionSlow` | `350ms cubic-bezier(0.2, 0, 0, 1)` |
| `transitionSpring` | `400ms cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `transitionBounce` | `500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` |

---

## 9. Interactions & Animations

| Interaction | Behavior |
|-------------|----------|
| **Scroll** | Header compacts after 50px scroll |
| **Haptic** | 8-10ms vibration on all buttons/taps |
| **Press** | `transform: scale(0.97)` on cards, `scale(0.92)` on nav items |
| **Toast** | Android-style snackbar from bottom (success, saved, liked, error) |
| **Dropdowns** | Backdrop overlay, close on outside tap or Escape |
| **Task Done/Pin** | Toggle icon regular/solid, persist to localStorage |
| **Like/Save** | POST to `/actions/like` or `/actions/save`, toggle state |
| **Nav Active** | Pill background, larger icon |
| **Stagger Load** | Cards animate in with `slideUp` + delay |

---

## 10. Header Component (Inner Pages)

Slim header with:
- Brand link "Baagicha" with seedling icon
- Orchard weather button (dropdown) — shows temp circle + orchard name + condition
- Notification bell (badge + dropdown)
- Profile button (dropdown with menu)

**Orchard Dropdown:**
- Active orchard summary
- List of orchards (selectable)
- Device GPS option
- Footer: Manage Orchards · Forecast

**Profile Dropdown Menu:**
- My Profile
- My Orchards
- Orchard Diary
- Saved Items
- Disease Reports
- Notification Settings
- Log out

---

## 11. Bottom Navigation (5 Tabs)

| Route | Label (EN) | Label (HI) | Icon |
|-------|-----------|-----------|------|
| `home` | Home | होम | `fas fa-home` |
| `spray-schedule` | Spray | स्प्रे | `fas fa-spray-can-sparkles` |
| `disease` | Disease | रोग | `fas fa-virus` |
| `variety` | Varieties | किस्में | `fas fa-apple-alt` |
| `rootstock` | Rootstock | मूलवृंत | `fas fa-tree` |

**Active State:** Green pill background, larger icon (`1.6rem`), green text.

---

## 12. Component Patterns

| Component | Description |
|-----------|-------------|
| `.card-modern` | White card, rounded-2xl, subtle shadow, scale on press |
| `.section-header` | Title (display font) + Hindi subtitle + "View All" link |
| `.section-title-icon` | Small green circle icon before section title |
| `.h-scroll-track` | Horizontal scroll container with snap |
| `.card-act-btn` | Circular action button (32px), like/save/done/pin |
| `.task-priority-pill` | Colored pill by priority |
| `.alert-row-card` | Alert with left colored severity bar |
| `.outbreak-card` | Community report with left severity bar |
| `.scroll-hint` | "Swipe to explore · स्वाइप करें" hint text |

---

## 13. Other Screens

| Screen | Route | Key Features |
|--------|-------|-------------|
| Spray Schedule | `spray-schedule` | Stage hero, fruit selector, region tabs, chemical panels, tank calculator |
| Disease Library | `disease` | Filter pills, disease cards with images, detail pages |
| Chemical Detail | `chemicals.show` | Brand listings, dose info, safety cards |
| Variety Guide | `variety` | Filter by season, variety cards, detail pages |
| Rootstock Guide | `rootstock` | Filter by size, rootstock cards, detail pages |
| Blog | `blog.home` | Category pills, blog cards, article pages |
| Weather | `weather.forecast` | 7-day forecast, detailed conditions |
| Orchards | `orchards.index` | Create/manage orchards, activity logs |
| Disease Reporter | `disease-reporter.index` | Map reports, outbreak submissions |
| Profile | `profile.dashboard` | User stats, saved items, settings |
| Notifications | `notifications.index` | Notification list, settings |

---

*This document is a reference for rebuilding the Baagicha web app as a React Native application. All values are extracted directly from the Laravel frontend source code.*
