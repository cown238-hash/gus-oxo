import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import Reveal from "@/app/components/reveal";

export const metadata: Metadata = {
  title: "Contact us — GSO",
  description:
    "Get in touch with the GSO team — email, address, and support information.",
};

const contactMethods = [
  {
    label: "Email",
    value: "support@gso.app",
    href: "mailto:support@gso.app",
  },
  {
    label: "Support",
    value: "help@gso.app",
    href: "mailto:help@gso.app",
  },
  {
    label: "Business",
    value: "hello@gso.app",
    href: "mailto:hello@gso.app",
  },
];

export default function ContactPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="contact" />

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
              <a
                key={method.label}
                href={method.href}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-accent/40"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  {method.label}
                </p>
                <p className="mt-2 text-base font-medium">{method.value}</p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="text-base font-medium">Office</h2>
            <p className="mt-2 text-sm text-muted">
              123 Sukhumvit Road, Klongtoey
              <br />
              Bangkok 10110, Thailand
            </p>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="text-base font-medium">Response time</h2>
            <p className="mt-2 text-sm text-muted">
              We typically reply within 1-2 business days. For urgent matters,
              please email support@gso.app with &quot;URGENT&quot; in the
              subject line.
            </p>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
