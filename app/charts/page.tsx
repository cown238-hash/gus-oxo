import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { pageMetadata } from "@/app/lib/seo";
import ChartsContent from "./charts-content";

export const metadata = pageMetadata({
  title: "Music Charts — GSO",
  description:
    "Top trending music charts — updated daily with the most popular tracks.",
  path: "/charts",
});

export default function ChartsPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteHeader activeNav={null} />
      <ChartsContent />
      <SiteFooter />
    </div>
  );
}