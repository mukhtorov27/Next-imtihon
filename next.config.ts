/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "m.media-amazon.com",
      "hyperlitemountaingear.com", // qo'shing: error dagi hostname
      // boshqa hostlar kerak bo'lsa shu yerga qo'shing
    ],
    // yoki kengroq sozlama:
    // remotePatterns: [{ protocol: 'https', hostname: '**', pathname: '/**' }],
  },
};

export default nextConfig;
