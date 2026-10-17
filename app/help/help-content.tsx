"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Reveal from "@/app/components/reveal";

type Guide = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

const guides: Guide[] = [
  {
    id: "upload",
    title: "Upload a file",
    summary: "Turn any file into a shareable link in under a minute.",
    steps: [
      "Open the home page and scroll to the upload box (or use the Upload button in the header).",
      "Drag files into the box, or click it to pick files from your device — you can add up to 50 at once.",
      "Leave “List on the Explore page” checked to publish the share publicly, or uncheck it for a link-only share.",
      "Press Upload. When it finishes you get one short URL that holds every file.",
    ],
  },
  {
    id: "links",
    title: "Share a link instead of a file",
    summary: "Bundle URLs together with (or without) files.",
    steps: [
      "In the same upload box, paste a full http(s) URL instead of choosing a file.",
      "Mix files and links freely — they are all stored behind the same share URL.",
      "Each link is validated, so only real web addresses are accepted.",
    ],
  },
  {
    id: "share",
    title: "Share and reuse the link",
    summary: "One URL works everywhere, with no account needed.",
    steps: [
      "Copy the share URL with the copy button on the share page.",
      "Send it in a chat, an email, or a post — anyone who opens it can view and download.",
      "The same link keeps working indefinitely; there is no expiry.",
    ],
  },
  {
    id: "categories",
    title: "Understand file categories",
    summary: "Files are tagged automatically, with nothing to configure.",
    steps: [
      "Every file gets a category from its extension: Image, Video, Audio, Document, Archive, or Other.",
      "Open the Explore page and use the category rail to filter what you see.",
      "On a mixed share page, a filter bar lets you jump to just one type.",
    ],
  },
  {
    id: "limits",
    title: "Know the limits",
    summary: "The caps that keep the service fast and free.",
    steps: [
      "Up to 100 MB per file.",
      "Up to 50 files and 50 links in a single share.",
      "No account, no email, and no per-download limit.",
    ],
  },
  {
    id: "privacy",
    title: "Stay safe and private",
    summary: "Understand what is public before you upload.",
    steps: [
      "Unlisted shares are readable by anyone who has the link — treat the link like a password.",
      "Do not upload content you do not have the right to share.",
      "Cookies for analytics and ads can be accepted or declined from the consent banner at any time.",
    ],
  },
];

const faqs = [
  {
    q: "Do I need an account to use GSO?",
    a: "No. GSO has no sign-up, no email, and no password. Upload a file or paste a link and you immediately get a shareable URL.",
  },
  {
    q: "Is GSO really free?",
    a: "Yes. The service is free to use and supported by ads. You can share up to 50 files at a time, each up to 100 MB, with no hidden fees.",
  },
  {
    q: "How large can my files be?",
    a: "Each file can be up to 100 MB, and a single share can hold up to 50 files plus 50 links. Uploads go straight from your browser to storage, so they are not capped by a small request limit.",
  },
  {
    q: "Do share links expire?",
    a: "No. A share link keeps working until it is removed. There is no automatic expiration date.",
  },
  {
    q: "Can I edit or delete a share after uploading?",
    a: "Because there is no account, a share cannot be edited once it is created. To have a share removed, contact us with the link and we will delete it.",
  },
  {
    q: "Are my files private?",
    a: "Files are private only in the sense that the link is unlisted. Anyone who has the link can open and download the files, so do not share sensitive information.",
  },
  {
    q: "What kind of files can I upload?",
    a: "All common file types are supported — images, video, audio, documents, and archives. Files are categorized automatically by their extension.",
  },
  {
    q: "An upload failed or a link does not open — what should I do?",
    a: "Check the file is under 100 MB and that your connection is stable, then try again. If the problem continues, contact us with the share link and a short description and we will look into it.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HelpContent() {
  return (
    <div className="relative flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Support
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Help &amp; FAQ
          </h1>
          <p className="mt-4 text-lg text-muted">
            Everything you need to upload, share, and stay safe on GSO. Still
            stuck? The answer is probably below — and if not, we are one email
            away.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Help sections">
            {[
              { href: "#guides", label: "Guides" },
              { href: "#faq", label: "FAQ" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/12 px-4 py-1.5 text-sm text-muted transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Reveal>

        <section id="guides" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">
              Guides
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {guides.map((guide, index) => (
              <Reveal key={guide.id} delay={index * 50}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
                >
                  <h3 className="text-base font-medium">{guide.title}</h3>
                  <p className="mt-2 text-sm text-muted">{guide.summary}</p>
                  <ol className="mt-4 space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-3 text-sm text-muted">
                        <span className="mt-0.5 font-mono text-xs text-accent/80">
                          {String(stepIndex + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-16 scroll-mt-28">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-6 space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 50}>
                <details className="group rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-4 transition-colors open:border-accent/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-16 scroll-mt-28">
          <Reveal>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
            >
              <h2 className="text-base font-medium">Still need help?</h2>
              <p className="mt-2 text-sm text-muted">
                Send us the share link and a short description of the problem
                and we will get back to you.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent"
              >
                Contact us →
              </Link>
            </motion.div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
