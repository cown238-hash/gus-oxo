"use client";

import Script from "next/script";
import { useConsent } from "./cookie-consent";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function GoogleAdSense() {
  const consent = useConsent();

  if (!ADSENSE_ID || consent !== "accepted") return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
    />
  );
}
