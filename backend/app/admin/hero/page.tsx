"use client";

import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaXmark,
  FaPlus,
  FaTrash,
  FaPenToSquare,
  FaFilePdf,
} from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const initialFormState = {
  greeting: "Hi I am",
  name: "Mizanor Rahman",
  title: "Full-Stack Developer",
  imageUrl: "",
  cvUrl: "",
  instagramUrl: "#",
  linkedinUrl: "#",
  facebookUrl: "#",
  whatsappUrl: "#",
  experienceYears: "5+",
  projectsDone: "20+",
  happyClients: "80+",
  isActive: true,
};

export default function HeroManagementPage() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);

  const fetchHeroes = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data.success) setHeroes(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleCloudinaryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageUrl" | "cvUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset || "portfolio_preset");

    const resourceType = field === "cvUrl" ? "raw" : "image";

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const fileData = await res.json();

      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, [field]: fileData.secure_url }));
      } else {
        alert(fileData.error?.message || "Cloudinary Upload Failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Cloudinary Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (hero?: any) => {
    if (hero) {
      setEditId(hero._id);
      setFormData({
        greeting: hero.greeting || "",
        name: hero.name || "",
        title: hero.title || "",
        imageUrl: hero.imageUrl || "",
        cvUrl: hero.cvUrl || "",
        instagramUrl: hero.instagramUrl ?? "#",
        linkedinUrl: hero.linkedinUrl ?? "#",
        facebookUrl: hero.facebookUrl ?? "#",
        whatsappUrl: hero.whatsappUrl ?? "#",
        experienceYears: hero.experienceYears || "",
        projectsDone: hero.projectsDone || "",
        happyClients: hero.happyClients || "",
        isActive: hero.isActive !== undefined ? hero.isActive : true,
      });
    } else {
      setEditId(null);
      setFormData(initialFormState);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/hero/${editId}` : "/api/hero";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        fetchHeroes();
      } else {
        alert(data.error || "Save operation failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setHeroes((prev) => prev.filter((hero) => hero._id !== id));
      } else {
        alert(data.error || "Failed to delete item!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete operation failed!");
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-gray-50 p-8 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hero Section Management
          </h1>
          <p className="text-sm text-gray-500">Total Created: {heroes.length}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#e05800]"
        >
          <FaPlus /> Add New Hero Content
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {heroes.map((hero) => (
          <div
            key={hero._id}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={hero.imageUrl || "/placeholder.jpg"}
                  alt={hero.name}
                  className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{hero.name}</h3>
                  <p className="text-sm font-medium text-[#FF6400]">
                    {hero.title}
                  </p>
                </div>
              </div>

              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                  hero.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {hero.isActive ? (
                  <>
                    <FaCheckCircle className="text-green-600" /> Active
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-gray-400" /> Inactive
                  </>
                )}
              </span>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-xs">
              <span className="font-semibold text-gray-500">Uploaded CV:</span>
              {hero.cvUrl ? (
                <a
                  href={hero.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <FaFilePdf className="text-red-500 text-sm flex-shrink-0" />
                  <span className="truncate">{hero.cvUrl.split("/").pop()}</span>
                </a>
              ) : (
                <p className="mt-1 text-gray-400 italic">No CV Uploaded</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => handleOpenModal(hero)}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <FaPenToSquare /> Edit
              </button>
              <button
                onClick={() => handleDelete(hero._id)}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl gap-8 overflow-y-auto rounded-3xl bg-white p-6 text-gray-900 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
            >
              <FaXmark className="text-2xl" />
            </button>

            <form
              onSubmit={handleSubmit}
              className="flex-1 space-y-4 border-r border-gray-100 pr-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editId ? "Edit Hero Content" : "Add Hero Content"}
                </h2>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-[#FF6400] focus:ring-[#FF6400]"
                  />
                  Active Status
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Greeting Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hi I am"
                    value={formData.greeting || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, greeting: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-[#FF6400]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mizanor Rahman"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-[#FF6400]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Professional Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Full-Stack Developer"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCloudinaryUpload(e, "imageUrl")}
                    className="w-full text-xs text-gray-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Upload CV (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleCloudinaryUpload(e, "cvUrl")}
                    className="w-full text-xs text-gray-600"
                  />
                  {formData.cvUrl && (
                    <p className="mt-1 truncate text-[10px] text-green-600">
                      ✓ Uploaded: {formData.cvUrl.split("/").pop()}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    placeholder="Instagram link or #"
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    placeholder="LinkedIn link or #"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    placeholder="Facebook link or #"
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, facebookUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    WhatsApp URL / Link
                  </label>
                  <input
                    type="text"
                    placeholder="WhatsApp link or #"
                    value={formData.whatsappUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsappUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5+"
                    value={formData.experienceYears || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceYears: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Completed Projects
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 20+"
                    value={formData.projectsDone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, projectsDone: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Happy Clients
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 80+"
                    value={formData.happyClients || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, happyClients: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              <button
                disabled={uploading}
                type="submit"
                className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white transition hover:bg-[#e05800] disabled:bg-gray-400"
              >
                {uploading
                  ? "Uploading..."
                  : editId
                  ? "Update Content"
                  : "Save Content"}
              </button>
            </form>

            <div className="flex-1 space-y-4 overflow-hidden rounded-2xl bg-[#111111] p-6 text-white">
              <span className="block text-xs font-bold uppercase tracking-widest text-[#FF6400]">
                Live Preview
              </span>
              <div>
                <p className="text-xs text-gray-400">{formData.greeting}</p>
                <h3 className="text-sm font-bold text-gray-200">
                  {formData.name}
                </h3>
                <h2 className="text-xl font-extrabold text-[#FF6400]">
                  {formData.title}
                </h2>
              </div>
              <div className="flex gap-2">
                <a
                  href={formData.instagramUrl || "#"}
                  target={formData.instagramUrl === "#" ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="rounded-full bg-neutral-800 p-2 text-xs"
                >
                  <FaInstagram />
                </a>
                <a
                  href={formData.linkedinUrl || "#"}
                  target={formData.linkedinUrl === "#" ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="rounded-full bg-neutral-800 p-2 text-xs"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={formData.facebookUrl || "#"}
                  target={formData.facebookUrl === "#" ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="rounded-full bg-neutral-800 p-2 text-xs"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={formData.whatsappUrl || "#"}
                  target={formData.whatsappUrl === "#" ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="rounded-full bg-neutral-800 p-2 text-xs"
                >
                  <FaWhatsapp />
                </a>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-lg bg-[#FF6400] px-4 py-1.5">
                  Hire Me
                </span>
                <span className="rounded-lg border border-neutral-700 px-4 py-1.5">
                  Download CV
                </span>
              </div>
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-neutral-800">
                <img
                  src={formData.imageUrl || "/placeholder.jpg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}