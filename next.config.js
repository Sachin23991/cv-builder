/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Canvas is not needed on server side for pdfjs
      config.externals = [...(config.externals || []), /^canvas$/];
    }
    return config;
  },
};

module.exports = nextConfig;
