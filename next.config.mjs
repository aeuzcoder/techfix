/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint errors are shown in development. Build is not blocked by them.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
