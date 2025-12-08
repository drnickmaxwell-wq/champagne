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
};

export default nextConfig;
