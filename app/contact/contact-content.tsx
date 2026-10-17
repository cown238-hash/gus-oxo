"use client";

import { motion } from "motion/react";
import Reveal from "@/app/components/reveal";

const contactMethods = [
  {
    label: "Email",
    value: "cown238@gmail.com",
    href: "mailto:cown238@gmail.com",
  },
  {
    label: "Phone",
    value: "020-552-39450",
    href: "tel:02055239450",
  },
  {
    label: "Email",
    value: "motmouy1@gmail.com",
    href: "mailto:motmouy1@gmail.com",
  },
  {
    label: "Phone",
    value: "02077862082",
    href: "tel:02077862082",
  },
];

export default function ContactContent() {
  return (
    <div className="relative flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-muted">
            Have a question, suggestion, or just want to say hi? We would love
            to hear from you.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {contactMethods.map((method) => (
              <motion.a
                key={method.label}
                href={method.href}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  {method.label}
                </p>
                <p className="mt-2 text-base font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
          >
            <h2 className="text-base font-medium">Line</h2>
            <p className="mt-2 text-sm text-muted">
              @gso
            </p>
          </motion.div>
        </Reveal>

        <Reveal delay={300}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
          >
            <h2 className="text-base font-medium">Response time</h2>
            <p className="mt-2 text-sm text-muted">
              We typically reply within 1-2 business days. For urgent matters,
              please email cown238@gmail.com with &ldquo;URGENT&rdquo; in the
              subject line.
            </p>
          </motion.div>
        </Reveal>
      </main>
    </div>
  );
}