"use client";

import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

export default function FooterSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const apiUrl = cleanBaseUrl ? `${cleanBaseUrl}/api/footer` : "/api/footer";

    fetch(apiUrl)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const active = resData.data.find((item: any) => item.isActive !== false);
          setData(active || null);
        } else {
          setData(null);
        }
      })
      .catch((err) => {
        console.warn("Footer fetch error:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return null;

  const instagramUrl = data.instagramUrl || "#";
  const linkedinUrl = data.linkedinUrl || "#";
  const facebookUrl = data.facebookUrl || "#";
  const whatsappUrl = data.whatsappUrl || "#";

  const getTarget = (url: string) => (!url || url === "#" ? "_self" : "_blank");

  return (
    <footer className="relative w-full overflow-hidden bg-[#121212] px-6 py-12 text-white sm:px-12 md:px-16 lg:px-20 lg:py-16">
      {/* লাল সীমানা অনুযায়ী ডানে-বামে চওড়া করার জন্য max-w-7xl ব্যবহার করা হয়েছে */}
      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-8 text-center sm:space-y-10">
        
        {/* LOGO */}
        {data.logoText && (
          <h2 className="text-3xl font-extrabold tracking-widest text-[#FF6400] sm:text-4xl">
            {data.logoText}
          </h2>
        )}

        {/* Navigation Links - স্পেস ও চওড়া সাইজ */}
        <nav className="flex flex-wrap items-center justify-center gap-8 text-base font-medium text-gray-300 sm:gap-14 sm:text-lg">
          <a href="/" className="transition hover:text-[#FF6400]">
            Home
          </a>
          <a href="/services" className="transition hover:text-[#FF6400]">
            Services
          </a>
          <a href="/about" className="transition hover:text-[#FF6400]">
            About me
          </a>
          <a href="/projects" className="transition hover:text-[#FF6400]">
            Projects
          </a>
          <a href="/education" className="transition hover:text-[#FF6400]">
            Education
          </a>
          <a href="/contact" className="transition hover:text-[#FF6400]">
            Contact me
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <a
            href={instagramUrl}
            target={getTarget(instagramUrl)}
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-[#1e1e1e] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
          >
            <FaInstagram className="text-lg" />
          </a>
          <a
            href={linkedinUrl}
            target={getTarget(linkedinUrl)}
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-[#1e1e1e] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
          >
            <FaLinkedinIn className="text-base" />
          </a>
          <a
            href={facebookUrl}
            target={getTarget(facebookUrl)}
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-[#1e1e1e] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
          >
            <FaFacebookF className="text-base" />
          </a>
          <a
            href={whatsappUrl}
            target={getTarget(whatsappUrl)}
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-[#1e1e1e] text-gray-300 transition duration-300 hover:border-[#FF6400] hover:text-[#FF6400]"
          >
            <FaWhatsapp className="text-lg" />
          </a>
        </div>

        {/* Contact Info (Email & Phone) */}
        {(data.email || data.phone) && (
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300 sm:gap-12 sm:text-base">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-2.5 transition hover:text-[#FF6400]"
              >
                <FaEnvelope className="text-base text-[#FF6400]" />
                <span>{data.email}</span>
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-2.5 transition hover:text-[#FF6400]"
              >
                <FaPhone className="text-base text-[#FF6400]" />
                <span>{data.phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Wide Divider & Copyright */}
        {data.copyrightText && (
          <div className="space-y-6 pt-4">
            <div className="mx-auto h-[1px] w-full max-w-5xl bg-neutral-800" />
            <p className="text-xs text-gray-400 sm:text-sm">
              {data.copyrightText}
            </p>
          </div>
        )}

      </div>
    </footer>
  );
}