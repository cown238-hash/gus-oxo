# GSO

Upload files and paste links, get one shareable URL back — the GSO sharing site. Built with
Next.js (App Router), Tailwind CSS v4 and Vercel Blob.

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

### Admin panel (optional)

`/admin` is the backend management system: it lists every share (date, files, links, size)
and deletes one — its files and its index. Protect it with a password:

1. Add to `.env.local`:

   ```
   ADMIN_PASSWORD=choose-a-strong-password
   ```

2. Restart the dev server.

Without `ADMIN_PASSWORD`, `/admin` shows setup instructions instead of the dashboard. Sign-in
sets an HMAC-signed, HTTP-only session cookie (7 days, re-signed with the password itself, so
changing the password logs everyone out). `proxy.ts` — Next 16's replacement for
`middleware.ts` — redirects unauthenticated visitors to `/admin/login` and returns 401 for
admin API calls; every admin page and route also re-checks the session on its own, so the
proxy is never the only guard.

## How it works

| Route | Purpose |
| --- | --- |
| `/` | Uploader: drag files or paste URLs, plus the file-category reference |
| `/about` | About GSO: how it works, categories, limits and honest gaps |
| `/api/blob` | `GET` reports whether storage is configured; `POST` issues short-lived client upload tokens |
| `/api/shares` | Validates a payload and writes the share index to Blob storage |
| `/s/[id]` | Renders one share: files with category badges and a filter, plus URLs |
| `/admin` | Admin dashboard: lists all shares, delete per share (sign-in required) |
| `/admin/login` | Password sign-in; sets the session cookie |
| `/api/admin/login` | `POST` verifies the password and sets the session cookie |
| `/api/admin/logout` | `POST` clears the session cookie |
| `/api/admin/shares/[id]` | `DELETE` removes a share: its files and its index |

**Files upload straight from the browser to Blob storage.** The server only mints a token,
so uploads aren't limited by the platform's 4.5 MB request-body cap — the per-file ceiling is
100 MB, enforced on both the client and the token.

Share metadata lives at `shares/{id}.json` in the same store, so there's no database. The
index is validated with a type guard (`isShare` in `app/lib/share.ts`) on read, and the id is
checked against `SHARE_ID_PATTERN` before it's interpolated into a storage pathname.

**The admin panel lists shares without a database too**: it enumerates `shares/` with Blob's
`list()` and reads each index. Deleting a share removes the index plus every file URL it
references; indexes that fail validation are still listed (flagged "unreadable") so a corrupt
entry can be cleaned up instead of becoming an orphan.

**File categories** are derived from the extension (`fileCategory` in `app/lib/share.ts`):
Image, Video, Audio, Document, Archive or Other. They're display-only — nothing is stored,
so existing shares pick up badges and filtering without migration.

## Limits

- 100 MB per file, 50 files and 50 links per share
- Links are normalized to `http(s)` URLs; file entries must point at this store's
  `.blob.vercel-storage.com` hostnames
- **Shares are public** — anyone with the link can open them. There's no viewer auth and no
  expiry; only the signed-in admin panel (`/admin`) can delete a share, and login has no rate
  limiting beyond a fixed delay on failures.

## Scripts

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # serve the production build
npm run lint   # eslint
```
