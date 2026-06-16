import { notFound } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_CAKES, Cake } from "@/lib/fallbackData";
import CakeDetailClient from "@/components/CakeDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  let cake: Cake | null = null;
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from("cakes").select("*").eq("slug", slug).maybeSingle();
      cake = data;
    } catch (err) {
      // ignore
    }
  }

  if (!cake) {
    cake = FALLBACK_CAKES.find((c) => c.slug === slug) || null;
  }

  if (!cake) {
    return {
      title: "Cake Not Found | Aksha Cakes",
    };
  }

  return {
    title: `${cake.name} | Aksha Cakes Premium Eggless Cakes`,
    description: cake.description || `Freshly baked ${cake.flavor} eggless cake for your celebrations.`,
    openGraph: {
      title: `${cake.name} | Aksha Cakes`,
      description: cake.description,
      images: [{ url: cake.image_url }],
    },
  };
}

export default async function CakeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let cake: Cake | null = null;
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from("cakes").select("*").eq("slug", slug).maybeSingle();
      cake = data;
    } catch (err) {
      // ignore
    }
  }

  // Fallback to local data
  if (!cake) {
    cake = FALLBACK_CAKES.find((c) => c.slug === slug) || null;
  }

  if (!cake) {
    notFound();
  }

  // Load related cakes (same category)
  let relatedCakes: Cake[] = [];
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from("cakes")
        .select("*")
        .eq("category_id", cake.category_id)
        .neq("id", cake.id)
        .eq("available", true)
        .limit(4);
      if (data) relatedCakes = data;
    } catch (err) {
      // ignore
    }
  }

  // Fallback related cakes
  if (relatedCakes.length === 0) {
    relatedCakes = FALLBACK_CAKES.filter(
      (c) => c.category_id === cake?.category_id && c.id !== cake?.id
    ).slice(0, 4);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": cake.name,
            "image": cake.image_url,
            "description": cake.description,
            "offers": {
              "@type": "Offer",
              "url": `https://akshacakes.vercel.app/cakes/${cake.slug}`,
              "priceCurrency": "INR",
              "price": cake.price,
              "availability": cake.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
      <CakeDetailClient cake={cake} relatedCakes={relatedCakes} />
    </>
  );
}
