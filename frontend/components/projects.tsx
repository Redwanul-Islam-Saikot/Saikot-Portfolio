"use client";

import { useEffect, useState } from "react";

export default function PortfolioSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    fetch(cleanBaseUrl + "/api/projects")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const activeProjects = resData.data.filter((item: any) => item.isActive !== false);
          setProjects(activeProjects);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (projects.length === 0) return null;

  const filteredProjects = projects.filter((item) => {
    if (activeTab === "All") return true;
    return item.category?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 pt-6 pb-12 text-white sm:px-8 md:px-12 lg:px-16 lg:pt-8 lg:pb-20">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute left-[-10%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#FF6400]/10 blur-[150px]" />

      {/* Hero Layout Container */}
      <div className="relative z-10 flex w-full flex-col justify-between space-y-10">
        
        {/* Header Section */}
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Projects
          </h2>

          {/* Dynamic Filter Buttons - Wider Left/Right Width */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["All", "Static", "Dynamic"].map((tab) => (
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

        {/* Dynamic Project Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <a
              key={project._id}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-[#151515] p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#FF6400]/50 hover:shadow-2xl hover:shadow-[#FF6400]/10"
            >
              {/* Dark Themed Image Frame */}
              <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-[#0a0a0a]">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover brightness-75 contrast-110 transition-all duration-500 group-hover:scale-105 group-hover:brightness-100"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-20" />
              </div>

              {/* Card Title & Category */}
              <div className="mt-5 flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-gray-200 transition-colors duration-300 group-hover:text-[#FF6400]">
                  {project.title}
                </h3>
                <span className="rounded-xl bg-[#202020] px-3 py-1 text-xs font-semibold text-[#FF6400]">
                  {project.category}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}