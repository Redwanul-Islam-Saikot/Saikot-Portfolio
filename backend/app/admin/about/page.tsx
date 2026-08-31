"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare, FaXmark, FaUpload } from "react-icons/fa6";

const initialForm = {
  subtitle: "",
  description: "",
  bioText: "",
  imageUrl: "",
  cvUrl: "",
  isActive: true,
  skills: [{ name: "", percentage: 80, logoUrl: "", iconUrl: "" }],
};

export default function AboutManagementPage() {
  const [aboutList, setAboutList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingSkillLogo, setUploadingSkillLogo] = useState<number | null>(null);

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success) setAboutList(data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const uploadToCloudinary = async (file: File, resourceType: "image" | "raw" | "auto") => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset";

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body }
    );
    const data = await res.json();
    return data.secure_url || data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      } else {
        alert("Image Upload Failed! Check Cloudinary Config.");
      }
    } catch (err) {
      alert("Image Upload Error!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const url = await uploadToCloudinary(file, "auto");
      if (url) {
        setFormData((prev) => ({ ...prev, cvUrl: url }));
      } else {
        alert("PDF Upload Failed!");
      }
    } catch (err) {
      alert("PDF Upload Error!");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSkillLogoUpload = async (index: number, file: File) => {
    setUploadingSkillLogo(index);
    try {
      const url = await uploadToCloudinary(file, "image");
      if (url) {
        const updatedSkills = [...formData.skills];
        updatedSkills[index].logoUrl = url;
        updatedSkills[index].iconUrl = url;
        setFormData((prev) => ({ ...prev, skills: updatedSkills }));
      }
    } catch (err) {
      alert("Skill Logo Upload Failed");
    } finally {
      setUploadingSkillLogo(null);
    }
  };

  const addSkillField = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", percentage: 100, logoUrl: "", iconUrl: "" }],
    }));
  };

  const removeSkillField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      const text = item.description || item.bioText || "";
      setFormData({
        subtitle: item.subtitle || "",
        description: text,
        bioText: text,
        imageUrl: item.imageUrl || "",
        cvUrl: item.cvUrl || "",
        isActive: item.isActive ?? true,
        skills: item.skills?.map((sk: any) => ({
          ...sk,
          logoUrl: sk.logoUrl || sk.iconUrl || "",
          iconUrl: sk.iconUrl || sk.logoUrl || "",
        })) || [],
      });
    } else {
      setEditId(null);
      setFormData(initialForm);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) return alert("Please upload an About Image!");
    if (!formData.cvUrl) return alert("Please upload a CV (PDF)!");

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/about/${editId}` : "/api/about";

    const payload = {
      ...formData,
      description: formData.description,
      bioText: formData.description,
      skills: formData.skills.map((sk) => ({
        name: sk.name,
        percentage: Number(sk.percentage),
        iconUrl: sk.iconUrl || sk.logoUrl || "",
        logoUrl: sk.logoUrl || sk.iconUrl || "",
      })),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setEditId(null);
        setFormData(initialForm);
        fetchAboutData();
        alert(editId ? "Updated successfully!" : "Saved successfully!");
      } else {
        alert("Error: " + (data.error || "Failed to save data"));
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      alert("Server Error! Check console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this About Section?")) return;
    try {
      const res = await fetch(`/api/about/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAboutList((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Delete failed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">About Me & Skills Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Records: <span className="font-bold text-[#FF6400]">{aboutList.length}</span>
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white transition hover:bg-[#e05800]"
        >
          <FaPlus /> Add About Data
        </button>
      </div>

      {/* Grid Item List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aboutList.map((item) => (
          <div key={item._id} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <img src={item.imageUrl} alt="About" className="h-14 w-14 rounded-xl object-cover object-top" />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{item.subtitle}</h3>
              <p className="line-clamp-2 text-xs text-gray-500">{item.description || item.bioText}</p>
            </div>
            <div className="text-xs text-gray-400">Skills Added: {item.skills?.length || 0}</div>
            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => handleOpenModal(item)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                <FaPenToSquare /> Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <FaXmark className="text-2xl" />
            </button>

            {/* Left Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4 border-r pr-6">
              <h2 className="text-xl font-bold">{editId ? "Edit About Me" : "Add About Me"}</h2>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Subtitle / Heading</label>
                <input
                  type="text"
                  placeholder="e.g. User Interface And User Experience..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
                <textarea
                  rows={4}
                  placeholder="About description text..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                      bioText: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-[#FF6400]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">About Image Upload</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs" />
                  {uploadingImage && <p className="mt-1 text-[10px] font-bold text-orange-500">Uploading Image...</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Raw PDF (CV) Upload</label>
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="w-full text-xs" />
                  {uploadingPdf && <p className="mt-1 text-[10px] font-bold text-orange-500">Uploading PDF...</p>}
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800">Skills & Percentages</h4>
                  <button type="button" onClick={addSkillField} className="text-xs font-semibold text-[#FF6400] hover:underline">
                    + Add Skill
                  </button>
                </div>

                {formData.skills.map((sk, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      value={sk.name}
                      onChange={(e) => {
                        const updated = [...formData.skills];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="flex-1 rounded-lg border p-1.5 text-xs"
                      required
                    />
                    <input
                      type="number"
                      placeholder="%"
                      min="0"
                      max="100"
                      value={sk.percentage}
                      onChange={(e) => {
                        const updated = [...formData.skills];
                        updated[idx].percentage = Number(e.target.value);
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="w-16 rounded-lg border p-1.5 text-xs"
                      required
                    />
                    <label className="cursor-pointer text-gray-500 hover:text-[#FF6400]">
                      <FaUpload className="text-xs" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleSkillLogoUpload(idx, e.target.files[0])}
                      />
                    </label>
                    {uploadingSkillLogo === idx && <span className="text-[9px] text-orange-500">...</span>}
                    <button type="button" onClick={() => removeSkillField(idx)} className="text-red-500 hover:text-red-700">
                      <FaXmark />
                    </button>
                  </div>
                ))}
              </div>

              <label className="flex cursor-pointer items-center gap-2 pt-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded text-[#FF6400]"
                />
                Active Status
              </label>

              <button
                disabled={uploadingImage || uploadingPdf}
                type="submit"
                className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white transition hover:bg-[#e05800] disabled:bg-gray-400"
              >
                {uploadingImage || uploadingPdf ? "Uploading Files..." : editId ? "Update Section" : "Save Section"}
              </button>
            </form>

            {/* Live Preview - object-top ব্যবহার করা হয়েছে */}
            <div className="flex flex-1 flex-col justify-between max-h-[75vh] overflow-y-auto rounded-2xl bg-[#0a0a0a] p-6 text-white">
              <span className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[#FF6400]">Live Section Preview</span>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-6 lg:flex-row">
                  <div className="h-44 w-44 flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-700 bg-neutral-900">
                    {formData.imageUrl && <img src={formData.imageUrl} alt="About" className="h-full w-full object-cover object-top" />}
                  </div>
                  <div className="flex-1 space-y-2 text-left">
                    <p className="text-xs text-gray-400">{formData.subtitle || "Subtitle preview..."}</p>
                    <p className="line-clamp-4 text-xs leading-relaxed text-gray-300">{formData.description || formData.bioText || "Description preview..."}</p>
                    {formData.cvUrl && (
                      <span className="inline-block rounded-lg bg-[#FF6400] px-4 py-1.5 text-xs font-semibold text-white">
                        Download CV
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 border-t border-neutral-800 pt-4">
                  {formData.skills.map((sk, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FF6400]">
                        {sk.logoUrl || sk.iconUrl ? (
                          <img src={sk.logoUrl || sk.iconUrl} alt="logo" className="h-6 w-6 object-contain" />
                        ) : (
                          <span className="text-[10px] text-gray-400">{sk.percentage}%</span>
                        )}
                      </div>
                      <span className="mt-1 text-[10px] font-semibold text-gray-300">{sk.name || "Skill"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}