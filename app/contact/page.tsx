import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact us — GSO",
  description:
    "Get in touch with the GSO team — email, address, and support information.",
};

export default function ContactPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="contact" />
      <ContactContent />
      <SiteFooter />
    </div>
  );
}