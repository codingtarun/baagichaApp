/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TYPOGRAPHY MODULE
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: This is a "barrel export" file. Instead of importing
 * from many files like:
 *   import { Fonts } from './fonts';
 *   import { FontSizes } from './sizes';
 *   import Typography from './Typography';
 *
 * We can import everything from ONE file:
 *   import { Fonts, FontSizes, Typography } from '../typography';
 *
 * This is a very common pattern in professional React Native apps.
 * It makes imports cleaner and easier to maintain.
 */

// ── Tokens ──
// These are the raw building blocks: font names, sizes, weights
export { Fonts, FontFamilies, getFont } from './fonts';
export { FontSizes } from './sizes';
export { FontWeights } from './weights';
export { LineHeights } from './lineHeights';

// ── Style catalog ──
// TextStyles contains 100+ predefined style objects
export { TextStyles } from './styles';

// ── Components ──
// Reusable text components for the entire app
export { default as Typography } from './Typography';
export type { TextVariant } from './Typography';

// ── Convenience wrappers ──
// These are pre-configured components for common text patterns.
// They wrap Typography with sensible defaults so you don't have
// to remember variant names for every use case.
export { default as PrimaryHeading } from './PrimaryHeading';
export { default as HindiText } from './HindiText';
export { default as SectionHeader } from './SectionHeader';
export { default as CardTitle } from './CardTitle';
export { default as MetaText } from './MetaText';
export { default as BadgeText } from './BadgeText';
export { default as NavLabel } from './NavLabel';
export { default as StatText } from './StatText';
