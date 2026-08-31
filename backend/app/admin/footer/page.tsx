"use client";

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaPenToSquare,
  FaTrash,
  FaXmark,
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

export default function FooterAdminPage() {
  const [footers, setFooters] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    logoText: "MIZAN",
    email: "Mahmood.fazile7005@gmail.com",
    phone: "+93 729 107 005",
    copyrightText: "Designed by @mahmood.fazile UI/UX designer",
    instagramUrl: "#",
    linkedinUrl: "#",
    facebookUrl: "#",
    whatsappUrl: "#",
    isActive: true,
  });

  const fetchFooters = async () => {
    try {
      const res = await fetch("/api/footer");
      const data = await res.json();
      if (data.success) setFooters(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFooters();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      logoText: "MIZAN",
      email: "Mahmood.fazile7005@gmail.com",
      phone: "+93 729 107 005",
      copyrightText: "Designed by @mahmood.fazile UI/UX designer",
      instagramUrl: "#",
      linkedinUrl: "#",
      facebookUrl: "#",
      whatsappUrl: "#",
      isActive: true,
    });
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setFormData({
      logoText: item.logoText || "",
      email: item.email || "",
      phone: item.phone || "",
      copyrightText: item.copyrightText || "",
      instagramUrl: item.instagramUrl || "#",
      linkedinUrl: item.linkedinUrl || "#",
      facebookUrl: item.facebookUrl || "#",
      whatsappUrl: item.whatsappUrl || "#",
      isActive: item.isActive !== false,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer config?")) return;
    try {
      const res = await fetch(`/api/footer/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFooters();
    } catch (err) {
      alert("Error deleting footer");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/footer/${editId}` : "/api/footer";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        resetForm();
        fetchFooters();
      }
    } catch (err) {
      alert("Error saving footer data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">Footer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your site footer links and contact info
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white hover:bg-[#e05800] transition-all"
        >
          <FaPlus /> Add New Footer
        </button>
      </div>

      {/* Dashboard Counter Card */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Footers Added</p>
          <h2 className="mt-2 text-4xl font-extrabold text-[#FF6400]">
            {footers.length}
          </h2>
        </div>
      </div>

      {/* Footer Configurations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {footers.map((item) => (
          <div
            key={item._id}
            className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-widest text-[#FF6400]">
                  {item.logoText}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {item.email || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {item.phone || "N/A"}
              </p>
              <p className="text-xs text-gray-400">
                <strong>Copyright:</strong> {item.copyrightText}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
              <button
                onClick={() => handleEdit(item)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-all"
              >
                <FaPenToSquare /> Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white transition-all"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Popup Modal with Live Preview */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
            >
              <FaXmark className="text-2xl" />
            </button>

            <h2 className="mb-6 text-2xl font-bold">
              {editId ? "Edit Footer Section" : "Add New Footer Section"}
            </h2>

            {/* LIVE PREVIEW BOX */}
            <div className="mb-8 rounded-2xl border border-neutral-800 bg-[#121212] p-6 text-center text-white shadow-inner">
              <span className="mb-4 inline-block rounded-full bg-[#FF6400]/20 px-3 py-1 text-xs font-semibold text-[#FF6400]">
                Live Preview
              </span>
              
              <div className="space-y-6">
                {/* Logo */}
                <h2 className="text-3xl font-extrabold tracking-widest text-[#FF6400]">
                  {formData.logoText || "LOGO"}
                </h2>

                {/* Nav Links Demo */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                  <span>Home</span>
                  <span>Services</span>
                  <span>About me</span>
                  <span>Portfolio</span>
                  <span>Contact me</span>
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-[#1a1a1a] text-gray-300">
                    <FaInstagram />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-[#1a1a1a] text-gray-300">
                    <FaLinkedinIn />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-[#1a1a1a] text-gray-300">
                    <FaFacebookF />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-[#1a1a1a] text-gray-300">
                    <FaWhatsapp />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#FF6400]" />
                    <span>{formData.email || "email@domain.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-[#FF6400]" />
                    <span>{formData.phone || "+000 000 000"}</span>
                  </div>
                </div>

                <hr className="border-neutral-800" />
                <p className="text-xs text-gray-500">
                  {formData.copyrightText || "Copyright text here"}
                </p>
              </div>
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Logo Text</label>
                  <input
                    type="text"
                    value={formData.logoText}
                    onChange={(e) =>
                      setFormData({ ...formData, logoText: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Copyright Text</label>
                  <input
                    type="text"
                    value={formData.copyrightText}
                    onChange={(e) =>
                      setFormData({ ...formData, copyrightText: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Link Inputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                    placeholder="#"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                    placeholder="#"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, facebookUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                    placeholder="#"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">WhatsApp URL</label>
                  <input
                    type="text"
                    value={formData.whatsappUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsappUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border p-3 text-sm focus:border-[#FF6400] focus:outline-none"
                    placeholder="#"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#FF6400] py-3.5 text-base font-semibold text-white hover:bg-[#e05800] transition-all"
                >
                  Save Footer Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}