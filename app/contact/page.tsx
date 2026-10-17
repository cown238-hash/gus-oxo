import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { pageMetadata } from "@/app/lib/seo";
import ContactContent from "./contact-content";

export const metadata = pageMetadata({
  title: "Contact us — GSO",
  description:
    "Get in touch with the GSO team — email and support information.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="contact" />
      <ContactContent />
      <SiteFooter />
    </div>
  );
}