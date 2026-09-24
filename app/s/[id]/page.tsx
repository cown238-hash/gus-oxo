import { get } from "@vercel/blob";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/app/components/copy-button";
import FileList from "@/app/components/file-list";
import ShareUrlField from "@/app/components/share-url-field";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { SHARE_ID_PATTERN, isShare, type Share } from "@/app/lib/share";

async function loadShare(id: string): Promise<Share | null> {
  const result = await get(`shares/${id}.json`, { access: "public" });
  if (!result) return null;

  const text = await new Response(result.stream).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  return isShare(parsed) ? parsed : null;
}

export async function generateMetadata(
  props: PageProps<"/s/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  if (!SHARE_ID_PATTERN.test(id)) return { title: "Not found — GSO" };
  return {
    title: `Share ${id} — GSO`,
    description: "Files and links shared with GSO.",
  };
}

function Unconfigured() {
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
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          Back to upload
        </Link>
      </div>
    </div>
  );
}

export default async function SharePage(props: PageProps<"/s/[id]">) {
  const { id } = await props.params;
  if (!SHARE_ID_PATTERN.test(id)) notFound();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return <Unconfigured />;

  const share = await loadShare(id);
  if (!share) notFound();

  const itemCount = share.files.length + share.links.length;
  const created = new Date(share.createdAt);
  const createdAt = Number.isNaN(created.getTime())
    ? null
    : created.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />
      <div className="grid-overlay pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />

      <div className="relative z-10">
        <SiteHeader size="narrow" />
      </div>

      <main className="fade-up relative z-10 mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Shared link
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {itemCount} item{itemCount === 1 ? "" : "s"}
          {createdAt && (
            <span className="text-muted"> · {createdAt}</span>
          )}
        </h1>

        <div className="mt-6 flex gap-3">
          <ShareUrlField value={`/s/${share.id}`} />
          <CopyButton />
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
                <li
                  key={link}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-accent/40"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate font-mono text-sm text-accent/90 hover:text-accent"
                  >
                    {link}
                  </a>
                  <span
                    className="shrink-0 text-xs text-muted"
                    aria-hidden
                  >
                    ↗
                  </span>
                </li>
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
