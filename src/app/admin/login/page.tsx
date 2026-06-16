"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cake, Lock, Mail, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoNotice, setIsDemoNotice] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(false);
    setIsDemoNotice(false);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        // 1. Try Supabase Authenticated Login
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          // If Supabase is configured but user doesn't exist, check demo credentials bypass
          if (email === "admin@akshacakes.com" && password === "admin123") {
            localStorage.setItem("demo-admin-session", "true");
            setIsDemoNotice(true);
            setTimeout(() => {
              router.push("/admin");
            }, 1000);
            return;
          }
          throw authError;
        }

        // Successful Supabase Login
        router.push("/admin");
      } else {
        // Local fallback bypass if email matches local demo when Supabase is unconfigured
        if (email === "admin@akshacakes.com" && password === "admin123") {
          localStorage.setItem("demo-admin-session", "true");
          setIsDemoNotice(true);
          setTimeout(() => {
            router.push("/admin");
          }, 1000);
        } else {
          setError("Invalid login credentials. Double-check your email/password.");
        }
      }
    } catch (err: any) {
      // Local fallback bypass if email matches local demo
      if (email === "admin@akshacakes.com" && password === "admin123") {
        localStorage.setItem("demo-admin-session", "true");
        setIsDemoNotice(true);
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        setError(err.message || "Invalid login credentials. Double-check your email/password.");
      }
    } finally {
      if (!isDemoNotice) setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-pastel-gradient dark:bg-bg-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center space-x-2 text-primary-dark dark:text-primary-soft mb-6">
          <Cake className="h-10 w-10 text-primary" />
          <span className="font-serif text-3xl font-bold tracking-wide">
            Aksha <span className="text-primary">Cakes</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl font-extrabold leading-9 tracking-tight text-primary-dark dark:text-primary-soft font-serif">
          Admin Portal Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-md border border-primary/10 px-8 py-8 shadow-xl rounded-3xl space-y-6">
          
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 flex items-start space-x-2 font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isDemoNotice && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-600 dark:text-amber-400 flex items-start space-x-2 font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Supabase unconfigured. Logging into Offline Demo Mode...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-primary-light">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-primary-dark/40 dark:text-primary-light/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@akshacakes.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-primary-light">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-primary-dark/40 dark:text-primary-light/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Info */}
          <div className="border-t border-primary/5 pt-4 text-center">
            <p className="text-[10px] text-primary-dark/50 dark:text-primary-light/50 leading-relaxed">
              Demo bypass credentials: <br />
              <strong>admin@akshacakes.com</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center space-x-1 text-xs text-primary font-bold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to main website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
