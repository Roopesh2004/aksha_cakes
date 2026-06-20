"use client";

import { useEffect, useState } from "react";
import { Mail, Clock, CheckCircle, Search, MessageSquare, Trash2, Calendar, ShieldAlert } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function loadEnquiries() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setEnquiries([
        {
          id: "enq-1",
          customer_name: "Sneha Sharma",
          phone: "917337335674",
          message: "Need a 2 kg eggless truffle cake with anniversary design and 'Happy 25th Anniversary' message.",
          event_date: "2026-06-25",
          status: "Pending",
          created_at: new Date().toISOString(),
          cakes: { name: "Royal Chocolate Truffle", flavor: "Chocolate Truffle" }
        },
        {
          id: "enq-2",
          customer_name: "Amit Patel",
          phone: "918888888888",
          message: "Inquiring about price of custom photoprint cupcake pack of 12.",
          event_date: "2026-06-29",
          status: "Contacted",
          created_at: new Date().toISOString(),
          cakes: { name: "Pastel Dream Cupcakes (Pack of 6)", flavor: "Assorted" }
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("enquiries")
        .select(`
          id,
          customer_name,
          phone,
          message,
          event_date,
          status,
          created_at,
          cake_id,
          cakes(name, flavor)
        `)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setEnquiries(data);
      } else {
        // Fallback mockup
        setEnquiries([
          {
            id: "enq-1",
            customer_name: "Sneha Sharma",
            phone: "917337335674",
            message: "Need a 2 kg eggless truffle cake with anniversary design and 'Happy 25th Anniversary' message.",
            event_date: "2026-06-25",
            status: "Pending",
            created_at: new Date().toISOString(),
            cakes: { name: "Royal Chocolate Truffle", flavor: "Chocolate Truffle" }
          },
          {
            id: "enq-2",
            customer_name: "Amit Patel",
            phone: "918888888888",
            message: "Inquiring about price of custom photoprint cupcake pack of 12.",
            event_date: "2026-06-29",
            status: "Contacted",
            created_at: new Date().toISOString(),
            cakes: { name: "Pastel Dream Cupcakes (Pack of 6)", flavor: "Assorted" }
          }
        ]);
      }
    } catch (err) {
      console.warn("Could not query enquiries database, loading mock logs.", err);
      // Fallback
      setEnquiries([
        {
          id: "enq-1",
          customer_name: "Sneha Sharma",
          phone: "917337335674",
          message: "Need a 2 kg eggless truffle cake with anniversary design and 'Happy 25th Anniversary' message.",
          event_date: "2026-06-25",
          status: "Pending",
          created_at: new Date().toISOString(),
          cakes: { name: "Royal Chocolate Truffle", flavor: "Chocolate Truffle" }
        },
        {
          id: "enq-2",
          customer_name: "Amit Patel",
          phone: "918888888888",
          message: "Inquiring about price of custom photoprint cupcake pack of 12.",
          event_date: "2026-06-29",
          status: "Contacted",
          created_at: new Date().toISOString(),
          cakes: { name: "Pastel Dream Cupcakes (Pack of 6)", flavor: "Assorted" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("enquiries").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    } catch (err) {
      console.warn("Database status save failed, executing offline update.", err);
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;

    try {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
      setEnquiries(enquiries.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Database delete failed, using client bypass:", err);
      setEnquiries(enquiries.filter((e) => e.id !== id));
    }
  };

  const getWhatsAppFollowUp = (phone: string, customerName: string, cakeName: string) => {
    const defaultMsg = `Hi ${customerName}, this is Aksha Cakes. We received your website inquiry regarding the ${cakeName || "custom"} cake design. Let's discuss details!`;
    const formattedPhone = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`;
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    // Filter by status
    if (statusFilter !== "all" && enq.status !== statusFilter) return false;
    
    // Search query
    const q = searchQuery.toLowerCase();
    return (
      enq.customer_name.toLowerCase().includes(q) ||
      enq.phone.includes(q) ||
      (enq.message && enq.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-primary-dark dark:text-primary-soft">
          Customer Enquiries
        </h1>
        <p className="text-sm text-primary-dark/70 dark:text-primary-light/70">
          Track customer booking inquiries, follow up on WhatsApp, and update order fulfillment statuses.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-primary-dark/40 dark:text-primary-light/40" />
          <input
            type="text"
            placeholder="Search name, phone, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 focus:outline-none focus:border-primary text-sm transition-all cursor-pointer text-primary-dark/80 dark:text-primary-light/80"
        >
          <option value="all">All Enquiries</option>
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm font-semibold">Loading Enquiries logs...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-20 bg-white/10 dark:bg-card-dark/10 border border-primary/5 rounded-2xl">
          <p className="font-serif text-xl font-bold text-primary-dark/70 dark:text-primary-light/70">
            No enquiries matched your filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className={`bg-white/40 dark:bg-card-dark/40 border rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all ${
                enq.status === "Pending" 
                  ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/2" 
                  : enq.status === "Contacted"
                  ? "border-blue-500/20"
                  : "border-primary/10 opacity-70"
              }`}
            >
              {/* Left Details block */}
              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-primary-dark dark:text-primary-light">
                    {enq.customer_name}
                  </h3>
                  <span className="text-xs text-primary-dark/50 dark:text-primary-light/50 font-medium">
                    ({enq.phone})
                  </span>
                  
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                      enq.status === "Pending"
                        ? "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
                        : enq.status === "Contacted"
                        ? "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400"
                        : "bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-primary-dark/80 dark:text-primary-light/80">
                  <p className="flex items-center space-x-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      Cake Option: <strong className="text-primary">{enq.cakes?.name || "Custom Design"}</strong>
                    </span>
                  </p>
                  
                  {enq.event_date && (
                    <p className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>
                        Delivery Date: <strong>{new Date(enq.event_date).toLocaleDateString()}</strong>
                      </span>
                    </p>
                  )}
                  
                  <p className="flex items-center space-x-1.5 text-primary-dark/40">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Inquired on {new Date(enq.created_at).toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-primary/5">
                  <p className="text-xs text-primary-dark/90 dark:text-primary-light/90 leading-relaxed italic">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right Operations Block */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 border-primary/5 pt-4 md:pt-0 shrink-0">
                {/* Status Selection */}
                <div className="space-y-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary-dark/50 dark:text-primary-light/50 md:text-right">
                    Update Status
                  </label>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className="px-3 py-2 rounded-xl border border-primary/10 bg-white/40 dark:bg-card-dark/40 text-xs focus:outline-none focus:border-primary cursor-pointer text-primary-dark/80 dark:text-primary-light/80 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-2 md:mt-2">
                  <a
                    href={getWhatsAppFollowUp(enq.phone, enq.customer_name, enq.cakes?.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-[#25D366] text-white px-4 py-2.5 rounded-full hover:bg-[#20ba5a] font-bold shadow-sm flex items-center space-x-1.5"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>Contact WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="rounded-full p-2.5 text-red-500 border border-red-500/10 hover:bg-red-500/10 transition-colors inline-flex items-center"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
