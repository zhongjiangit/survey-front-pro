/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://8.137.101.138:19080/:path*'
      }
    ];
  },
};

export default nextConfig;
