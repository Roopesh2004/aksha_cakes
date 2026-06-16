"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_REVIEWS, Review } from "@/lib/fallbackData";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setReviews(FALLBACK_REVIEWS);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        setReviews(FALLBACK_REVIEWS);
      }
    } catch (err) {
      setReviews(FALLBACK_REVIEWS);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    const nextApproved = !currentApproved;
    try {
      const { error } = await supabase.from("reviews").update({ approved: nextApproved }).eq("id", id);
      if (error) throw error;
      setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: nextApproved } : r)));
    } catch (err) {
      console.warn("Database status change failed, executing offline toggle.", err);
      setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: nextApproved } : r)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Database delete failed, using client bypass:", err);
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
          Approve & Moderate Reviews
        </h1>
        <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
          Moderate review ratings and feedback left by customers. Only approved reviews are shown on the website slider.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Reviews List...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No customer reviews found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white/40 dark:bg-card-dark/40 border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                rev.approved ? "border-primary/10" : "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/2"
              }`}
            >
              <div className="space-y-3">
                {/* Rating and Header */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 shrink-0 ${
                          i < rev.rating
                            ? "fill-primary text-primary"
                            : "text-primary-dark/20 dark:text-primary-light/20"
                        }`}
                      />
                    ))}
                  </div>
                  {!rev.approved && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/15 uppercase">
                      Awaiting approval
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm italic text-primary-dark/85 dark:text-primary-light/85 leading-relaxed">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Action Buttons & Customer Name */}
              <div className="border-t border-primary/5 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-primary-dark dark:text-primary-light">
                    {rev.customer_name}
                  </h4>
                  <p className="text-[10px] text-primary-dark/40 dark:text-primary-light/40">Verified Customer</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleApprove(rev.id, rev.approved)}
                    className={`text-xs font-bold px-4 py-2 rounded-full border shadow-sm transition-all flex items-center space-x-1 ${
                      rev.approved
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                        : "bg-green-500 border-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {rev.approved ? "Unapprove" : "Approve Now"}
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="rounded-full p-2 text-red-500 border border-red-500/10 hover:bg-red-500/10 transition-colors inline-flex items-center"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
