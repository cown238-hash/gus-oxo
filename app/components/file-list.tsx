"use client";

import { useMemo, useState } from "react";
import CategoryBadge from "./category-badge";
import {
  CATEGORY_META,
  FILE_CATEGORIES,
  fileCategory,
  formatBytes,
  type FileCategory,
  type SharedFile,
} from "@/app/lib/share";

const chipClass = (selected: boolean) =>
  `inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors ${
    selected
      ? "border-accent/50 bg-accent/10 text-foreground"
      : "border-white/12 text-muted hover:border-white/25 hover:text-foreground"
  }`;

/** File list with a category filter. Categories come from the file
 *  extension — see fileCategory() in the share lib. */
export default function FileList({ files }: { files: SharedFile[] }) {
  const [selected, setSelected] = useState<FileCategory | "all">("all");

  const counts = useMemo(() => {
    const map = new Map<FileCategory, number>();
    for (const file of files) {
      const category = fileCategory(file.name);
      map.set(category, (map.get(category) ?? 0) + 1);
    }
    return map;
  }, [files]);

  const categories = FILE_CATEGORIES.filter((category) =>
    counts.has(category),
  );
  const visible =
    selected === "all"
      ? files
      : files.filter((file) => fileCategory(file.name) === selected);
  const showFilter = categories.length > 1;

  return (
    <>
      {showFilter && (
        <div
          className="mt-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setSelected("all")}
            aria-pressed={selected === "all"}
            className={chipClass(selected === "all")}
          >
            All <span className="opacity-60">{files.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelected(category)}
              aria-pressed={selected === category}
              className={chipClass(selected === category)}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${CATEGORY_META[category].dot}`}
                aria-hidden="true"
              />
              {CATEGORY_META[category].label}
              <span className="opacity-60">{counts.get(category)}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="mt-5 space-y-3">
        {visible.map((file) => (
          <li
            key={file.url}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-accent/40"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-medium hover:text-accent"
              >
                {file.name}
              </a>
              <div className="flex items-center gap-2">
                <CategoryBadge category={fileCategory(file.name)} />
                <span className="font-mono text-xs text-muted">
                  {formatBytes(file.size)}
                </span>
              </div>
            </div>
            <a
              href={file.downloadUrl}
              className="shrink-0 rounded-full border border-white/12 px-4 py-1.5 text-sm transition-all hover:border-accent/50 hover:bg-white/5 active:scale-95"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mt-5 text-sm text-muted">No files in this category.</p>
      )}
    </>
  );
}
