import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Share-page thumbnails load from our Vercel Blob store: one store-id
    // subdomain, https only, any path inside the store.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
    // SVG counts as an image category, so allow it through the optimizer —
    // the sandboxed CSP keeps embedded scripts from ever running.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
