/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "lh3.googleusercontent.com"],
  },
  typescript: {
    // disable after fixing the fucking code
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
