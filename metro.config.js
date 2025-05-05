const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable the new architecture
config.resolver.unstable_enableNewArchitecture = true;
config.resolver.unstable_enablePackageExports = true;

// Add any additional configuration needed for the new architecture
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(config, { input: './global.css' });
