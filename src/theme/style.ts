/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GLOBAL STYLES
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: StyleSheet.create() is a React Native utility that
 * converts a JavaScript object of styles into an optimized
 * reference. It validates the styles at creation time and
 * gives better performance than plain objects because React
 * Native can send style references (numbers) across the bridge
 * instead of full objects.
 *
 * Always use StyleSheet.create() for component styles!
 */

import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Fonts } from '../typography/fonts';

export const globalStyle = StyleSheet.create({
  /**
   * Standard screen container.
   * LEARN: flex: 1 makes the view fill all available space.
   * This is the root container for every screen.
   */
  screen: {
    flex: 1,
    backgroundColor: Colors.gray50, // Light gray background for content screens
  },

  /**
   * Screen with centered content.
   * LEARN: alignItems: 'center' centers children horizontally.
   * justifyContent: 'center' centers children vertically.
   * Use this for login screens, empty states, loading screens.
   */
  centeredScreen: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Container for scrollable content.
   * LEARN: paddingHorizontal adds left AND right padding.
   * In the web design, content has 16px side padding.
   */
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Extra padding for bottom nav + safe area
  },

  /**
   * Row layout - horizontal flex.
   * LEARN: flexDirection: 'row' lays children horizontally.
   * This is used everywhere for header rows, card footers, etc.
   */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /**
   * Row with space-between justification.
   * LEARN: justifyContent: 'space-between' pushes first child
   * to the left and last child to the right, with equal spacing.
   */
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /**
   * Card container - white background with shadow.
   * LEARN: This matches the .card-modern class from the web CSS.
   */
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24, // radius-lg
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    // LEARN: iOS shadows use shadow* props
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    // LEARN: Android shadows use elevation (dp units)
    elevation: 2,
  },

  /**
   * Horizontal scroll track.
   * LEARN: This matches the .h-scroll-track class from the web.
   * We use it for horizontal scrolling card lists.
   */
  hScrollTrack: {
    flexDirection: 'row',
    gap: 10,
  },

  /**
   * Divider line.
   */
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 8,
  },

  /**
   * Safe area bottom spacing.
   * LEARN: On iPhones with home indicators, we need extra
   * bottom padding. This is handled by SafeAreaView, but
   * we also add some for the bottom nav bar (about 80px).
   */
  safeBottom: {
    height: 80,
  },

  // ═══════════════════════════════════════════════════════════
  // FILTER PILL STYLES (Global — used across all filter rows)
  // ═══════════════════════════════════════════════════════════

  /** Base filter pill — inactive state */
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

  /** Active filter pill — primary green bg + white text */
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  /** Filter pill text — inactive */
  filterPillText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    color: Colors.gray600,
  },

  /** Filter pill text — active (white) */
  filterPillTextActive: {
    color: Colors.white,
  },

  /** Filter pill Hindi text — inactive */
  filterPillTextHi: {
    fontFamily: Fonts.hindi,
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
    color: Colors.gray400,
  },

  /** Filter pill Hindi text — active (white, slightly transparent) */
  filterPillTextHiActive: {
    color: 'rgba(255,255,255,0.85)',
  },
});
