const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow .wasm files to be resolved by Metro
config.resolver.assetExts = config.resolver.assetExts ?? [];
config.resolver.sourceExts = config.resolver.sourceExts ?? [];

// Add wasm to asset extensions so Metro bundles it
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

module.exports = config;
