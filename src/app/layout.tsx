import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aksha Cakes | Handcrafted Eggless Cakes for Every Celebration",
  description:
    "Freshly baked custom cakes made with premium ingredients and delivered with love. Order online on WhatsApp for birthdays, anniversaries, weddings, and theme parties.",
  keywords: "eggless cakes, premium cakes, custom birthday cakes, anniversary cakes, wedding cakes, home bakery, Aksha Cakes",
  metadataBase: new URL("http://localhost:3000"), // Will be updated on production
  openGraph: {
    title: "Aksha Cakes | Handcrafted Eggless Cakes for Every Celebration",
    description: "Freshly baked custom cakes made with premium ingredients and delivered with love.",
    url: "/",
    siteName: "Aksha Cakes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aksha Cakes | Handcrafted Eggless Cakes",
    description: "Freshly baked custom cakes made with premium ingredients and delivered with love.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flicker blocking theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-light dark:bg-bg-dark text-primary-dark dark:text-primary-light transition-colors duration-300">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
