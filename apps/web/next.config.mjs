/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@champagne/cta",
    "@champagne/hero",
    "@champagne/sections",
    "@champagne/manifests",
    "@champagne/tokens",
  ],
  webpack: (config) => {
    config.resolve.alias ||= {};
    config.resolve.alias[
      "next/dist/server/route-modules/app-page/vendored/contexts/loadable"
    ] = "next/dist/server/route-modules/pages/vendored/contexts/loadable";
    return config;
  },
};

export default nextConfig;
