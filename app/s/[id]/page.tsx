import { get } from "@vercel/blob";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHARE_ID_PATTERN, isShare, type Share } from "@/app/lib/share";
import ShareContent, { Unconfigured } from "./share-content";

async function loadShare(id: string): Promise<Share | null> {
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
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await props.params;
  if (!SHARE_ID_PATTERN.test(id)) return { title: "Not found — GSO" };
  return {
    title: `Share ${id} — GSO`,
    description: "Files and links shared with GSO.",
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