/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['neo.org'],
  },
};

module.exports = nextTranslate(nextConfig);
