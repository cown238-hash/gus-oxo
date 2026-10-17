import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { pageMetadata } from "@/app/lib/seo";
import HelpContent from "./help-content";

export const metadata = pageMetadata({
  title: "Help & FAQ — GSO",
  description:
    "Guides and answers to common questions about uploading, sharing, file limits, categories, privacy, and troubleshooting on GSO.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="help" />
      <HelpContent />
      <SiteFooter />
    </div>
  );
}
