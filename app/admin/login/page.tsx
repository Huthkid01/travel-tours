"use client";

import { BRAND, SITE_CONFIG } from "@/lib/constants";
import { Eye, EyeOff, Loader2, Lock, Mail, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Login failed");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_#fdf8ef_0%,_#f4f7fb_45%,_#e8eef6_100%)] px-4 py-12 dark:bg-[radial-gradient(ellipse_at_top,_#1a2744_0%,_#0f1729_55%,_#0a0f1a_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(201, 138, 42, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56, 92, 135, 0.12) 0%, transparent 45%)",
        }}
      />

      <div className="relative z-10 mb-8 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-gold-200/60 dark:bg-navy-900 dark:ring-gold-500/20">
          <Image
            src="/branding/logo.png"
            alt={BRAND.name}
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
            priority
          />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
          {BRAND.short.toUpperCase()}
        </h1>
        <p className="mt-1 text-sm font-medium text-navy-500 dark:text-navy-400">
          Admin Dashboard Access
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/80 bg-white/95 p-8 shadow-xl shadow-navy-900/8 backdrop-blur-sm dark:border-navy-700/60 dark:bg-navy-900/90 dark:shadow-black/40 sm:p-10">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-4 py-1.5 text-xs font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
              <Shield className="h-3.5 w-3.5 text-gold-600" />
              Secure Admin Access
            </span>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-navy-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter your admin email"
                  className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-4 text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25 dark:border-navy-600 dark:bg-navy-950 dark:text-white dark:placeholder:text-navy-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-navy-200">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-navy-200 bg-white py-3 pl-11 pr-12 text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25 dark:border-navy-600 dark:bg-navy-950 dark:text-white dark:placeholder:text-navy-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-navy-400 hover:text-navy-700 dark:hover:text-navy-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-bold text-white shadow-md shadow-gold-600/25 transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 border-t border-navy-100 pt-6 text-center dark:border-navy-700">
            <p className="text-xs leading-relaxed text-navy-500 dark:text-navy-400">
              Authorized personnel only. All access is monitored and logged.
            </p>
            <p className="mt-2 text-xs text-navy-400 dark:text-navy-500">
              Support ·{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="font-medium text-gold-600 hover:text-gold-700 dark:text-gold-400"
              >
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-navy-500 transition hover:text-gold-600 dark:text-navy-400 dark:hover:text-gold-400"
          >
            ← Back to public website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-navy-500 dark:bg-navy-950">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
