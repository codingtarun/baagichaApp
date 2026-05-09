# Baagicha — Complete Data Models

> Extracted from: `/home/tarun-chauhan/Desktop/Apps/web_baagicha/resources/views/app/home/index.blade.php`
> All TypeScript interfaces for the React Native app.

---

## 1. Growth Stage

```typescript
interface GrowthStage {
  /** English stage name */
  name: string;
  /** Hindi stage name */
  nameHi: string;
  /** FontAwesome icon class */
  icon: string;
  /** Date range string */
  period: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Next stage English name */
  nextStage: string;
  /** Next stage Hindi name */
  nextStageHi: string;
}
```

**Example:**
```typescript
const stage: GrowthStage = {
  name: 'Dormancy Break / Green Tip',
  nameHi: 'सुप्तावस्था / हरी कली',
  icon: 'fas fa-seedling',
  period: 'Mar 1 – Mar 20, 2026',
  progress: 65,
  nextStage: 'Tight Cluster',
  nextStageHi: 'कसी कली',
};
```

---

## 2. Task / Spray Item

```typescript
interface TaskItem {
  /** English name */
  name: string;
  /** Hindi name */
  nameHi: string;
  /** URL slug for detail page */
  slug: string | null;
  /** Dose instruction */
  dose: string | null;
  /** When to apply */
  when: string;
  /** Hindi timing instruction */
  whenHi: string;
  /** What disease/pest it targets */
  target: string;
  /** Available brands */
  brands: Brand[] | null;
  /** Priority level */
  priority: 'essential' | 'recommended' | 'conditional';
  /** Pre-Harvest Interval in days (null if not applicable) */
  phi: number | null;
  /** FontAwesome icon class */
  icon: string;
}

interface Brand {
  name: string;
  slug: string | null;
}
```

**Example:**
```typescript
const task: TaskItem = {
  name: 'Copper Oxychloride 50WP',
  nameHi: 'कॉपर ऑक्सीक्लोराइड',
  slug: 'copper-oxychloride',
  dose: '300 gm / 200 L',
  when: 'Before bud break · 6–10 AM',
  whenHi: 'कली फूटने से पहले · सुबह',
  target: 'Canker, Blossom Blight',
  brands: [
    { name: 'Blitox', slug: 'blitox' },
    { name: 'Blue Copper', slug: 'blue-copper' },
    { name: 'Fytolan', slug: 'fytolan' },
  ],
  priority: 'essential',
  phi: null,
  icon: 'fas fa-flask',
};
```

---

## 3. Disease Watch Item

```typescript
interface DiseaseWatchItem {
  /** English disease name */
  name: string;
  /** Hindi disease name */
  nameHi: string;
  /** URL slug for detail page */
  slug: string | null;
  /** Type of threat */
  type: 'fungal' | 'pest' | 'bacterial';
  /** Risk level */
  risk: 'high' | 'medium' | 'low';
  /** Advisory note */
  note: string;
  /** Hindi advisory note */
  noteHi: string;
}
```

---

## 4. Soil Nutrition Item

```typescript
interface SoilNutritionItem {
  /** Nutrient name */
  name: string;
  /** Hindi name */
  nameHi: string;
  /** Application dose */
  dose: string;
  /** Application method */
  method: string;
  /** Hindi method */
  methodHi: string;
  /** Timing instruction */
  timing: string;
  /** FontAwesome icon */
  icon: string;
}
```

---

## 5. Weather Warning

```typescript
interface WeatherWarning {
  /** Warning type */
  type: 'frost' | 'hail' | 'heavy_rain' | 'strong_wind' | 'generic';
  /** Warning message */
  message: string;
  /** Severity level */
  severity: 'critical' | 'high' | 'medium' | 'low';
}
```

---

## 6. Preventive Alert

```typescript
interface PreventiveAlert {
  /** FontAwesome icon class */
  icon: string;
  /** English title */
  title: string;
  /** Hindi title */
  titleHi: string;
  /** Description */
  desc: string;
  /** Severity: critical | high | medium | low */
  sev: 'critical' | 'high' | 'medium' | 'low';
}
```

---

## 7. Outbreak Alert

```typescript
interface OutbreakAlert {
  /** Location string */
  location: string;
  /** Disease name English */
  disease: string;
  /** Disease name Hindi */
  diseaseHi: string;
  /** Number of farmer reports */
  reports: number;
  /** Time ago string */
  when: string;
  /** Severity */
  sev: 'critical' | 'high' | 'medium';
  /** Action tip */
  tip: string;
}
```

---

## 8. Variety Card

```typescript
interface Variety {
  /** English name */
  name: string;
  /** Hindi name */
  nameHi: string;
  /** Altitude range */
  altitude: string;
  /** Number of farmer votes */
  votes: number;
  /** Rating out of 5 */
  rating: number;
  /** Card accent color */
  color: string;
  /** Tag label */
  tag: string;
  /** Optional season for filtering */
  season?: string;
}
```

---

## 9. Rootstock Card

```typescript
interface Rootstock {
  /** Name */
  name: string;
  /** Hindi name */
  nameHi: string;
  /** Type (Dwarfing, Semi-dwarfing, etc.) */
  type: string;
  /** Planting spacing */
  spacing: string;
  /** Number of farmer votes */
  votes: number;
  /** Rating out of 5 */
  rating: number;
  /** Card accent color */
  color: string;
  /** Tag label */
  tag: string;
  /** Optional vigour for filtering */
  vigour?: string;
}
```

---

## 10. Blog Card

```typescript
interface BlogPost {
  /** Article title */
  title: string;
  /** Hindi title */
  titleHi: string;
  /** Category name */
  category: string;
  /** Category badge color */
  catColor: string;
  /** Read time in minutes */
  readMin: number;
  /** View count */
  views: number;
  /** Like count */
  likes: number;
  /** Author name */
  author: string;
  /** Publish date string */
  date: string;
  /** Optional excerpt */
  excerpt?: string;
}
```

---

## 11. Contributor

```typescript
interface Contributor {
  /** Full name */
  name: string;
  /** Hindi name */
  nameHi: string;
  /** Location with altitude */
  location: string;
  /** Initials for avatar */
  initials: string;
  /** Avatar border/accent color */
  color: string;
  /** Total points */
  points: number;
  /** Badge label */
  badge: string;
  /** Number of disease reports */
  reports: number;
  /** Number of reviews */
  reviews: number;
  /** Number of photos uploaded */
  photos: number;
}
```

---

## 12. Forecast Day

```typescript
interface ForecastDay {
  /** Day name in Hindi */
  day: string;
  /** Day name in English */
  dayEn: string;
  /** Date string */
  date: string;
  /** Weather FontAwesome icon */
  icon: string;
  /** Icon color */
  iconColor: string;
  /** High temperature */
  high: string;
  /** Low temperature */
  low: string;
  /** Wind speed km/h */
  wind: string;
  /** Rain probability % */
  rain: string;
  /** Spray suitability */
  suit: 'perfect' | 'caution' | 'avoid';
  /** Suitability label English */
  suitLabel: string;
  /** Suitability label Hindi */
  suitHi: string;
}
```

---

## 13. Priority Meta

```typescript
interface PriorityMeta {
  label: string;
  color: string;
}

// Usage:
const priorityMeta: Record<string, PriorityMeta> = {
  essential: { label: 'Essential', color: '#dc2626' },
  recommended: { label: 'Recommended', color: '#f59e0b' },
  conditional: { label: 'If Needed', color: '#60a5fa' },
};
```

---

## 14. Severity Colors Map

```typescript
const sevColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
};
```

---

## 15. Spray Suitability Config

```typescript
interface SuitConfig {
  icon: string;
  className: string;
  label: string;
}

const suitConfig: Record<string, SuitConfig> = {
  perfect: { icon: 'fas fa-check-circle', className: 'suit-perfect', label: 'Good for Spray' },
  caution: { icon: 'fas fa-exclamation-triangle', className: 'suit-caution', label: 'Use Caution' },
  avoid: { icon: 'fas fa-times-circle', className: 'suit-avoid', label: 'Avoid Spray' },
};
```

---

## 16. Navigation Item

```typescript
interface NavItem {
  /** Route name for navigation */
  route: string;
  /** English label */
  label: string;
  /** Hindi label */
  labelHi: string;
  /** Accessibility title */
  title: string;
  /** FontAwesome icon class */
  icon: string;
}
```

**Navigation Items:**
```typescript
const navItems: NavItem[] = [
  { route: 'home', label: 'Home', labelHi: 'होम', title: 'Home', icon: 'fas fa-home' },
  { route: 'spray-schedule', label: 'Spray', labelHi: 'स्प्रे', title: 'Spray Schedule', icon: 'fas fa-spray-can-sparkles' },
  { route: 'disease', label: 'Disease', labelHi: 'रोग', title: 'Disease Library', icon: 'fas fa-virus' },
  { route: 'variety', label: 'Varieties', labelHi: 'किस्में', title: 'Apple Varieties', icon: 'fas fa-apple-alt' },
  { route: 'rootstock', label: 'Rootstock', labelHi: 'मूलवृंत', title: 'Rootstocks', icon: 'fas fa-tree' },
];
```

---

## 17. Weather Header Data

```typescript
interface HeaderWeather {
  /** Location name */
  location: string;
  /** Current temperature */
  temperature: string;
  /** Weather condition description */
  weatherCondition: string;
  /** Spray status message */
  sprayStatus: string;
  /** Days until bloom */
  daysToBloom: string;
  /** Number of pending sprays */
  pendingSprays: string;
  /** Mandi price trend */
  mandiTrend: string;
}
```

---

## 18. Orchard

```typescript
interface Orchard {
  id: number;
  orchard_name: string;
  village: string;
  district: string;
  location: string;
  is_primary: boolean;
}
```

---

*All interfaces are extracted directly from the Laravel Blade templates and are ready to use in the React Native TypeScript codebase.*
