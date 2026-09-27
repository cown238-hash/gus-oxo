import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import Reveal from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "About us — GSO",
  description:
    "Learn about GSO — a fast, no-account file and link sharing tool. Upload, share, browse.",
};

const features = [
  {
    title: "No account required",
    description:
      "Upload files and share links instantly — no sign-up, no email, no password.",
  },
  {
    title: "Fast & lightweight",
    description:
      "Files go straight from your browser to cloud storage. No waiting, no queues.",
  },
  {
    title: "Organized by category",
    description:
      "Images, videos, audio, documents, and archives — automatically sorted and easy to browse.",
  },
  {
    title: "Free to use",
    description:
      "Share up to 50 files at a time, each up to 100 MB. No hidden fees.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="about" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            About us
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Sharing files, simplified
          </h1>
          <p className="mt-4 text-lg text-muted">
            GSO is a file and link sharing tool built for speed and simplicity.
            Drop a file, paste a link, and get a shareable URL in seconds — no
            account required.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
              >
                <h2 className="text-base font-medium">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="text-base font-medium">Our mission</h2>
            <p className="mt-2 text-sm text-muted">
              We believe sharing files should be as easy as sending a text
              message. No barriers, no friction — just drag, drop, and share.
              Whether you are a student sharing notes, a designer sending
              mockups, or a musician distributing tracks, GSO is built for you.
            </p>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
