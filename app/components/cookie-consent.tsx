"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";

const CONSENT_KEY = "gso_cookie_consent";
const CONSENT_EVENT = "gso-consent-change";

type ConsentState = "pending" | "accepted" | "declined";

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    return (localStorage.getItem(CONSENT_KEY) as ConsentState) ?? "pending";
  } catch {
    return "pending";
  }
}

/** localStorage is an external system: subscribe to it (plus our own change
 *  event, since same-tab writes don't fire "storage") and read through a
 *  snapshot instead of copying into state from an effect. */
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

const getServerConsent = () => "pending" as ConsentState;

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getConsent, getServerConsent);
}

export default function CookieConsent() {
  const consent = useConsent();
  const [dismissed, setDismissed] = useState(false);
  const visible = consent === "pending" && !dismissed;

  const decide = (state: ConsentState) => {
    try {
      localStorage.setItem(CONSENT_KEY, state);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-2xl border border-white/12 bg-black/90 p-5 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center">
            <p className="text-sm text-muted">
              เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและแสดงโฆษณา
              คุณสามารถเลือกยอมรับหรือปฏิเสธได้
            </p>
            <div className="flex shrink-0 gap-2">
              <motion.button
                type="button"
                onClick={() => decide("declined")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="h-9 rounded-full border border-white/15 px-5 text-sm transition-all hover:bg-white/5"
              >
                ปฏิเสธ
              </motion.button>
              <motion.button
                type="button"
                onClick={() => decide("accepted")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="h-9 rounded-full bg-accent px-5 text-sm font-medium text-background"
              >
                ยอมรับ
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
