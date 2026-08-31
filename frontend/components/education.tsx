"use client";

import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function EducationSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    fetch(cleanBaseUrl + "/api/education")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          // Filter only active items
          const activeItems = resData.data.filter((item: any) => item.isActive !== false);
          setItems(activeItems);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  // Dynamic Categories
  const availableCategories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  const tabs = ["All", ...availableCategories];

  // Filtering Logic
  const filteredItems = activeTab === "All" ? items : items.filter((item) => item.category === activeTab);

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 pt-6 pb-12 text-white sm:px-8 md:px-12 lg:px-16 lg:pt-8 lg:pb-20">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#FF6400]/10 blur-[150px]" />

      {/* Hero Layout Container */}
      <div className="relative z-10 flex w-full flex-col justify-between space-y-10">
        
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Education
          </h2>

          {/* Dynamic Filter Buttons - Matched to Projects Section */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-12 sm:px-16 py-4 text-lg font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#FF6400] text-white shadow-xl shadow-[#FF6400]/30 scale-105"
                    : "bg-[#151515] text-gray-300 hover:bg-[#202020] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const CardWrapper = item.link ? "a" : "div";
            const wrapperProps = item.link ? { href: item.link, target: "_blank", rel: "noreferrer" } : {};

            return (
              <CardWrapper
                key={item._id}
                {...wrapperProps}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#151515] p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#FF6400]/50 hover:shadow-2xl hover:shadow-[#FF6400]/10"
              >
                <div>
                  {/* Dark Themed Image Frame */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-[#0a0a0a] flex items-center justify-center p-2">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Education Item"}
                        className="h-full w-full object-contain transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-600">
                        No Image
                      </div>
                    )}
                    {/* Dark Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-30 transition-opacity duration-300 group-hover:opacity-10" />
                  </div>

                  {/* Title & Category */}
                  <div className="mt-5 flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-gray-200 transition-colors duration-300 group-hover:text-[#FF6400]">
                      {item.title || "Untitled Card"}
                    </h3>
                    <span className="rounded-xl bg-[#202020] px-3 py-1 text-xs font-semibold text-[#FF6400]">
                      {item.category}
                    </span>
                  </div>

                  {item.instituteName && (
                    <p className="mt-1 px-1 text-sm text-gray-400">{item.instituteName}</p>
                  )}

                  {/* Additional Information Badges */}
                  <div className="mt-3 flex flex-wrap gap-2 px-1 text-xs text-gray-300">
                    {item.programmeName && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">Prog: {item.programmeName}</span>
                    )}
                    {item.result && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">GPA: {item.result}</span>
                    )}
                    {item.session && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">Session: {item.session}</span>
                    )}
                    {item.passingYear && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">Passing Year: {item.passingYear}</span>
                    )}
                    {item.board && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">Board: {item.board}</span>
                    )}
                    {item.group && (
                      <span className="rounded-md bg-[#202020] px-2.5 py-1">Group: {item.group}</span>
                    )}
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>

      </div>
    </section>
  );
}