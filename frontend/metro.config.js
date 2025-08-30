// Canonical Expo Metro config to ensure correct plugin wiring under SDK 53
const { getDefaultConfig } = require("expo/metro-config");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
// No custom plugins or paths; rely on Expo's defaults to match Metro for SDK 53.
module.exports = config;