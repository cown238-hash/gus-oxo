"use client";

import { motion } from "motion/react";
import Reveal from "@/app/components/reveal";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Files you upload: We store files you share on our cloud storage solely for the purpose of providing the sharing service. Files are stored until you delete them or an admin removes them.",
      "Usage data: We collect anonymized analytics (page views, device type, approximate location) to improve the service. This data cannot be used to identify you personally.",
      "Cookies: We use cookies for analytics and advertising. You can decline cookies via our consent banner at any time.",
      "Log data: Our servers automatically collect standard log data (IP address, browser type, timestamps) for security and debugging purposes.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To provide and maintain the sharing service — storing, processing, and delivering your files and links.",
      "To analyze usage patterns and improve performance, reliability, and user experience.",
      "To display relevant advertisements via Google AdSense (personalized or non-personalized, depending on your consent).",
      "To detect, prevent, and address abuse, fraud, or illegal activity on the platform.",
      "To comply with legal obligations and enforce our terms of service.",
    ],
  },
  {
    title: "3. Data Retention",
    content: [
      "Shared files remain available indefinitely until you delete them or an admin removes them. There is no automatic expiration on share links.",
      "Analytics data is retained for up to 14 months (Google Analytics default retention period).",
      "Log data is retained for a maximum of 30 days before being automatically purged.",
      "You can request deletion of your data at any time by contacting us — see section 6.",
    ],
  },
  {
    title: "4. Third-Party Services",
    content: [
      "Google Analytics 4 — anonymized usage statistics to understand how the service is used.",
      "Google AdSense — personalized and non-personalized advertising based on your consent preferences.",
      "Vercel Blob — secure file storage infrastructure. Files are stored in encrypted cloud storage.",
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "All data transmission is encrypted using TLS/SSL (HTTPS).",
      "Files are stored in encrypted cloud storage with access restricted to authorized personnel only.",
      "Admin access is protected by signed, HTTP-only session cookies with a 7-day expiry.",
      "We regularly review our security practices to protect against unauthorized access, alteration, or destruction of data.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "Access: Request a copy of the data we hold about you.",
      "Deletion: Request removal of your data from our systems at any time.",
      "Opt-out: Decline cookies and personalized advertising at any time via the consent banner.",
      "Portability: Request your data in a commonly used, machine-readable format.",
      "Complain: Lodge a complaint with a supervisory authority if you believe your rights have been violated.",
    ],
  },
  {
    title: "7. Children's Privacy",
    content: [
      "GSO is not directed at children under the age of 13. We do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal information, please contact us and we will promptly delete it.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.",
      "You are advised to review this privacy policy periodically for any changes. Changes are effective immediately upon posting.",
    ],
  },
  {
    title: "9. Contact Us",
    content: [
      "For privacy-related inquiries, email cown238@gmail.com or motmouy1@gmail.com.",
      "For urgent matters, call 020-552-39450 or 02077862082.",
      "We will respond to all requests within 30 days.",
    ],
  },
];

export default function PrivacyContent() {
  return (
    <div className="relative flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted">
            Last updated: September 30, 2026
          </p>
        </Reveal>

        <div className="mt-10 space-y-6">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 60}>
              <motion.section
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-accent/40 hover:shadow-[0_20px_60px_-30px] hover:shadow-accent/50"
              >
                <h2 className="text-lg font-medium">{section.title}</h2>
                <ul className="mt-3 space-y-2">
                  {section.content.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.section>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}