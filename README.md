# Droplink

Upload files and paste links, get one shareable URL back. Built with Next.js (App Router),
Tailwind CSS v4 and Vercel Blob.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Storage (required)

Files are stored in [Vercel Blob](https://vercel.com/docs/vercel-blob). You need a token
before uploads will work:

1. Go to https://vercel.com/dashboard → **Storage** → **Create Blob Store**
2. Copy the **Read-Write API token**
3. Paste it into `.env.local`:

   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
   ```

4. Restart the dev server (`Ctrl+C`, then `npm run dev`)

Until then, the UI shows a clear "storage isn't configured" message instead of failing silently.

## How it works

| Route | Purpose |
| --- | --- |
| `/` | Uploader: drag files or paste URLs |
| `/api/blob` | `GET` reports whether storage is configured; `POST` issues short-lived client upload tokens |
| `/api/shares` | Validates a payload and writes the share index to Blob storage |
| `/s/[id]` | Renders one share: files with download links, plus URLs |

**Files upload straight from the browser to Blob storage.** The server only mints a token,
so uploads aren't limited by the platform's 4.5 MB request-body cap — the per-file ceiling is
100 MB, enforced on both the client and the token.

Share metadata lives at `shares/{id}.json` in the same store, so there's no database. The
index is validated with a type guard (`isShare` in `app/lib/share.ts`) on read, and the id is
checked against `SHARE_ID_PATTERN` before it's interpolated into a storage pathname.

## Limits

- 100 MB per file, 50 files and 50 links per share
- Links are normalized to `http(s)` URLs; file entries must point at this store's
  `.blob.vercel-storage.com` hostnames
- **Shares are public** — anyone with the link can open them. There's no auth, no expiry and
  no deletion flow yet.

## Scripts

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # serve the production build
npm run lint   # eslint
```
