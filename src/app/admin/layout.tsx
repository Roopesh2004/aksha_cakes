"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Cake, LayoutDashboard, FolderKanban, Image as ImageIcon, 
  MessageSquare, MailOpen, LogOut, ChevronRight, Menu, X, ArrowLeft
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const adminNavItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Cakes", path: "/admin/cakes", icon: Cake },
  { name: "Categories", path: "/admin/categories", icon: FolderKanban },
  { name: "Gallery", path: "/admin/gallery", icon: ImageIcon },
  { name: "Reviews", path: "/admin/reviews", icon: MessageSquare },
  { name: "Enquiries", path: "/admin/enquiries", icon: MailOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip auth check for login page itself
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthorized(false);
      return;
    }

    async function checkSession() {
      // Local fallback bypass if Supabase is unconfigured
      if (!isSupabaseConfigured) {
        const localSession = localStorage.getItem("demo-admin-session");
        if (localSession === "true") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push("/admin/login");
        }
        setChecking(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localSession = localStorage.getItem("demo-admin-session");

        if (session || localSession === "true") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push("/admin/login");
        }
      } catch (err) {
        // Fallback to checking local demo storage on failure
        const localSession = localStorage.getItem("demo-admin-session");
        if (localSession === "true") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push("/admin/login");
        }
      } finally {
        setChecking(false);
      }
    }

    checkSession();
  }, [pathname, router]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignore error
      }
    }
    localStorage.removeItem("demo-admin-session");
    router.push("/admin/login");
  };

  // If loading authentication state
  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-light dark:bg-bg-dark">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="text-sm font-semibold text-primary-dark/70 dark:text-primary-light/70">
            Checking credentials...
          </span>
        </div>
      </div>
    );
  }

  // If login page, bypass template
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Redirecting state
  if (!authorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      
      {/* 1. Mobile Sidebar Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-card-dark border-b border-primary/10 flex items-center justify-between px-4 z-30">
        <Link href="/" className="flex items-center space-x-1.5 text-primary-dark dark:text-primary-soft group">
          <div className="relative h-6 w-6 overflow-hidden rounded-full border border-primary/20 bg-white flex items-center justify-center shadow-sm">
            <Image
              src="/logo.png"
              alt="Aksha Cakes Logo"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="font-serif text-lg font-bold tracking-wide">Aksha Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-1.5 border border-primary/20 text-primary-dark dark:text-primary-light"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 2. Left Sidebar Navigation Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-card-dark border-r border-primary/10 flex flex-col justify-between p-6 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8 mt-10 lg:mt-0">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-primary-dark dark:text-primary-soft group">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-primary/20 bg-white flex items-center justify-center shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Aksha Cakes Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl font-bold tracking-wide">
                Aksha <span className="text-primary text-sm font-sans block uppercase font-bold tracking-widest">Admin Panel</span>
              </span>
            </Link>
            <button className="lg:hidden text-primary-dark/60" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-primary-dark/80 dark:text-primary-light/80 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-primary/5">
          <Link
            href="/"
            className="flex items-center space-x-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Dashboard Content Slot */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 lg:p-10 pt-20 lg:pt-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile backdrop shadow */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-35 bg-black/40 backdrop-blur-sm"
        />
      )}
    </div>
  );
}
