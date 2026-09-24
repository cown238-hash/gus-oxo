"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Variant = "success" | "error";
type Toast = { id: number; message: string; variant: Variant };
type ToastFn = (message: string, variant?: Variant) => void;

const ToastContext = createContext<ToastFn | null>(null);

/**
 * Transient feedback ("Link copied", "Share deleted"). Form validation
 * errors deliberately stay inline next to their field instead.
 */
export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const toast = useCallback<ToastFn>((message, variant = "success") => {
    const id = ++nextId.current;
    // Keep at most three on screen; oldest falls off.
    setToasts((current) => [...current.slice(-2), { id, message, variant }]);
    timers.current.set(
      id,
      setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
        timers.current.delete(id);
      }, 3200),
    );
  }, []);

  // Clear any pending timers if the provider unmounts.
  useEffect(
    () => () => {
      for (const timer of timers.current.values()) clearTimeout(timer);
    },
    [],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`toast-in pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md ${
              item.variant === "success"
                ? "border-accent/40 bg-background/95 text-foreground"
                : "border-red-500/40 bg-background/95 text-red-400"
            }`}
          >
            <span
              aria-hidden
              className={
                item.variant === "success" ? "text-accent" : "text-red-400"
              }
            >
              {item.variant === "success" ? "✓" : "✕"}
            </span>
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
