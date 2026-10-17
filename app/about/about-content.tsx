"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "@/app/components/reveal";

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

const limits = [
  { value: "100 MB", label: "maximum per file" },
  { value: "50", label: "files per share" },
  { value: "50", label: "links per share" },
  { value: "∞", label: "no expiry on links" },
];

const audiences = [
  {
    title: "Students",
    description: "Send notes, slides, and assignments in one tidy link.",
  },
  {
    title: "Creators",
    description: "Deliver mockups, photos, or audio without an account to set up.",
  },
  {
    title: "Teams",
    description: "Bundle a handful of assets together and drop the link in chat.",
  },
];

export default function AboutContent() {
  return (
    <div className="relative flex min-h-full flex-col">
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
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-12 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
          >
            <h2 className="text-base font-medium">Our mission</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              We believe sharing files should be as easy as sending a text
              message. No barriers, no friction — just drag, drop, and share.
              Whether you are a student sharing notes, a designer sending
              mockups, or a musician distributing tracks, GSO is built for you.
            </p>
          </motion.div>
        </Reveal>

        <section id="features" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">
              What you get
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 60}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
                >
                  <h3 className="text-base font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {feature.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="limits" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">
              Good to know
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {limits.map((limit, index) => (
              <Reveal key={limit.label} delay={index * 50}>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
                  <p className="text-2xl font-semibold tracking-tight text-accent">
                    {limit.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{limit.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="who" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">Who it is for</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {audiences.map((audience, index) => (
              <Reveal key={audience.title} delay={index * 60}>
                <div className="h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <h3 className="text-base font-medium">{audience.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {audience.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="categories" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">
              How categories work
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Every upload is tagged from its file extension — Image, Video,
              Audio, Document, Archive, or Other. Nothing is configured by hand,
              and nothing extra is stored, so categories work on every share,
              old or new. Use the category rail on the Explore page to filter,
              and the filter bar on a share page to jump between types.
            </p>
          </Reveal>
        </section>

        <Reveal delay={120}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-12 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
          >
            <h2 className="text-base font-medium">Questions?</h2>
            <p className="mt-2 text-sm text-muted">
              Most answers live in our Help &amp; FAQ, from upload limits to
              privacy. Still stuck? Send us a message.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/help"
                className="inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
              >
                Help &amp; FAQ →
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-full border border-white/12 px-6 text-sm transition-all hover:border-accent/50 hover:bg-accent/10"
              >
                Contact us
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </main>
    </div>
  );
}
