const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Excluir reflect-metadata en web
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
];

// Optimizar módulos para web
if (process.env.RN_SRC_EXT) {
  config.resolver.sourceExts = [
    process.env.RN_SRC_EXT,
    ...config.resolver.sourceExts,
  ];
}

module.exports = withNativeWind(config, { input: './global.css' });
