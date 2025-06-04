/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to use our custom directory structure
  experimental: {
    appDir: true,
  },
  // Update the source directory to frontend
  distDir: '.next',
  // Configure webpack to resolve our custom paths
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@frontend': './frontend',
      '@backend': './backend',
      '@shared': './shared',
      '@config': './config',
    };
    return config;
  },
};

export default nextConfig;
