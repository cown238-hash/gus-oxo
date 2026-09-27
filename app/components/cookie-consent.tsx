"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "gso_cookie_consent";

type ConsentState = "pending" | "accepted" | "declined";

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    return (localStorage.getItem(CONSENT_KEY) as ConsentState) ?? "pending";
  } catch {
    return "pending";
  }
}

export function useConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>("pending");

  useEffect(() => {
    setConsent(getConsent());
  }, []);

  return consent;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === "pending") setVisible(true);
  }, []);

  const decide = (state: ConsentState) => {
    try {
      localStorage.setItem(CONSENT_KEY, state);
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-2xl border border-white/12 bg-black/90 p-5 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและแสดงโฆษณา
          คุณสามารถเลือกยอมรับหรือปฏิเสธได้
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="h-9 rounded-full border border-white/15 px-5 text-sm transition-all hover:bg-white/5 active:scale-95"
          >
            ปฏิเสธ
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="h-9 rounded-full bg-accent px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
}
