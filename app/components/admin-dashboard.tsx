"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "./toast";
import type { AdminShareRow } from "@/app/lib/admin-data";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = "";
  for (const next of units) {
    value /= 1024;
    unit = next;
    if (value < 1024) break;
  }
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${unit}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Sign-out button: clears the cookie, then leaves the admin area. */
function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        router.push("/");
        router.refresh();
      }}
      className="h-9 rounded-full border border-white/12 px-4 text-sm text-muted transition-all hover:border-accent/50 hover:text-foreground active:scale-95 disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

/** Row with a two-step delete: first click arms it, second click deletes. */
function ShareRow({ row }: { row: AdminShareRow }) {
  const router = useRouter();
  const toast = useToast();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    if (busy) return;
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shares/${row.id}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not delete the share.");
        setArmed(false);
        return;
      }
      toast("Share deleted");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setArmed(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-5 py-4 transition-colors hover:bg-white/[0.02] sm:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Link
          href={`/s/${row.id}`}
          className="font-mono text-sm text-accent transition-colors hover:text-accent/80"
        >
          /s/{row.id}
        </Link>

        <span className="text-sm text-muted">{formatDate(row.createdAt)}</span>

        <span className="text-sm text-muted">
          {row.valid ? (
            <>
              {row.fileCount} {row.fileCount === 1 ? "file" : "files"} ·{" "}
              {row.linkCount} {row.linkCount === 1 ? "link" : "links"} ·{" "}
              <span className="font-mono">{formatBytes(row.totalBytes)}</span>
            </>
          ) : (
            <span className="text-red-400/90">unreadable index</span>
          )}
        </span>

        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className={`ml-auto h-9 rounded-full border px-4 text-sm transition-all active:scale-95 disabled:opacity-50 ${
            armed
              ? "border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              : "border-white/12 text-muted hover:border-red-500/40 hover:text-red-400"
          }`}
        >
          {busy
            ? "Deleting…"
            : armed
              ? "Confirm delete"
              : row.valid
                ? "Delete"
                : "Remove index"}
        </button>
      </div>

      {armed && !error && (
        <p className="mt-2 text-xs text-red-400/90">
          Deletes this share, its {row.valid ? `${row.fileCount} file${row.fileCount === 1 ? "" : "s"} and its link index` : "index"} permanently. Click again to
          confirm, or refresh the page to cancel.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Admin table: every share in the store, newest first, with a per-share
 * delete. Rendering is optimistic — rows disappear after a successful
 * DELETE, and router.refresh() re-syncs the server-rendered list.
 */
export default function AdminDashboard({
  rows,
  hasMore,
}: {
  rows: AdminShareRow[];
  hasMore: boolean;
}) {
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Shares
          </h1>
          <p className="mt-3 text-sm text-muted">
            Every share in this store, newest first.{" "}
            <span className="font-mono">{rows.length}</span>{" "}
            {rows.length === 1 ? "entry" : "entries"} shown.
          </p>
        </div>
        <LogoutButton />
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6 text-accent"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V4.5m0 0L7.5 9M12 4.5 16.5 9M4.5 16.5v1.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5"
              />
            </svg>
          </span>
          <p className="mt-4 text-sm font-medium">No shares yet</p>
          <p className="mt-1 text-sm text-muted">
            Upload something on the{" "}
            <Link href="/" className="text-accent hover:underline">
              home page
            </Link>{" "}
            — it will show up here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
          <div className="flex items-center gap-4 border-b border-white/8 bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-muted sm:px-6">
            <span>Share</span>
            <span className="hidden sm:inline">Created</span>
            <span className="hidden md:inline">Contents</span>
            <span className="ml-auto">Action</span>
          </div>
          <div className="divide-y divide-white/6">
            {rows.map((row) => (
              <ShareRow key={row.id} row={row} />
            ))}
          </div>
        </div>
      )}

      {hasMore && (
        <p className="mt-4 text-xs text-muted">
          Showing the newest 1000 shares — older entries exist in storage but
          aren&apos;t listed here.
        </p>
      )}
    </>
  );
}
