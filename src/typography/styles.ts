/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TEXT STYLE CATALOG
 * ═══════════════════════════════════════════════════════════════
 *
 * Every text variant used across the app, mapped from the web
 * design (style.css + home.css + component blades).
 *
 * Usage:
 *   import { TextStyles } from '../typography';
 *   <Text style={TextStyles.displayHeading}>Title</Text>
 */

import { StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from './fonts';
import { FontSizes } from './sizes';
import { FontWeights } from './weights';
import { LineHeights } from './lineHeights';

export const TextStyles = StyleSheet.create({
  // ═══════════════════════════════════════════════════════════
  // 1. DISPLAY / HEADING STYLES (DM Serif Display)
  // ═══════════════════════════════════════════════════════════

  /** Hero greeting in header: "Namaste," */
  displayHero: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hero * LineHeights.tight,
    letterSpacing: -0.02 * FontSizes.hero,
    color: Colors.white,
  } as TextStyle,

  /** Section title: "Top Varieties", "Weekly Tasks" */
  displayHeading: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h1 * LineHeights.tight,
    letterSpacing: -0.02 * FontSizes.h1,
    color: Colors.gray900,
  } as TextStyle,

  /** Sub-heading / stage name in Do Now card */
  displaySubheading: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h2 * LineHeights.snug,
    color: Colors.white,
  } as TextStyle,

  /** Section title inside Do Now card: "Spray Now", "Watch For" */
  displaySectionTitle: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h3 * LineHeights.tight,
    letterSpacing: -0.01 * FontSizes.h3,
    color: Colors.gray900,
  } as TextStyle,

  /** Brand name in header / sidebar: "Baagicha" */
  displayBrand: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h2 * LineHeights.tight,
    color: Colors.white,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 2. HINDI DISPLAY STYLES (Yatra One / Noto Sans Devanagari)
  // ═══════════════════════════════════════════════════════════

  /** Hindi hero text: "सुप्तावस्था / हरी कली" */
  hindiDisplayHero: {
    fontFamily: Fonts.hindiDisplay,
    fontSize: FontSizes.hindiHero,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hindiHero * LineHeights.normal,
    color: 'rgba(255,255,255,0.42)',
  } as TextStyle,

  /** Hindi section subtitle: "निगरानी", "छिड़काव" */
  hindiDisplaySection: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiBody,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.hindiBody * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Hindi card name: "रॉयल डेलिशस" */
  hindiCardName: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiBody,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hindiBody * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Hindi nav label */
  hindiNavLabel: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiMicro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hindiMicro * LineHeights.tight,
    color: 'inherit',
    opacity: 0.85,
  } as TextStyle,

  /** Hindi micro text: forecast suit label */
  hindiMicro: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiMicro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hindiMicro * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Hindi body in alerts, tasks */
  hindiBody: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 3. BODY TEXT STYLES (DM Sans)
  // ═══════════════════════════════════════════════════════════

  /** Standard body text */
  body: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray700,
  } as TextStyle,

  /** Body text — dark (on light backgrounds) */
  bodyDark: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray800,
  } as TextStyle,

  /** Body text — light (on dark backgrounds) */
  bodyLight: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  /** Body text — muted */
  bodyMuted: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Small body — descriptions, excerpts */
  bodySmall: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.relaxed,
    color: Colors.gray600,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 4. LABEL / META STYLES
  // ═══════════════════════════════════════════════════════════

  /** Caption — timestamps, meta info */
  caption: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Caption — muted */
  captionMuted: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Small label — pills, badges, tags */
  label: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    letterSpacing: 0.04 * FontSizes.small,
    textTransform: 'uppercase',
    color: Colors.gray600,
  } as TextStyle,

  /** Micro label — overlines, tiny badges */
  overline: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.06 * FontSizes.micro,
    textTransform: 'uppercase',
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 5. CARD TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Card title — bold, prominent */
  cardTitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.body * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Card title — linkable (chemical names, etc) */
  cardTitleLink: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.body * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Card subtitle — smaller, lighter */
  cardSubtitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Card meta — author, date, views */
  cardMeta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Card footer — read time, votes */
  cardFooter: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 6. TASK TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Task name — bold */
  taskName: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.body * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Task meta — when, target */
  taskMeta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Dose pill text */
  dosePill: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: Colors.primary,
  } as TextStyle,

  /** PHI pill text */
  phiPill: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: '#b45309',
  } as TextStyle,

  /** Target pill text */
  targetPill: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: '#92400e',
  } as TextStyle,

  /** Brand chip text */
  brandChip: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    color: Colors.gray500,
  } as TextStyle,

  /** Priority pill — Essential/Recommended/If Needed */
  priorityPill: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    color: Colors.gray600,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 7. ALERT TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Alert title — bold */
  alertTitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.bodySmall * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Alert description */
  alertDesc: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.relaxed,
    color: Colors.gray600,
  } as TextStyle,

  /** Outbreak disease name */
  outbreakDisease: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.bodySmall * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Outbreak tip/action */
  outbreakTip: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Alert group label: "Preventive Alerts" */
  alertGroupLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    letterSpacing: 0.06 * FontSizes.small,
    textTransform: 'uppercase',
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 8. HEADER TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Greeting subtext: location */
  headerLocation: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: 'rgba(255,255,255,0.7)',
  } as TextStyle,

  /** Location chip text */
  chipText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  /** Weather temperature value */
  tempValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.tempLarge,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.tempLarge * LineHeights.tight,
    letterSpacing: -0.02 * FontSizes.tempLarge,
    color: Colors.white,
  } as TextStyle,

  /** Weather temperature compact */
  tempValueCompact: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.tempCompact,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.tempCompact * LineHeights.tight,
    letterSpacing: -0.02 * FontSizes.tempCompact,
    color: Colors.white,
  } as TextStyle,

  /** Weather description */
  weatherDesc: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: 'rgba(255,255,255,0.8)',
  } as TextStyle,

  /** Spray window badge: "Safe to spray" */
  sprayWindow: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: Colors.bgPrimary,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 9. STAT TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Stat pill value: "14", "3", "+5%" */
  statValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.statValue,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.statValue * LineHeights.tight,
    color: Colors.white,
  } as TextStyle,

  /** Stat pill label: "Days to bloom" */
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.statLabel,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.statLabel * LineHeights.tight,
    color: 'rgba(255,255,255,0.8)',
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 10. DO NOW CARD TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Do Now badge: "DO NOW" */
  doNowBadge: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.04 * FontSizes.micro,
    textTransform: 'uppercase',
    color: Colors.bgPrimary,
  } as TextStyle,

  /** Period text: "Mar 1 – Mar 20, 2026" */
  periodText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: 'rgba(255,255,255,0.4)',
  } as TextStyle,

  /** Progress percentage */
  progressPct: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: Colors.accent,
  } as TextStyle,

  /** Progress meta: "12d left", "Next: Tight Cluster" */
  progressMeta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: 'rgba(255,255,255,0.35)',
  } as TextStyle,

  /** Suitability badge: "Good for Spray" */
  suitBadge: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
  } as TextStyle,

  /** Suitability Hindi: "उचित" */
  suitBadgeHi: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: 'rgba(255,255,255,0.7)',
  } as TextStyle,

  /** Warning row text */
  warningText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 11. FORECAST TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Forecast day Hindi: "रवि" */
  forecastDayHi: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.caption * LineHeights.tight,
    color: Colors.gray600,
  } as TextStyle,

  /** Forecast day English: "Sun" */
  forecastDayEn: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.tight,
    color: Colors.gray400,
  } as TextStyle,

  /** Forecast date: "Mar 9" */
  forecastDate: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.tight,
    color: Colors.gray400,
  } as TextStyle,

  /** Forecast high temp */
  forecastHigh: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.bodySmall * LineHeights.tight,
    color: Colors.gray900,
  } as TextStyle,

  /** Forecast low temp */
  forecastLow: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.tight,
    color: Colors.gray400,
  } as TextStyle,

  /** Forecast meta: wind, rain */
  forecastMeta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.tight,
    color: Colors.gray400,
  } as TextStyle,

  /** Forecast suit badge */
  forecastSuit: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 12. VARIETY / ROOTSTOCK / BLOG CARD TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Rank badge: "#1" */
  rankBadge: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.rank,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.rank * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.rank,
    color: Colors.gray300,
  } as TextStyle,

  /** Rank gold: "#1" */
  rankGold: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.rank,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.rank * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.rank,
    color: '#d97706',
  } as TextStyle,

  /** Rank silver: "#2" */
  rankSilver: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.rank,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.rank * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.rank,
    color: '#9ca3af',
  } as TextStyle,

  /** Rank bronze: "#3" */
  rankBronze: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.rank,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.rank * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.rank,
    color: '#b45309',
  } as TextStyle,

  /** Tag text: "#1 Most Grown", "Best for HP" */
  tagText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.micro,
    textTransform: 'uppercase',
  } as TextStyle,

  /** Altitude text: "6000–9000ft" */
  altitudeText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Rating text: "4.7" */
  ratingText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray600,
  } as TextStyle,

  /** Votes/views count */
  countText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Blog category tag: "Spray", "Disease" */
  categoryTag: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.04 * FontSizes.micro,
    textTransform: 'uppercase',
  } as TextStyle,

  /** Blog excerpt */
  excerpt: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.relaxed,
    color: Colors.gray600,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 13. CONTRIBUTOR TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Contributor name */
  contributorName: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.bodySmall * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Contributor badge: "Top Contributor" */
  contributorBadge: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.03 * FontSizes.micro,
  } as TextStyle,

  /** Contributor location */
  contributorLocation: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Contributor stats: "34 reports" */
  contributorStats: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Points value */
  pointsValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.pointsValue,
    fontWeight: FontWeights.extrabold,
    lineHeight: FontSizes.pointsValue * LineHeights.tight,
    color: Colors.primary,
  } as TextStyle,

  /** Points label: "pts" */
  pointsLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.pointsLabel,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.pointsLabel * LineHeights.tight,
    letterSpacing: 0.06 * FontSizes.pointsLabel,
    textTransform: 'uppercase',
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 14. NAVIGATION TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Bottom nav label (English) */
  navLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.navLabel,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.navLabel * LineHeights.tight,
    color: Colors.gray400,
  } as TextStyle,

  /** Bottom nav label (Hindi) */
  navLabelHi: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.navLabelHi,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.navLabelHi * LineHeights.tight,
    color: 'inherit',
    opacity: 0.85,
  } as TextStyle,

  /** Nav label active */
  navLabelActive: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.navLabel,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.navLabel * LineHeights.tight,
    color: Colors.primary,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 15. SECTION HEADER TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Section header title with icon */
  sectionTitle: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h1 * LineHeights.tight,
    letterSpacing: -0.02 * FontSizes.h1,
    color: Colors.gray900,
  } as TextStyle,

  /** Section header subtitle (Hindi) */
  sectionSubtitle: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiBody,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.hindiBody * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Section "View All" link */
  sectionLink: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.link,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.link * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Scroll hint: "Swipe to explore · स्वाइप करें" */
  scrollHint: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 16. BUTTON & LINK TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Primary button text */
  button: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.button * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  /** Secondary / ghost button */
  buttonSecondary: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.button * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Text link */
  link: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.link,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.link * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Learn more / Know more button */
  learnMore: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Coming soon tag */
  comingSoon: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.micro * LineHeights.tight,
    letterSpacing: 0.02 * FontSizes.micro,
    textTransform: 'uppercase',
    color: Colors.gray400,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 17. DROPDOWN & MENU TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Dropdown header title: "Notifications" */
  dropdownHeader: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.dropdownHeader,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.dropdownHeader * LineHeights.normal,
    color: Colors.gray900,
  } as TextStyle,

  /** Dropdown item text */
  dropdownItem: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.dropdownItem,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.dropdownItem * LineHeights.normal,
    color: Colors.gray800,
  } as TextStyle,

  /** Dropdown item meta */
  dropdownItemMeta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Profile menu item */
  menuItem: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.menuItem,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.menuItem * LineHeights.normal,
    color: Colors.gray800,
  } as TextStyle,

  /** Menu item subtext */
  menuItemSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 18. INSIGHT & INFO TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Insight strip text */
  insightText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.gray700,
  } as TextStyle,

  /** Insight chip */
  insightChip: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: Colors.primary,
  } as TextStyle,

  /** Knowledge card title */
  knowledgeTitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h3 * LineHeights.snug,
    color: Colors.gray900,
  } as TextStyle,

  /** Knowledge card body */
  knowledgeBody: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.relaxed,
    color: Colors.gray600,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 19. TOAST & NOTIFICATION TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Toast message text */
  toast: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.toast,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.toast * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  /** Toast error */
  toastError: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.toast,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.toast * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 20. EMPTY STATE & FOOTER TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Empty state text */
  emptyState: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.emptyState,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.emptyState * LineHeights.relaxed,
    color: Colors.gray500,
    textAlign: 'center',
  } as TextStyle,

  /** Footer copyright */
  footer: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.footer,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.footer * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Footer author link */
  footerLink: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.footer,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.footer * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 21. FORM & INPUT TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Input label */
  inputLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray700,
  } as TextStyle,

  /** Input text */
  input: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray900,
  } as TextStyle,

  /** Input placeholder */
  inputPlaceholder: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Error text */
  errorText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.danger,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 22. TAB & FILTER TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Task tab / filter pill */
  tab: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Tab active */
  tabActive: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.primary,
  } as TextStyle,

  /** Tab Hindi label */
  tabHi: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.micro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.micro * LineHeights.normal,
    color: 'inherit',
    opacity: 0.75,
  } as TextStyle,

  /** Blog topic pill */
  topicPill: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.gray600,
  } as TextStyle,

  /** Topic pill active */
  topicPillActive: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 23. DETAIL PAGE TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Detail tab label */
  detailTab: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Detail tab active */
  detailTabActive: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: Colors.white,
  } as TextStyle,

  /** Page title in inner header */
  pageTitle: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h2 * LineHeights.tight,
    color: Colors.white,
  } as TextStyle,

  /** Page subtitle */
  pageSubtitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: 'rgba(255,255,255,0.7)',
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 24. MARKET / RATE TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Rate name */
  rateName: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray700,
  } as TextStyle,

  /** Rate value */
  rateValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray900,
  } as TextStyle,

  /** Trend indicator */
  trendUp: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.success,
  } as TextStyle,

  trendDown: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.danger,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 25. PROFILE & SETTINGS TEXT STYLES
  // ═══════════════════════════════════════════════════════════

  /** Profile name */
  profileName: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h3 * LineHeights.normal,
    color: Colors.gray900,
  } as TextStyle,

  /** Profile tag / badge */
  profileTag: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray700,
  } as TextStyle,

  /** Setting row label */
  settingLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: Colors.gray800,
  } as TextStyle,

  /** Setting description */
  settingDesc: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  // ═══════════════════════════════════════════════════════════
  // 21. UTILITY TEXT STYLES (used across multiple screens)
  // ═══════════════════════════════════════════════════════════

  /** Small badge text inside pills, tags, and filter buttons */
  badgeText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.small * LineHeights.tight,
    color: Colors.gray600,
  } as TextStyle,

  /** Meta text for small info labels, altitudes, counts */
  metaText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.small * LineHeights.normal,
    color: Colors.gray500,
  } as TextStyle,

  /** Hindi meta text for card subtitles */
  hindiMeta: {
    fontFamily: Fonts.hindi,
    fontSize: FontSizes.hindiMicro,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.hindiMicro * LineHeights.normal,
    color: Colors.gray400,
  } as TextStyle,

  /** Section header for detail page tabs */
  sectionHeader: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.h3 * LineHeights.tight,
    color: Colors.gray800,
  } as TextStyle,
});
