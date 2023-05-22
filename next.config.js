/** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
// }
//
// module.exports = nextConfig

const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
});
/* 只需要前端静态代码，用这个 */
const nextElectronConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: "./",
  experimental: {
    appDir: true,
  },
  output: "export",
  distDir: "electron/web",
  images: {
    unoptimized: true,
  },
});

const nextConfig = withPWA({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
});
module.exports = nextConfig;
// module.exports =
//   process.env.NODE_ENV === "development" ? nextDevConfig : nextConfig;
