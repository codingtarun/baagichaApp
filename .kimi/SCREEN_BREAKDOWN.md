# Baagicha — Screen Breakdown

> Complete list of all screens in the app, with components, data, and navigation.

---

## 1. Home Screen

**Route:** `/`  
**File:** `resources/views/app/home/index.blade.php`

### Sections (in order):

#### 1.1 Do Now Banner (`<x-home.now-banner>`)
- **Hero:** Stage name, Hindi name, progress bar, period, spray suitability badge
- **Weather Warnings:** Scrollable list of warnings
- **Disease Watch:** Horizontal scroll chips with risk levels
- **Spray Now:** Horizontal scroll chips (fungicides, pesticides, foliar)
- **Soil:** Compact rows with nutrient info

#### 1.2 Forecast Strip (`<x-home.forecast-strip>`)
- 4-day forecast cards in a horizontal scroll
- Each card: day, date, icon, high/low temp, wind, rain %, spray suitability

#### 1.3 Weekly Tasks (`<x-home.weekly-tasks>`)
- Tab bar: Spray | Nutrition | Cultural
- Task rows with: icon, name, Hindi name, priority pill, when, target, dose, PHI, brands
- Action buttons: Done ✓, Pin 📌

#### 1.4 Alerts (`<x-home.alerts-section>`)
- **Preventive Alerts:** Icon + title + Hindi title + description, left severity bar
- **Community Outbreaks:** Disease name, Hindi name, report count, location, time, tip

#### 1.5 Top Varieties (`<x-home.top-varieties>`)
- Horizontal scroll cards
- Rank badge, placeholder image, tag, name, Hindi name, altitude, rating, votes
- Like / Save buttons

#### 1.6 Top Rootstocks (`<x-home.top-rootstocks>`)
- Horizontal scroll cards
- Rank badge, placeholder image, tag, name, Hindi name, type, spacing, votes
- Like / Save buttons

#### 1.7 Top Blogs (`<x-home.top-blogs>`)
- Horizontal scroll cards
- Rank badge, thumbnail image, category tag, title, Hindi title, author, date, read time, views
- Like / Save buttons

#### 1.8 Top Contributors (`<x-home.top-contributors>`)
- Vertical list rows
- Rank (gold/silver/bronze for top 3), avatar, name, badge, location, stats, points

---

## 2. Spray Schedule Screen

**Route:** `/spray-schedule`  
**File:** `resources/views/app/spray-schedule/index.blade.php`

### Components:
- Stage hero with fruit image
- Fruit selector tabs
- Region tabs (HP / UK / J&K)
- Stage track / timeline
- Chemical panels (priority sections)
- Tank calculator
- Safety card
- Hail card
- Tips panel
- Share row
- Floating action button

---

## 3. Disease Library Screen

**Route:** `/disease`  
**File:** `resources/views/app/disease/index.blade.php`

### Components:
- Filter pills (All / Fungal / Pest / Bacterial)
- Disease cards with image, name, Hindi name, type badge, risk level
- Search bar
- Detail page with tabs: Symptoms / Prevention / Treatment

---

## 4. Chemical Detail Screen

**Route:** `/chemicals/{slug}`  
**File:** `resources/views/app/chemical/show.blade.php`

### Components:
- Chemical name + Hindi name
- Dose info
- Brand listings with links
- Safety instructions
- Related diseases

---

## 5. Variety Guide Screen

**Route:** `/variety`  
**File:** `resources/views/app/variety/index.blade.php`

### Components:
- Filter pills by season
- Variety tiles/cards
- Detail page with: description, altitude chart, characteristics, ratings

---

## 6. Rootstock Guide Screen

**Route:** `/rootstock`  
**File:** `resources/views/app/rootstock/index.blade.php`

### Components:
- Filter pills by size/vigour
- Rootstock cards
- Detail page with: description, spacing, soil compatibility, ratings

---

## 7. Blog Screen

**Route:** `/blog`  
**File:** `resources/views/app/blog/index.blade.php`

### Components:
- Category pills (Spray / Disease / Pest / Rootstock / Market / Practice)
- Blog cards with image, title, excerpt, author, date
- Article page with full content, comments
- Search functionality

---

## 8. Weather Forecast Screen

**Route:** `/weather/forecast`  
**File:** `resources/views/app/weather/index.blade.php`

### Components:
- Current weather widget
- 7-day forecast list
- Hourly forecast
- Spray suitability for each day
- Weather alerts

---

## 9. Orchards Screen

**Route:** `/orchards`  
**File:** `resources/views/app/orchards/index.blade.php`

### Components:
- Orchard list cards
- Create orchard form
- Orchard detail with varieties
- Activity log
- Weather for each orchard

---

## 10. Disease Reporter Screen

**Route:** `/disease-reporter`  
**File:** `resources/views/app/disease-reporter/index.blade.php`

### Components:
- Map view with outbreak pins
- Report form (disease, location, photos, notes)
- Recent reports list
- Outbreak alerts

---

## 11. Profile Screen

**Route:** `/profile`  
**File:** `resources/views/app/profile/dashboard.blade.php`

### Components:
- User info card
- Points / badges
- Stats (reports, reviews, photos)
- Saved items section
- Settings link

---

## 12. Notifications Screen

**Route:** `/notifications`  
**File:** `resources/views/app/notifications/index.blade.php`

### Components:
- Notification list
- Unread badge
- Settings screen for notification preferences

---

## 13. Auth Screens

**Files:** `resources/views/auth/*.blade.php`

### Screens:
- Login
- Register
- Forgot Password
- Reset Password
- Confirm Password
- Verify Email

---

## 14. Saved Items Screen

**Route:** `/saved`  
**File:** `resources/views/app/saved/index.blade.php`

### Components:
- Filter by type (Varieties / Rootstocks / Blogs / Chemicals)
- Saved item cards
- Remove from saved action

---

## Navigation Structure

```
Home (Tab)
├── Spray Schedule (Tab)
├── Disease Library (Tab)
│   └── Disease Detail
├── Variety Guide (Tab)
│   └── Variety Detail
├── Rootstock Guide (Tab)
│   └── Rootstock Detail
├── Blog
│   └── Article Detail
├── Weather Forecast
├── Orchards
│   ├── Create Orchard
│   └── Orchard Detail
├── Disease Reporter
│   └── Submit Report
├── Profile
│   ├── Saved Items
│   ├── Notification Settings
│   └── Edit Profile
├── Notifications
└── Auth (Login / Register)
```

---

*This breakdown covers every screen in the Laravel app. Each screen should be implemented as a React Native screen component with matching design and data structures.*
