/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'assets.coingecko.com',
      's2.coinmarketcap.com',
      'images.pexels.com',
      'ui-avatars.com',
      'coin-images.coingecko.com'
    ],
  },
};

module.exports = nextConfig;
