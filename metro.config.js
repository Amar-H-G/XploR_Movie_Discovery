const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const fastImagePath = path.resolve(
  __dirname,
  'src/components/common/FastImage.js',
);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-fast-image') {
        return {
          filePath: fastImagePath,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
