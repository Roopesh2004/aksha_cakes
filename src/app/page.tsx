"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Sparkles, ShieldCheck, Truck, UtensilsCrossed, Gift, 
  Star, ChevronLeft, ChevronRight, MessageSquare, ArrowRight 
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  FALLBACK_CATEGORIES, FALLBACK_CAKES, FALLBACK_REVIEWS, FALLBACK_GALLERY,
  Category, Cake, Review, GalleryItem 
} from "@/lib/fallbackData";

// Helper component for count-up animation
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span className="font-serif text-4xl font-bold md:text-5xl text-primary">{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [featuredCakes, setFeaturedCakes] = useState<Cake[]>(FALLBACK_CAKES);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [gallery, setGallery] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(true);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data: dbCategories } = await supabase.from("categories").select("*");
        const { data: dbCakes } = await supabase.from("cakes").select("*").eq("featured", true).eq("available", true);
        const { data: dbReviews } = await supabase.from("reviews").select("*").eq("approved", true);
        const { data: dbGallery } = await supabase.from("gallery").select("*").limit(4);

        if (dbCategories && dbCategories.length > 0) setCategories(dbCategories);
        if (dbCakes && dbCakes.length > 0) setFeaturedCakes(dbCakes);
        if (dbReviews && dbReviews.length > 0) setReviews(dbReviews);
        if (dbGallery && dbGallery.length > 0) setGallery(dbGallery);
      } catch (err) {
        console.warn("Could not query Supabase, using fallback local mock data instead.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Review Slider Auto-play
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews]);

  const handlePrevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  // WhatsApp helper
  const getWhatsAppLink = (cakeName?: string) => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
    const msg = cakeName 
      ? `Hi Aksha Cakes, I would like to inquire about ordering the ${cakeName} cake.`
      : "Hi Aksha Cakes, I would like to inquire about your custom cakes!";
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-pastel-gradient dark:bg-none py-12 px-4 sm:px-6 lg:px-8">
        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-primary/20 blur-md animate-float" />
        <div className="absolute bottom-1/4 right-10 w-12 h-12 rounded-full bg-primary-soft/30 blur-md animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-primary-soft/40 blur-sm animate-pulse" />

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Premium Home Bakery</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-dark dark:text-primary-soft leading-tight">
              Handcrafted Eggless Cakes <br />
              <span className="text-primary">For Every Celebration</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-dark/80 dark:text-primary-light/80 max-w-xl mx-auto lg:mx-0">
              Freshly baked custom cakes made with premium ingredients and delivered with love. 100% vegetarian & pure bliss.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#20ba5a] transition-all hover:scale-105"
              >
                Order on WhatsApp
              </a>
              <Link
                href="/cakes"
                className="w-full sm:w-auto text-center rounded-full bg-white/80 dark:bg-card-dark/80 px-8 py-4 text-base font-bold text-primary-dark dark:text-primary-light border border-primary/20 shadow-md hover:bg-primary/5 transition-all hover:scale-105"
              >
                Browse Cakes
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center relative"
          >
            {/* Soft decorative background circles */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl w-72 h-72 sm:w-96 sm:h-96 m-auto -z-10" />
            
            <div className="relative aspect-square w-72 sm:w-[420px] md:w-[480px] lg:w-[500px] overflow-hidden drop-shadow-2xl animate-float">
              <Image
                src="/hero-cake.png"
                alt="Aksha Cakes Signature Flower Cake"
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CAKE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-dark dark:text-primary-soft">
            Explore Our Categories
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto text-sm md:text-base">
            Select a category to browse our delicious creations designed for your special day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/cakes?category=${category.slug}`}
                className="flex flex-col items-center bg-white/40 dark:bg-card-dark/40 border border-primary/10 hover:border-primary/45 rounded-2xl p-4 text-center transition-all hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="relative w-16 h-16 rounded-full bg-primary/10 overflow-hidden mb-3 group-hover:scale-110 transition-transform">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CAKES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-dark dark:text-primary-soft">
              Our Bestselling Cakes
            </h2>
            <p className="text-primary-dark/70 dark:text-primary-light/70 text-sm md:text-base">
              Handpicked favorite treats crafted to perfection.
            </p>
          </div>
          <Link
            href="/cakes"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary font-bold hover:underline"
          >
            <span>View All Cakes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCakes.slice(0, 3).map((cake, index) => (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                <Image
                  src={cake.image_url}
                  alt={cake.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {cake.flavor}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <h3 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors">
                  {cake.name}
                </h3>
                <p className="text-sm text-primary-dark/70 dark:text-primary-light/70 line-clamp-2 leading-relaxed">
                  {cake.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-primary-dark/50 dark:text-primary-light/50 font-semibold pt-1">
                  <span>Weight: {cake.weight}</span>
                  <span>100% Eggless</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/5 mt-auto">
                  <span className="text-2xl font-extrabold text-primary">
                    ₹{cake.price}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/cakes/${cake.slug}`}
                      className="text-xs font-bold border border-primary/20 text-primary-dark dark:text-primary-light px-3.5 py-2.5 rounded-full hover:bg-primary/5"
                    >
                      Details
                    </Link>
                    <a
                      href={getWhatsAppLink(cake.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-[#25D366] text-white px-3.5 py-2.5 rounded-full hover:bg-[#20ba5a] shadow-sm flex items-center space-x-1"
                    >
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-white/30 dark:bg-card-dark/20 py-16 border-y border-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-dark dark:text-primary-soft">
              Why Choose Aksha Cakes?
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto text-sm md:text-base">
              We focus on premium taste, hygiene, and outstanding designs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "100% Eggless", desc: "Our bakery is strictly vegetarian. We bake soft, premium, eggless cakes without compromising on texture." },
              { icon: Sparkles, title: "Custom Designs", desc: "From theme cakes to photo designs, we transform your dream ideas into cake masterworks." },
              { icon: UtensilsCrossed, title: "Fresh Ingredients", desc: "We bake fresh on order using finest chocolates, seasonal fresh fruits, and premium frostings." },
              { icon: ShieldCheck, title: "Premium Quality", desc: "No artificial chemical preservatives. Safe, clean, and delicious home-baked goodness." },
              { icon: Truck, title: "Midnight Delivery", desc: "Surprise your loved ones! We coordinate midnight deliveries within our delivery radius." },
              { icon: Gift, title: "Homemade with Love", desc: "Every order is carefully baked and styled by a passionate home chef who puts love in details." }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white dark:bg-card-dark border border-primary/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex space-x-4"
              >
                <div className="rounded-xl bg-primary/10 p-3 h-fit shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-dark/70 dark:text-primary-light/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 bg-pastel-gradient dark:bg-card-dark/40 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-primary/10 pb-6 sm:pb-0">
            <AnimatedCounter end={2500} suffix="+" />
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark/85 dark:text-primary-light/85">
              Cakes Delivered
            </p>
          </div>
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-primary/10 py-6 sm:py-0">
            <AnimatedCounter end={1800} suffix="+" />
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark/85 dark:text-primary-light/85">
              Happy Customers
            </p>
          </div>
          <div className="space-y-2 pt-6 sm:pt-0">
            <AnimatedCounter end={5} suffix="+" />
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark/85 dark:text-primary-light/85">
              Years of Experience
            </p>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-dark dark:text-primary-soft">
              Sweet Moments Gallery
            </h2>
            <p className="text-primary-dark/70 dark:text-primary-light/70 text-sm md:text-base">
              A glimpse of our delicious works of art.
            </p>
          </div>
          <Link
            href="/gallery"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary font-bold hover:underline"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative aspect-square rounded-2xl overflow-hidden group border border-primary/5 bg-primary/5"
            >
              <Image
                src={item.image_url}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <p className="text-white text-xs md:text-sm text-center font-medium">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center space-y-3 mb-10">
          <div className="flex justify-center text-primary mb-2">
            <MessageSquare className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary-dark dark:text-primary-soft">
            Love From Our Customers
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="relative bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-2xl p-8 md:p-12 shadow-sm text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Stars */}
              <div className="flex justify-center space-x-1">
                {Array.from({ length: reviews[currentReview]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-md md:text-lg italic text-primary-dark/85 dark:text-primary-light/85 leading-relaxed font-medium">
                &ldquo;{reviews[currentReview]?.review}&rdquo;
              </p>

              <div>
                <h4 className="font-serif text-base font-bold text-primary">
                  {reviews[currentReview]?.customer_name}
                </h4>
                <p className="text-xs text-primary-dark/50 dark:text-primary-light/50">Verified Order Customer</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          {reviews.length > 1 && (
            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                onClick={handlePrevReview}
                className="rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-xs font-bold text-primary-dark/40 dark:text-primary-light/40">
                {currentReview + 1} / {reviews.length}
              </span>
              <button
                onClick={handleNextReview}
                className="rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="relative rounded-3xl bg-premium-gradient px-8 py-12 md:py-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16" />

          <div className="relative max-w-2xl mx-auto space-y-6 z-10">
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to sweeten your next celebration?
            </h2>
            <p className="text-md md:text-lg text-white/80 max-w-xl mx-auto">
              Get in touch on WhatsApp to discuss custom designs, select flavors, choose weights, and lock in your order delivery.
            </p>
            <div className="pt-4 flex justify-center">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-8 py-4 text-base font-bold text-primary-dark shadow-lg hover:bg-primary-light transition-all hover:scale-105"
              >
                Inquire on WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Bakery",
            "name": "Aksha Cakes",
            "image": "https://akshacakes.vercel.app/hero-cake.png",
            "@id": "https://akshacakes.vercel.app/#bakery",
            "url": "https://akshacakes.vercel.app",
            "telephone": "+919999999999",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Premium Home Bakery Area",
              "addressLocality": "Mumbai",
              "addressRegion": "MH",
              "postalCode": "400001",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "09:00",
              "closes": "22:00"
            }
          })
        }}
      />
    </div>
  );
}
