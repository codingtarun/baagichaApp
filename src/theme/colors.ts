/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COLOR THEME
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: In React Native, we centralize all colors in one file.
 * This is called a "design token" approach. Instead of writing
 * '#3a7d44' everywhere, we use Colors.primary. If we ever need
 * to change the brand color, we change it in ONE place.
 *
 * These colors are extracted directly from the Laravel web app's
 * CSS custom properties (style.css :root).
 */

export const Colors = {
  // ── Brand Colors ──
  // These define the app's identity - the green and gold theme
  bgPrimary: '#1a2e1a', // Dark green - used for header backgrounds
  bgSecondary: '#2d4a2d', // Slightly lighter dark green
  primary: '#3a7d44', // Main green - buttons, active states, links
  primaryLight: '#52a85f', // Light green - gradients, hover states
  accent: '#e8b84b', // Gold/amber - highlights, badges, progress bars
  accentLight: '#f5d07a', // Light gold - soft backgrounds

  // ── Status Colors ──
  // Semantic colors for success, warnings, errors, and info
  success: '#22c55e', // Green checkmarks, good spray conditions
  warning: '#f59e0b', // Amber cautions, medium risk
  danger: '#ef4444', // Red errors, critical alerts, high risk
  info: '#3b82f6', // Blue info badges, links

  // ── Gray Scale ──
  // LEARN: Using a numbered gray scale (50-900) is a common design
  // pattern from Tailwind CSS. It gives us predictable light-to-dark
  // steps. 50 is nearly white, 900 is nearly black.
  gray50: '#f8fafc', // Page background - very light gray
  gray100: '#f1f5f9', // Card backgrounds, input fields
  gray200: '#e2e8f0', // Borders, dividers
  gray300: '#cbd5e1', // Disabled states, scrollbar thumbs
  gray400: '#94a3b8', // Secondary text, placeholders
  gray500: '#64748b', // Muted text, timestamps
  gray600: '#475569', // Body text on light backgrounds
  gray700: '#334155', // Headings, strong text
  gray800: '#1e293b', // Dark text, almost black
  gray900: '#0f172a', // Deepest dark - used for text on light bg

  // ── Base Colors ──
  white: '#ffffff',
  black: '#000000',

  // ── Priority Colors ──
  // LEARN: These are "derived" colors used for specific UI patterns.
  // They map to the priorityMeta object in the home screen data.
  priorityEssential: '#dc2626', // Red - must do tasks
  priorityRecommended: '#f59e0b', // Amber - should do tasks
  priorityConditional: '#60a5fa', // Blue - do if needed tasks

  // ── Severity Colors ──
  // Used for alert severity levels
  sevCritical: '#dc2626',
  sevHigh: '#f97316',
  sevMedium: '#f59e0b',
  sevLow: '#22c55e',
} as const;

// ── Color Helpers ──
// LEARN: TypeScript 'as const' makes this object readonly and
// gives us literal types. Colors.primary is the LITERAL string
// '#3a7d44', not just 'string'. This helps with autocomplete
// and catching typos at compile time.

/**
 * Helper to get a priority color from a priority string.
 * LEARN: Using a Record type ensures we handle all cases.
 *
 * @param priority - 'essential' | 'recommended' | 'conditional'
 * @returns The hex color string
 */
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

/**
 * Helper to get a severity color from a severity string.
 *
 * @param severity - 'critical' | 'high' | 'medium' | 'low'
 * @returns The hex color string
 */
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
