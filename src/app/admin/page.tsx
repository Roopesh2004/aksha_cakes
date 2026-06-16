"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Cake, FolderKanban, Image as ImageIcon, MessageSquare, 
  MailOpen, ShieldAlert, ChevronRight, Clock, Star 
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  FALLBACK_CAKES, FALLBACK_CATEGORIES, FALLBACK_GALLERY, 
  FALLBACK_REVIEWS 
} from "@/lib/fallbackData";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    cakes: FALLBACK_CAKES.length,
    categories: FALLBACK_CATEGORIES.length,
    gallery: FALLBACK_GALLERY.length,
    reviews: FALLBACK_REVIEWS.length,
    enquiries: 3, // Mock fallback
  });

  const [pendingEnquiries, setPendingEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const localSession = localStorage.getItem("demo-admin-session");
        if (localSession === "true") {
          setIsDemo(true);
        }

        if (!isSupabaseConfigured) {
          setStats({
            cakes: FALLBACK_CAKES.length,
            categories: FALLBACK_CATEGORIES.length,
            gallery: FALLBACK_GALLERY.length,
            reviews: FALLBACK_REVIEWS.length,
            enquiries: 3,
          });
          setPendingEnquiries([
            {
              id: "enq-1",
              customer_name: "Sneha Sharma",
              phone: "9876543210",
              event_date: "2026-06-25",
              status: "Pending",
              created_at: new Date().toISOString(),
              cakes: { name: "Royal Chocolate Truffle" }
            },
            {
              id: "enq-2",
              customer_name: "Rohan Varma",
              phone: "9123456789",
              event_date: "2026-06-28",
              status: "Pending",
              created_at: new Date().toISOString(),
              cakes: { name: "Red Velvet Bliss" }
            }
          ]);
          setLoading(false);
          return;
        }

        const { count: cakeCount } = await supabase.from("cakes").select("*", { count: "exact", head: true });
        const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true });
        const { count: galleryCount } = await supabase.from("gallery").select("*", { count: "exact", head: true });
        const { count: reviewCount } = await supabase.from("reviews").select("*", { count: "exact", head: true });
        const { count: enquiryCount } = await supabase.from("enquiries").select("*", { count: "exact", head: true });
        
        // Fetch recent pending enquiries
        const { data: dbEnquiries } = await supabase
          .from("enquiries")
          .select("id, customer_name, phone, event_date, status, created_at, cakes(name)")
          .eq("status", "Pending")
          .order("created_at", { ascending: false })
          .limit(3);

        setStats({
          cakes: cakeCount !== null ? cakeCount : FALLBACK_CAKES.length,
          categories: categoryCount !== null ? categoryCount : FALLBACK_CATEGORIES.length,
          gallery: galleryCount !== null ? galleryCount : FALLBACK_GALLERY.length,
          reviews: reviewCount !== null ? reviewCount : FALLBACK_REVIEWS.length,
          enquiries: enquiryCount !== null ? enquiryCount : 3,
        });

        if (dbEnquiries && dbEnquiries.length > 0) {
          setPendingEnquiries(dbEnquiries);
        } else {
          // Mock some pending enquiries for demonstration
          setPendingEnquiries([
            {
              id: "enq-1",
              customer_name: "Sneha Sharma",
              phone: "9876543210",
              event_date: "2026-06-25",
              status: "Pending",
              created_at: new Date().toISOString(),
              cakes: { name: "Royal Chocolate Truffle" }
            },
            {
              id: "enq-2",
              customer_name: "Rohan Varma",
              phone: "9123456789",
              event_date: "2026-06-28",
              status: "Pending",
              created_at: new Date().toISOString(),
              cakes: { name: "Red Velvet Bliss" }
            }
          ]);
        }
      } catch (err) {
        console.warn("Error loading database stats, using offline info.", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
            Dashboard Overview
          </h1>
          <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
            Monitor and manage your bakery menu, reviews, and client enquiries.
          </p>
        </div>
        
        {isDemo && (
          <div className="inline-flex items-center space-x-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Viewing in Offline Demo Mode</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Gathering Metrics...</p>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Cakes", value: stats.cakes, path: "/admin/cakes", icon: Cake, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
              { label: "Categories", value: stats.categories, path: "/admin/categories", icon: FolderKanban, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
              { label: "Gallery Photos", value: stats.gallery, path: "/admin/gallery", icon: ImageIcon, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
              { label: "Total Reviews", value: stats.reviews, path: "/admin/reviews", icon: MessageSquare, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
              { label: "Enquiries", value: stats.enquiries, path: "/admin/enquiries", icon: MailOpen, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
            ].map((metric) => (
              <Link
                key={metric.label}
                href={metric.path}
                className="bg-white/40 dark:bg-card-dark/40 border border-primary/10 hover:border-primary/30 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl border ${metric.color}`}>
                    <metric.icon className="h-5 w-5 shrink-0" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary-dark/30 dark:text-primary-light/30 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div>
                  <p className="text-2xl font-black text-primary-dark dark:text-primary-light">
                    {metric.value}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary-dark/60 dark:text-primary-light/60">
                    {metric.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Detailed Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Pending Enquiries Teaser (7 cols) */}
            <div className="lg:col-span-8 bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <h2 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-soft">
                    Pending Cake Enquiries
                  </h2>
                </div>
                <Link
                  href="/admin/enquiries"
                  className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                >
                  <span>Manage All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {pendingEnquiries.length === 0 ? (
                <p className="text-sm text-primary-dark/60 dark:text-primary-light/60 py-6 text-center italic">
                  No pending enquiries. All clear!
                </p>
              ) : (
                <div className="divide-y divide-primary/5">
                  {pendingEnquiries.map((enq) => (
                    <div key={enq.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary-dark dark:text-primary-light">
                            {enq.customer_name}
                          </span>
                          <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-xs text-primary-dark/70 dark:text-primary-light/70">
                          Cake Selection: <strong className="text-primary">{enq.cakes?.name || "Custom Design"}</strong>
                        </p>
                        <p className="text-xs text-primary-dark/50 dark:text-primary-light/50">
                          Deliver by: {enq.event_date ? new Date(enq.event_date).toLocaleDateString() : "Flexible Date"}
                        </p>
                      </div>
                      <div className="flex space-x-2 sm:self-center">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#25D366] text-white px-4 py-2.5 rounded-full hover:bg-[#20ba5a] font-bold shadow-sm"
                        >
                          Chat WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Guidelines Panel (4 cols) */}
            <div className="lg:col-span-4 bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-3xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-soft border-b border-primary/5 pb-2">
                Bakery Actions Guide
              </h2>
              
              <ul className="space-y-3 text-xs text-primary-dark/85 dark:text-primary-light/85 leading-relaxed">
                <li>
                  <strong>Cakes Menu:</strong> Manage descriptions, weights, flavors, prices, and availability flags. Toggle "Featured" to display them on the homepage.
                </li>
                <li>
                  <strong>Categories:</strong> Add or modify groups like wedding, birthday, or custom cakes.
                </li>
                <li>
                  <strong>Enquiries:</strong> Contact customers directly on WhatsApp, then update statuses from Pending &rarr; Contacted &rarr; Completed.
                </li>
                <li>
                  <strong>Reviews:</strong> Approve customer submissions before they show up on the testimonial slider on the front page.
                </li>
              </ul>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
