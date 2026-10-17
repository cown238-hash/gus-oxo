import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import PrivacyContent from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy — GSO",
  description:
    "Learn how GSO collects, uses, and protects your data. Your privacy matters to us.",
};

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="privacy" />
      <PrivacyContent />
      <SiteFooter />
    </div>
  );
}