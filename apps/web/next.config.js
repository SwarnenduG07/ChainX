const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  webpack: (config) => {
    // Add CaseSensitivePathsPlugin to the Webpack plugins
    config.plugins.push(new CaseSensitivePathsPlugin());
    
    return config;
  },
};
