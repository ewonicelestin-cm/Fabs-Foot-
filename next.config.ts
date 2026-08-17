import type { NextConfig } from 'next';  
  
const nextConfig: NextConfig = {  
  serverExternalPackages: ['ws', 'ioredis'],  
  experimental: {  
    serverComponentsExternalPackages: ['ioredis', 'ws'],  
  },  
  eslint: {  
    ignoreDuringBuilds: false,  
  },  
};  
  
export default nextConfig;
