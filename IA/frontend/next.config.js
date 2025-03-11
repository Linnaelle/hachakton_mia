/** @type {import('next').NextConfig} */
const nextConfig = {
    // Images provenant du backend sont autorisées
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
      ],
      // Permettre les images data URL
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
  }
  
  module.exports = nextConfig