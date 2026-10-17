import { listPublicShares } from "@/app/lib/browse";
import { pageMetadata } from "@/app/lib/seo";
import BrowseContent from "./browse-content";

export const metadata = pageMetadata({
  title: "Explore files — GSO",
  description:
    "Browse the latest files and links shared publicly on GSO — search by name and filter by category.",
  path: "/browse",
});

export default async function BrowsePage(props: { searchParams: Promise<{ q?: string; cat?: string; page?: string }> }) {
  const sp = await props.searchParams;
  const rawQ = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const q = rawQ.trim();
  const rawCat = typeof sp.cat === "string" ? sp.cat : "";
  const FILE_CATEGORIES = ["image", "video", "audio", "document", "archive"] as const;
  type FileCategory = (typeof FILE_CATEGORIES)[number];
  function parseCat(raw: string | string[] | undefined): FileCategory | "all" {
    const value = Array.isArray(raw) ? raw[0] : raw;
    return FILE_CATEGORIES.includes(value as FileCategory)
      ? (value as FileCategory)
      : "all";
  }
  const cat = parseCat(rawCat);
  const rawPage = Number.parseInt(
    typeof sp.page === "string" ? sp.page : "",
    10,
  );

  const result = await listPublicShares({
    q,
    cat,
    page: Number.isFinite(rawPage) ? rawPage : 1,
  });

  return <BrowseContent result={result} q={q} cat={cat} />;
}