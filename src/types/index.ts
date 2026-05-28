/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHARED TYPES
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: In TypeScript, we define the SHAPE of our data using
 * "interfaces" or "types". This is like a contract - it tells
 * the compiler "every TaskItem MUST have a name, nameHi, slug..."
 *
 * Benefits:
 *   - Catch bugs at compile time (before running the app!)
 *   - Get autocomplete in VS Code (press Ctrl+Space)
 *   - Document what data looks like for other developers
 *
 * These types are extracted from the Laravel Blade templates
 * at /home/tarun-chauhan/Desktop/Apps/web_baagicha
 */

// ═══════════════════════════════════════════════════════════
// 1. GROWTH STAGE
// ═══════════════════════════════════════════════════════════

/**
 * Represents the current growth stage of the apple tree.
 * LEARN: The '?' after a property means it's optional.
 * The '|' means "this OR that" (union type).
 */
export interface GrowthStage {
  /** English stage name, e.g. "Dormancy Break / Green Tip" */
  name: string;
  /** Hindi stage name, e.g. "सुप्तावस्था / हरी कली" */
  nameHi: string;
  /** FontAwesome icon class, e.g. "fas fa-seedling" */
  icon: string;
  /** Date range string, e.g. "Mar 1 – Mar 20, 2026" */
  period: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Next stage English name */
  nextStage: string;
  /** Next stage Hindi name */
  nextStageHi: string;
}

// ═══════════════════════════════════════════════════════════
// 2. BRAND (for chemicals)
// ═══════════════════════════════════════════════════════════

/**
 * A brand/manufacturer of a chemical product.
 * LEARN: Simple interfaces with just 2-3 fields are very common.
 */
export interface Brand {
  /** Brand name, e.g. "Blitox" */
  name: string;
  /** URL slug for the brand detail page, or null if no page */
  slug: string | null;
}

// ═══════════════════════════════════════════════════════════
// 3. TASK / SPRAY ITEM
// ═══════════════════════════════════════════════════════════

/**
 * LEARN: We use string literal union types for properties
 * that can only have specific values. TypeScript will
 * prevent us from accidentally using 'critical' instead
 * of 'essential' for priority.
 */
export type Priority = 'essential' | 'recommended' | 'conditional';

/**
 * A single task or spray item in the weekly schedule.
 * This appears in the Do Now banner AND the Weekly Tasks section.
 */
export interface TaskItem {
  /** English name, e.g. "Copper Oxychloride 50WP" */
  name: string;
  /** Hindi name, e.g. "कॉपर ऑक्सीक्लोराइड" */
  nameHi: string;
  /** URL slug for detail page, or null if not linkable */
  slug: string | null;
  /** Dose instruction, e.g. "300 gm / 200 L" */
  dose: string | null;
  /** When to apply, e.g. "Before bud break · 6–10 AM" */
  when: string;
  /** Hindi timing instruction */
  whenHi: string;
  /** What disease/pest it targets, e.g. "Canker, Blossom Blight" */
  target: string;
  /** Available brands for this chemical */
  brands: Brand[] | null;
  /** Priority level - controls color and urgency */
  priority: Priority;
  /** Pre-Harvest Interval in days (null if not applicable) */
  phi: number | null;
  /** FontAwesome icon class, e.g. "fas fa-flask" */
  icon: string;
}

// ═══════════════════════════════════════════════════════════
// 4. DISEASE WATCH ITEM
// ═══════════════════════════════════════════════════════════

export type DiseaseType = 'fungal' | 'pest' | 'bacterial';
export type RiskLevel = 'high' | 'medium' | 'low';

/**
 * A disease or pest to watch for in the current stage.
 * Shown in the Do Now banner's "Watch For" section.
 */
export interface DiseaseWatchItem {
  name: string;
  nameHi: string;
  slug: string | null;
  type: DiseaseType;
  risk: RiskLevel;
  note: string;
  noteHi: string;
}

// ═══════════════════════════════════════════════════════════
// 5. SOIL NUTRITION ITEM
// ═══════════════════════════════════════════════════════════

export interface SoilNutritionItem {
  name: string;
  nameHi: string;
  dose: string;
  method: string;
  methodHi: string;
  timing: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════
// 6. WEATHER WARNING
// ═══════════════════════════════════════════════════════════

export type WarningType = 'frost' | 'hail' | 'heavy_rain' | 'strong_wind' | 'generic';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface WeatherWarning {
  type: WarningType;
  message: string;
  severity: SeverityLevel;
}

// ═══════════════════════════════════════════════════════════
// 7. PREVENTIVE ALERT
// ═══════════════════════════════════════════════════════════

export interface PreventiveAlert {
  /** FontAwesome icon class, e.g. "fas fa-biohazard" */
  icon: string;
  title: string;
  titleHi: string;
  desc: string;
  sev: SeverityLevel;
}

// ═══════════════════════════════════════════════════════════
// 8. OUTBREAK ALERT
// ═══════════════════════════════════════════════════════════

export interface OutbreakAlert {
  location: string;
  disease: string;
  diseaseHi: string;
  reports: number;
  when: string;
  sev: 'critical' | 'high' | 'medium';
  tip: string;
}

// ═══════════════════════════════════════════════════════════
// 9. VARIETY CARD
// ═══════════════════════════════════════════════════════════

export interface Variety {
  name: string;
  nameHi: string;
  altitude: string;
  votes: number;
  rating: number;
  /** Card accent color (hex string) */
  color: string;
  tag: string;
  season?: string;
}

// ═══════════════════════════════════════════════════════════
// 10. ROOTSTOCK CARD
// ═══════════════════════════════════════════════════════════

export interface Rootstock {
  name: string;
  nameHi: string;
  type: string;
  spacing: string;
  votes: number;
  rating: number;
  color: string;
  tag: string;
  vigour?: string;
}

// ═══════════════════════════════════════════════════════════
// 11. BLOG POST
// ═══════════════════════════════════════════════════════════

export interface BlogPost {
  title: string;
  titleHi: string;
  category: string;
  catColor: string;
  readMin: number;
  views: number;
  likes: number;
  author: string;
  date: string;
  excerpt?: string;
}

// ═══════════════════════════════════════════════════════════
// 12. CONTRIBUTOR
// ═══════════════════════════════════════════════════════════

export interface Contributor {
  name: string;
  nameHi: string;
  location: string;
  initials: string;
  color: string;
  points: number;
  badge: string;
  reports: number;
  reviews: number;
  photos: number;
}

// ═══════════════════════════════════════════════════════════
// 13. FORECAST DAY
// ═══════════════════════════════════════════════════════════

export type SpraySuitability = 'perfect' | 'caution' | 'avoid';

export interface ForecastDay {
  day: string;        // Hindi day name, e.g. "रवि"
  dayEn: string;      // English day name, e.g. "Sun"
  date: string;       // e.g. "Mar 9"
  icon: string;       // FontAwesome icon class
  iconColor: string;  // Hex color for the icon
  high: string;       // High temp
  low: string;        // Low temp
  wind: string;       // Wind speed km/h
  rain: string;       // Rain probability %
  suit: SpraySuitability;
  suitLabel: string;
  suitHi: string;
}

// ═══════════════════════════════════════════════════════════
// 14. NAVIGATION
// ═══════════════════════════════════════════════════════════

export interface NavItem {
  route: string;
  label: string;
  labelHi: string;
  title: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════
// 15. ORCHARD
// ═══════════════════════════════════════════════════════════

export interface Orchard {
  id: number;
  orchard_name: string;
  village: string;
  district: string;
  location: string;
}

// ═══════════════════════════════════════════════════════════
// 16. WEATHER HEADER DATA
// ═══════════════════════════════════════════════════════════

export interface HeaderWeather {
  location: string;
  temperature: string;
  weatherCondition: string;
  sprayStatus: string;
  daysToBloom: string;
  pendingSprays: string;
  mandiTrend: string;
}

// ═══════════════════════════════════════════════════════════
// 17. HOME SCREEN DATA (complete)
// ═══════════════════════════════════════════════════════════

/**
 * LEARN: This is a "composite" interface that groups all the
 * data needed for the Home screen. The API returns something
 * like this, and we pass it down to child components.
 */
export interface HomeScreenData {
  stage: GrowthStage;
  forecast: ForecastDay[];
  tasks: {
    spray: TaskItem[];
    nutrition: TaskItem[];
    cultural: TaskItem[];
  };
  diseaseWatch: DiseaseWatchItem[];
  soilNutrition: SoilNutritionItem[];
  weatherWarnings: WeatherWarning[];
  preventiveAlerts: PreventiveAlert[];
  outbreakAlerts: OutbreakAlert[];
  topVarieties: Variety[];
  topRootstocks: Rootstock[];
  topBlogs: BlogPost[];
  topContributors: Contributor[];
  location: string;
}

// ═══════════════════════════════════════════════════════════
// 18. PRIORITY META
// ═══════════════════════════════════════════════════════════

export interface PriorityMeta {
  label: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════
// 19. API RESPONSES
// ═══════════════════════════════════════════════════════════

/**
 * LEARN: Generic API response wrapper. The <T> is a "generic"
 * type parameter - it lets us reuse this interface for ANY
 * kind of data while keeping type safety.
 *
 * Usage: ApiResponse<TaskItem[]> means data is TaskItem[]
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  time: string;
  type_label: string;
  icon: string;
  icon_class: string;
  url: string;
  is_read: boolean;
}

export interface NotificationsResponse {
  count: number;
  notifications: NotificationItem[];
}

export interface UnreadCountResponse {
  count: number;
}
