"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactSection() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    timeline: "",
    message: "",
  });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    if (cleanBaseUrl) {
      fetch(cleanBaseUrl + "/api/contact-section")
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            const active = resData.data.find((item: any) => item.isActive !== false);
            setConfig(active || null);
          }
        })
        .catch((err) => {
          console.warn("Admin config fetch error:", err);
          setConfig({
            title: "Contact me",
            subtitle: "Cultivating Connections: Reach Out And Connect With Me",
            servicesOptions: ["Web Design", "App Design", "Branding"],
          });
        })
        .finally(() => setLoading(false));
    } else {
      setConfig({
        title: "Contact me",
        subtitle: "Cultivating Connections: Reach Out And Connect With Me",
        servicesOptions: ["Web Design", "App Design", "Branding"],
      });
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMsg(null);

    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    try {
      if (cleanBaseUrl) {
        await fetch(cleanBaseUrl + "/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
      }
    } catch (dbErr) {
      console.warn("Database save skipped:", dbErr);
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_gp35n5u";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_oafgtg5";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "xOrgCmyABEIdMRKXp";

    const templateParams = {
      from_name: formValues.name,
      reply_to: formValues.email,
      phone_number: formValues.phone,
      service: formValues.service,
      timeline: formValues.timeline,
      message: formValues.message,
    };

    try {
      const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      if (res.status === 200) {
        setStatusMsg({ type: "success", text: "Message sent successfully!" });
        setFormValues({ name: "", email: "", phone: "", service: "", timeline: "", message: "" });
      }
    } catch (error: any) {
      const errMsg = error?.text || error?.message || "Check EmailJS setup.";
      console.log("EmailJS Error:", errMsg);
      setStatusMsg({ type: "error", text: `Failed: ${errMsg}` });
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  return (
    <section id="contact" className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-12 text-white sm:px-8 md:px-12 lg:px-16 lg:py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#FF6400]/10 blur-[150px]" />

      {/* Container - max-w-7xl দিয়ে ডানে-বামে চওড়া করা হয়েছে */}
      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {config?.title || "Contact me"}
          </h2>
          {config?.subtitle && (
            <p className="mx-auto max-w-3xl text-base text-gray-400 sm:text-lg">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Form - Full Width Grid */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              value={formValues.name}
              onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-white placeholder-gray-500 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-white placeholder-gray-500 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formValues.phone}
              onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-white placeholder-gray-500 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
            />
            <select
              value={formValues.service}
              onChange={(e) => setFormValues({ ...formValues, service: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-gray-400 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
            >
              <option value="" disabled>Service Of Interest</option>
              {config?.servicesOptions?.map((srv: string, idx: number) => (
                <option key={idx} value={srv} className="bg-[#141414] text-white">
                  {srv}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <input
              type="text"
              placeholder="Timeline"
              value={formValues.timeline}
              onChange={(e) => setFormValues({ ...formValues, timeline: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-white placeholder-gray-500 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
            />
            <textarea
              rows={5}
              placeholder="Project Details..."
              value={formValues.message}
              onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
              className="w-full rounded-2xl border border-neutral-800 bg-[#141414] px-6 py-4 text-base text-white placeholder-gray-500 transition-all duration-300 focus:border-[#FF6400] focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col items-end space-y-3 pt-4">
            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-[#FF6400] px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#e05800] hover:shadow-lg hover:shadow-[#FF6400]/20 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>

            {statusMsg && (
              <p className={`text-sm font-semibold ${statusMsg.type === "success" ? "text-green-500" : "text-red-500"}`}>
                {statusMsg.text}
              </p>
            )}
          </div>
        </form>

      </div>
    </section>
  );
}