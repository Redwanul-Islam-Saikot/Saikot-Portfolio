"use client";

import { useEffect, useState } from "react";

export default function ServicesSection() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const apiUrl = cleanBaseUrl + "/api/services";

    fetch(apiUrl)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const activeServices = resData.data.filter((item: any) => item.isActive !== false);
          setServices(activeServices);
        }
      })
      .catch((err) => console.error("Error fetching services:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-12 text-white sm:px-8 md:px-12 lg:px-16 lg:py-20">
      {/* Container - Matching Hero Section Width */}
      <div className="relative z-10 mx-auto w-full">
        
        {/* Header Title & Subtitle */}
        <div className="mb-12 space-y-3 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Services
          </h2>
          <p className="mx-auto max-w-xl text-sm font-normal text-gray-400 sm:text-base">
            My Expertise Area.
          </p>
        </div>

        {/* Dynamic Responsive Grid Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-neutral-800/80 bg-[#121212] px-8 py-14 text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6400]/40 hover:bg-[#151515]"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1c1c1c] p-3 shadow-inner">
                <img
                  src={service.iconUrl}
                  alt={service.title}
                  className="h-14 w-14 object-contain"
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-[#FF6400] sm:text-2xl">
                {service.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-400 sm:text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}