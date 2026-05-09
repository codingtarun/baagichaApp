/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FONT FAMILIES
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: React Native uses the device's built-in fonts by default.
 * To use custom fonts (like DM Serif Display), you need to:
 *
 *   1. Download the font files (.ttf or .otf)
 *   2. Place them in android/app/src/main/assets/fonts/ (Android)
 *   3. Add them to the Xcode project (iOS)
 *   4. OR use react-native-vector-icons with custom font support
 *   5. OR use expo-font (if using Expo)
 *
 * For now, we define the font names here. The actual font loading
 * will be done later when we set up the project build.
 *
 * Web originals:
 *   · Display:    DM Serif Display  →  Georgia (iOS) / serif (Android)
 *   · Body:       DM Sans           →  -apple-system / Roboto
 *   · Hindi:      Noto Sans Devanagari / Yatra One
 *
 * LEARN: The 'as const' assertion makes TypeScript treat these
 * as literal string types rather than just 'string'. This means
 * autocomplete will suggest these exact values.
 */

export const FontFamilies = {
  /** Serif display font for headings, hero text, section titles.
   * LEARN: This is a Google Font. On the web it's loaded via
   * Google Fonts CDN. In React Native, we need to bundle it. */
  display: 'DM Serif Display',

  /** iOS fallback for display font if DM Serif Display is not loaded */
  displayFallback: 'Georgia',

  /** Sans-serif body font for all regular text */
  body: 'DM Sans',

  /** iOS system font fallback */
  bodyFallbackIOS: '-apple-system',

  /** Android system font fallback */
  bodyFallbackAndroid: 'Roboto',

  /** Hindi/Devanagari font for Hindi text */
  hindi: 'Noto Sans Devanagari',

  /** Hindi display font for decorative Hindi headings */
  hindiDisplay: 'Yatra One',

  /** Generic fallback for Hindi text */
  hindiFallback: 'sans-serif',
} as const;

/** Resolved font family strings for direct use in styles.
 * LEARN: These are the font names you'll actually reference
 * in your StyleSheet.create() calls. */
export const Fonts = {
  display: FontFamilies.display,
  body: FontFamilies.body,
  hindi: FontFamilies.hindi,
  hindiDisplay: FontFamilies.hindiDisplay,
} as const;

/**
 * Platform-aware font resolver.
 * LEARN: This function lets you get the right font name
 * dynamically. The 'worklet' directive tells React Native
 * that this function can run on the UI thread (important
 * for Reanimated animations).
 */
export const getFont = (type: 'display' | 'body' | 'hindi' | 'hindiDisplay'): string => {
  'worklet';
  switch (type) {
    case 'display':
      return FontFamilies.display;
    case 'body':
      return FontFamilies.body;
    case 'hindi':
      return FontFamilies.hindi;
    case 'hindiDisplay':
      return FontFamilies.hindiDisplay;
    default:
      return FontFamilies.body;
  }
};
