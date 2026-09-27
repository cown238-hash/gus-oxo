"use client";

import { trackEvent } from "@/app/lib/tracking";
import { CATEGORY_META, type FileCategory } from "@/app/lib/share";

export function TrackSearch({ query }: { query: string }) {
  if (!query.trim()) return null;
  trackEvent("search", { search_term: query.trim() });
  return null;
}

export function TrackFilter({ category }: { category: FileCategory | "all" }) {
  if (category === "all") return null;
  trackEvent("filter_by_category", {
    category,
    category_label: CATEGORY_META[category].label,
  });
  return null;
}
