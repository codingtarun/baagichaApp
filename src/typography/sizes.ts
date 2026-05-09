/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FONT SIZE SCALE
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: In React Native, font sizes are in "points" (pt) on iOS
 * and "sp" (scalable pixels) on Android. Both are roughly equal
 * to physical pixels at default settings. Unlike the web where we
 * use rem units, in RN we use raw numbers.
 *
 * The web design uses rem values (1rem = 16px). We've converted
 * them to approximate dp values for mobile.
 *
 * Why not just use random sizes everywhere?
 * - Consistency: Every "small" text is exactly 11pt
 * - Rhythm: Sizes follow a harmonious scale
 * - Maintainability: Change one number, update everywhere
 *
 * LEARN: A "type scale" is like a musical scale - each size has
 * a specific relationship to the others. This creates visual
 * harmony across the app.
 */

export const FontSizes = {
  // ── Display Sizes ──
  // Used for the biggest, most prominent text

  /** Hero greeting in header: "Namaste," (1.45rem ≈ 23pt) */
  hero: 23,

  // ── Heading Sizes ──
  // Used for section titles and sub-sections

  /** Section headings (display font): 1.25rem ≈ 20pt */
  h1: 20,

  /** Sub-section headings: 1.05rem ≈ 17pt */
  h2: 17,

  /** Card titles, prominent labels: 0.95rem ≈ 15pt */
  h3: 15,

  // ── Body Sizes ──
  // Used for readable text content

  /** Standard body text: 0.82–0.88rem ≈ 14pt */
  body: 14,

  /** Smaller body, card descriptions: 0.76–0.8rem ≈ 13pt */
  bodySmall: 13,

  // ── Meta Sizes ──
  // Used for timestamps, labels, secondary info

  /** Meta text, timestamps, captions: 0.72rem ≈ 12pt */
  caption: 12,

  /** Tiny labels, badges, pills: 0.6–0.68rem ≈ 11pt */
  small: 11,

  /** Micro text, overlines, nav Hindi: 0.5–0.55rem ≈ 9pt */
  micro: 9,

  // ── Special Numeric Sizes ──
  // One-off sizes for specific UI elements

  /** Temperature large value: 1.5rem ≈ 24pt */
  tempLarge: 24,

  /** Temperature compact mode: 1.15rem ≈ 18pt */
  tempCompact: 18,

  /** Stat pill value: 0.88rem ≈ 14pt */
  statValue: 14,

  /** Stat pill label: 0.62–0.65rem ≈ 10pt */
  statLabel: 10,

  /** Points value: 0.92rem ≈ 15pt */
  pointsValue: 15,

  /** Points label: 0.58rem ≈ 9pt */
  pointsLabel: 9,

  /** Rank number: 0.78rem ≈ 12pt */
  rank: 12,

  // ── Icon Sizes ──
  // FontAwesome icon sizes (used as fontSize on <Text> or <Icon>)

  /** Header action button icons: 1rem ≈ 16pt */
  headerIcon: 16,

  /** Weather icon: 1.6rem ≈ 26pt */
  weatherIcon: 26,

  /** Action grid icon: 1.5rem ≈ 24pt */
  actionIcon: 24,

  /** Bottom nav icon active: 1.6rem ≈ 26pt */
  navIconActive: 26,

  /** Bottom nav icon inactive: 1.4rem ≈ 22pt */
  navIconInactive: 22,

  // ── Navigation Labels ──

  /** Bottom nav label English: 0.55rem ≈ 9pt */
  navLabel: 9,

  /** Bottom nav label Hindi: 0.5rem ≈ 8pt */
  navLabelHi: 8,

  // ── UI Element Sizes ──

  /** Section link / "View All": 0.85rem ≈ 14pt */
  link: 14,

  /** Dropdown header title: ~0.9rem ≈ 14pt */
  dropdownHeader: 14,

  /** Dropdown item: ~0.82rem ≈ 13pt */
  dropdownItem: 13,

  /** Menu item: ~0.88rem ≈ 14pt */
  menuItem: 14,

  /** Toast message: ~0.85rem ≈ 14pt */
  toast: 14,

  /** Empty state text: ~0.85rem ≈ 14pt */
  emptyState: 14,

  /** Footer copyright: ~0.7rem ≈ 11pt */
  footer: 11,

  /** Button text: ~0.88rem ≈ 14pt */
  button: 14,

  // ── Hindi Text Sizes ──

  /** Hindi hero / stage name: 0.72rem ≈ 12pt */
  hindiHero: 12,

  /** Hindi body / card subtitle: 0.64–0.68rem ≈ 11pt */
  hindiBody: 11,

  /** Hindi micro / nav: 0.5–0.58rem ≈ 9pt */
  hindiMicro: 9,
} as const;

/**
 * LEARN: The scale above follows these principles:
 *
 * 1. Base unit is 14pt (body) - comfortable reading size
 * 2. Display sizes are 1.6–1.8× the base (23–24pt)
 * 3. Headings are 1.1–1.4× the base (15–20pt)
 * 4. Meta sizes are 0.65–0.85× the base (9–12pt)
 * 5. We keep sizes as even numbers where possible for
 *    cleaner pixel alignment on screens
 */
