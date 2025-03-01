/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  devIndicators: process.env.NODE_ENV === 'development',
};

module.exports = nextConfig;
