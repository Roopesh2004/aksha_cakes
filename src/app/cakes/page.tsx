"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  FALLBACK_CATEGORIES, FALLBACK_CAKES,
  Category, Cake 
} from "@/lib/fallbackData";
import { CakeCardSkeleton } from "@/components/Skeleton";

// Stagger parent animation config
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 15 } },
};

function CakesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [cakes, setCakes] = useState<Cake[]>(FALLBACK_CAKES);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured"); // featured, price-asc, price-desc, name
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data: dbCats } = await supabase.from("categories").select("*");
        const { data: dbCakes } = await supabase.from("cakes").select("*").eq("available", true);

        if (dbCats && dbCats.length > 0) setCategories(dbCats);
        if (dbCakes && dbCakes.length > 0) setCakes(dbCakes);
      } catch (err) {
        console.warn("Could not query Supabase, using local fallback data.", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync with searchParams if they change (e.g. user clicks another category on header)
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all";
    setSelectedCategory(categoryParam);
    setCurrentPage(1); // Reset page
  }, [searchParams]);

  // Filtering & Sorting logic
  const filteredCakes = cakes
    .filter((cake) => {
      // Category match
      if (selectedCategory !== "all") {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && cake.category_id !== cat.id) return false;
      }
      // Search query match
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          cake.name.toLowerCase().includes(query) ||
          cake.flavor.toLowerCase().includes(query) ||
          (cake.description && cake.description.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      // Default: featured or created_at
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  // Pagination bounds
  const totalPages = Math.ceil(filteredCakes.length / itemsPerPage);
  const paginatedCakes = filteredCakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getWhatsAppLink = (cakeName: string) => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917337335674";
    const msg = `Hi Aksha Cakes, I would like to order the ${cakeName} cake.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-extrabold text-primary-dark dark:text-primary-soft"
        >
          Our Premium Cakes Menu
        </motion.h1>
        <p className="text-primary-dark/70 dark:text-primary-light/70 max-w-md mx-auto text-sm font-medium">
          Freshly baked custom designs & delicious flavors. Find your perfect cake.
        </p>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
      </div>

      {/* Search and Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-primary-dark/40 dark:text-primary-light/40" />
          <input
            type="text"
            placeholder="Search cakes, flavors, or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
          />
        </div>

        {/* Categories Select Dropdown */}
        <div className="relative md:col-span-3">
          <SlidersHorizontal className="absolute left-4 top-3.5 h-5 w-5 text-primary-dark/40 dark:text-primary-light/40" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none cursor-pointer text-primary-dark/80 dark:text-primary-light/80 font-bold"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort select */}
        <div className="relative md:col-span-3">
          <ArrowUpDown className="absolute left-4 top-3.5 h-5 w-5 text-primary-dark/40 dark:text-primary-light/40" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm appearance-none cursor-pointer text-primary-dark/80 dark:text-primary-light/80 font-bold"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-primary/25">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedCategory("all");
            setCurrentPage(1);
          }}
          className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition-all border whitespace-nowrap cursor-pointer ${
            selectedCategory === "all"
              ? "bg-primary border-primary text-white shadow-md"
              : "bg-white/40 dark:bg-card-dark/40 border-primary/10 text-primary-dark/80 dark:text-primary-light/80 hover:bg-primary/5"
          }`}
        >
          All
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory(cat.slug);
              setCurrentPage(1);
            }}
            className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition-all border whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-primary border-primary text-white shadow-md"
                : "bg-white/40 dark:bg-card-dark/40 border-primary/10 text-primary-dark/80 dark:text-primary-light/80 hover:bg-primary/5"
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Grid content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CakeCardSkeleton key={idx} />
          ))}
        </div>
      ) : paginatedCakes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white/20 dark:bg-card-dark/20 border border-primary/10 rounded-2xl"
        >
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No cakes matched your criteria.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 text-xs font-bold bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/95 shadow-md cursor-pointer"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      ) : (
        <>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {paginatedCakes.map((cake) => (
                <motion.div
                  key={cake.id}
                  layout
                  variants={cardAnimation}
                  className="group flex flex-col premium-glass-card hover-lift rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-primary/5 border-b border-primary/5">
                    <Image
                      src={cake.image_url}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {cake.flavor}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors leading-tight">
                        {cake.name}
                      </h2>
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
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-8">
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-full border border-primary/20 p-2.5 text-primary hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <span className="text-sm font-bold text-primary-dark dark:text-primary-light">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-full border border-primary/20 p-2.5 text-primary hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CakesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm font-semibold">Loading Cakes...</p>
      </div>
    }>
      <CakesContent />
    </Suspense>
  );
}
