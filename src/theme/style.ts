/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GLOBAL STYLES (Modernized)
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: StyleSheet.create() converts JS style objects into
 * optimized references for better bridge performance.
 *
 * UPDATED: Added 8px spacing grid, 3-level shadow system,
 * and modern card variants.
 */

import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Fonts } from '../typography/fonts';

// ═══════════════════════════════════════════════════════════════
// SPACING TOKENS (8px Grid)
// ═══════════════════════════════════════════════════════════════
// LEARN: Using a consistent 8px grid creates visual rhythm.
// All margins, paddings, and gaps should use these values.

const Space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
} as const;

// ═══════════════════════════════════════════════════════════════
// RADIUS TOKENS
// ═══════════════════════════════════════════════════════════════

const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

// ═══════════════════════════════════════════════════════════════
// SHADOW TOKENS (3 levels only — no more random values)
// ═══════════════════════════════════════════════════════════════
// LEARN: Consistent shadows create depth hierarchy.
//   subtle  = seated elements (inputs, small chips)
//   medium  = cards, lists (primary content containers)
//   strong  = floating elements (FABs, modals, toasts)

const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// MAIN STYLES
// ═══════════════════════════════════════════════════════════════

export const globalStyle = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredScreen: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Space[4],
    paddingTop: Space[4],
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Modern Cards ──
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Space[4],
    ...Shadows.medium,
  },
  cardFlat: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Space[4],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardSubtle: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    padding: Space[4],
  },

  // ── Horizontal Scroll Track ──
  hScrollTrack: {
    flexDirection: 'row',
    gap: Space[3],
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Space[3],
  },

  // ── Safe Bottom ──
  safeBottom: {
    height: 80,
  },

  // ── Filter Pills (Legacy) ──
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    color: Colors.gray600,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  filterPillTextHi: {
    fontFamily: Fonts.hindi,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
    color: Colors.gray400,
  },
  filterPillTextHiActive: {
    color: 'rgba(255,255,255,0.85)',
  },

  // ── Input (Modern) ──
  input: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: Space[4],
    paddingVertical: Space[3],
    fontSize: 15,
    color: Colors.gray800,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: Colors.primary300,
    backgroundColor: Colors.white,
  },
});

// ═══════════════════════════════════════════════════════════════
// EXPORT TOKENS FOR INLINE USE
// ═══════════════════════════════════════════════════════════════

export { Shadows, Radius, Space };
