"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare, FaXmark, FaEnvelope } from "react-icons/fa6";

export default function ContactAdminPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "Contact me",
    subtitle: "Cultivating Connections: Reach Out And Connect With Me",
    servicesOptions: ["Web Design", "App Design", "Branding"],
    isActive: true,
  });
  const [serviceInput, setServiceInput] = useState("");

  const fetchConfigs = async () => {
    try {
      const res = await fetch("/api/contact-section");
      const data = await res.json();
      if (data.success) setConfigs(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // পুরো সেকশন ডিলিট ফাংশন
  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entire section?")) return;

    try {
      const res = await fetch(`/api/contact-section/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        fetchConfigs();
      } else {
        alert("Failed to delete section: " + data.error);
      }
    } catch (err) {
      console.error("Error deleting section:", err);
      alert("Error deleting section");
    }
  };

  // মেসেজ ওপেন করা এবং সর্টিং (Latest Message First)
  const handleOpenMessages = (config: any) => {
    setActiveConfigId(config._id);
    const msgs = config.messages || [];
    const sortedMsgs = [...msgs].reverse();
    setSelectedMessages(sortedMsgs);
    setIsMsgModalOpen(true);
  };

  // একক মেসেজ ডিলিট করার ফাংশন
  const handleDeleteMessage = async (msgId: string) => {
    if (!msgId) return alert("Message ID missing!");
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${msgId}?configId=${activeConfigId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setSelectedMessages((prev) => prev.filter((msg) => msg._id !== msgId));
        fetchConfigs();
      } else {
        alert("Failed to delete message: " + data.error);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Error deleting message");
    }
  };

  const handleAddService = () => {
    if (!serviceInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      servicesOptions: [...prev.servicesOptions, serviceInput.trim()],
    }));
    setServiceInput("");
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      servicesOptions: prev.servicesOptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/contact-section/${editId}` : "/api/contact-section";
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
        fetchConfigs();
      }
    } catch (err) {
      alert("Error saving config");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Section & Inbox</h1>
          <p className="mt-1 text-sm text-gray-500">Manage Section and View Received Messages</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({
              title: "Contact me",
              subtitle: "Cultivating Connections: Reach Out And Connect With Me",
              servicesOptions: ["Web Design", "App Design", "Branding"],
              isActive: true,
            });
            setIsOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#FF6400] px-5 py-3 font-semibold text-white hover:bg-[#e05800]"
        >
          <FaPlus /> Setup Section
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {configs.map((item) => (
          <div key={item._id} className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.subtitle}</p>
            
            <div className="flex flex-wrap gap-2">
              {item.servicesOptions?.map((srv: string, idx: number) => (
                <span key={idx} className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {srv}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <button
                onClick={() => handleOpenMessages(item)}
                className="flex items-center gap-2 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-bold text-[#FF6400]"
              >
                <FaEnvelope /> View Messages ({item.messages?.length || 0})
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditId(item._id); setFormData(item); setIsOpen(true); }}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                >
                  <FaPenToSquare /> Edit
                </button>
                <button
                  onClick={() => handleDeleteSection(item._id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white transition-all"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Received Messages Modal */}
      {isMsgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsMsgModalOpen(false)} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600">
              <FaXmark className="text-2xl" />
            </button>
            <h2 className="mb-4 text-xl font-bold">Received Messages ({selectedMessages.length})</h2>

            {selectedMessages.length === 0 ? (
              <p className="text-sm text-gray-500">No messages received yet.</p>
            ) : (
              <div className="space-y-4">
                {selectedMessages.map((msg: any, idx: number) => (
                  <div key={msg._id || idx} className="relative rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm space-y-1">
                    
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="absolute right-3 top-3 rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Message"
                    >
                      <FaTrash className="text-xs" />
                    </button>

                    <div className="flex justify-between font-bold text-gray-900 pr-8">
                      <span>{msg.name} ({msg.email})</span>
                      <span className="text-xs font-normal text-gray-400">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    {msg.phone && <p className="text-xs text-gray-600">Phone: {msg.phone}</p>}
                    {msg.service && <p className="text-xs text-orange-600 font-semibold">Service: {msg.service}</p>}
                    {msg.timeline && <p className="text-xs text-gray-600">Timeline: {msg.timeline}</p>}
                    <p className="pt-2 text-gray-700 italic">"{msg.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute right-5 top-5 text-gray-400">
              <FaXmark className="text-2xl" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold">{editId ? "Edit Section" : "Setup Section"}</h2>
              <div>
                <label className="text-xs font-semibold">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full rounded-xl border p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Services</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    className="w-full rounded-xl border p-2 text-sm"
                  />
                  <button type="button" onClick={handleAddService} className="rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white">
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.servicesOptions.map((srv, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2 py-1 text-xs font-semibold text-[#FF6400]">
                      {srv}
                      <button type="button" onClick={() => handleRemoveService(idx)}>
                        <FaXmark />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full rounded-xl bg-[#FF6400] py-3 text-sm font-semibold text-white">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}