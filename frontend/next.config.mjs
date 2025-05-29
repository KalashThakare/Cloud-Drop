/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "", // Optional, leave empty for default ports
        pathname: "/**", // Matches all paths
      },
    ],
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
