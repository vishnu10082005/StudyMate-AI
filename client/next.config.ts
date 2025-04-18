/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["supabase.co", "localhost", "assets.aceternity.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
