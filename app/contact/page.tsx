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
    value: "cown238@gmail.com",
    href: "mailto:cown238@gmail.com",
  },
  {
    label: "Phone",
    value: "020-552-39450",
    href: "tel:02055239450",
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
            <h2 className="text-base font-medium">Line</h2>
            <p className="mt-2 text-sm text-muted">
              @gso
            </p>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="text-base font-medium">Response time</h2>
            <p className="mt-2 text-sm text-muted">
              We typically reply within 1-2 business days. For urgent matters,
              please email cown238@gmail.com with &quot;URGENT&quot; in the
              subject line.
            </p>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
