const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (
        moduleName === '@react-native-vector-icons/material-design-icons' ||
        moduleName === '@expo/vector-icons/MaterialCommunityIcons'
      ) {
        return context.resolveRequest(
          context,
          'react-native-vector-icons/MaterialCommunityIcons',
          platform
        );
      }
      if (moduleName === 'react-native/asset-registry') {
        return context.resolveRequest(
          context,
          'react-native/Libraries/Image/AssetRegistry',
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
