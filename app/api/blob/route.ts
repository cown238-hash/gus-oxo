import { handleUpload } from "@vercel/blob/client";
import type { HandleUploadBody } from "@vercel/blob/client";
import { MAX_FILE_SIZE } from "@/app/lib/share";

const notConfigured = Response.json(
  {
    error:
      "Storage is not configured. Add BLOB_READ_WRITE_TOKEN to .env.local and restart the dev server.",
  },
  { status: 500 },
);

/**
 * Lets the browser check whether uploads are usable before it starts
 * sending files, so we can show a clear message instead of a vague failure.
 */
export async function GET() {
  return Response.json({ configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

/**
 * Issues short-lived client tokens so files go straight from the browser to
 * Vercel Blob. This bypasses the 4.5 MB request limit you'd hit by proxying
 * uploads through the server.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return notConfigured;

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => ({
        maximumSizeInBytes: MAX_FILE_SIZE,
        allowOverwrite: false,
        addRandomSuffix: false,
      }),
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
