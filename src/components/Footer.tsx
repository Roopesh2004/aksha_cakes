import Link from "next/link";
import { Cake, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 bg-white/40 dark:bg-bg-dark/40 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary-dark dark:text-primary-soft">
              <Cake className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold tracking-wide">
                Aksha <span className="text-primary">Cakes</span>
              </span>
            </Link>
            <p className="text-sm text-primary-dark/70 dark:text-primary-light/70 leading-relaxed">
              Premium handcrafted eggless cakes baked with fresh ingredients, custom-made to elevate your celebrations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-md font-bold uppercase tracking-wider text-primary-dark dark:text-primary-soft mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-primary-dark/80 dark:text-primary-light/80">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/cakes" className="hover:text-primary transition-colors">Our Cakes</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Get in Touch</Link>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h3 className="font-serif text-md font-bold uppercase tracking-wider text-primary-dark dark:text-primary-soft mb-4">
              Baking Hours
            </h3>
            <ul className="space-y-3 text-sm text-primary-dark/80 dark:text-primary-light/80">
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Monday - Sunday: 9:00 AM - 10:00 PM</span>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Midnight Deliveries Available on request for custom orders.</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-md font-bold uppercase tracking-wider text-primary-dark dark:text-primary-soft mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm text-primary-dark/80 dark:text-primary-light/80">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Aksha Cakes, Premium Home Bakery, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@akshacakes.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-primary/5 flex flex-col md:flex-row items-center justify-between text-xs text-primary-dark/60 dark:text-primary-light/60">
          <p>© {currentYear} Aksha Cakes. All Rights Reserved. Crafted with love.</p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <Link href="/admin" className="hover:text-primary transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
