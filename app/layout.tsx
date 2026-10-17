import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/toast";
import GoogleAnalytics from "./components/google-analytics";
import GoogleAdSense from "./components/google-adsense";
import CookieConsent from "./components/cookie-consent";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const adsenseAccount = process.env.NEXT_PUBLIC_ADSENSE_ID;
// Extra Google Search Console tokens (HTML-tag method), one per verified
// property. The first entry is the original property token; additional ones
// can be supplied through the environment without a code change.
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  // Canonical origin for the migrated domain: relative OG/canonical URLs
  // resolve against this, so they never fall back to the deployment host.
  metadataBase: new URL(SITE_URL),
  title: "GSO — Upload & share files and links",
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "file sharing",
    "upload files",
    "share links",
    "free file host",
    "GSO",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "GSO — Upload & share files and links",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "GSO — Upload & share files and links",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: [
      "e2zEu_Xq4SgJHnQdrK-ku_i_fqF-0YJfv3nInB2IZtM",
      ...(googleSiteVerification ? [googleSiteVerification] : []),
    ],
  },
  // AdSense ownership verification. Uses the same public publisher id as the
  // ad script so it can be rotated through one env var.
  other: {
    ...(adsenseAccount ? { "google-adsense-account": adsenseAccount } : {}),
  },
};

export const viewport = {
  themeColor: "#0a0a12",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ToastProvider>{children}</ToastProvider>
        <GoogleAnalytics />
        <GoogleAdSense />
        <CookieConsent />
      </body>
    </html>
  );
}
