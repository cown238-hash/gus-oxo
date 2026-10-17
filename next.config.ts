import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Domain migration: any request still arriving on the old (or www) hosts is
  // permanently redirected to the new canonical origin. This complements the
  // Vercel Dashboard domain redirect, so the old domain keeps working for as
  // long as its DNS points at this deployment.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rosantoscs1997.com" }],
        destination: "https://wksl.site/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rosantoscs1997.com" }],
        destination: "https://wksl.site/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.wksl.site" }],
        destination: "https://wksl.site/:path*",
        permanent: true,
      },
    ];
  },
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
