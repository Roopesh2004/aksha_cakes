"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Plus, Edit2, Trash2, CheckCircle, XCircle, Search, 
  Loader2, X, Upload, Check, AlertCircle 
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_CAKES, FALLBACK_CATEGORIES, Cake, Category } from "@/lib/fallbackData";

export default function AdminCakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(500);
  const [weight, setWeight] = useState("1 kg");
  const [flavor, setFlavor] = useState("Vanilla");
  const [imageUrl, setImageUrl] = useState("/hero-cake.png");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setCakes(FALLBACK_CAKES);
      setCategories(FALLBACK_CATEGORIES);
      if (FALLBACK_CATEGORIES.length > 0) {
        setCategoryId(FALLBACK_CATEGORIES[0].id);
      }
      setLoading(false);
      return;
    }

    try {
      const { data: dbCategories } = await supabase.from("categories").select("*");
      const { data: dbCakes } = await supabase.from("cakes").select("*").order("created_at", { ascending: false });

      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
        setCategoryId(dbCategories[0].id); // set default category
      } else {
        setCategories(FALLBACK_CATEGORIES);
        setCategoryId(FALLBACK_CATEGORIES[0].id);
      }

      if (dbCakes && dbCakes.length > 0) {
        setCakes(dbCakes);
      } else {
        setCakes(FALLBACK_CAKES);
      }
    } catch (err) {
      setCakes(FALLBACK_CAKES);
      setCategories(FALLBACK_CATEGORIES);
      setCategoryId(FALLBACK_CATEGORIES[0].id);
    } finally {
      setLoading(false);
    }
  }

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCake) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleOpenAddModal = () => {
    setEditingCake(null);
    setName("");
    setSlug("");
    setDescription("");
    setPrice(999);
    setWeight("1 kg");
    setFlavor("Chocolate Truffle");
    setImageUrl("/hero-cake.png");
    if (categories.length > 0) setCategoryId(categories[0].id);
    setFeatured(false);
    setAvailable(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cake: Cake) => {
    setEditingCake(cake);
    setName(cake.name);
    setSlug(cake.slug);
    setDescription(cake.description || "");
    setPrice(cake.price);
    setWeight(cake.weight || "1 kg");
    setFlavor(cake.flavor || "Chocolate Truffle");
    setImageUrl(cake.image_url || "/hero-cake.png");
    setCategoryId(cake.category_id || "");
    setFeatured(cake.featured);
    setAvailable(cake.available);
    setFormError("");
    setIsModalOpen(true);
  };

  // Supabase Storage Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setFormError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cakes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cakes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("cakes").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (err: any) {
      console.warn("Upload failed. Storage bucket 'cakes' might not exist. Using mockup fallback.", err);
      // Generate a mock URL or let user input text
      setFormError("Supabase Storage upload failed. Set Image URL directly or create the 'cakes' bucket.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !slug || !price) {
      setFormError("Please enter all required fields.");
      return;
    }

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      weight,
      flavor,
      image_url: imageUrl,
      category_id: categoryId || null,
      featured,
      available,
    };

    try {
      if (editingCake) {
        // UPDATE
        const { error } = await supabase.from("cakes").update(payload).eq("id", editingCake.id);
        if (error) throw error;
        
        setCakes(cakes.map((c) => (c.id === editingCake.id ? { ...c, ...payload } : c)));
      } else {
        // CREATE
        const newId = Math.random().toString(36).substring(2);
        const { data, error } = await supabase.from("cakes").insert([{ ...payload }]).select();
        
        if (error) throw error;

        if (data && data.length > 0) {
          setCakes([data[0], ...cakes]);
        } else {
          setCakes([{ id: newId, ...payload } as Cake, ...cakes]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Database save failed:", err);
      // Demo fallback save
      if (editingCake) {
        setCakes(cakes.map((c) => (c.id === editingCake.id ? { ...c, ...payload } : c)));
      } else {
        setCakes([{ id: Math.random().toString(36).substring(2), ...payload } as Cake, ...cakes]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cake?")) return;

    try {
      const { error } = await supabase.from("cakes").delete().eq("id", id);
      if (error) throw error;
      setCakes(cakes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Database delete failed, using client bypass:", err);
      setCakes(cakes.filter((c) => c.id !== id));
    }
  };

  const filteredCakes = cakes.filter((cake) => {
    const q = searchQuery.toLowerCase();
    return (
      cake.name.toLowerCase().includes(q) ||
      cake.flavor.toLowerCase().includes(q) ||
      (cake.description && cake.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
            Manage Cakes Menu
          </h1>
          <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
            Create, modify, and delete the cakes listed on the website.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Cake</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-primary-dark/40 dark:text-primary-light/40" />
        <input
          type="text"
          placeholder="Filter by name, flavor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
        />
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Cakes List...</p>
        </div>
      ) : filteredCakes.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No cakes found. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10 text-xs font-bold uppercase tracking-wider text-primary-dark/60 dark:text-primary-light/60 bg-primary/5">
                  <th className="p-4 pl-6">Cake details</th>
                  <th className="p-4">Flavor / Weight</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-sm">
                {filteredCakes.map((cake) => (
                  <tr key={cake.id} className="hover:bg-primary/5 transition-colors">
                    {/* Item */}
                    <td className="p-4 pl-6 flex items-center space-x-3 min-w-[280px]">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-primary/5 shrink-0">
                        <Image
                          src={cake.image_url}
                          alt={cake.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-primary-dark dark:text-primary-light">{cake.name}</p>
                        <p className="text-xs text-primary-dark/50 dark:text-primary-light/50 truncate max-w-xs">{cake.description}</p>
                      </div>
                    </td>
                    
                    {/* Details */}
                    <td className="p-4">
                      <p className="font-semibold">{cake.flavor}</p>
                      <p className="text-xs text-primary-dark/60 dark:text-primary-light/60">{cake.weight}</p>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-primary">
                      ₹{cake.price}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <span className="flex items-center space-x-1 text-xs">
                          {cake.available ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          )}
                          <span>{cake.available ? "Available" : "Hidden"}</span>
                        </span>
                        {cake.featured && (
                          <span className="inline-flex max-w-fit items-center rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(cake)}
                        className="rounded-full p-2 text-primary-dark hover:bg-primary/10 transition-colors inline-flex items-center"
                        title="Edit Cake"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cake.id)}
                        className="rounded-full p-2 text-red-500 hover:bg-red-500/10 transition-colors inline-flex items-center"
                        title="Delete Cake"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark border border-primary/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h2 className="font-serif text-2xl font-bold text-primary-dark dark:text-primary-soft">
                {editingCake ? "Edit Cake Details" : "Create New Cake"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-primary-dark/60 hover:bg-primary/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error alerts */}
            {formError && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start space-x-2 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                    Cake Name *
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
                    URL Slug * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                    Default Weight
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 1 kg"
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Flavor */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                    Default Flavor
                  </label>
                  <input
                    type="text"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    placeholder="e.g. Red Velvet"
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Category ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary cursor-pointer text-primary-dark dark:text-primary-light"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Input Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Cake Photo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* File Upload Option */}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl p-4 text-center cursor-pointer hover:bg-primary/5 transition-all relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 text-primary mb-1" />
                    )}
                    <span className="text-xs font-semibold text-primary-dark/80 dark:text-primary-light/80">
                      {uploadingImage ? "Uploading to Storage..." : "Upload local image"}
                    </span>
                    <span className="text-[10px] text-primary-dark/50">PNG, JPG, WebP</span>
                  </div>

                  {/* Manual URL entry */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-primary-dark/50 block font-bold uppercase">Or enter direct URL:</span>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-xs focus:outline-none focus:border-primary"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] text-primary-dark/50">Preview:</span>
                      <div className="relative w-8 h-8 rounded border overflow-hidden">
                        <img src={imageUrl} alt="preview" className="object-cover w-full h-full" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Options */}
              <div className="flex space-x-6 border-t border-primary/5 pt-4">
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Featured Product (Home Carousel)</span>
                </label>

                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Product Available (Visible in list)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 border-t border-primary/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-primary/20 px-5 py-2.5 text-xs font-bold text-primary-dark dark:text-primary-light hover:bg-primary/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/95"
                >
                  {editingCake ? "Save Changes" : "Create Cake"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
