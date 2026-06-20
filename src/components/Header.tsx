"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Cake } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Cakes", path: "/cakes" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism transition-all duration-300 border-b border-primary/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with micro-animation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-primary"
              >
                <Cake className="h-8 w-8" />
              </motion.div>
              <span className="font-serif text-2xl font-bold tracking-wide text-primary-dark dark:text-primary-soft">
                Aksha <span className="text-primary group-hover:text-primary-dark dark:group-hover:text-primary-soft transition-colors duration-300">Cakes</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative py-1 text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-primary ${
                    isActive
                      ? "text-primary"
                      : "text-primary-dark/80 dark:text-primary-light/80"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/cakes"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all cursor-pointer inline-block"
              >
                Order Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-primary-dark dark:text-primary-light hover:bg-primary/10"
              aria-label="Open Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glassmorphism border-t border-primary/10"
          >
            <div className="space-y-1 px-4 py-4 pb-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-primary-dark dark:text-primary-light hover:bg-primary/5"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-primary/10">
                <Link
                  href="/cakes"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center rounded-full bg-primary py-3 text-base font-semibold text-white shadow-md"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
