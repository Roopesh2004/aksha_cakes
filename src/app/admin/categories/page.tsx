"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, X, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_CATEGORIES, Category } from "@/lib/fallbackData";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("/hero-cake.png");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setCategories(FALLBACK_CATEGORIES);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setImageUrl("/hero-cake.png");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.image_url || "/hero-cake.png");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !slug) {
      setFormError("Please fill in Name and Slug.");
      return;
    }

    const payload = {
      name,
      slug,
      image_url: imageUrl,
    };

    try {
      if (editingCategory) {
        // UPDATE
        const { error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id);
        if (error) throw error;
        setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c)));
      } else {
        // CREATE
        const newId = Math.random().toString(36).substring(2);
        const { data, error } = await supabase.from("categories").insert([payload]).select();
        
        if (error) throw error;
        if (data && data.length > 0) {
          setCategories([...categories, data[0]]);
        } else {
          setCategories([...categories, { id: newId, ...payload }]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Database save failed, using local bypass:", err);
      if (editingCategory) {
        setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c)));
      } else {
        setCategories([...categories, { id: Math.random().toString(36).substring(2), ...payload }]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Active cakes in this category will become uncategorized.")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Database delete failed, using client bypass:", err);
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
            Manage Categories
          </h1>
          <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
            Organize cakes into groups like birthdays, cupcakes, and wedding custom designs.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-primary-dark/40 dark:text-primary-light/40" />
        <input
          type="text"
          placeholder="Filter categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No categories found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-2xl p-4 flex items-center justify-between shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 shrink-0">
                  <Image
                    src={cat.image_url || "/hero-cake.png"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate">
                  <h3 className="font-serif font-bold text-primary-dark dark:text-primary-light truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-primary-dark/50 dark:text-primary-light/50 truncate">
                    /{cat.slug}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 shrink-0 ml-4">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="rounded-full p-2 text-primary-dark hover:bg-primary/10 transition-colors inline-flex items-center"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="rounded-full p-2 text-red-500 hover:bg-red-500/10 transition-colors inline-flex items-center"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark border border-primary/10 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h2 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-soft">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-primary-dark/60 hover:bg-primary/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start space-x-2 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Category Icon/Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-primary/20 px-5 py-2 text-xs font-bold text-primary-dark dark:text-primary-light hover:bg-primary/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/95"
                >
                  {editingCategory ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
