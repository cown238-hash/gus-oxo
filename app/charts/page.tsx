import type { Metadata } from "next";
import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import ChartsContent from "./charts-content";

export const metadata: Metadata = {
  title: "Music Charts — GSO",
  description:
    "Top trending music charts — updated daily with the most popular tracks.",
};

export default function ChartsPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav={null} />
      <ChartsContent />
      <SiteFooter />
    </div>
  );
}