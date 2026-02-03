const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  basePath: process.env.NODE_ENV === 'production' ? '/turtle-image-code-gen-web' : '',
};

export default nextConfig;