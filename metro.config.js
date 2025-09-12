const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Resolver extensiones de archivos para RxJS
config.resolver.sourceExts.push('cjs');

// Resolver alias para RxJS (fix para el error de Observable)
config.resolver.alias = {
  ...config.resolver.alias,
  'rxjs/operators': 'rxjs/dist/cjs/operators',
  'rxjs': 'rxjs/dist/cjs/index.js'
};

// Aplicar NativeWind al final
module.exports = withNativeWind(config, { input: "./src/global.css" });