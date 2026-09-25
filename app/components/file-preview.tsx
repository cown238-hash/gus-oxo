"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  CATEGORY_META,
  fileCategory,
  type FileCategory,
  type SharedFile,
} from "@/app/lib/share";

/** Stroke glyphs (24×24 viewBox) used on the non-image covers. */
const ICONS: Record<FileCategory, ReactNode> = {
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 16-5.5-5.5L7 19" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="13" height="14" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  audio: <path d="M3 12h3l3-7 4 14 3-7h5" />,
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 8h16" />
      <path d="M12 11v1.5M12 14v1.5M12 17v1.5" />
    </>
  ),
  other: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
};

/** Stroke glyph for a category — shared by row covers and Explore cards. */
export function CategoryGlyph({
  category,
  className = "h-6 w-6",
}: {
  category: FileCategory;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[category]}
    </svg>
  );
}

/** Category-tinted tile with a glyph — the cover for everything that isn't
 *  a previewable image. Tint classes come from CATEGORY_META so the JIT
 *  sees them at build time. */
function IconCover({ file }: { file: SharedFile }) {
  const category = fileCategory(file.name);
  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${CATEGORY_META[category].pill}`}
      aria-hidden
    >
      <CategoryGlyph category={category} />
    </span>
  );
}

/** Small cover image for a row: the real thumbnail for image files (falling
 *  back to the icon tile when the browser can't decode it, e.g. heic). */
export function FileCover({ file }: { file: SharedFile }) {
  const [failed, setFailed] = useState(false);
  const isImage = fileCategory(file.name) === "image";

  if (!isImage || failed) return <IconCover file={file} />;

  return (
    <Image
      src={file.url}
      alt=""
      width={56}
      height={56}
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover"
    />
  );
}

/** Inline player for playable categories. `preload="none"` keeps page loads
 *  light — nothing downloads until the visitor presses play. */
export function FileMedia({ file }: { file: SharedFile }) {
  const category = fileCategory(file.name);

  if (category === "audio") {
    return (
      <audio
        controls
        preload="none"
        src={file.url}
        aria-label={`Play ${file.name}`}
        className="mt-3 h-10 w-full max-w-md"
      />
    );
  }

  if (category === "video") {
    return (
      <video
        controls
        preload="metadata"
        src={file.url}
        className="mt-3 max-h-80 w-full rounded-xl bg-black/40"
      />
    );
  }

  return null;
}
