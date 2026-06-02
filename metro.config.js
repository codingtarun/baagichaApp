const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Exclude heavy generated directories from file watching
  // to avoid ENOSPC "System limit for number of file watchers reached" errors
  watchFolders: [],
  resolver: {
    blockList: [
      // Android generated build files
      /android\/\.gradle\/.*/,
      /android\/app\/build\/.*/,
      /android\/app\/\.cxx\/.*/,
      /android\/build\/.*/,
      // iOS generated files
      /ios\/Pods\/.*/,
      /ios\/build\/.*/,
      // Misc
      /node_modules\/.*\/node_modules\/.*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
