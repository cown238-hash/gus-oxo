import type { Metadata } from "next";

/** Canonical origin for the migrated domain. */
export const SITE_URL = "https://www.wksl.site";
export const SITE_NAME = "GSO";
export const SITE_DESCRIPTION =
  "Drop a file or paste a link, get one shareable URL in seconds — or browse what others shared on the Explore page. Fast, no account required.";

/** The generated `app/opengraph-image.tsx` route, referenced explicitly so
 *  pages that define their own `openGraph` keep a social preview image. */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "GSO — Upload & share files and links",
};

/**
 * Shared page metadata: a self-referencing canonical URL plus matching
 * Open Graph and Twitter cards. `path` is root-relative (e.g. "/about") and
 * resolves to an absolute URL through `metadataBase` in the root layout.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
