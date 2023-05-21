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

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: "./",
  experimental: {
    appDir: true,
  },
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
});

const nextDevConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // 将接口请求代理到本地地址
      },
    ];
  },
});
module.exports =
  process.env.NODE_ENV === "development" ? nextDevConfig : nextConfig;
