import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Domain migration: the canonical host is `www.wksl.site`. Requests still
  // arriving on the old domains (or the bare apex) are permanently redirected
  // there, which complements the Vercel Dashboard domain redirect.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rosantoscs1997.com" }],
        destination: "https://www.wksl.site/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rosantoscs1997.com" }],
        destination: "https://www.wksl.site/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "wksl.site" }],
        destination: "https://www.wksl.site/:path*",
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
