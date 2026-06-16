import { MetadataRoute } from "next";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_CAKES } from "@/lib/fallbackData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://akshacakes.vercel.app";

  let cakes: { slug: string; updated_at?: string }[] = [];
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from("cakes").select("slug, updated_at").eq("available", true);
      if (data && data.length > 0) {
        cakes = data;
      } else {
        cakes = FALLBACK_CAKES.map((c) => ({ slug: c.slug, updated_at: new Date().toISOString() }));
      }
    } catch (err) {
      cakes = FALLBACK_CAKES.map((c) => ({ slug: c.slug, updated_at: new Date().toISOString() }));
    }
  } else {
    cakes = FALLBACK_CAKES.map((c) => ({ slug: c.slug, updated_at: new Date().toISOString() }));
  }

  const cakeUrls = cakes.map((cake) => ({
    url: `${baseUrl}/cakes/${cake.slug}`,
    lastModified: cake.updated_at ? new Date(cake.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cakes`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...cakeUrls];
}
