/**
 * React Native Configuration
 *
 * LEARN: This file tells React Native's CLI how to handle
 * native dependencies (autolinking) and assets like fonts.
 *
 * Without this config, font files from node_modules won't be
 * automatically copied to your Android/iOS projects.
 */

module.exports = {
  // Project configuration
  project: {
    ios: {},
    android: {},
  },

  // Asset configuration - tells the CLI where to find fonts
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
