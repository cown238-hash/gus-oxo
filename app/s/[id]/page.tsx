import { get } from "@vercel/blob";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SHARE_ID_PATTERN, isShare, type Share } from "@/app/lib/share";
import ShareContent, { Unconfigured } from "./share-content";

/** Wrapped in `cache` so the page and its `generateMetadata` share one read. */
const loadShare = cache(async (id: string): Promise<Share | null> => {
  const result = await get(`shares/${id}.json`, { access: "public" });
  if (!result) return null;

  const text = await new Response(result.stream).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return isShare(parsed) ? parsed : null;
});

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await props.params;
  if (!SHARE_ID_PATTERN.test(id) || !process.env.BLOB_READ_WRITE_TOKEN) {
    return { title: "Not found — GSO", robots: { index: false, follow: false } };
  }

  const share = await loadShare(id);
  if (!share) {
    return { title: "Not found — GSO", robots: { index: false, follow: false } };
  }

  // Shares hidden from the Explore listing are link-only: keep them out of
  // search engines but let crawlers follow their outbound links.
  const listed = share.listed !== false;
  const title = share.title ? `${share.title} — GSO` : "Shared files — GSO";

  return {
    title,
    description: "Files and links shared with GSO.",
    alternates: { canonical: `/s/${id}` },
    robots: listed ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description: "Files and links shared with GSO.",
      url: `/s/${id}`,
      type: "website",
    },
  };
}

export default async function SharePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (!SHARE_ID_PATTERN.test(id)) notFound();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return <Unconfigured />;

  const share = await loadShare(id);
  if (!share) notFound();

  const itemCount = share.files.length + share.links.length;
  const created = new Date(share.createdAt);
  const createdAt = Number.isNaN(created.getTime())
    ? null
    : created.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return <ShareContent share={share} itemCount={itemCount} createdAt={createdAt} />;
}
