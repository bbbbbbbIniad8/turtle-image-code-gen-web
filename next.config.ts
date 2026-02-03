/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/turtle-image-code-gen-web',
  images: { unoptimized: true },
}

module.exports = nextConfig;

export default nextConfig;
