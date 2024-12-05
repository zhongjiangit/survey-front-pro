/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://8.137.101.138:19080/:path*',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // 忽略 eslint 检查
  },
};

export default nextConfig;
