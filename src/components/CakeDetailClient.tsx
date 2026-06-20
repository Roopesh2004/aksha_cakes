"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Calendar, MessageSquare, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Cake } from "@/lib/fallbackData";

interface CakeDetailClientProps {
  cake: Cake;
  relatedCakes: Cake[];
}

const weightOptions = ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg"];
const flavorOptions = [
  "Chocolate Truffle", 
  "Red Velvet Cream Cheese", 
  "Vanilla Bean", 
  "Butterscotch Caramel", 
  "Strawberry Cream",
  "Pineapple Fresh",
  "Black Forest Classic"
];

export default function CakeDetailClient({ cake, relatedCakes }: CakeDetailClientProps) {
  const [selectedWeight, setSelectedWeight] = useState(cake.weight || "1 kg");
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavor || "Chocolate Truffle");
  const [customMessage, setCustomMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  
  // Calculate dynamic price based on weight selected
  const getDynamicPrice = () => {
    const basePrice = cake.price;
    if (selectedWeight === "0.5 kg") return Math.floor(basePrice * 0.6);
    if (selectedWeight === "1.5 kg") return Math.floor(basePrice * 1.5);
    if (selectedWeight === "2 kg") return Math.floor(basePrice * 1.85);
    if (selectedWeight === "3 kg") return Math.floor(basePrice * 2.7);
    return basePrice; // 1 kg
  };

  const currentPrice = getDynamicPrice();

  const handleOrderWhatsApp = () => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917337335674";
    
    let messageText = `*New Cake Inquiry from Website*\n\n`;
    messageText += `*Cake:* ${cake.name}\n`;
    messageText += `*Weight:* ${selectedWeight}\n`;
    messageText += `*Flavor:* ${selectedFlavor}\n`;
    
    if (customMessage.trim()) {
      messageText += `*Message on Cake:* "${customMessage.trim()}"\n`;
    }
    if (eventDate) {
      messageText += `*Delivery/Event Date:* ${eventDate}\n`;
    }
    
    messageText += `*Estimated Price:* ₹${currentPrice}\n\n`;
    messageText += `Please confirm availability and delivery slot. Thank you!`;

    const whatsappUrl = `https://wa.me/${num}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image and Badges */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/40 dark:bg-card-dark/40 border border-primary/10 shadow-lg"
          >
            <Image
              src={cake.image_url}
              alt={cake.name}
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/40 dark:bg-card-dark/40 border border-primary/5 rounded-2xl p-4">
              <Heart className="h-5 w-5 text-primary mx-auto mb-1" />
              <span className="text-xs font-bold text-primary-dark/80 dark:text-primary-light/80 block">100% Eggless</span>
            </div>
            <div className="bg-white/40 dark:bg-card-dark/40 border border-primary/5 rounded-2xl p-4">
              <Sparkles className="h-5 w-5 text-primary mx-auto mb-1" />
              <span className="text-xs font-bold text-primary-dark/80 dark:text-primary-light/80 block">Freshly Baked</span>
            </div>
            <div className="bg-white/40 dark:bg-card-dark/40 border border-primary/5 rounded-2xl p-4">
              <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" />
              <span className="text-xs font-bold text-primary-dark/80 dark:text-primary-light/80 block">Pure Ingredients</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Forms */}
        <div className="space-y-8 bg-white/35 dark:bg-card-dark/35 border border-primary/10 rounded-3xl p-6 md:p-8">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-primary-dark dark:text-primary-soft">
              {cake.name}
            </h1>
            <p className="text-primary text-2xl font-black">
              ₹{currentPrice}
            </p>
          </div>

          <p className="text-sm text-primary-dark/80 dark:text-primary-light/80 leading-relaxed border-b border-primary/5 pb-6">
            {cake.description}
          </p>

          <div className="space-y-6">
            {/* 1. Weight selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light block">
                Select Weight:
              </label>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`rounded-full px-5 py-2 text-xs font-bold border transition-all ${
                      selectedWeight === weight
                        ? "bg-primary border-primary text-white shadow-md"
                        : "bg-white/40 dark:bg-card-dark/40 border-primary/10 text-primary-dark/85 dark:text-primary-light/85 hover:bg-primary/5"
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Flavor selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light block">
                Choose Flavor:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {flavorOptions.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold border text-left transition-all ${
                      selectedFlavor === flavor
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white/40 dark:bg-card-dark/40 border-primary/10 text-primary-dark/80 dark:text-primary-light/80 hover:bg-primary/5"
                    }`}
                  >
                    <span>{flavor}</span>
                    {selectedFlavor === flavor && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text on Cake */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light flex items-center space-x-1.5">
                <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                <span>Text on Cake (Optional):</span>
              </label>
              <input
                type="text"
                maxLength={35}
                placeholder="e.g., Happy 25th Anniversary Mom & Dad"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
              />
            </div>

            {/* 4. Event Date */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-primary-dark dark:text-primary-light flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>Delivery Date (Optional):</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all cursor-pointer text-primary-dark/85 dark:text-primary-light/85"
              />
            </div>
          </div>

          <button
            onClick={handleOrderWhatsApp}
            className="w-full rounded-full bg-[#25D366] text-white py-4 text-base font-extrabold shadow-lg hover:bg-[#20ba5a] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Related Cakes Section */}
      {relatedCakes.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-primary/5">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-dark dark:text-primary-soft">
              Related Celebrations
            </h2>
            <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
              Other delicious cakes you might like.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCakes.map((c) => (
              <Link
                key={c.id}
                href={`/cakes/${c.slug}`}
                className="group flex flex-col bg-white/30 dark:bg-card-dark/30 border border-primary/10 rounded-2xl overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow space-y-1">
                  <h3 className="font-serif text-base font-bold text-primary-dark dark:text-primary-light group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-primary pt-2 font-black mt-auto">
                    <span>₹{c.price}</span>
                    <span className="text-primary-dark/50 dark:text-primary-light/50 font-bold">{c.flavor}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
