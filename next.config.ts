// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
  
// };

// export default nextConfig;

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/webhook/:path*',
        destination: 'http://localhost:5678/workflow/EAGM3qmQnYgINC4U', // Replace with your n8n instance URL
      },
    ]
  },
}