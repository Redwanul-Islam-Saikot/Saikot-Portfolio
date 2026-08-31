"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare, FaXmark, FaUpload, FaArrowUpRightFromSquare } from "react-icons/fa6";

const CATEGORIES = ["B.Sc", "HSC", "SSC", "JSC", "PSC"];

const initialForm = {
  category: "B.Sc",
  title: "",
  imageUrl: "",
  link: "",
  result: "",
  instituteName: "",
  session: "",
  passingYear: "",
  board: "",
  group: "",
  programmeName: "",
  isActive: true,
};

export default function AdminEducationPage() {
  const [list, setList] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      if (data.success) setList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_preset";

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      }
    } catch (err) {
      alert("Image Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        category: item.category || "B.Sc",
        title: item.title || "",
        imageUrl: item.imageUrl || "",
        link: item.link || "",
        result: item.result || "",
        instituteName: item.instituteName || "",
        session: item.session || "",
        passingYear: item.passingYear || "",
        board: item.board || "",
        group: item.group || "",
        programmeName: item.programmeName || "",
        isActive: item.isActive ?? true,
      });
    } else {
      setEditId(null);
      setFormData(initialForm);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/education/${editId}` : "/api/education";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success) {
        setIsOpen(false);
        fetchData();
        alert(editId ? "Updated successfully!" : "Added successfully!");
      }
    } catch (err) {
      alert("Error saving data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (resData.success) {
        setList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      {/* Header & Dashboard Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolio / Education Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Items Added: <span className="font-bold text-[#FF6400]">{list.length}</span>
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white transition hover:bg-[#e05800]"
        >
          <FaPlus /> Add New Item
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <div key={item._id} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="space-y-3">
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">No Image</div>
                )}
                <span className="absolute left-2 top-2 rounded-lg bg-[#FF6400] px-2.5 py-1 text-xs font-semibold text-white">
                  {item.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{item.title || "Untitled Card"}</h3>
              <p className="text-xs text-gray-500">{item.instituteName || "Institute Not Specified"}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
                {item.result && <span className="rounded bg-gray-100 px-2 py-0.5">GPA: {item.result}</span>}
                {item.passingYear && <span className="rounded bg-gray-100 px-2 py-0.5">Passing Year: {item.passingYear}</span>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className={`text-xs font-semibold ${item.isActive ? "text-green-600" : "text-gray-400"}`}>
                {item.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(item)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                  <FaPenToSquare />
                </button>
                <button onClick={() => handleDelete(item._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-700">
              <FaXmark className="text-2xl" />
            </button>

            {/* Left Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4 border-r pr-6">
              <h2 className="text-xl font-bold">{editId ? "Edit Item" : "Add New Item"}</h2>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Category Tag</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border p-2.5 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Title / Degree / Project Name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border p-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Image Upload</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs" />
                  {uploading && <p className="text-[10px] text-orange-500">Uploading Image...</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Custom Link (URL or #)</label>
                  {/* type="text" করা হলো যেন # বা যেকোনো কাস্টম টেক্সট ইমপুট দেওয়া যায় */}
                  <input
                    type="text"
                    placeholder="e.g. https://example.com or #"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Institute Name</label>
                  <input
                    type="text"
                    value={formData.instituteName}
                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Programme Name</label>
                  <input
                    type="text"
                    value={formData.programmeName}
                    onChange={(e) => setFormData({ ...formData, programmeName: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Result / GPA</label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Session</label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Passing Year</label>
                  <input
                    type="text"
                    value={formData.passingYear}
                    onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Board</label>
                  <input
                    type="text"
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Group / Major</label>
                  <input
                    type="text"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 pt-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-[#FF6400]"
                />
                Active Status
              </label>

              <button
                disabled={uploading}
                type="submit"
                className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white hover:bg-[#e05800] disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : editId ? "Update Item" : "Save Item"}
              </button>
            </form>

            {/* Live Preview Card */}
            <div className="flex flex-1 flex-col justify-between max-h-[75vh] overflow-y-auto rounded-2xl bg-[#0a0a0a] p-6 text-white">
              <span className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-[#FF6400]">
                Live Card Preview
              </span>

              <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#141414] p-4 shadow-xl">
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-neutral-900">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover object-top" />
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white line-clamp-1">{formData.title || "Name / Project Title"}</h4>
                    <span className="text-xs font-medium text-[#FF6400]">{formData.category}</span>
                  </div>
                  <p className="text-xs text-gray-400">{formData.instituteName || "Institute Name"}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 pt-2 border-t border-neutral-800">
                    {formData.programmeName && <p>Prog: {formData.programmeName}</p>}
                    {formData.result && <p>Result: {formData.result}</p>}
                    {formData.session && <p>Session: {formData.session}</p>}
                    {formData.passingYear && <p>Year: {formData.passingYear}</p>}
                    {formData.board && <p>Board: {formData.board}</p>}
                    {formData.group && <p>Group: {formData.group}</p>}
                  </div>

                  {formData.link && (
                    <a href={formData.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#FF6400] pt-1">
                      Visit Link <FaArrowUpRightFromSquare className="text-[10px]" />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}