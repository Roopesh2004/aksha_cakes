"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { 
  Heart, Sparkles, ShieldCheck, Truck, UtensilsCrossed, Gift, 
  Star, ChevronLeft, ChevronRight, MessageSquare, ArrowRight, Clock 
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

  return (
    <span className="font-serif text-4xl font-extrabold md:text-5xl text-primary drop-shadow-sm">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Stagger parent animation config
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

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

  const getWhatsAppLink = (cakeName?: string) => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
    const msg = cakeName 
      ? `Hi Aksha Cakes, I would like to inquire about ordering the ${cakeName} cake.`
      : "Hi Aksha Cakes, I would like to inquire about your custom cakes!";
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-24 pb-24 bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CAKE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient backglow */}
        <div className="ambient-glow ambient-glow-rose absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 opacity-20 pointer-events-none" />
        
        <div className="text-center space-y-3 mb-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-extrabold text-primary-dark dark:text-primary-soft"
          >
            Explore Our Sweet Collections
          </motion.h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto text-sm md:text-base font-medium">
            Choose a flavor design or celebration theme category below.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
            >
              <Link
                href={`/cakes?category=${category.slug}`}
                className="flex flex-col items-center premium-glass-card rounded-2xl p-5 text-center transition-colors group cursor-pointer h-full justify-between"
              >
                <div className="relative w-20 h-20 rounded-full border border-primary/10 overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors tracking-wide leading-tight mt-1">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. FEATURED CAKES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient backglow */}
        <div className="ambient-glow ambient-glow-dark-rose absolute top-12 left-10 w-[500px] h-[500px] opacity-15 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 relative z-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
              Our Bestselling Masterpieces
            </h2>
            <p className="text-primary-dark/70 dark:text-primary-light/70 text-sm md:text-base font-medium">
              Handpicked favorite treats crafted to sweet perfection.
            </p>
          </div>
          <Link
            href="/cakes"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary font-bold hover:underline transition-all hover:translate-x-1"
          >
            <span>View All Cakes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredCakes.slice(0, 3).map((cake) => (
            <motion.div
              key={cake.id}
              variants={fadeInUp}
              className="group flex flex-col premium-glass-card hover-lift rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-primary/5 border-b border-primary/5">
                <Image
                  src={cake.image_url}
                  alt={cake.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {cake.flavor}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors">
                    {cake.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-dark/50 dark:text-primary-light/50">100% Vegetarian & Eggless</p>
                </div>
                <p className="text-sm text-primary-dark/70 dark:text-primary-light/70 line-clamp-2 leading-relaxed font-medium">
                  {cake.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-primary-dark/60 dark:text-primary-light/60 font-bold pt-1">
                  <span>Weight: {cake.weight}</span>
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <span className="inline-block w-2.5 h-2.5 border border-green-600 rounded-sm bg-green-600/20" />
                    <span>Pure Vegetarian</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/10 mt-auto">
                  <span className="text-2xl font-extrabold text-primary">
                    ₹{cake.price}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/cakes/${cake.slug}`}
                      className="text-xs font-bold border border-primary/20 text-primary-dark dark:text-primary-light px-4 py-2.5 rounded-full hover:bg-primary/5 transition-colors"
                    >
                      Details
                    </Link>
                    <a
                      href={getWhatsAppLink(cake.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-[#25D366] text-white px-4 py-2.5 rounded-full hover:bg-[#20ba5a] shadow-md flex items-center space-x-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. WHY CHOOSE US (Bento Grid Style) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
            Crafting Premium Cakes
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto text-sm md:text-base font-medium">
            We focus on premium gourmet taste, pristine hygiene, and custom artistic details.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          
          {/* Card 1: 100% Eggless (Col span 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center space-x-4">
              <div className="rounded-2xl bg-green-500/10 p-3 h-fit shrink-0 text-green-600">
                <Heart className="h-7 w-7 fill-green-600/20" />
              </div>
              <h3 className="font-serif text-xl font-extrabold text-primary-dark dark:text-primary-light">
                100% Strict Eggless Purity
              </h3>
            </div>
            <p className="text-sm md:text-base text-primary-dark/80 dark:text-primary-light/80 leading-relaxed font-medium mt-4">
              Our home bakery is strictly vegetarian. We use specialized, secret recipes to achieve a soft, moist, and luxurious sponge texture without compromise.
            </p>
            <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-2 flex items-center space-x-1">
              <span className="w-2.5 h-2.5 border border-green-600 rounded-sm bg-green-600/30" />
              <span>100% Vegetarian Approved Kitchen</span>
            </div>
          </motion.div>

          {/* Card 2: Custom Designs (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-1 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-primary/10 p-3 h-fit shrink-0 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light">
                Theme Masterworks
              </h3>
            </div>
            <p className="text-xs md:text-sm text-primary-dark/75 dark:text-primary-light/75 leading-relaxed font-medium mt-2">
              From sophisticated flower designs to intricate custom theme cakes, we transform your dream visual ideas into cake art.
            </p>
            <span className="text-xs font-extrabold text-primary mt-4">Custom Moldings & Piping</span>
          </motion.div>

          {/* Card 3: Fresh Ingredients (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-1 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-orange-500/10 p-3 h-fit shrink-0 text-orange-500">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light">
                Gourmet Sourcing
              </h3>
            </div>
            <p className="text-xs md:text-sm text-primary-dark/75 dark:text-primary-light/75 leading-relaxed font-medium mt-2">
              Baked freshly to order using only pure couverture chocolates, real dairy cream, and hand-selected fresh fruits.
            </p>
            <span className="text-xs font-extrabold text-orange-500 mt-4">Zero Preservatives</span>
          </motion.div>

          {/* Card 4: Quality & Care (Col span 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center space-x-4">
              <div className="rounded-2xl bg-blue-500/10 p-3 h-fit shrink-0 text-blue-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-extrabold text-primary-dark dark:text-primary-light">
                Hygiene & Premium Standards
              </h3>
            </div>
            <p className="text-sm md:text-base text-primary-dark/80 dark:text-primary-light/80 leading-relaxed font-medium mt-4">
              Baked in a completely clean, sanitized home kitchen with extreme focus on quality checks. We put safety, health, and fresh quality above all.
            </p>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 flex items-center space-x-1.5">
              <span>Sanitized Baking Process</span>
            </div>
          </motion.div>

          {/* Card 5: Midnight Delivery (Col span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-1 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10"
          >
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-indigo-500/10 p-3 h-fit shrink-0 text-indigo-500">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light">
                Timely Celebrations
              </h3>
            </div>
            <p className="text-xs md:text-sm text-primary-dark/75 dark:text-primary-light/75 leading-relaxed font-medium mt-2">
              Coordinate custom delivery hours, including midnight dispatch, to create magical birthday and anniversary surprises.
            </p>
            <span className="text-xs font-extrabold text-indigo-500 mt-4">Midnight Surprise Delivery</span>
          </motion.div>

          {/* Card 6: Homemade Love (Col span 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 premium-glass-card rounded-3xl p-8 flex flex-col justify-between hover-lift border border-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center space-x-4">
              <div className="rounded-2xl bg-pink-500/10 p-3 h-fit shrink-0 text-pink-500">
                <Gift className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-xl font-extrabold text-primary-dark dark:text-primary-light">
                Homemade Personal Touch
              </h3>
            </div>
            <p className="text-sm md:text-base text-primary-dark/80 dark:text-primary-light/80 leading-relaxed font-medium mt-4">
              Every celebration order receives the personal attention of a passionate home baker. No mass commercial production—just handcrafted love.
            </p>
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-2">
              <span>Crafted Individually with Care</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 premium-glass-card rounded-3xl p-8 md:p-12 border border-primary/15 shadow-lg">
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-primary/10 pb-6 sm:pb-0">
            <AnimatedCounter end={2500} suffix="+" />
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-dark/80 dark:text-primary-light/80">
              Cakes Delivered
            </p>
          </div>
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-primary/10 py-6 sm:py-0">
            <AnimatedCounter end={1800} suffix="+" />
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-dark/80 dark:text-primary-light/80">
              Happy Customers
            </p>
          </div>
          <div className="space-y-2 pt-6 sm:pt-0">
            <AnimatedCounter end={5} suffix="+" />
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-dark/80 dark:text-primary-light/80">
              Years of Experience
            </p>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
              Sweet Moments Gallery
            </h2>
            <p className="text-primary-dark/70 dark:text-primary-light/70 text-sm md:text-base font-medium">
              A glimpse of our delicious works of art.
            </p>
          </div>
          <Link
            href="/gallery"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary font-bold hover:underline transition-all hover:translate-x-1"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="relative aspect-square rounded-2xl overflow-hidden group border border-primary/5 bg-primary/5 shadow-sm cursor-pointer"
            >
              <Image
                src={item.image_url}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <p className="text-white text-xs md:text-sm text-center font-bold tracking-wide">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="mx-auto max-w-3xl px-4">
        <div className="text-center space-y-3 mb-10">
          <div className="flex justify-center text-primary mb-2">
            <MessageSquare className="h-8 w-8 text-primary/80 animate-bounce" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
            Love From Our Customers
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="relative premium-glass-card rounded-3xl p-8 md:p-12 shadow-md text-center border border-primary/10 overflow-hidden">
          <div className="absolute top-4 left-6 text-7xl font-serif text-primary/10 select-none pointer-events-none">&ldquo;</div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 relative z-10"
            >
              {/* Stars */}
              <div className="flex justify-center space-x-1">
                {Array.from({ length: reviews[currentReview]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-md md:text-lg italic text-primary-dark/85 dark:text-primary-light/85 leading-relaxed font-bold">
                &ldquo;{reviews[currentReview]?.review}&rdquo;
              </p>

              <div>
                <h4 className="font-serif text-base font-bold text-primary">
                  {reviews[currentReview]?.customer_name}
                </h4>
                <p className="text-xs text-primary-dark/50 dark:text-primary-light/50 font-bold uppercase tracking-wider mt-0.5">Verified Order Customer</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          {reviews.length > 1 && (
            <div className="flex justify-center items-center space-x-6 mt-8 relative z-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevReview}
                className="rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <span className="text-xs font-bold text-primary-dark/40 dark:text-primary-light/40">
                {currentReview + 1} / {reviews.length}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNextReview}
                className="rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="mx-auto max-w-5xl px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl bg-premium-gradient px-8 py-14 md:py-16 text-center text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-10 -mt-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16 animate-pulse-slow" />

          <div className="relative max-w-2xl mx-auto space-y-6 z-10">
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Sweeten Your Celebration?
            </h2>
            <p className="text-md md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed font-medium">
              Consult with us directly on WhatsApp to design your dream cake layout, choose weights, request fillings, and confirm scheduling.
            </p>
            <motion.div 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="pt-4 flex justify-center"
            >
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-8 py-4 text-base font-extrabold text-primary-dark shadow-lg hover:bg-primary-light transition-all cursor-pointer inline-block"
              >
                Inquire on WhatsApp Now
              </a>
            </motion.div>
          </div>
        </motion.div>
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
