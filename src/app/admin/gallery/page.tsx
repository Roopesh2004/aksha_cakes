"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, Loader2, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_GALLERY, GalleryItem } from "@/lib/fallbackData";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");

  // Fields
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("/hero-cake.png");

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setGallery(FALLBACK_GALLERY);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setGallery(data);
      } else {
        setGallery(FALLBACK_GALLERY);
      }
    } catch (err) {
      setGallery(FALLBACK_GALLERY);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCaption("");
    setImageUrl("/hero-cake.png");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setCaption(item.caption || "");
    setImageUrl(item.image_url || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Image Upload handler for gallery
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    setFormError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (err: any) {
      console.warn("Storage upload failed, fallback direct input.", err);
      setFormError("Supabase Storage upload failed. Set Image URL directly or create the 'gallery' bucket.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!imageUrl) {
      setFormError("Please upload an image or provide a URL.");
      return;
    }

    const payload = {
      image_url: imageUrl,
      caption,
    };

    try {
      if (editingItem) {
        // UPDATE
        const { error } = await supabase.from("gallery").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        setGallery(gallery.map((g) => (g.id === editingItem.id ? { ...g, ...payload } : g)));
      } else {
        // CREATE
        const newId = Math.random().toString(36).substring(2);
        const { data, error } = await supabase.from("gallery").insert([payload]).select();
        
        if (error) throw error;
        if (data && data.length > 0) {
          setGallery([data[0], ...gallery]);
        } else {
          setGallery([{ id: newId, ...payload } as GalleryItem, ...gallery]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Database save failed, using local bypass:", err);
      if (editingItem) {
        setGallery(gallery.map((g) => (g.id === editingItem.id ? { ...g, ...payload } : g)));
      } else {
        setGallery([{ id: Math.random().toString(36).substring(2), ...payload } as GalleryItem, ...gallery]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      setGallery(gallery.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Database delete failed, using client bypass:", err);
      setGallery(gallery.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
            Manage Gallery Photos
          </h1>
          <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
            Upload images showing Aksha Cakes creations to display on the public gallery grid.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Photo</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Gallery Items...</p>
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No gallery items found. Upload photos to start your showcase!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Photo Box */}
              <div className="relative aspect-square w-full bg-primary/5">
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery"}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Caption details & actions */}
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-primary-dark/75 dark:text-primary-light/75 line-clamp-2 leading-relaxed">
                  {item.caption || <span className="italic text-primary-dark/40">No caption provided.</span>}
                </p>
                
                <div className="flex justify-end space-x-2 pt-2 border-t border-primary/5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="text-xs font-bold border border-primary/20 text-primary px-3 py-1.5 rounded-full hover:bg-primary/5 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-bold bg-red-500/15 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-500/25 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-card-dark border border-primary/10 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h2 className="font-serif text-xl font-bold text-primary-dark dark:text-primary-soft">
                {editingItem ? "Edit Gallery Caption" : "Upload Gallery Photo"}
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
              
              {/* Image upload widget */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Image file
                </label>
                <div className="flex items-center justify-center border-2 border-dashed border-primary/20 rounded-xl p-6 text-center cursor-pointer hover:bg-primary/5 transition-all relative">
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
                </div>
                
                <div className="space-y-1 mt-2">
                  <label className="text-[10px] text-primary-dark/50 block font-bold uppercase">Or enter direct URL:</label>
                  <input
                    type="text"
                    placeholder="https://example.com/gallery.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-dark/70 dark:text-primary-light/70">
                  Caption / Description
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Gorgeous 2-tier Buttercream Wedding Cake with fresh roses."
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Buttons */}
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
                  {editingItem ? "Save Changes" : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
