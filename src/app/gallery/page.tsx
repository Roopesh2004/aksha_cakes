"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_GALLERY, GalleryItem } from "@/lib/fallbackData";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data: dbGal } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
        if (dbGal && dbGal.length > 0) {
          setGalleryItems(dbGal);
        }
      } catch (err) {
        console.warn("Could not query Supabase gallery, using fallback local mock data.", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % galleryItems.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
          Our Sweet Creations Gallery
        </h1>
        <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto">
          A visual showcase of custom eggless birthday, anniversary, and wedding cakes baked in our kitchen.
        </p>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Gallery...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No gallery images found. Check back later!
          </p>
        </div>
      ) : (
        /* Pinterest Masonry Layout */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
              onClick={() => openLightbox(index)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden border border-primary/10 bg-white/40 dark:bg-card-dark/40 shadow-sm cursor-zoom-in group select-none"
            >
              <div className="relative w-full h-auto min-h-[200px] overflow-hidden bg-primary/5">
                <img
                  src={item.image_url}
                  alt={item.caption || "Aksha Cakes Creation"}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-white">
                    <p className="text-sm font-semibold truncate pr-4">{item.caption || "Cake Design"}</p>
                    <ZoomIn className="h-5 w-5 shrink-0" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-55 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-55 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous Image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Image and Caption Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
              className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative w-full max-h-[75vh] aspect-auto flex justify-center items-center">
                <img
                  src={galleryItems[lightboxIndex].image_url}
                  alt={galleryItems[lightboxIndex].caption || "Cake Design"}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/5"
                />
              </div>

              {galleryItems[lightboxIndex].caption && (
                <div className="text-center max-w-xl bg-white/10 dark:bg-black/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10">
                  <p className="text-white text-sm font-medium">
                    {galleryItems[lightboxIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Right navigation */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-55 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              aria-label="Next Image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
