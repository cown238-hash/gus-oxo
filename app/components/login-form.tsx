"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Password form for /admin/login. */
export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data: { error?: string } = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 w-full max-w-sm">
      <label
        htmlFor="admin-password"
        className="block text-sm font-medium text-muted"
      >
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (error) setError(null);
        }}
        className="mt-2 h-11 w-full rounded-full border border-white/12 bg-black/40 px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent/50"
        placeholder="Your admin password"
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || password.length === 0}
        className="mt-5 h-11 w-full rounded-full bg-accent text-sm font-medium text-background shadow-[0_0_40px_-8px] shadow-accent transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
      >
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
