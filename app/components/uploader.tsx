"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useRef, useState } from "react";
import CategoryBadge from "./category-badge";
import { useToast } from "./toast";
import {
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_LINKS,
  fileCategory,
  formatBytes,
  normalizeUrl,
  safeFileName,
  type SharedFile,
} from "@/app/lib/share";

type UploaderState =
  | { status: "idle" }
  | { status: "uploading"; done: number; total: number; percent: number }
  | { status: "done"; url: string }
  | { status: "error"; message: string };

export default function Uploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [title, setTitle] = useState("");
  const [listed, setListed] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<UploaderState>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const busy = state.status === "uploading";
  const hasContents = files.length > 0 || links.length > 0;

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);

    const oversized = list.filter((file) => file.size > MAX_FILE_SIZE);
    const acceptable = list.filter((file) => file.size <= MAX_FILE_SIZE);

    const seen = new Set(files.map((file) => `${file.name}:${file.size}`));
    const fresh = acceptable.filter(
      (file) => !seen.has(`${file.name}:${file.size}`),
    );
    const room = MAX_FILES - files.length;
    const toAdd = fresh.slice(0, Math.max(room, 0));

    let message = "";
    if (oversized.length > 0) {
      message = `"${oversized[0].name}" is over the ${formatBytes(MAX_FILE_SIZE)} limit.`;
    } else if (fresh.length > toAdd.length) {
      message = `You can share up to ${MAX_FILES} files at once.`;
    }

    if (toAdd.length > 0) setFiles([...files, ...toAdd]);
    setState(message ? { status: "error", message } : { status: "idle" });
  };

  const addLink = () => {
    const url = normalizeUrl(linkInput);
    if (!url) {
      setState({
        status: "error",
        message: "That doesn't look like a valid URL.",
      });
      return;
    }
    if (links.length >= MAX_LINKS) {
      setState({
        status: "error",
        message: `You can share up to ${MAX_LINKS} links at once.`,
      });
      return;
    }
    setLinkInput("");
    if (links.includes(url)) {
      setState({ status: "idle" });
      return;
    }
    setState({ status: "idle" });
    setLinks([...links, url]);
  };

  const removeFile = (index: number) =>
    setFiles(files.filter((_, i) => i !== index));

  const removeLink = (link: string) =>
    setLinks(links.filter((item) => item !== link));

  const reset = () => {
    setFiles([]);
    setLinks([]);
    setLinkInput("");
    setTitle("");
    setListed(true);
    setState({ status: "idle" });
    setCopied(false);
  };

  const copy = async () => {
    if (state.status !== "done") return;
    try {
      await navigator.clipboard.writeText(state.url);
      setCopied(true);
      toast("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; say so instead of failing silently.
      toast("Couldn't copy — select the URL manually", "error");
    }
  };

  const submit = async () => {
    if (!hasContents || busy) return;
    setState({ status: "uploading", done: 0, total: files.length, percent: 0 });

    try {
      // Fail early with a useful message if the token was never added.
      const probe = await fetch("/api/blob").then(
        (res) => res.json() as Promise<{ configured?: boolean }>,
      );
      if (!probe.configured) {
        throw new Error(
          "Storage isn't configured yet. Add BLOB_READ_WRITE_TOKEN to .env.local and restart the dev server.",
        );
      }

      const uploaded: SharedFile[] = [];
      const folder = crypto.randomUUID();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setState({ status: "uploading", done: i, total: files.length, percent: 0 });

        // Files go straight from the browser to Blob storage — the server only
        // ever issues a short-lived token, so we avoid its request size limit.
        const blob = await upload(
          `files/${folder}/${i}_${safeFileName(file.name)}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/blob",
            onUploadProgress: ({ percentage }) =>
              setState({
                status: "uploading",
                done: i,
                total: files.length,
                percent: percentage,
              }),
          },
        );

        uploaded.push({
          name: file.name,
          size: file.size,
          url: blob.url,
          downloadUrl: blob.downloadUrl,
        });
      }

      const res = await fetch("/api/shares", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          files: uploaded,
          links,
          title: title.trim() || undefined,
          listed,
        }),
      });
      const data: { path?: string; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok || !data.path) {
        throw new Error(data.error ?? "Could not create the share link.");
      }

      setState({
        status: "done",
        url: new URL(data.path, window.location.origin).toString(),
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed.",
      });
    }
  };

  if (state.status === "done") {
    return (
      <div className="fade-up rounded-3xl border border-accent/30 bg-white/[0.03] p-8 shadow-[0_30px_80px_-40px] shadow-accent/60">
        <div className="flex items-center gap-3 text-sm font-medium text-accent">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          Your share link is ready
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={state.url}
            onFocus={(event) => event.currentTarget.select()}
            className="h-11 flex-1 rounded-full border border-white/12 bg-black/40 px-5 font-mono text-sm text-foreground outline-none focus:border-accent/50"
          />
          <button
            onClick={copy}
            className="h-11 shrink-0 rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
              {links.length} link{links.length === 1 ? "" : "s"}
            </span>
            {[
              ...new Set(files.map((file) => fileCategory(file.name))),
            ].map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </span>
          <button
            onClick={reset}
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Share something else
          </button>
        </div>

        <p className="mt-4 text-xs text-muted">
          This link never expires — the files stay online until an admin
          deletes the share, and anyone with the link can download them any
          time.
        </p>
        <p className="mt-2 text-xs text-muted">
          {listed ? (
            <>
              🌍 Listed on the{" "}
              <Link
                href="/browse"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
              >
                Explore page
              </Link>{" "}
              — anyone can discover it there too.
            </>
          ) : (
            <>🔒 Link-only share — it won&apos;t appear on the Explore page.</>
          )}
        </p>
      </div>
    );
  }

  const overall =
    state.status === "uploading" && state.total > 0
      ? Math.min(
          100,
          ((state.done + state.percent / 100) / state.total) * 100,
        )
      : 0;

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 sm:p-8">
      {/* Drop zone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
          dragging
            ? "scale-[1.01] border-accent bg-accent/10 shadow-[0_0_60px_-15px] shadow-accent"
            : "border-white/12 hover:border-accent/40 hover:bg-white/[0.02]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8 text-accent transition-transform duration-300"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V4.5m0 0L7.5 9M12 4.5 16.5 9M4.5 16.5v1.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5"
          />
        </svg>
        <p className="mt-4 text-sm font-medium">
          Drag files here, or{" "}
          <span className="text-accent underline underline-offset-4">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          Any file type · up to {formatBytes(MAX_FILE_SIZE)} each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {/* Link input */}
      <div className="mt-5 flex gap-3">
        <input
          type="url"
          inputMode="url"
          value={linkInput}
          placeholder="Or paste a link…"
          onChange={(event) => {
            setLinkInput(event.target.value);
            if (state.status === "error") setState({ status: "idle" });
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addLink();
            }
          }}
          className="h-11 flex-1 rounded-full border border-white/12 bg-black/40 px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/50"
        />
        <button
          onClick={addLink}
          className="h-11 shrink-0 rounded-full border border-white/12 px-5 text-sm transition-all hover:border-accent/50 hover:bg-white/5 active:scale-95"
        >
          Add
        </button>
      </div>

      {/* Optional title + Explore listing */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          maxLength={120}
          value={title}
          placeholder="Title for the Explore page (optional)"
          onChange={(event) => {
            setTitle(event.target.value);
            if (state.status === "error") setState({ status: "idle" });
          }}
          className="h-11 flex-1 rounded-full border border-white/12 bg-black/40 px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/50"
        />
      </div>

      <label className="mt-4 flex cursor-pointer select-none items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={listed}
          onChange={(event) => setListed(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          <span className="font-medium">List on the Explore page</span>
          <span className="block text-xs leading-5 text-muted">
            Anyone can browse, search and download it. Uncheck for a
            link-only share.
          </span>
        </span>
      </label>

      {/* Selected items */}
      {(files.length > 0 || links.length > 0) && (
        <ul className="mt-5 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/30 px-4 py-2.5 transition-colors hover:border-white/20"
            >
              <div className="flex min-w-0 items-center gap-3">
                <CategoryBadge category={fileCategory(file.name)} />
                <span className="truncate text-sm">{file.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground active:scale-90"
              >
                ✕
              </button>
            </li>
          ))}
          {links.map((link) => (
            <li
              key={link}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/30 px-4 py-2.5 transition-colors hover:border-white/20"
            >
              <span className="truncate font-mono text-sm text-accent/90">
                {link}
              </span>
              <button
                onClick={() => removeLink(link)}
                aria-label={`Remove ${link}`}
                className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground active:scale-90"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Status + progress */}
      <div
        className={`mt-6 text-sm ${
          state.status === "error" ? "text-red-400" : "text-muted"
        }`}
        role={state.status === "error" ? "alert" : undefined}
      >
        {state.status === "error"
          ? state.message
          : state.status === "uploading"
            ? `Uploading ${Math.min(state.done + 1, state.total)} of ${state.total}…`
            : hasContents
              ? `${files.length + links.length} item${
                  files.length + links.length === 1 ? "" : "s"
                } ready`
              : "Add a file or a link to get started"}
      </div>

      {state.status === "uploading" && (
        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(overall)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-200"
            style={{ width: `${overall}%` }}
          />
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={submit}
          disabled={!hasContents || busy}
          className="h-11 rounded-full bg-accent px-7 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {busy ? "Uploading…" : "Create share link"}
        </button>
      </div>
    </div>
  );
}
