"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare, FaXmark } from "react-icons/fa6";

const initialFormState = {
  title: "",
  description: "",
  iconUrl: "",
  isActive: true,
};

export default function ServicesManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset || "portfolio_preset");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, iconUrl: fileData.secure_url }));
      } else {
        alert("Cloudinary Upload Failed!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload error!");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditId(service._id);
      setFormData({
        title: service.title,
        description: service.description,
        iconUrl: service.iconUrl,
        isActive: service.isActive ?? true,
      });
    } else {
      setEditId(null);
      setFormData(initialFormState);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.iconUrl) return alert("Please upload an icon/logo!");

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/services/${editId}` : "/api/services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setEditId(null);
        setFormData(initialFormState);
        fetchServices();
      } else {
        alert(data.error || "Operation failed!");
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.error || "Failed to delete!");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Header Dashboard Stats */}
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Added: <span className="font-bold text-[#FF6400]">{services.length}</span> Services
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white transition hover:bg-[#e05800]"
        >
          <FaPlus /> Add New Service
        </button>
      </div>

      {/* Grid Dashboard Item List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service._id} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <img src={service.iconUrl} alt={service.title} className="h-10 w-10 object-contain" />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
            <p className="line-clamp-2 text-xs text-gray-500">{service.description}</p>
            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => handleOpenModal(service)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                <FaPenToSquare /> Edit
              </button>
              <button onClick={() => handleDelete(service._id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Form Modal with Live Preview */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <FaXmark className="text-2xl" />
            </button>

            {/* Left Input Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4 border-r pr-6">
              <h2 className="text-xl font-bold">{editId ? "Edit Service" : "Add New Service"}</h2>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g. App Design"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
                <textarea
                  rows={3}
                  placeholder="Service description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Icon/Logo Upload</label>
                <input type="file" accept="image/*" onChange={handleCloudinaryUpload} className="w-full text-xs" />
                {uploading && <p className="mt-1 text-[10px] text-orange-500">Uploading to Cloudinary...</p>}
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded text-[#FF6400]"
                />
                Active Status
              </label>

              <button
                disabled={uploading}
                type="submit"
                className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white transition hover:bg-[#e05800] disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : editId ? "Update Service" : "Save Service"}
              </button>
            </form>

            {/* Right Side Live Preview */}
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 rounded-2xl bg-[#0e0e0e] p-6 text-white">
              <span className="mb-2 text-xs font-bold uppercase tracking-wider text-[#FF6400]">Live Card Preview</span>
              <div className="w-full max-w-xs space-y-3 rounded-2xl border border-neutral-800 bg-[#141414] p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-900/50">
                  {formData.iconUrl ? (
                    <img src={formData.iconUrl} alt="Preview" className="h-10 w-10 object-contain" />
                  ) : (
                    <div className="h-8 w-8 rounded-full border border-dashed border-gray-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#FF6400]">{formData.title || "Service Title"}</h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  {formData.description || "Lorem ipsum dolor sit amet consectetur imperdiet convallis."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}