const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Configuración mínima necesaria
config.resolver.sourceExts.push('cjs');

module.exports = withNativeWind(config, { input: "./src/global.css" });