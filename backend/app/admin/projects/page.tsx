"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare, FaXmark } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

const initialForm = {
  title: "",
  category: "Static",
  imageUrl: "",
  liveUrl: "",
  isActive: true,
};

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset";

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      }
    } catch (err) {
      alert("Image Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  // Open Modal for Add/Edit
  const handleOpenModal = (item?: any) => {
    if (item && item._id) {
      setEditId(item._id);
      setFormData({
        title: item.title || "",
        category: item.category || "Static",
        imageUrl: item.imageUrl || "",
        liveUrl: item.liveUrl || "",
        isActive: item.isActive ?? true,
      });
    } else {
      setEditId(null);
      setFormData(initialForm);
    }
    setIsOpen(true);
  };

  // Create or Update Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Please upload a project thumbnail!");

    const isEditing = Boolean(editId);
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/projects/${editId}` : "/api/projects";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setFormData(initialForm);
        setEditId(null);
        fetchProjects(); // Reload list
      } else {
        alert(data.error || "Operation failed!");
      }
    } catch (err) {
      alert("Server error processing request!");
    }
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    if (!id) return alert("Invalid Project ID!");
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.error || "Could not delete project");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Header & Stats Dashboard */}
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Projects Added: <span className="font-bold text-[#FF6400]">{projects.length}</span>
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white transition hover:bg-[#e05800]"
        >
          <FaPlus /> Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((item) => (
          <div key={item._id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <span className="text-xs font-medium text-[#FF6400]">{item.category}</span>
              </div>
              <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FF6400]">
                <FaExternalLinkAlt />
              </a>
            </div>
            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                onClick={() => handleOpenModal(item)}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
              >
                <FaPenToSquare /> Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <FaXmark className="text-2xl" />
            </button>

            {/* Left Input Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4 border-r pr-6">
              <h2 className="text-xl font-bold">{editId ? "Edit Project" : "Add New Project"}</h2>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Web App"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-[#FF6400]"
                >
                  <option value="Static">Static</option>
                  <option value="Dynamic">Dynamic</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Live Project URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Thumbnail Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs" />
                {uploading && <p className="mt-1 text-xs font-semibold text-orange-500">Uploading image...</p>}
              </div>

              <button
                disabled={uploading}
                type="submit"
                className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white transition hover:bg-[#e05800] disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : editId ? "Update Project" : "Save Project"}
              </button>
            </form>

            {/* Right Live Preview */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#0a0a0a] p-6 text-white">
              <span className="mb-4 text-xs font-bold uppercase tracking-wider text-[#FF6400]">Live Card Preview</span>
              <div className="w-full max-w-xs overflow-hidden rounded-2xl border border-neutral-800 bg-[#141414] p-3 shadow-lg">
                <div className="h-44 w-full overflow-hidden rounded-xl bg-neutral-900">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-600">No Image Uploaded</div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-200">{formData.title || "Name Project"}</span>
                  <span className="text-xs font-medium text-gray-400">{formData.category}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}