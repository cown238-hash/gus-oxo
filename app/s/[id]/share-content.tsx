"use client";

import Link from "next/link";
import { motion } from "motion/react";
import CopyButton from "@/app/components/copy-button";
import FileList from "@/app/components/file-list";
import ShareUrlField from "@/app/components/share-url-field";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { type Share } from "@/app/lib/share";

interface ShareContentProps {
  share: Share;
  itemCount: number;
  createdAt: string | null;
}

export function Unconfigured() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Storage isn&apos;t configured
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Add your Vercel Blob token to <code className="font-mono text-accent">.env.local</code> as{" "}
          <code className="font-mono text-accent">BLOB_READ_WRITE_TOKEN</code>, then
          restart the dev server.
        </p>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 0 40px -8px var(--accent)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 inline-block"
        >
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
          >
            Back to upload
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ShareContent({ share, itemCount, createdAt }: ShareContentProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />
      <div className="grid-overlay pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />

      <div className="relative z-10">
        <SiteHeader size="narrow" />
      </div>

      <main className="fade-up relative z-10 mx-auto w-full max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Shared link
          </p>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="inline-block"
          >
            <Link
              href="/browse"
              className="text-xs text-muted transition-colors hover:text-accent"
            >
              ← Explore more files
            </Link>
          </motion.div>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {itemCount} item{itemCount === 1 ? "" : "s"}
          {createdAt && (
            <span className="text-muted"> · {createdAt}</span>
          )}
        </h1>

        <div className="mt-6 flex gap-3">
          <ShareUrlField value={`/s/${share.id}`} />
          <CopyButton className="h-10 shrink-0 rounded-full bg-accent px-5 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_-6px] hover:shadow-accent active:scale-[0.98] btn-press" />
        </div>

        {share.files.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-white/8 pb-4 text-lg font-semibold tracking-tight">
              Files
            </h2>
            <FileList files={share.files} />
          </section>
        )}

        {share.links.length > 0 && (
          <section className="mt-12">
            <h2 className="border-b border-white/8 pb-4 text-lg font-semibold tracking-tight">
              Links
            </h2>
            <ul className="mt-5 space-y-3">
              {share.links.map((link) => (
                <motion.li
                  key={link}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 hover:border-accent/40 hover:shadow-[0_10px_30px_-15px] hover:shadow-accent/30"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate font-mono text-sm text-accent/90 transition-all hover:text-accent hover:translate-x-1"
                  >
                    {link}
                  </a>
                  <span
                    className="shrink-0 text-xs text-muted"
                    aria-hidden
                  >
                    ↗
                  </span>
                </motion.li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 text-sm text-muted">
          Anyone with this link can view these items. There&apos;s no account
          attached to them. The files stay online until an admin deletes this
          share — the link never expires, and downloading never removes them.
        </p>
      </main>

      <div className="relative z-10">
        <SiteFooter size="narrow" />
      </div>
    </div>
  );
}