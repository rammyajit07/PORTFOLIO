import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  headers: async () => [
    {
      // Disable bfcache on all pages — forces a fresh load instead of
      // restoring a frozen GSAP/Lenis state that causes black screens
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
  ],
};

export default nextConfig;
