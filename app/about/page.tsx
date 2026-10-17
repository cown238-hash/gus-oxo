import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About us — GSO",
  description:
    "Learn about GSO — a fast, no-account file and link sharing tool. Upload, share, browse.",
};

export default function AboutPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav="about" />
      <AboutContent />
      <SiteFooter />
    </div>
  );
}