/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GLOBAL STYLES (LeafSnap Style)
 * ═══════════════════════════════════════════════════════════════
 *
 * Warm cream background, large rounded cards (24px),
 * subtle shadows, clean pill buttons.
 */

import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Fonts } from '../typography/fonts';

// ═══════════════════════════════════════════════════════════════
// SPACING TOKENS (8px Grid)
// ═══════════════════════════════════════════════════════════════

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
  '3xl': 28,
  full: 999,
} as const;

// ═══════════════════════════════════════════════════════════════
// SHADOW TOKENS
// ═══════════════════════════════════════════════════════════════

const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
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

  // ── Modern Cards (LeafSnap style: white, 24px radius, subtle shadow) ──
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  cardFlat: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardSubtle: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius['2xl'],
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

  // ── Filter Pills (LeafSnap style) ──
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    ...Shadows.subtle,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterPillText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: Colors.gray700,
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
    borderRadius: Radius.lg,
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

  // ── Primary Button (LeafSnap: full pill, solid green) ──
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: Space[6],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  buttonText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },

  // ── Secondary Button (outlined) ──
  buttonSecondary: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: Space[6],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  buttonSecondaryText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});

// ═══════════════════════════════════════════════════════════════
// EXPORT TOKENS FOR INLINE USE
// ═══════════════════════════════════════════════════════════════

export { Shadows, Radius, Space };
