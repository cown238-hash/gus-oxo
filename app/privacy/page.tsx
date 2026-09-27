import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import Reveal from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy — GSO",
  description:
    "Learn how GSO collects, uses, and protects your data. Your privacy matters to us.",
};

const sections = [
  {
    title: "1. Information we collect",
    content: [
      "Files you upload: We store files you share on our cloud storage solely for the purpose of providing the sharing service.",
      "Usage data: We collect anonymized analytics (page views, device type, approximate location) to improve the service.",
      "Cookies: We use cookies for analytics and advertising. You can decline cookies via our consent banner.",
    ],
  },
  {
    title: "2. How we use your information",
    content: [
      "To provide and maintain the sharing service.",
      "To analyze usage and improve performance.",
      "To display relevant advertisements (via Google AdSense).",
      "To detect and prevent abuse or illegal activity.",
    ],
  },
  {
    title: "3. Data retention",
    content: [
      "Shared files remain available until you delete them or they expire.",
      "Analytics data is retained for up to 14 months (Google Analytics default).",
      "You can request deletion of your data at any time by contacting us.",
    ],
  },
  {
    title: "4. Third-party services",
    content: [
      "Google Analytics 4 — anonymized usage statistics.",
      "Google AdSense — personalized and non-personalized advertising.",
      "Vercel Blob — file storage infrastructure.",
    ],
  },
  {
    title: "5. Your rights",
    content: [
      "Access: Request a copy of the data we hold about you.",
      "Deletion: Request removal of your data from our systems.",
      "Opt-out: Decline cookies and personalized advertising at any time.",
    ],
  },
  {
    title: "6. Contact",
    content: [
      "For privacy-related inquiries, email privacy@gso.app.",
      "We will respond to all requests within 30 days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="privacy" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted">
            Last updated: September 28, 2026
          </p>
        </Reveal>

        <div className="mt-10 space-y-8">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 60}>
              <section>
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
              </section>
            </Reveal>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
