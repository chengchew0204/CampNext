import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'camp.mx',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
