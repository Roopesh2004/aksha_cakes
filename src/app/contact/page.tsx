"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  CheckCircle, AlertTriangle, Send, Loader2 
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_CAKES, Cake } from "@/lib/fallbackData";

// Zod Validation Schema
const enquirySchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Invalid phone number format"),
  cakeId: z.string().min(1, "Please select a cake or custom enquiry option"),
  eventDate: z.string().refine((val) => {
    if (!val) return true;
    return new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0));
  }, "Event date cannot be in the past"),
  message: z.string().min(5, "Inquiry message must be at least 5 characters"),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export default function ContactPage() {
  const [cakes, setCakes] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      customerName: "",
      phone: "",
      cakeId: "custom", // default selection
      eventDate: "",
      message: "",
    },
  });

  // Fetch active cakes for dropdown selection
  useEffect(() => {
    async function loadCakes() {
      if (!isSupabaseConfigured) {
        setCakes(FALLBACK_CAKES.map((c) => ({ id: c.id, name: c.name })));
        return;
      }
      try {
        const { data } = await supabase.from("cakes").select("id, name").eq("available", true);
        if (data && data.length > 0) {
          setCakes(data);
        } else {
          // Map from fallback cakes
          setCakes(FALLBACK_CAKES.map((c) => ({ id: c.id, name: c.name })));
        }
      } catch (err) {
        setCakes(FALLBACK_CAKES.map((c) => ({ id: c.id, name: c.name })));
      }
    }
    loadCakes();
  }, []);

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured");
      }
      const dbCakeId = data.cakeId === "custom" ? null : data.cakeId;

      const { error } = await supabase.from("enquiries").insert({
        customer_name: data.customerName,
        phone: data.phone,
        cake_id: dbCakeId,
        message: data.message,
        event_date: data.eventDate || null,
        status: "Pending",
      });

      if (error) throw error;
      
      setSubmitStatus("success");
      reset(); // Clear form
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      // Even if database submit fails due to missing keys, we will allow it to fail gracefully
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
          Contact Aksha Cakes
        </h1>
        <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto">
          Have questions or want to plan a custom design? Drop us a line.
        </p>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-3xl p-6 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-primary-dark dark:text-primary-soft">
              Bakery Details
            </h2>

            <ul className="space-y-4 text-sm text-primary-dark/80 dark:text-primary-light/80">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>11/224-A, Eluru Rd, opposite to Bommarillu Theatre, Loyaada, Gudivada, Andhra Pradesh 521301</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 73373 35674 (Inquiries & WhatsApp)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>orders@akshacakes.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Daily Baking Hours:</p>
                  <p className="text-xs">Monday - Sunday: 9:00 AM - 10:00 PM</p>
                </div>
              </li>
            </ul>

            {/* Google Map Iframe Placeholder */}
            <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-primary/5 shadow-inner">
              <iframe
                title="Aksha Cakes Location Map"
                src="https://maps.google.com/maps?q=Aksha%20Eggless%20Cakes,%20Gudivada&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right: Enquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-3xl p-6 md:p-8">
          <div className="space-y-2 mb-6">
            <h2 className="font-serif text-2xl font-bold text-primary-dark dark:text-primary-soft">
              Cake Inquiry Form
            </h2>
            <p className="text-xs md:text-sm text-primary-dark/70 dark:text-primary-light/70">
              Submit your inquiry details below. We will review and contact you shortly.
            </p>
          </div>

          {/* Submission Feedback */}
          {submitStatus === "success" && (
            <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-600 dark:text-green-400 flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Enquiry Submitted Successfully!</p>
                <p className="text-xs mt-1">We have logged your cake inquiry in our kitchen list. We will contact you shortly.</p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-400 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Submission Error</p>
                <p className="text-xs mt-1">We could not connect to our server. Please ensure your environment settings are valid, or message us directly on WhatsApp!</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light">
                Your Full Name:
              </label>
              <input
                type="text"
                placeholder="e.g., Sneha Sharma"
                {...register("customerName")}
                className={`w-full px-4 py-3 rounded-xl border bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all ${
                  errors.customerName ? "border-red-400 focus:border-red-400" : "border-primary/10"
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-red-400 font-semibold">{errors.customerName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary-dark dark:text-primary-light">
                  Phone / WhatsApp Number:
                </label>
                <input
                  type="tel"
                  placeholder="e.g., 9999999999"
                  {...register("phone")}
                  className={`w-full px-4 py-3 rounded-xl border bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all ${
                    errors.phone ? "border-red-400 focus:border-red-400" : "border-primary/10"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary-dark dark:text-primary-light">
                  Delivery / Event Date:
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("eventDate")}
                  className={`w-full px-4 py-3 rounded-xl border bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all cursor-pointer text-primary-dark/80 dark:text-primary-light/80 ${
                    errors.eventDate ? "border-red-400 focus:border-red-400" : "border-primary/10"
                  }`}
                />
                {errors.eventDate && (
                  <p className="text-xs text-red-400 font-semibold">{errors.eventDate.message}</p>
                )}
              </div>
            </div>

            {/* Cake Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light">
                Which cake are you inquiring about?
              </label>
              <select
                {...register("cakeId")}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all text-primary-dark/80 dark:text-primary-light/80 cursor-pointer"
              >
                <option value="custom">General Custom Cake Inquiry</option>
                {cakes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light">
                Message / Design Requirements:
              </label>
              <textarea
                rows={4}
                placeholder="Mention flavor preferences, design specifications, delivery address, or general questions..."
                {...register("message")}
                className={`w-full px-4 py-3 rounded-xl border bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all ${
                  errors.message ? "border-red-400 focus:border-red-400" : "border-primary/10"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-400 font-semibold">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary text-white py-4 text-sm font-bold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Inquiry Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
