"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CategoryGlyph } from "./file-preview";
import { CATEGORY_META, formatBytes } from "@/app/lib/share";
import type { BrowseCard } from "@/app/lib/browse";

function itemCountLabel(card: BrowseCard): string {
  const parts: string[] = [];
  if (card.fileCount > 0) {
    parts.push(`${card.fileCount} file${card.fileCount === 1 ? "" : "s"}`);
  }
  if (card.linkCount > 0) {
    parts.push(`${card.linkCount} link${card.linkCount === 1 ? "" : "s"}`);
  }
  if (card.totalBytes > 0) parts.push(formatBytes(card.totalBytes));
  return parts.join(" · ") || "Empty share";
}

/** Grid card for the Explore page and the homepage's "latest" row:
 *  cover (image or category icon tile), title, badges and meta. */
export default function ShareCard({ card }: { card: BrowseCard }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(card.coverUrl) && !failed;
  const meta = CATEGORY_META[card.coverCategory];

  return (
    <Link
      href={`/s/${card.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        {showImage && card.coverUrl ? (
          <Image
            src={card.coverUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${meta.pill}`}
            aria-hidden
          >
            <CategoryGlyph
              category={card.coverCategory}
              className="h-12 w-12 opacity-70"
            />
          </div>
        )}

        {/* Badges over the cover, i-loadzone style */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {card.cats.slice(0, 2).map((category) => (
            <span
              key={category}
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${CATEGORY_META[category].pill}`}
            >
              {CATEGORY_META[category].label}
            </span>
          ))}
        </div>
        {card.totalBytes > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 font-mono text-[10px] text-foreground/90 backdrop-blur-sm">
            {formatBytes(card.totalBytes)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-medium leading-5 transition-colors group-hover:text-accent">
          {card.title}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3 text-[11px] text-muted">
          <span className="truncate">{itemCountLabel(card)}</span>
          {card.dateLabel && (
            <span className="shrink-0">{card.dateLabel}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
