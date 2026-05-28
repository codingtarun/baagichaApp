/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COLOR THEME (Option A: Fresh Mint + Harvest Gold)
 * ═══════════════════════════════════════════════════════════════
 *
 * Modern light-green palette optimized for outdoor readability.
 *   • Primary: Fresh mint green — growth, nature, trust
 *   • Accent: Warm harvest gold — Himachali apples, sun, energy
 *   • Background: Light mint tint — easy on eyes in sunlight
 *   • Surfaces: Clean white with subtle warmth
 */

// ═══════════════════════════════════════════════════════════════
// 1. CORE PALETTE
// ═══════════════════════════════════════════════════════════════

const Core = {
  // Primary — Fresh mint green (modern, airy, outdoor-readable)
  primary50:  '#ecfdf3',
  primary100: '#d1fae1',
  primary200: '#a7f3c9',
  primary300: '#6ee7a3',
  primary400: '#34d376',
  primary500: '#2D9E4F', // Main brand color
  primary600: '#1B7A3A',
  primary700: '#166534',
  primary800: '#14522d',
  primary900: '#052e16',

  // Accent — Harvest gold (warmth, prosperity, Himachali harvest)
  accent50:  '#fffbeb',
  accent100: '#fef3c7',
  accent200: '#fde68a',
  accent300: '#fcd34d',
  accent400: '#fbbf24',
  accent500: '#F5A623', // Main accent
  accent600: '#d97706',
  accent700: '#b45309',
  accent800: '#92400e',
  accent900: '#78350f',

  // Neutral — Sage slate (softer than pure gray, matches green theme)
  slate50:  '#F7FAF5',
  slate100: '#eef4ea',
  slate200: '#dce8d5',
  slate300: '#b8d0ab',
  slate400: '#8eb37e',
  slate500: '#6a9560',
  slate600: '#4a7345',
  slate700: '#365a33',
  slate800: '#244022',
  slate900: '#132612',
} as const;

// ═══════════════════════════════════════════════════════════════
// 2. SEMANTIC COLORS
// ═══════════════════════════════════════════════════════════════

const Semantic = {
  success: '#22c55e',
  successLight: '#dcfce7',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  info: '#0ea5e9',
  infoLight: '#e0f2fe',
} as const;

// ═══════════════════════════════════════════════════════════════
// 3. SURFACE COLORS
// ═══════════════════════════════════════════════════════════════

const Surface = {
  background: Core.slate50,
  surface: '#ffffff',
  surfaceSubtle: Core.slate100,
  surfaceElevated: '#ffffff',
  surfaceOverlay: 'rgba(19, 38, 18, 0.45)',
} as const;

// ═══════════════════════════════════════════════════════════════
// 4. EXPORTED COLORS
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  // ── Brand Aliases (Legacy Support) ──
  bgPrimary: Core.primary800,
  bgSecondary: Core.primary700,
  primary: Core.primary500,
  primaryLight: Core.primary400,
  accent: Core.accent500,
  accentLight: Core.accent400,

  // ── Status Aliases (Legacy Support) ──
  success: Semantic.success,
  warning: Semantic.warning,
  danger: Semantic.danger,
  info: Semantic.info,

  // ── Gray Scale Aliases (Legacy Support) ──
  // Mapped to sage slate for thematic consistency
  gray50:  Core.slate50,
  gray100: Core.slate100,
  gray200: Core.slate200,
  gray300: Core.slate300,
  gray400: Core.slate400,
  gray500: Core.slate500,
  gray600: Core.slate600,
  gray700: Core.slate700,
  gray800: Core.slate800,
  gray900: Core.slate900,

  // ── Base ──
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // ── Surface (New) ──
  background: Surface.background,
  surface: Surface.surface,
  surfaceSubtle: Surface.surfaceSubtle,
  surfaceElevated: Surface.surfaceElevated,
  surfaceOverlay: Surface.surfaceOverlay,

  // ── Primary Scale ──
  primary50: Core.primary50,
  primary100: Core.primary100,
  primary200: Core.primary200,
  primary300: Core.primary300,
  primary400: Core.primary400,
  primary500: Core.primary500,
  primary600: Core.primary600,
  primary700: Core.primary700,
  primary800: Core.primary800,
  primary900: Core.primary900,

  // ── Accent Scale ──
  accent50: Core.accent50,
  accent100: Core.accent100,
  accent200: Core.accent200,
  accent300: Core.accent300,
  accent400: Core.accent400,
  accent500: Core.accent500,
  accent600: Core.accent600,
  accent700: Core.accent700,
  accent800: Core.accent800,
  accent900: Core.accent900,

  // ── Semantic Scale ──
  successLight: Semantic.successLight,
  warningLight: Semantic.warningLight,
  dangerLight: Semantic.dangerLight,
  infoLight: Semantic.infoLight,

  // ── Priority / Severity (Legacy) ──
  priorityEssential: Semantic.danger,
  priorityRecommended: Semantic.warning,
  priorityConditional: Semantic.info,
  sevCritical: Semantic.danger,
  sevHigh: '#f97316',
  sevMedium: Semantic.warning,
  sevLow: Semantic.success,
} as const;

// ═══════════════════════════════════════════════════════════════
// 5. COLOR HELPERS
// ═══════════════════════════════════════════════════════════════

export const getPriorityColor = (
  priority: 'essential' | 'recommended' | 'conditional',
): string => {
  const map: Record<string, string> = {
    essential: Colors.priorityEssential,
    recommended: Colors.priorityRecommended,
    conditional: Colors.priorityConditional,
  };
  return map[priority] ?? Colors.gray400;
};

export const getSeverityColor = (
  severity: 'critical' | 'high' | 'medium' | 'low',
): string => {
  const map: Record<string, string> = {
    critical: Colors.sevCritical,
    high: Colors.sevHigh,
    medium: Colors.sevMedium,
    low: Colors.sevLow,
  };
  return map[severity] ?? Colors.gray400;
};

export const getPriorityPair = (
  priority: 'critical' | 'high' | 'medium' | 'low',
): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    critical: { bg: Colors.dangerLight, text: Colors.danger },
    high:     { bg: Colors.warningLight, text: '#b45309' },
    medium:   { bg: '#fef9c3', text: '#a16207' },
    low:      { bg: Colors.infoLight, text: Colors.info },
  };
  return map[priority] ?? { bg: Colors.gray100, text: Colors.gray500 };
};
