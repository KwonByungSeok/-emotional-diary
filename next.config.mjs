/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://main-practice.codebootcamp.co.kr/graphql',
      },
    ];
  },
};

export default nextConfig;
