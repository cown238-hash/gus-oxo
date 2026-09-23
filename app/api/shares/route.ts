import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import {
  MAX_FILES,
  MAX_LINKS,
  MAX_NAME_LENGTH,
  SHARE_ID_PATTERN,
  isSharedFile,
  normalizeUrl,
  type Share,
} from "@/app/lib/share";

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function createShareId(length = 10): string {
  const bytes = randomBytes(length);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  }
  return id;
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

/**
 * Stores the index for one share: which files it contains and which links it
 * points at. The files themselves are already in Blob storage — uploaded
 * directly from the browser via /api/blob — so this payload stays tiny and
 * never trips request body limits.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      {
        error:
          "Storage is not configured. Add BLOB_READ_WRITE_TOKEN to .env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    files?: unknown;
    links?: unknown;
  } | null;
  if (!body) return badRequest("Invalid request body.");

  const rawFiles = body.files ?? [];
  const rawLinks = body.links ?? [];

  if (!Array.isArray(rawFiles) || !Array.isArray(rawLinks)) {
    return badRequest("`files` and `links` must be arrays.");
  }
  if (rawFiles.length > MAX_FILES) return badRequest(`Too many files (max ${MAX_FILES}).`);
  if (rawLinks.length > MAX_LINKS) return badRequest(`Too many links (max ${MAX_LINKS}).`);
  if (rawFiles.length === 0 && rawLinks.length === 0) {
    return badRequest("Add at least one file or link.");
  }
  if (!rawFiles.every(isSharedFile)) {
    return badRequest("One of the files is invalid or exceeds the 100 MB limit.");
  }

  const links: string[] = [];
  for (const raw of rawLinks) {
    if (typeof raw !== "string" || raw.length > 2048) {
      return badRequest("One of the links is invalid.");
    }
    const url = normalizeUrl(raw);
    if (!url) return badRequest(`"${raw.slice(0, 80)}" is not a valid URL.`);
    links.push(url);
  }

  const id = createShareId();
  const share: Share = {
    id,
    createdAt: new Date().toISOString(),
    files: rawFiles,
    links,
  };

  try {
    await put(`shares/${id}.json`, JSON.stringify(share), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 60,
    });
  } catch (error) {
    console.error("Failed to store share metadata", error);
    return Response.json(
      { error: "Could not save the share. Check your storage credentials." },
      { status: 500 },
    );
  }

  // Guard against an id that somehow escaped our alphabet (defence in depth —
  // the id is interpolated into a storage pathname when the share is read).
  if (!SHARE_ID_PATTERN.test(id) || id.length > MAX_NAME_LENGTH) {
    return Response.json({ error: "Could not create a share id." }, { status: 500 });
  }

  return Response.json({ path: `/s/${id}` });
}
