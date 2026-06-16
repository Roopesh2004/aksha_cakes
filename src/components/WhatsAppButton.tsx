"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const defaultMessage = encodeURIComponent("Hi Aksha Cakes! I would like to inquire about ordering a cake.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] transition-colors relative group"
        aria-label="Order on WhatsApp"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:animate-none"></span>
        
        <MessageCircle className="h-7 w-7 relative z-10" />

        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all origin-right bg-primary-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md select-none pointer-events-none">
          Order on WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
