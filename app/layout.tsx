import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/toast";
import GoogleAnalytics from "./components/google-analytics";
import GoogleAdSense from "./components/google-adsense";
import CookieConsent from "./components/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSO — Upload & share files and links",
  description:
    "Drop a file or paste a link, get one shareable URL in seconds — or browse what others shared on the Explore page. Fast, no account required.",
  verification: {
    google: "e2zEu_Xq4SgJHnQdrK-ku_i_fqF-0YJfv3nInB2IZtM",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
        <GoogleAnalytics />
        <GoogleAdSense />
        <CookieConsent />
      </body>
    </html>
  );
}
