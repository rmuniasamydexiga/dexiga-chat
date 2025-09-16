const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const libsPackages = {};

// Path to local moblibs package
const libRoot = path.resolve(projectRoot, 'libs', 'moblibs');
if (fs.existsSync(libRoot)) {
  libsPackages['react-native-dex-moblibs'] = libRoot;
}

const defaultConfig = getDefaultConfig(projectRoot);

// 👀 Watch local libs so Metro picks up changes
defaultConfig.watchFolders = Object.values(libsPackages);

// ✅ Tell Metro how to resolve the local lib
defaultConfig.resolver.extraNodeModules = {
  ...libsPackages,
};

// 🚫 Don’t look up the folder tree
defaultConfig.resolver.disableHierarchicalLookup = true;

// ✅ Always resolve dependencies from main node_modules
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

module.exports = defaultConfig;
