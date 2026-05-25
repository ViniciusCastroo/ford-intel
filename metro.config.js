const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Habilita resolução de package.exports (necessário para zustand v5 e outros pacotes ESM modernos)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
