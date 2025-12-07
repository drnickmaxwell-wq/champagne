/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        // TODO: Replace this stub with a real, strict CSP once routes are defined.
        value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' data: https:;"
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload"
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN"
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff"
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin"
      }
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;