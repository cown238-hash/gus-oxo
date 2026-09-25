export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
export const MAX_FILES = 50;
export const MAX_LINKS = 50;
export const MAX_NAME_LENGTH = 255;
export const MAX_TITLE_LENGTH = 120;

/** Share ids are generated with this alphabet, and validated with it on read. */
export const SHARE_ID_PATTERN = /^[a-z0-9]{6,20}$/;

export type SharedFile = {
  name: string;
  size: number;
  url: string;
  downloadUrl: string;
};

export type Share = {
  id: string;
  createdAt: string;
  /** Optional display title shown as the card headline on the Explore page. */
  title?: string;
  /** Whether the share shows up in the public Explore listing.
   *  Omitted on older indexes — readers treat that as `true`. */
  listed?: boolean;
  files: SharedFile[];
  links: string[];
};

export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";

/** Display metadata for each category. `pill`/`dot` are full Tailwind class
 *  strings so the JIT can see them at build time. */
export const CATEGORY_META: Record<
  FileCategory,
  { label: string; blurb: string; examples: string; pill: string; dot: string }
> = {
  image: {
    label: "Image",
    blurb: "Photos, screenshots, icons and artwork.",
    examples: "png · jpg · webp · gif · svg · heic",
    pill: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    dot: "bg-sky-400",
  },
  video: {
    label: "Video",
    blurb: "Clips and screen recordings.",
    examples: "mp4 · mov · mkv · webm · avi",
    pill: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    dot: "bg-rose-400",
  },
  audio: {
    label: "Audio",
    blurb: "Music, voice notes and podcasts.",
    examples: "mp3 · wav · flac · m4a · ogg",
    pill: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  document: {
    label: "Document",
    blurb: "PDFs, Office files, notes and code.",
    examples: "pdf · docx · xlsx · txt · md · json",
    pill: "border-teal-400/30 bg-teal-400/10 text-teal-300",
    dot: "bg-teal-400",
  },
  archive: {
    label: "Archive",
    blurb: "Compressed bundles of many files.",
    examples: "zip · rar · 7z · tar · gz",
    pill: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    dot: "bg-orange-400",
  },
  other: {
    label: "Other",
    blurb: "Anything that doesn't fit the buckets above.",
    examples: "extensions we don't recognise — still fully shareable",
    pill: "border-white/12 bg-white/[0.04] text-muted",
    dot: "bg-zinc-400",
  },
};

/** Display order for category chips and grids. */
export const FILE_CATEGORIES: FileCategory[] = [
  "image",
  "video",
  "audio",
  "document",
  "archive",
  "other",
];

const EXTENSION_GROUPS: Array<[FileCategory, string[]]> = [
  [
    "image",
    "png jpg jpeg gif webp svg bmp ico heic heif avif tiff raw".split(" "),
  ],
  ["video", "mp4 mov mkv webm avi wmv m4v mpg mpeg flv".split(" ")],
  ["audio", "mp3 wav flac aac ogg oga m4a opus wma aiff mid midi".split(" ")],
  [
    "document",
    "pdf doc docx xls xlsx ppt pptx txt md csv rtf odt ods odp json xml yaml yml html css js ts tsx jsx py java rb go rs php c cpp h cs sql sh toml ini log".split(
      " ",
    ),
  ],
  ["archive", "zip rar 7z tar gz tgz bz2 xz zst jar".split(" ")],
];

const EXTENSION_TO_CATEGORY: Record<string, FileCategory> = {};
for (const [category, extensions] of EXTENSION_GROUPS) {
  for (const extension of extensions) {
    EXTENSION_TO_CATEGORY[extension] = category;
  }
}

/** Derives a shareable category from a filename's extension. */
export function fileCategory(name: string): FileCategory {
  const match = /\.([a-z0-9]+)$/i.exec(name.trim());
  if (!match) return "other";
  return EXTENSION_TO_CATEGORY[match[1].toLowerCase()] ?? "other";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let unit = "";
  for (const next of units) {
    value /= 1024;
    unit = next;
    if (value < 1024) break;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`;
}

/** Accepts bare domains ("example.com/x") and normalizes them to https URLs. */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** Reduces an arbitrary filename to something safe for a storage pathname. */
export function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, "-")
    .replace(/^\.+/, "")
    .slice(0, MAX_NAME_LENGTH);
  // Falls back when the name was nothing but separators (e.g. "///").
  return /[A-Za-z0-9]/.test(cleaned) ? cleaned : "file";
}

/** True for plain http(s) URLs — used to reject `javascript:`/`data:` links. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Vercel Blob public URLs look like {storeId}.public.blob.vercel-storage.com */
export function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export function isSharedFile(value: unknown): value is SharedFile {
  if (typeof value !== "object" || value === null) return false;
  const file = value as Record<string, unknown>;
  return (
    typeof file.name === "string" &&
    file.name.length > 0 &&
    file.name.length <= MAX_NAME_LENGTH &&
    typeof file.size === "number" &&
    Number.isFinite(file.size) &&
    file.size >= 0 &&
    file.size <= MAX_FILE_SIZE &&
    typeof file.url === "string" &&
    isBlobUrl(file.url) &&
    typeof file.downloadUrl === "string" &&
    isBlobUrl(file.downloadUrl)
  );
}

export function isShare(value: unknown): value is Share {
  if (typeof value !== "object" || value === null) return false;
  const share = value as Record<string, unknown>;
  return (
    typeof share.id === "string" &&
    SHARE_ID_PATTERN.test(share.id) &&
    typeof share.createdAt === "string" &&
    (share.title === undefined ||
      (typeof share.title === "string" &&
        share.title.length <= MAX_TITLE_LENGTH)) &&
    (share.listed === undefined || typeof share.listed === "boolean") &&
    Array.isArray(share.files) &&
    share.files.length <= MAX_FILES &&
    share.files.every(isSharedFile) &&
    Array.isArray(share.links) &&
    share.links.length <= MAX_LINKS &&
    share.links.every(
      (link) => typeof link === "string" && link.length <= 2048 && isHttpUrl(link),
    )
  );
}
